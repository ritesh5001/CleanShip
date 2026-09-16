import {
  DOCUMENT_STATE_STYLE,
  type CrewBoard as CrewBoardData,
  type CrewMember,
  type DocumentState,
} from "@/lib/cleantrack/types";
import { formatDateTime } from "@/lib/format";
import {
  holdReportedAction,
  removeCrewAction,
  setCrewCellAction,
} from "@/app/cleantrack/admin/actions";

/**
 * The joining sheet, as it was printed: a column per person, a row per item.
 *
 * On a phone this shape is unreadable and the app turns it into a list of
 * people; here there is room for the real thing, and the real thing is what
 * the office already knows how to read. Anyone who has used the paper version
 * can use this without being told what it is.
 *
 * Every square is its own tiny form. That is deliberate: the office corrects
 * one thing at a time — "his medical came through this morning" — and a single
 * whole-board save would quietly overwrite whatever the crew ticked on their
 * phones while the page sat open. One square, one write, one merge.
 */
export function CrewBoard({
  vesselId,
  board,
}: {
  vesselId: number;
  board: CrewBoardData;
}) {
  const { crew, documents, checklist, travelSteps } = board;
  const aboard = Boolean(board.holdReportedAt);

  if (crew.length === 0) {
    return (
      <p className="px-5 py-6 text-[14px] text-slate-600">
        Nobody is on this vessel&apos;s crew yet. Add people below and their
        documents, checklist and travel appear here — and on their phones.
      </p>
    );
  }

  return (
    <div>
      {/* The one line somebody reads before the grid. */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 ${
          aboard
            ? "border-slate-200 bg-slate-50"
            : "border-amber-300 bg-amber-50"
        }`}
      >
        <p className="text-[13px] font-semibold text-slate-800">
          {aboard
            ? `Crew reported to the hold ${formatDateTime(board.holdReportedAt!)}${
                board.holdReportedByName ? ` by ${board.holdReportedByName}` : ""
              } — joining is closed`
            : `${crew.filter((m) => m.progress.ready).length} of ${crew.length} ready to fly`}
        </p>
        <form action={holdReportedAction}>
          <input type="hidden" name="vesselId" value={vesselId} />
          <input type="hidden" name="reopen" value={aboard ? "1" : "0"} />
          <button
            type="submit"
            className={`min-h-9 rounded-none border px-3 text-[12px] font-semibold ${
              aboard
                ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                : "border-[#0e3d6b] bg-[#1461a0] text-white hover:bg-[#0e3d6b]"
            }`}
          >
            {aboard ? "Reopen joining" : "Crew reported to the hold"}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {/* Sticky so a wide crew list can be scrolled without losing
                  which row is which — the same rule the phone's grids follow. */}
              <th className="sticky left-0 z-10 min-w-[220px] border-b border-r border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-500">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
                  Item
                </span>
              </th>
              {crew.map((m) => (
                <th
                  key={m.userId}
                  className="min-w-[132px] border-b border-r border-slate-200 bg-white px-3 py-3 text-left align-top"
                >
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {m.isSupervisor ? "Supervisor" : "Crew"}
                  </p>
                  <Readiness member={m} />
                  {!aboard && (
                    <form action={removeCrewAction} className="mt-2">
                      <input type="hidden" name="vesselId" value={vesselId} />
                      <input type="hidden" name="userId" value={m.userId} />
                      <button
                        type="submit"
                        className="text-[11px] font-medium text-slate-400 underline underline-offset-2 hover:text-[#c6472f]"
                      >
                        Remove
                      </button>
                    </form>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <SectionRow label="Documents" span={crew.length + 1} />
            {documents.map((item) => (
              <tr key={item.key}>
                <RowLabel>{item.label}</RowLabel>
                {crew.map((m) => (
                  <td
                    key={m.userId}
                    className="border-b border-r border-slate-100 px-2 py-1.5 text-center"
                  >
                    <DocumentCell
                      vesselId={vesselId}
                      userId={m.userId}
                      itemKey={item.key}
                      state={m.documents[item.key] ?? "pending"}
                      disabled={aboard}
                    />
                  </td>
                ))}
              </tr>
            ))}

            <SectionRow label="Checklist" span={crew.length + 1} />
            {checklist.map((item) => (
              <tr key={item.key}>
                <RowLabel>{item.label}</RowLabel>
                {crew.map((m) => (
                  <td
                    key={m.userId}
                    className="border-b border-r border-slate-100 px-2 py-1.5 text-center"
                  >
                    <ChecklistCell
                      vesselId={vesselId}
                      userId={m.userId}
                      itemKey={item.key}
                      done={m.checklist[item.key] === true}
                      disabled={aboard}
                    />
                  </td>
                ))}
              </tr>
            ))}

            <SectionRow label="Travel" span={crew.length + 1} />
            {travelSteps.map((step) => (
              <tr key={step.key}>
                <RowLabel>{step.label}</RowLabel>
                {crew.map((m) => (
                  <td
                    key={m.userId}
                    className="border-b border-r border-slate-100 px-2 py-1.5 text-center"
                  >
                    <TravelCell
                      vesselId={vesselId}
                      userId={m.userId}
                      itemKey={step.key}
                      at={m.travel[step.key] ?? null}
                      disabled={aboard}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Readiness({ member }: { member: CrewMember }) {
  const { progress } = member;
  if (progress.documentsExpired > 0) {
    return (
      <span className="mt-1 inline-block rounded-none border border-[#c6472f] bg-[#fae5e0] px-1.5 py-0.5 text-[10px] font-bold text-[#c6472f]">
        {progress.documentsExpired} expired
      </span>
    );
  }
  if (progress.ready) {
    return (
      <span className="mt-1 inline-block rounded-none border border-[#4f9c2b] bg-[#e2f4ea] px-1.5 py-0.5 text-[10px] font-bold text-[#14400a]">
        Ready
      </span>
    );
  }
  const left =
    progress.documentsTotal -
    progress.documentsDone -
    progress.documentsExpired +
    (progress.checklistTotal - progress.checklistDone);
  return (
    <span className="mt-1 inline-block rounded-none border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
      {left} left
    </span>
  );
}

function SectionRow({ label, span }: { label: string; span: number }) {
  return (
    <tr>
      <td
        colSpan={span}
        className="border-b border-slate-200 bg-[#0a2e52] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75"
      >
        {label}
      </td>
    </tr>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 py-1.5 text-slate-800">
      {children}
    </td>
  );
}

/**
 * A document square: submits the NEXT state, so the whole control is one
 * button and there is no dropdown to open, choose from and close for each of
 * eight rows times four people.
 */
function DocumentCell({
  vesselId,
  userId,
  itemKey,
  state,
  disabled,
}: {
  vesselId: number;
  userId: number;
  itemKey: string;
  state: DocumentState;
  disabled: boolean;
}) {
  const next: DocumentState =
    state === "pending" ? "done" : state === "done" ? "expired" : "pending";
  const skin = DOCUMENT_STATE_STYLE[state];

  return (
    <form action={setCrewCellAction}>
      <input type="hidden" name="vesselId" value={vesselId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="kind" value="document" />
      <input type="hidden" name="key" value={itemKey} />
      <input type="hidden" name="value" value={next} />
      <button
        type="submit"
        disabled={disabled}
        title={disabled ? "Closed — the crew are aboard" : `Set to ${next}`}
        className={`min-h-8 w-full rounded-none border px-2 text-[11px] font-bold ${skin.className} ${
          disabled ? "cursor-not-allowed opacity-70" : "hover:opacity-80"
        }`}
      >
        {skin.label}
      </button>
    </form>
  );
}

function ChecklistCell({
  vesselId,
  userId,
  itemKey,
  done,
  disabled,
}: {
  vesselId: number;
  userId: number;
  itemKey: string;
  done: boolean;
  disabled: boolean;
}) {
  return (
    <form action={setCrewCellAction}>
      <input type="hidden" name="vesselId" value={vesselId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="kind" value="checklist" />
      <input type="hidden" name="key" value={itemKey} />
      <input type="hidden" name="value" value={done ? "false" : "true"} />
      <button
        type="submit"
        disabled={disabled}
        aria-pressed={done}
        title={disabled ? "Closed — the crew are aboard" : done ? "Clear" : "Mark done"}
        className={`min-h-8 w-full rounded-none border px-2 text-[12px] font-bold ${
          done
            ? "border-[#4f9c2b] bg-[#8fce6a] text-[#14400a]"
            : "border-slate-300 bg-white text-slate-300"
        } ${disabled ? "cursor-not-allowed opacity-70" : "hover:opacity-80"}`}
      >
        {done ? "✓" : "—"}
      </button>
    </form>
  );
}

/**
 * A travel square shows the TIME, not a tick.
 *
 * "Boarded the flight" is 04:20 to the office chasing a late joiner, and a
 * tick throws away the only part of it anybody needs.
 */
function TravelCell({
  vesselId,
  userId,
  itemKey,
  at,
  disabled,
}: {
  vesselId: number;
  userId: number;
  itemKey: string;
  at: string | null;
  disabled: boolean;
}) {
  return (
    <form action={setCrewCellAction}>
      <input type="hidden" name="vesselId" value={vesselId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="kind" value="travel" />
      <input type="hidden" name="key" value={itemKey} />
      {/* Empty clears it; anything else stamps now. */}
      <input type="hidden" name="value" value={at ? "" : "now"} />
      <button
        type="submit"
        disabled={disabled}
        title={
          disabled
            ? "Closed — the crew are aboard"
            : at
              ? "Clear this time"
              : "Stamp the time now"
        }
        className={`min-h-8 w-full rounded-none border px-2 font-mono text-[11px] ${
          at
            ? "border-[#00929b] bg-[#e6f7f8] text-[#0a2e52]"
            : "border-slate-200 bg-white text-slate-300"
        } ${disabled ? "cursor-not-allowed opacity-70" : "hover:opacity-80"}`}
      >
        {at ? compactTime(at) : "—"}
      </button>
    </form>
  );
}

/** "16 Sep 09:03" — the year is noise on a job measured in days. */
function compactTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
