import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ApiError, getCrewBoard, reportToHold } from "../../src/api";
import { useSession } from "../../src/session";
import { Banner, Empty, ProgressBar } from "../../src/components/ui";
import { colors, space, TAP } from "../../src/theme";
import {
  formatWorkTime,
  travelStage,
  wallNow,
  type CrewBoard,
  type CrewMember,
  type TravelStep,
} from "../../src/types";

/**
 * The supervisor's joining board.
 *
 * The printed sheet had a column per person and a row per item. On a phone
 * that matrix is unreadable — four columns of twenty rows on a 360px screen —
 * so it is turned into a list of people with what is outstanding on each, and
 * the detail is one tap away. The matrix belongs on the office screen, where
 * there is room for it, and that is where it lives.
 *
 * The supervisor appears on this list like anybody else. They fly with the
 * gang and carry the same paperwork, and a board that quietly left them off
 * would be a board that says a crew is ready when one passport is missing.
 */
export default function CrewBoardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vesselId = Number(id);
  const { token, user, signOut } = useSession();
  const navigation = useNavigation();
  const router = useRouter();

  const [board, setBoard] = useState<CrewBoard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [reporting, setReporting] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token || !Number.isInteger(vesselId)) return;
      try {
        const fresh = await getCrewBoard(token, vesselId, signal);
        if (signal?.aborted) return;
        setBoard(fresh);
        setError(null);
      } catch (err) {
        if (signal?.aborted) return;
        if (err instanceof ApiError && err.status === 401) {
          await signOut();
          return;
        }
        setError(
          err instanceof ApiError && err.isTransient
            ? "No connection. The joining board needs signal — try again once you have it."
            : err instanceof ApiError
              ? err.message
              : "Could not load the joining board.",
        );
      }
    },
    [token, vesselId, signOut],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    navigation.setOptions({ title: "Joining board" });
  }, [navigation]);

  /**
   * The switch.
   *
   * Confirmed rather than instant, because it is not reversible from this app:
   * once it is called the joining paperwork closes for everybody, and only the
   * office can reopen it. The count of what is outstanding goes in the prompt
   * so the decision is made with the number in front of the person making it —
   * it does NOT block them. A gang standing on a deck has arrived whether or
   * not somebody remembered to tick their safety shoes.
   */
  const onReport = useCallback(() => {
    if (!token || !board) return;
    const notReady = board.crew.filter((m) => !m.progress.ready).length;
    const expired = board.crew.filter((m) => m.progress.documentsExpired > 0).length;

    const lines = [
      "This ends joining and starts the cleaning record. Only the office can undo it.",
    ];
    if (expired > 0) {
      lines.unshift(
        `${expired} ${expired === 1 ? "person has" : "people have"} an expired document.`,
      );
    } else if (notReady > 0) {
      lines.unshift(
        `${notReady} ${notReady === 1 ? "person has" : "people have"} paperwork outstanding.`,
      );
    }

    Alert.alert("Crew reported to the hold?", lines.join("\n\n"), [
      { text: "Not yet", style: "cancel" },
      {
        text: "Yes, reported",
        style: "destructive",
        onPress: () => {
          setReporting(true);
          /* Wall-clock, like every other time this product records: the hour
             the supervisor means is the hour that gets stored. */
          void reportToHold(token, vesselId, wallNow().toISOString())
            .then(() => load())
            .catch((err: unknown) =>
              setError(
                err instanceof ApiError && err.isTransient
                  ? "No connection — that did not save. Try again once you have signal."
                  : err instanceof ApiError
                    ? err.message
                    : "Could not report to the hold.",
              ),
            )
            .finally(() => setReporting(false));
        },
      },
    ]);
  }, [token, board, vesselId, load]);

  if (!board) {
    return (
      <View style={styles.centre}>
        {error ? (
          <View style={{ padding: space.lg, width: "100%" }}>
            <Banner tone="error">{error}</Banner>
          </View>
        ) : (
          <>
            <ActivityIndicator size="large" color={colors.navy} />
            <Text style={styles.waiting}>Loading the joining board…</Text>
          </>
        )}
      </View>
    );
  }

  const aboard = Boolean(board.holdReportedAt);
  const ready = board.crew.filter((m) => m.progress.ready).length;
  const blocked = board.crew.filter((m) => m.progress.documentsExpired > 0).length;

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
      {error ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone="error">{error}</Banner>
        </View>
      ) : null}

      <View style={styles.head}>
        <Text style={styles.headTitle}>
          {aboard ? "Crew aboard" : "Crew joining"}
        </Text>
        <Text style={styles.headSub}>
          {aboard
            ? `Reported ${formatWorkTime(board.holdReportedAt)}${
                board.holdReportedByName ? ` by ${board.holdReportedByName}` : ""
              }`
            : `${ready} of ${board.crew.length} ready${
                blocked > 0 ? ` · ${blocked} blocked by expired documents` : ""
              }`}
        </Text>
      </View>

      {board.crew.length === 0 ? (
        <Empty
          title="Nobody on this ship yet"
          body="The office adds the crew from the admin panel. Once they are on, their documents and travel appear here."
        />
      ) : (
        <View>
          {board.crew.map((m) => (
            <CrewRow
              key={m.userId}
              vesselId={vesselId}
              member={m}
              steps={board.travelSteps}
              isMe={m.userId === user?.sub}
            />
          ))}
        </View>
      )}

      {/* The switch, at the foot of the list — after the thing it is a
          judgement about, not before it. */}
      {!aboard && board.crew.length > 0 ? (
        <Pressable
          onPress={onReport}
          disabled={reporting}
          accessibilityRole="button"
          accessibilityLabel="Record that the crew have reported to the hold"
          style={({ pressed }) => [
            styles.report,
            pressed ? { opacity: 0.85 } : null,
            reporting ? { opacity: 0.5 } : null,
          ]}
        >
          <Text style={styles.reportText}>
            {reporting ? "Saving…" : "Crew reported to the hold"}
          </Text>
          <Text style={styles.reportHint}>
            Ends joining · starts the cleaning record
          </Text>
        </Pressable>
      ) : null}

      {aboard ? (
        <Pressable
          onPress={() => router.replace(`/vessels/${vesselId}`)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.openSheet,
            pressed ? { opacity: 0.85 } : null,
          ]}
        >
          <Text style={styles.openSheetText}>Open the cleaning sheet</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

function CrewRow({
  vesselId,
  member,
  steps,
  isMe,
}: {
  vesselId: number;
  member: CrewMember;
  steps: TravelStep[];
  isMe: boolean;
}) {
  const { progress } = member;
  const answered = progress.documentsDone + progress.checklistDone;
  const asked = progress.documentsTotal + progress.checklistTotal;
  const ratio = asked === 0 ? 1 : answered / asked;
  const stage = travelStage(member.travel, steps);
  const blocked = progress.documentsExpired > 0;

  /* My own row goes through /api/v1/me, which is scoped to the token and needs
     no ownership check; everybody else's goes through the vessel's crew
     routes. The screen is the same either way — see app/joining/[id]. */
  const href = isMe
    ? `/joining/${vesselId}`
    : `/joining/${vesselId}?userId=${member.userId}`;

  return (
    <Link href={href as never} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${member.name}, ${answered} of ${asked} done${
          blocked ? ", documents expired" : ""
        }`}
      >
        {({ pressed }) => (
          <View style={[styles.row, pressed ? { opacity: 0.85 } : null]}>
            <View style={styles.rowHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {member.name}
                  {isMe ? "  (you)" : ""}
                </Text>
                <Text style={styles.rowRole}>
                  {member.isSupervisor ? "Supervisor" : "Crew"}
                  {stage.step ? ` · ${stage.step.short}` : ""}
                </Text>
              </View>
              <View
                style={[
                  styles.pill,
                  blocked
                    ? styles.pillBlocked
                    : progress.ready
                      ? styles.pillReady
                      : styles.pillOpen,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    blocked
                      ? styles.pillTextBlocked
                      : progress.ready
                        ? styles.pillTextReady
                        : styles.pillTextOpen,
                  ]}
                >
                  {blocked
                    ? `${progress.documentsExpired} expired`
                    : progress.ready
                      ? "Ready"
                      : `${asked - answered} left`}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: space.sm }}>
              <ProgressBar ratio={ratio} />
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

  head: {
    backgroundColor: colors.navy,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    marginBottom: space.lg,
  },
  headTitle: { fontSize: 18, fontWeight: "800", color: colors.onDark },
  headSub: { marginTop: 2, fontSize: 12, color: colors.onDarkMuted },

  row: {
    padding: space.md,
    marginBottom: space.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: TAP + 16,
  },
  rowHead: { flexDirection: "row", alignItems: "flex-start", gap: space.md },
  rowName: { fontSize: 16, fontWeight: "700", color: colors.text },
  rowRole: { marginTop: 2, fontSize: 12, color: colors.muted },

  pill: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 11, fontWeight: "800" },
  pillOpen: { backgroundColor: colors.warnBg, borderColor: colors.warnBorder },
  pillTextOpen: { color: colors.warn },
  pillReady: { backgroundColor: "#e2f4ea", borderColor: colors.ok },
  pillTextReady: { color: "#14400a" },
  pillBlocked: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
  pillTextBlocked: { color: colors.danger },

  report: {
    marginTop: space.lg,
    minHeight: TAP + 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: colors.blueDark,
    paddingVertical: space.md,
  },
  reportText: { fontSize: 16, fontWeight: "800", color: colors.onDark },
  reportHint: { marginTop: 2, fontSize: 12, color: "rgba(255,255,255,0.75)" },

  openSheet: {
    marginTop: space.lg,
    minHeight: TAP,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
  },
  openSheetText: { fontSize: 15, fontWeight: "700", color: colors.text },
});
