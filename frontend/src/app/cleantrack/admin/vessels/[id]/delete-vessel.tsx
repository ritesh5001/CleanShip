"use client";

import { useFormStatus } from "react-dom";
import { deleteVesselAction } from "../../actions";

/**
 * The delete button, behind a typed-name confirmation.
 *
 * A plain "Are you sure?" gets clicked through out of habit. Typing the
 * vessel's name makes someone look at which vessel they are about to erase.
 */
export function DeleteVesselButton({ vesselId, name }: { vesselId: number; name: string }) {
  return (
    <form
      action={deleteVesselAction}
      onSubmit={(e) => {
        const typed = window.prompt(
          `This permanently deletes ${name}, its holds and its time log.\n\nType the vessel name to confirm:`,
        );
        if (typed === null || typed.trim().toLowerCase() !== name.trim().toLowerCase()) {
          e.preventDefault();
          if (typed !== null) window.alert("The name did not match. Nothing was deleted.");
        }
      }}
      className="mt-3"
    >
      <input type="hidden" name="vesselId" value={vesselId} />
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 w-full rounded-none border border-red-700 bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete vessel"}
    </button>
  );
}
