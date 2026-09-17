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
import { Link, useFocusEffect } from "expo-router";
import { ApiError, listVessels } from "../../src/api";
import { readVessels, writeVessels } from "../../src/cache";
import { useSession } from "../../src/session";
import { Banner, Empty } from "../../src/components/ui";
import { colors, space, TAP } from "../../src/theme";
import {
  compartmentNoun,
  VESSEL_STATUS_STYLE,
  type VesselSummary,
} from "../../src/types";

/**
 * Which vessel's times to open.
 *
 * A time log is a vessel's own log, so this stands between the home button and
 * the grid. It is deliberately thinner than the home list — no progress bars,
 * no percentages — because the question here is only "which ship", and a
 * second copy of the home screen would invite a supervisor to treat it as one.
 *
 * Cached vessels are painted first, as everywhere else: on a cold API instance
 * that request takes half a minute, and there is no reason to stare at a
 * spinner when the list is already on the phone.
 */
export default function TimeLogPicker() {
  const { token, signOut } = useSession();

  const [vessels, setVessels] = useState<VesselSummary[] | null>(null);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;
      try {
        const fresh = await listVessels(token, signal);
        if (signal?.aborted) return;
        setVessels(fresh);
        setStale(false);
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
          setVessels((current) => current ?? cached.data);
          setStale(true);
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
          setStale(true);
        }
      });
    }
  }, [vessels]);

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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load().finally(() => setRefreshing(false));
          }}
        />
      }
    >
      <Text style={styles.lede}>
        Start and finish times for every {compartmentNoun("hold").toLowerCase()}{" "}
        and every stage. Pick a vessel.
      </Text>

      {error ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone={stale ? "warn" : "error"}>{error}</Banner>
        </View>
      ) : null}

      {vessels.length === 0 ? (
        <Empty
          title="Nothing assigned yet"
          body="When the office assigns you a vessel its time log appears here."
        />
      ) : (
        <View>
          {active.map((v) => (
            <VesselRow key={v.id} vessel={v} />
          ))}

          {done.length > 0 ? (
            <>
              <Text style={styles.sectionHeading}>Completed</Text>
              {done.map((v) => (
                <VesselRow key={v.id} vessel={v} />
              ))}
            </>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

function VesselRow({ vessel }: { vessel: VesselSummary }) {
  const status =
    VESSEL_STATUS_STYLE[vessel.status] ?? VESSEL_STATUS_STYLE.scheduled;
  const noun = compartmentNoun(vessel.type, true).toLowerCase();

  return (
    <Link href={`/timelog/${vessel.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Time log for ${vessel.name} at ${vessel.port}`}
      >
        {/* Inner View carries the styling — see the note on the home screen's
            time log button for why it cannot sit on the Pressable. */}
        {({ pressed }) => (
          <View style={[styles.row, pressed ? { opacity: 0.85 } : null]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {vessel.name}
              </Text>
              <Text style={styles.where} numberOfLines={1}>
                {vessel.port}
                {vessel.berth ? ` · ${vessel.berth}` : ""} ·{" "}
                {vessel.compartmentCount} {noun}
              </Text>
            </View>
            <View
              style={[
                styles.chip,
                { backgroundColor: status.bg, borderColor: status.border },
              ]}
            >
              <Text style={[styles.chipText, { color: status.text }]}>
                {vessel.status.replace("-", " ")}
              </Text>
            </View>
          </View>
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
  lede: {
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginBottom: space.lg,
  },
  sectionHeading: {
    marginTop: space.lg,
    marginBottom: space.xs,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: TAP + 8,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: -1,
  },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  where: { marginTop: 2, fontSize: 12, color: colors.muted },
  chip: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
});
