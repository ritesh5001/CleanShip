import { useCallback, useState } from "react";
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
import { ApiError, getMyAssignments } from "../../src/api";
import { useSession } from "../../src/session";
import { Banner, Empty, ProgressBar } from "../../src/components/ui";
import { colors, radius, space, TAP } from "../../src/theme";
import {
  formatWorkTime,
  travelStage,
  type MyAssignment,
  type TravelStep,
} from "../../src/types";

/**
 * What this person is joining.
 *
 * The crew app's home screen, and a supervisor's way into their own paperwork
 * — a supervisor carries the same passport onto the same flight as their gang,
 * so they have a row on the joining sheet like everybody else.
 *
 * Deliberately NOT cached to disk like the vessel list is. Joining paperwork
 * is filled in at a hotel, an office or an airport, all of which have signal;
 * the offline story that matters is the one inside a hold, which is the
 * cleaning sheet's problem and already solved there. Showing a stale copy of
 * something a supervisor might have ticked ten minutes ago would be worse than
 * asking the person to pull to refresh.
 */
export default function MyJoining() {
  const { token, user, signOut } = useSession();
  const router = useRouter();

  const [assignments, setAssignments] = useState<MyAssignment[] | null>(null);
  const [steps, setSteps] = useState<TravelStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;
      try {
        const fresh = await getMyAssignments(token, signal);
        if (signal?.aborted) return;
        setAssignments(fresh.assignments);
        setSteps(fresh.travelSteps);
        setError(null);
      } catch (err) {
        if (signal?.aborted) return;
        if (err instanceof ApiError && err.status === 401) {
          await signOut();
          return;
        }
        setAssignments((current) => current ?? []);
        setError(
          err instanceof ApiError && err.isTransient
            ? "No connection. Your paperwork needs signal — try again once you have it."
            : "Could not load what you are joining.",
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

  if (assignments === null) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color={colors.navy} />
        <Text style={styles.waiting}>Loading your joining details…</Text>
      </View>
    );
  }

  /* Still joining first — that is the list the person opened the app for. */
  const open = assignments.filter((a) => !a.vessel.holdReportedAt);
  const aboard = assignments.filter((a) => a.vessel.holdReportedAt);
  const crewOnly = user?.role === "crew";

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
      <View style={styles.greeting}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>
            {user ? `Hello, ${user.name.split(" ")[0]}` : "My joining"}
          </Text>
          <Text style={styles.count}>
            {open.length === 0
              ? "Nothing to prepare for"
              : `${open.length} ${open.length === 1 ? "ship" : "ships"} to prepare for`}
          </Text>
        </View>
        {/* Crew have no other screen to sign out from, so the control lives
            here. A supervisor signs out from their vessel list as before. */}
        {crewOnly ? (
          <Pressable
            onPress={() => void signOut().then(() => router.replace("/login"))}
            accessibilityRole="button"
            style={styles.signOut}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone="error">{error}</Banner>
        </View>
      ) : null}

      {assignments.length === 0 ? (
        <Empty
          title="Nothing assigned yet"
          body="When the office puts you on a ship, your documents and travel appear here. Pull down to check again."
        />
      ) : (
        <View>
          {open.map((a) => (
            <JoiningCard key={a.vessel.id} assignment={a} steps={steps} />
          ))}

          {aboard.length > 0 ? (
            <>
              <Text style={styles.sectionHeading}>Aboard</Text>
              {aboard.map((a) => (
                <JoiningCard key={a.vessel.id} assignment={a} steps={steps} />
              ))}
            </>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

function JoiningCard({
  assignment,
  steps,
}: {
  assignment: MyAssignment;
  steps: TravelStep[];
}) {
  const { vessel, member } = assignment;
  const { progress } = member;
  const aboard = Boolean(vessel.holdReportedAt);
  const blocked = progress.documentsExpired > 0;

  /* Documents and checklist together: what somebody has to finish before they
     fly, as one fraction rather than two the reader has to add up. */
  const answered = progress.documentsDone + progress.checklistDone;
  const asked = progress.documentsTotal + progress.checklistTotal;
  const ratio = asked === 0 ? 1 : answered / asked;

  const stage = travelStage(member.travel, steps);

  return (
    <Link href={`/joining/${vessel.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${vessel.name} at ${vessel.port}. ${answered} of ${asked} items done.${
          blocked ? " Documents expired." : ""
        }`}
      >
        {({ pressed }) => (
          <View style={[styles.card, pressed ? { opacity: 0.85 } : null]}>
            <View style={styles.cardHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reference}>{vessel.reference}</Text>
                <Text style={styles.vessel}>{vessel.name}</Text>
                <Text style={styles.where}>
                  {vessel.port}
                  {vessel.berth ? ` · ${vessel.berth}` : ""}
                  {vessel.destination ? ` → ${vessel.destination}` : ""}
                </Text>
              </View>
              <View
                style={[
                  styles.chip,
                  aboard
                    ? styles.chipAboard
                    : blocked
                      ? styles.chipBlocked
                      : progress.ready
                        ? styles.chipReady
                        : styles.chipOpen,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    aboard
                      ? styles.chipTextAboard
                      : blocked
                        ? styles.chipTextBlocked
                        : progress.ready
                          ? styles.chipTextReady
                          : styles.chipTextOpen,
                  ]}
                >
                  {aboard
                    ? "Aboard"
                    : blocked
                      ? "Expired"
                      : progress.ready
                        ? "Ready"
                        : "To do"}
                </Text>
              </View>
            </View>

            {aboard ? (
              <Text style={styles.aboardNote}>
                Crew reported to the hold {formatWorkTime(vessel.holdReportedAt)} —
                paperwork closed
              </Text>
            ) : (
              <>
                <View style={{ marginTop: space.md }}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>
                      {answered} of {asked} done
                    </Text>
                    <Text style={styles.percent}>
                      {Math.round(ratio * 100)}%
                    </Text>
                  </View>
                  <View style={{ marginTop: space.sm }}>
                    <ProgressBar ratio={ratio} />
                  </View>
                </View>

                <Text style={styles.travel}>
                  {stage.step
                    ? `Travel: ${stage.step.label} · ${formatWorkTime(
                        member.travel[stage.step.key],
                      )}`
                    : "Travel: not started"}
                </Text>
              </>
            )}
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
  greeting: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: space.lg,
  },
  hello: { fontSize: 22, fontWeight: "800", color: colors.text },
  count: { marginTop: 2, fontSize: 14, color: colors.muted },
  signOut: {
    minHeight: TAP,
    justifyContent: "center",
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  signOutText: { color: colors.blue, fontWeight: "700", fontSize: 14 },
  sectionHeading: {
    marginTop: space.lg,
    marginBottom: space.sm,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },

  card: {
    padding: space.lg,
    marginBottom: space.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start", gap: space.md },
  reference: {
    fontSize: 12,
    color: colors.faint,
    fontVariant: ["tabular-nums"],
  },
  vessel: { marginTop: 2, fontSize: 19, fontWeight: "800", color: colors.text },
  where: { marginTop: 2, fontSize: 13, color: colors.muted },

  chip: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 12, fontWeight: "700" },
  chipOpen: { backgroundColor: colors.warnBg, borderColor: colors.warnBorder },
  chipTextOpen: { color: colors.warn },
  chipReady: { backgroundColor: "#e2f4ea", borderColor: colors.ok },
  chipTextReady: { color: "#14400a" },
  chipBlocked: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
  chipTextBlocked: { color: colors.danger },
  chipAboard: { backgroundColor: colors.bg, borderColor: colors.borderStrong },
  chipTextAboard: { color: colors.muted },

  progressRow: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  percent: {
    fontSize: 13,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  travel: { marginTop: space.md, fontSize: 13, color: colors.muted },
  aboardNote: { marginTop: space.md, fontSize: 13, color: colors.muted },
});
