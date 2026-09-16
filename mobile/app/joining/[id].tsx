import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  ApiError,
  getCrewBoard,
  getMyAssignments,
  patchCrewMember,
  patchMyAssignment,
  type CrewPatch,
} from "../../src/api";
import { useSession } from "../../src/session";
import { Banner } from "../../src/components/ui";
import { JoiningSheet } from "../../src/components/joining-sheet";
import { colors, space } from "../../src/theme";
import {
  formatWorkTime,
  type CrewItem,
  type CrewMember,
  type DocumentState,
  type TravelStep,
} from "../../src/types";

/**
 * One person's joining paperwork, filled in.
 *
 * Serves both halves of the printed sheet from one screen:
 *
 *   /joining/7            my own row, through /api/v1/me — scoped to the token
 *   /joining/7?userId=12  somebody else's, through the vessel's crew routes
 *
 * One screen rather than two because the sheet is the same sheet and the rules
 * about what counts as done are the same rules. The only difference is which
 * endpoint the save goes to, which is four lines at the bottom of `save`.
 *
 * WHY THE SAVE IS OPTIMISTIC
 *
 * The row is redrawn from the answer the server sends back, but the tap is
 * shown immediately. Joining paperwork is worked through in bursts — somebody
 * sits down and does eight documents — and a spinner between each one turns a
 * two-minute job into a five-minute one. A failed save rolls the item back and
 * says so, which is the honest version of the same trade.
 */
export default function JoiningDetail() {
  const { id, userId } = useLocalSearchParams<{ id: string; userId?: string }>();
  const vesselId = Number(id);
  /* Present means "I am filling in somebody else's row" — the supervisor's
     half of the sheet. Absent means my own. */
  const subjectId = userId ? Number(userId) : null;

  const { token, signOut } = useSession();
  const navigation = useNavigation();

  const [member, setMember] = useState<CrewMember | null>(null);
  const [vesselName, setVesselName] = useState<string>("");
  const [documents, setDocuments] = useState<CrewItem[]>([]);
  const [checklist, setChecklist] = useState<CrewItem[]>([]);
  const [steps, setSteps] = useState<TravelStep[]>([]);
  const [holdReportedAt, setHoldReportedAt] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token || !Number.isInteger(vesselId)) return;
      try {
        if (subjectId === null) {
          const fresh = await getMyAssignments(token, signal);
          if (signal?.aborted) return;
          const mine = fresh.assignments.find((a) => a.vessel.id === vesselId);
          if (!mine) {
            setError("You are not on the crew list for this vessel.");
            return;
          }
          setMember(mine.member);
          setVesselName(mine.vessel.name);
          setDocuments(mine.vessel.crewDocuments);
          setChecklist(mine.vessel.crewChecklist);
          setSteps(fresh.travelSteps);
          setHoldReportedAt(mine.vessel.holdReportedAt);
        } else {
          const board = await getCrewBoard(token, vesselId, signal);
          if (signal?.aborted) return;
          const row = board.crew.find((m) => m.userId === subjectId);
          if (!row) {
            setError("That person is not on the crew list for this vessel.");
            return;
          }
          setMember(row);
          setDocuments(board.documents);
          setChecklist(board.checklist);
          setSteps(board.travelSteps);
          setHoldReportedAt(board.holdReportedAt);
        }
        setError(null);
      } catch (err) {
        if (signal?.aborted) return;
        if (err instanceof ApiError && err.status === 401) {
          await signOut();
          return;
        }
        setError(
          err instanceof ApiError && err.isTransient
            ? "No connection. Joining paperwork needs signal — try again once you have it."
            : "Could not load this paperwork.",
        );
      }
    },
    [token, vesselId, subjectId, signOut],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    if (!member) return;
    navigation.setOptions({
      title: subjectId === null ? "My joining" : member.name,
    });
  }, [member, subjectId, navigation]);

  /**
   * Applies one tap.
   *
   * The item is repainted before the request goes out and rolled back if it
   * fails — the whole row is replaced with the server's copy on success, so a
   * concurrent edit by somebody else arrives at the same moment.
   */
  const save = useCallback(
    async (key: string, patch: CrewPatch, optimistic: (m: CrewMember) => CrewMember) => {
      if (!token || !member) return;
      const before = member;
      setBusyKey(key);
      setSaveError(null);
      setMember(optimistic(member));
      try {
        const updated =
          subjectId === null
            ? await patchMyAssignment(token, vesselId, patch)
            : await patchCrewMember(token, vesselId, subjectId, patch);
        setMember(updated);
      } catch (err) {
        setMember(before);
        setSaveError(
          err instanceof ApiError && err.isTransient
            ? "No connection — that did not save. Try again once you have signal."
            : err instanceof ApiError
              ? err.message
              : "That did not save. Try again.",
        );
      } finally {
        setBusyKey(null);
      }
    },
    [token, member, subjectId, vesselId],
  );

  if (!member) {
    return (
      <View style={styles.centre}>
        {error ? (
          <View style={{ padding: space.lg, width: "100%" }}>
            <Banner tone="error">{error}</Banner>
          </View>
        ) : (
          <>
            <ActivityIndicator size="large" color={colors.navy} />
            <Text style={styles.waiting}>Loading the joining sheet…</Text>
          </>
        )}
      </View>
    );
  }

  const aboard = Boolean(holdReportedAt);

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
      <View style={styles.head}>
        <Text style={styles.name} numberOfLines={1}>
          {member.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {vesselName ? `${vesselName} · ` : ""}
          {member.isSupervisor ? "Supervisor" : "Crew"}
        </Text>
      </View>

      {error ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone="warn">{error}</Banner>
        </View>
      ) : null}
      {saveError ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone="error">{saveError}</Banner>
        </View>
      ) : null}

      {/* Once the gang is aboard the sheet is a record, not a form. Saying so
          is better than leaving the rows tappable and letting the server
          refuse each one. */}
      {aboard ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone="warn">
            {`Crew reported to the hold ${formatWorkTime(holdReportedAt)}. This is now a record and cannot be changed.`}
          </Banner>
        </View>
      ) : null}

      <JoiningSheet
        documents={documents}
        checklist={checklist}
        travelSteps={steps}
        documentState={member.documents}
        checklistState={member.checklist}
        travelState={member.travel}
        progress={member.progress}
        readOnly={aboard}
        busyKey={busyKey}
        onDocument={(key, next: DocumentState) =>
          void save(key, { documents: { [key]: next } }, (m) => ({
            ...m,
            documents: { ...m.documents, [key]: next },
          }))
        }
        onChecklist={(key, next) =>
          void save(key, { checklist: { [key]: next } }, (m) => ({
            ...m,
            checklist: { ...m.checklist, [key]: next },
          }))
        }
        onTravel={(key, next) =>
          void save(key, { travel: { [key]: next } }, (m) => ({
            ...m,
            travel: { ...m.travel, [key]: next },
          }))
        }
      />

      {member.updatedByName ? (
        <Text style={styles.footnote}>
          Last changed by {member.updatedByName} ·{" "}
          {formatWorkTime(member.updatedAt)}
        </Text>
      ) : null}
    </ScrollView>
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
  name: { fontSize: 18, fontWeight: "800", color: colors.onDark },
  sub: { marginTop: 2, fontSize: 12, color: colors.onDarkMuted },
  footnote: {
    marginTop: space.lg,
    fontSize: 12,
    color: colors.faint,
    textAlign: "center",
  },
});
