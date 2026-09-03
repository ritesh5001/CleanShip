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
import { colors, radius, space } from "../../src/theme";
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
  statusChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  progressRow: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  percent: { fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"] },
});
