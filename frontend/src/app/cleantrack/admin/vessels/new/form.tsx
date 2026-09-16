"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createVesselAction, type FormState } from "../../actions";
import { Button, Card, Field, inputClass } from "@/components/cleantrack/ui";
import { compartmentNoun, type Stage, type StageTemplate, type VesselType } from "@/lib/cleantrack/types";

const initial: FormState = {};

type StageDraft = { key?: string; label: string; short: string };

/**
 * The create form.
 *
 * Two things here are not standard CRUD, and they are the point of the screen:
 * the admin chooses how many holds or tanks the vessel has, and then edits the
 * stage list the crew will work through. The stages are a starting template
 * that can be renamed, reordered, added to and deleted — what is saved belongs
 * to this vessel alone, so changing a template later never rewrites a job that
 * has already been worked.
 */
export function NewVesselForm({
  clients,
  supervisors,
  joiners,
  templates,
  defaultLabels,
  places,
}: {
  clients: { id: number; name: string }[];
  supervisors: { id: number; name: string }[];
  /** Crew and supervisor accounts that can be put on this vessel. */
  joiners: { id: number; name: string; email: string; role: string }[];
  templates: StageTemplate[];
  defaultLabels: { hold: string[]; tank: string[] };
  /** Ports and destinations already used, offered as suggestions. */
  places: string[];
}) {
  const [state, action] = useActionState(createVesselAction, initial);
  const [type, setType] = useState<VesselType>("hold");
  const [count, setCount] = useState(5);
  const [templateId, setTemplateId] = useState(
    templates.find((t) => t.type === "hold")?.id ?? "",
  );
  const [stages, setStages] = useState<StageDraft[]>(
    templates.find((t) => t.type === "hold")?.stages.map(toDraft) ?? [],
  );
  const [labels, setLabels] = useState<string[]>([]);
  /* Controlled rather than left to the checkboxes, because the supervisor
     select above also decides who is on the roster and the count has to
     include them. */
  const [supervisorId, setSupervisorId] = useState("");
  const [crewIds, setCrewIds] = useState<Set<number>>(new Set());
  const [crewFilter, setCrewFilter] = useState("");

  const options = templates.filter((t) => t.type === type);

  /** Compartment names: the admin's edits win, defaults fill the rest. */
  const resolvedLabels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) =>
        (labels[i] ?? "").trim() || defaultLabels[type][i] || `${i + 1}`,
      ),
    [count, labels, defaultLabels, type],
  );

  function switchType(next: VesselType) {
    setType(next);
    const template = templates.find((t) => t.type === next);
    setTemplateId(template?.id ?? "");
    setStages(template?.stages.map(toDraft) ?? []);
    /* Custom names belong to the old numbering scheme — holds are numbered,
       tanks are port/starboard pairs — so they are cleared rather than
       carried across into a layout they do not describe. */
    setLabels([]);
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    const template = templates.find((t) => t.id === id);
    if (template) setStages(template.stages.map(toDraft));
  }

  function editStage(index: number, patch: Partial<StageDraft>) {
    setStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  function moveStage(index: number, delta: number) {
    setStages((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const valid = stages.length > 0 && stages.every((s) => s.label.trim().length > 0);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {/* Carried as JSON because a variable-length list of stages does not fit
          flat form fields, and a hidden input keeps the whole form a single
          progressive-enhancement-friendly post. */}
      <input
        type="hidden"
        name="stages"
        value={JSON.stringify(
          stages.map((s) => ({
            ...(s.key ? { key: s.key } : {}),
            label: s.label.trim(),
            short: (s.short || s.label).trim().slice(0, 12),
          })),
        )}
      />
      <input
        type="hidden"
        name="compartmentLabels"
        value={JSON.stringify(resolvedLabels)}
      />

      <div className="space-y-6 lg:col-span-2">
        <Card className="p-5">
          {state.error && (
            <p
              role="alert"
              className="mb-4 rounded-none border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-800"
            >
              {state.error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Vessel name">
                <input name="name" required className={inputClass} placeholder="SEA VOYAGER" />
              </Field>
            </div>

            <Field label="IMO number" hint="7 digits. Customers need it to open the share link.">
              <input name="imo" inputMode="numeric" className={inputClass} placeholder="9123456" />
            </Field>

            <Field label="Client">
              <select name="clientId" defaultValue="" className={inputClass}>
                <option value="">No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Port">
              <input name="port" required className={inputClass} placeholder="Kandla" />
            </Field>

            <Field label="Berth or anchorage" hint="Optional">
              <input name="berth" className={inputClass} placeholder="Oil jetty 3" />
            </Field>

            <Field label="Destination" hint="Optional. Where the vessel sails to next.">
              <input
                name="destination"
                list="destination-suggestions"
                autoComplete="off"
                className={inputClass}
                placeholder="Singapore"
              />
              <datalist id="destination-suggestions">
                {places.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </Field>

            <Field label="Supervisor" hint="Can be assigned later.">
              <select
                name="supervisorId"
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className={inputClass}
              >
                <option value="">Unassigned</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Scheduled for" hint="Optional">
              <input name="scheduledFor" type="date" className={inputClass} />
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Notes for the supervisor"
                hint="Previous cargo, next fixture, anything they need on the day."
              >
                <textarea name="notes" rows={3} className={`${inputClass} min-h-24 py-2`} />
              </Field>
            </div>
          </div>
        </Card>

        {/* ---- crew ---- */}
        <CrewPicker
          joiners={joiners}
          supervisorId={supervisorId ? Number(supervisorId) : null}
          selected={crewIds}
          filter={crewFilter}
          onFilter={setCrewFilter}
          onToggle={(id) =>
            setCrewIds((current) => {
              const next = new Set(current);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })
          }
        />

        {/* ---- compartments ---- */}
        <Card className="p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
            Holds or tanks
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="What is being cleaned">
              <select
                name="type"
                value={type}
                onChange={(e) => switchType(e.target.value as VesselType)}
                className={inputClass}
              >
                <option value="hold">Cargo holds</option>
                <option value="tank">Tanks</option>
              </select>
            </Field>

            <Field
              label={`Number of ${compartmentNoun(type, true).toLowerCase()}`}
              hint="One row on the status sheet each."
            >
              <input
                name="compartmentCount"
                type="number"
                min={1}
                max={60}
                required
                value={count}
                onChange={(e) =>
                  setCount(Math.min(60, Math.max(1, Number(e.target.value) || 1)))
                }
                className={inputClass}
              />
            </Field>
          </div>

          <p className="mt-4 text-[13px] text-slate-600">
            Names are filled in for you. Edit any that differ from the vessel&apos;s
            own plan.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {resolvedLabels.map((label, i) => (
              <input
                key={i}
                value={labels[i] ?? label}
                onChange={(e) =>
                  setLabels((prev) => {
                    const next = [...prev];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                aria-label={`${compartmentNoun(type)} ${i + 1} name`}
                className="min-h-10 rounded-none border border-slate-300 px-2 text-[13px] text-slate-900 outline-none focus:border-blue-600"
              />
            ))}
          </div>
        </Card>

        {/* ---- stages ---- */}
        <Card className="p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Stages
            </h2>
            {options.length > 0 && (
              <label className="text-[13px] text-slate-600">
                Start from{" "}
                <select
                  value={templateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="ml-1 rounded-none border border-slate-300 px-2 py-1.5 text-[13px]"
                >
                  {options.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <p className="mt-2 text-[13px] text-slate-600">
            These become the columns of the status sheet, in this order. Rename,
            reorder, add or remove — what you save belongs to this vessel only.
          </p>

          <ol className="mt-4 space-y-2">
            {stages.map((stage, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2">
                <span className="w-5 shrink-0 font-mono text-[12px] text-slate-400">
                  {i + 1}
                </span>
                <input
                  value={stage.label}
                  onChange={(e) => editStage(i, { label: e.target.value })}
                  aria-label={`Stage ${i + 1} name`}
                  placeholder="Stage name"
                  className="min-h-10 flex-1 rounded-none border border-slate-300 px-2.5 text-[14px] outline-none focus:border-blue-600"
                />
                <input
                  value={stage.short}
                  onChange={(e) => editStage(i, { short: e.target.value })}
                  aria-label={`Stage ${i + 1} short name`}
                  placeholder="Short"
                  maxLength={12}
                  title="Column heading on a phone, where the full name will not fit"
                  className="min-h-10 w-24 rounded-none border border-slate-300 px-2.5 text-[13px] outline-none focus:border-blue-600"
                />
                <span className="flex gap-1">
                  <IconButton label="Move up" onClick={() => moveStage(i, -1)} disabled={i === 0}>
                    ↑
                  </IconButton>
                  <IconButton
                    label="Move down"
                    onClick={() => moveStage(i, 1)}
                    disabled={i === stages.length - 1}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    label="Remove stage"
                    onClick={() => setStages((p) => p.filter((_, j) => j !== i))}
                    disabled={stages.length === 1}
                  >
                    ✕
                  </IconButton>
                </span>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => setStages((p) => [...p, { label: "", short: "" }])}
            className="mt-3 rounded-none border border-dashed border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-700"
          >
            + Add a stage
          </button>
        </Card>

        <SubmitButton disabled={!valid} />
      </div>

      {/* Live preview — the compartment count and the stage list are the two
          fields people get wrong, and seeing the grid appear catches it before
          saving rather than after the crew is on board. */}
      <Card className="h-fit p-5 lg:sticky lg:top-20">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
          The status sheet
        </h2>
        <p className="mt-2 text-[13px] text-slate-600">
          {count} {compartmentNoun(type, count !== 1).toLowerCase()} ×{" "}
          {stages.length} stage{stages.length === 1 ? "" : "s"} ={" "}
          {count * stages.length} cells
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-slate-50 px-1.5 py-1 text-left font-semibold text-slate-600">
                  {compartmentNoun(type)}
                </th>
                {stages.map((s, i) => (
                  <th
                    key={i}
                    className="border border-slate-200 bg-slate-50 px-1.5 py-1 font-semibold text-slate-600"
                  >
                    {(s.short || s.label || "—").slice(0, 8)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resolvedLabels.slice(0, 12).map((label, i) => (
                <tr key={i}>
                  <th className="border border-slate-200 px-1.5 py-1 text-left font-medium text-slate-700">
                    {label}
                  </th>
                  {stages.map((_, j) => (
                    <td key={j} className="border border-slate-200 px-1.5 py-2" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {resolvedLabels.length > 12 && (
            <p className="mt-2 text-[12px] text-slate-500">
              …and {resolvedLabels.length - 12} more.
            </p>
          )}
        </div>
      </Card>
    </form>
  );
}

function toDraft(stage: Stage): StageDraft {
  return { key: stage.key, label: stage.label, short: stage.short };
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="size-10 rounded-none border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? "Creating…" : "Create vessel"}
    </Button>
  );
}


/**
 * Who is joining this vessel.
 *
 * Checkboxes rather than a multi-select: a gang is picked by name from a list
 * the admin can see all of, and a multi-select that loses every choice to one
 * click without Ctrl held is how a roster of four becomes a roster of one.
 *
 * The chosen supervisor is shown ticked and locked — they are always on the
 * roster, because they carry the same passport onto the same flight — so the
 * count matches what the joining board will actually show.
 */
function CrewPicker({
  joiners,
  supervisorId,
  selected,
  filter,
  onFilter,
  onToggle,
}: {
  joiners: { id: number; name: string; email: string; role: string }[];
  supervisorId: number | null;
  selected: Set<number>;
  filter: string;
  onFilter: (value: string) => void;
  onToggle: (id: number) => void;
}) {
  const needle = filter.trim().toLowerCase();
  const shown = joiners.filter(
    (j) =>
      !needle ||
      j.name.toLowerCase().includes(needle) ||
      j.email.toLowerCase().includes(needle),
  );
  const total = new Set([...selected, ...(supervisorId ? [supervisorId] : [])]).size;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
          Crew joining this vessel
        </h2>
        <span className="font-mono text-[12px] text-slate-500">
          {total} selected
        </span>
      </div>
      <p className="mt-1 text-[13px] text-slate-600">
        The people who will report aboard. Each gets this vessel&apos;s joining
        sheet on their phone. You can add or remove people later from the vessel
        page.
      </p>

      {/* Posted from state, not from the checkboxes: a filtered list does not
          render the people it hides, and an unrendered checkbox posts nothing —
          so typing a name to find the fourth person would silently drop the
          first three. The supervisor is sent separately and the API adds them. */}
      {[...selected]
        .filter((id) => id !== supervisorId)
        .map((id) => (
          <input key={id} type="hidden" name="crewIds" value={id} />
        ))}

      {joiners.length === 0 ? (
        <p className="mt-4 text-[13px] text-slate-600">
          No crew accounts yet. Create them under{" "}
          <span className="font-semibold">Users</span> with the Crew role.
        </p>
      ) : (
        <>
          {joiners.length > 8 && (
            <input
              type="search"
              value={filter}
              onChange={(e) => onFilter(e.target.value)}
              placeholder="Filter by name or email"
              className={`${inputClass} mt-4`}
            />
          )}

          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((j) => {
              const isSupervisor = j.id === supervisorId;
              const checked = isSupervisor || selected.has(j.id);
              return (
                <li key={j.id}>
                  <label
                    className={`flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 ${
                      checked
                        ? "border-[#1461a0] bg-[#f1f7fc]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    } ${isSupervisor ? "cursor-default" : ""}`}
                  >
                    <input
                      type="checkbox"
                      value={j.id}
                      checked={checked}
                      disabled={isSupervisor}
                      onChange={() => onToggle(j.id)}
                      className="size-4 accent-[#1461a0]"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium text-slate-900">
                        {j.name}
                      </span>
                      <span className="block text-[11px] capitalize text-slate-500">
                        {isSupervisor ? "Supervisor — always on the crew" : j.role}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {shown.length === 0 && (
            <p className="mt-3 text-[13px] text-slate-500">Nobody matches that filter.</p>
          )}
        </>
      )}
    </Card>
  );
}
