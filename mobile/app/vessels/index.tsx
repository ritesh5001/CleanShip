import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { ApiError, listVessels } from "../../src/api";
import { readVessels, writeVessels } from "../../src/cache";
import { useSession } from "../../src/session";
import { Banner, Card, Empty, ProgressBar } from "../../src/components/ui";
import { colors, radius, space, TAP } from "../../src/theme";
import {
  compartmentNoun,
  VESSEL_STATUS_STYLE,
  type VesselSummary,
} from "../../src/types";

/**
 * The supervisor's home: the vessels assigned to them.
 *
 * The list arrives already filtered by the API — a supervisor is only ever
 * sent their own vessels — so there is no filter here to get wrong.
 *
 * Cached data is painted first and replaced when the network answers. On a
 * cold Render instance that request can take half a minute, and a supervisor
 * standing at a gangway should be reading their holds during that time rather
 * than a spinner.
 */
export default function Vessels() {
  const { token, user, signOut } = useSession();
  const router = useRouter();

  const [vessels, setVessels] = useState<VesselSummary[] | null>(null);
  const [stale, setStale] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;
      try {
        const fresh = await listVessels(token, signal);
        if (signal?.aborted) return;
        setVessels(fresh);
        setStale(null);
        setError(null);
        void writeVessels(fresh);
      } catch (err) {
        if (signal?.aborted) return;
        if (err instanceof ApiError && err.status === 401) {
          await signOut();
          return;
        }
        const cached = await readVessels();
        if (cached) {
          setVessels(cached.data);
          setStale(cached.fetchedAt);
        }
        setError(
          err instanceof ApiError && err.isTransient
            ? "Showing the last update from this phone — no connection right now."
            : "Could not load your vessels.",
        );
      }
    },
    [token, signOut],
  );

  /* Reloads whenever the screen is returned to, so coming back from a vessel
     shows the progress that was just recorded. */
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      void load(controller.signal);
      return () => controller.abort();
    }, [load]),
  );

  useEffect(() => {
    if (vessels === null) {
      void readVessels().then((cached) => {
        if (cached) {
          setVessels((current) => current ?? cached.data);
          setStale(cached.fetchedAt);
        }
      });
    }
  }, [vessels]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (vessels === null) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color={colors.navy} />
        <Text style={styles.waiting}>Loading your vessels…</Text>
      </View>
    );
  }

  const active = vessels.filter((v) => v.status !== "complete");
  const done = vessels.filter((v) => v.status === "complete");

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.greeting}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>
            {user ? `Hello, ${user.name.split(" ")[0]}` : "My vessels"}
          </Text>
          <Text style={styles.count}>
            {active.length} active {active.length === 1 ? "vessel" : "vessels"}
          </Text>
        </View>
        <Pressable
          onPress={() => void signOut().then(() => router.replace("/login"))}
          accessibilityRole="button"
          style={styles.signOut}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>

      {/* The way through to the time log, across every vessel.
          A button rather than the log itself: this screen answers "which of
          my vessels needs me", and a grid of start and finish times for every
          hold on every vessel would bury that under figures nobody opens the
          app to read. Opening a single vessel's own log is faster — see the
          button on that vessel's dashboard — this one is for looking across
          all of them, or for someone who has not opened a vessel yet. */}
      <Link href="/timelog" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open the time log — start and finish times for every hold and stage"
        >
          {/* Styled on an inner View, not on the Pressable: `Link asChild`
              clones its child with the Link's own props, and the style set
              here would be overwritten by the Link's undefined one. */}
          {({ pressed }) => (
            <View
              style={[styles.timelog, pressed ? { opacity: 0.85 } : null]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.timelogLabel}>Time log</Text>
                <Text style={styles.timelogHint}>
                  Every start and finish time, on one grid
                </Text>
              </View>
              <Text style={styles.timelogChevron}>›</Text>
            </View>
          )}
        </Pressable>
      </Link>

      {/* A supervisor is a joiner too: same passport, same flight, same sheet
          as the gang they are taking. Their own paperwork lives on the same
          screen the crew use, which is why this is a link out rather than a
          second copy of it here. */}
      <Link href="/joining" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open my joining paperwork — documents, checklist and travel"
        >
          {({ pressed }) => (
            <View style={[styles.joining, pressed ? { opacity: 0.85 } : null]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.joiningLabel}>My joining</Text>
                <Text style={styles.joiningHint}>
                  My documents, checklist and travel
                </Text>
              </View>
              <Text style={styles.joiningChevron}>›</Text>
            </View>
          )}
        </Pressable>
      </Link>

      {error && (
        <View style={{ marginBottom: space.md }}>
          <Banner tone={stale ? "warn" : "error"}>{error}</Banner>
        </View>
      )}

      {vessels.length === 0 ? (
        <Empty
          title="Nothing assigned yet"
          body="When the office assigns you a vessel it appears here. Pull down to check again."
        />
      ) : (
        <View style={{ gap: space.md }}>
          {active.map((v) => (
            <VesselCard key={v.id} vessel={v} />
          ))}

          {done.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Completed</Text>
              {done.map((v) => (
                <VesselCard key={v.id} vessel={v} />
              ))}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function VesselCard({ vessel }: { vessel: VesselSummary }) {
  const status = VESSEL_STATUS_STYLE[vessel.status] ?? VESSEL_STATUS_STYLE.scheduled;
  const noun = compartmentNoun(vessel.type, true).toLowerCase();
  const { progress } = vessel;

  return (
    <Link href={`/vessels/${vessel.id}`} asChild>
      <Pressable accessibilityRole="button">
        {({ pressed }) => (
          <Card style={pressed ? { opacity: 0.85 } : undefined}>
            <View style={{ padding: space.lg }}>
              <View style={styles.cardHead}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reference}>{vessel.reference}</Text>
                  <Text style={styles.vesselName}>{vessel.name}</Text>
                  <Text style={styles.where}>
                    {vessel.port}
                    {vessel.berth ? ` · ${vessel.berth}` : ""}
                    {vessel.destination ? ` → ${vessel.destination}` : ""}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusChip,
                    { backgroundColor: status.bg, borderColor: status.border },
                  ]}
                >
                  <Text style={[styles.statusText, { color: status.text }]}>
                    {vessel.status.replace("-", " ")}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: space.lg }}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>
                    {progress.compartmentsComplete} of{" "}
                    {progress.compartmentsTotal} {noun} ready
                  </Text>
                  <Text style={styles.percent}>
                    {Math.round(progress.ratio * 100)}%
                  </Text>
                </View>
                <View style={{ marginTop: space.sm }}>
                  <ProgressBar ratio={progress.ratio} />
                </View>
              </View>
            </View>
          </Card>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space.lg, paddingBottom: space.xl * 2 },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    gap: space.md,
  },
  waiting: { color: colors.muted, fontSize: 14 },
  greeting: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: space.lg,
  },
  hello: { fontSize: 22, fontWeight: "800", color: colors.text },
  count: { marginTop: 2, fontSize: 14, color: colors.muted },
  signOut: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  signOutText: { color: colors.blue, fontWeight: "700", fontSize: 14 },
  joining: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: TAP,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginBottom: space.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.blue,
  },
  joiningLabel: { fontSize: 16, fontWeight: "800", color: colors.text },
  joiningHint: { marginTop: 2, fontSize: 12, color: colors.muted },
  joiningChevron: { fontSize: 26, fontWeight: "700", color: colors.blue },
  timelog: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: TAP,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginBottom: space.lg,
    backgroundColor: colors.navy,
    borderLeftWidth: 3,
    borderLeftColor: colors.aqua,
  },
  timelogLabel: { fontSize: 16, fontWeight: "800", color: colors.onDark },
  timelogHint: { marginTop: 2, fontSize: 12, color: colors.onDarkMuted },
  timelogChevron: { fontSize: 26, fontWeight: "700", color: colors.aquaTint },
  sectionHeading: {
    marginTop: space.lg,
    marginBottom: space.xs,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start", gap: space.md },
  reference: { fontSize: 12, color: colors.faint, fontVariant: ["tabular-nums"] },
  vesselName: {
    marginTop: 2,
    fontSize: 19,
    fontWeight: "800",
    color: colors.text,
  },
  where: { marginTop: 2, fontSize: 13, color: colors.muted },
  statusChip: { borderWidth: 1, borderRadius: 0, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  progressRow: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  percent: { fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"] },
});
