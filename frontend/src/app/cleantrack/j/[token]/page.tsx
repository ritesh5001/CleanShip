import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientVesselView } from "@/components/cleantrack/client-vessel-view";
import { ApiError, getSharedVessel, peekShare, verifyShare } from "@/lib/api";
import { shareProof } from "@/lib/share-session";
import { ShareGate } from "./gate";

export const dynamic = "force-dynamic";

/**
 * The customer's view. No account, ever.
 *
 * Access is the share link plus the vessel's IMO number. An IMO is public
 * information, so this stops a forwarded link opening straight into a vessel;
 * it does not stop someone who already knows which ship it is. That is the
 * trade being made, and it is the right one against issuing customers
 * passwords they will lose.
 *
 * The page shows this vessel and nothing else: no client list, no other
 * vessels, no navigation to walk anywhere from here.
 */
export const metadata: Metadata = {
  title: "Cleaning progress",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SharedVesselPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let peek;
  try {
    peek = await peekShare(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  /* A vessel with no IMO — a barge, a workboat — has nothing to gate on.
     Inventing a challenge it cannot answer would lock the customer out of
     their own job, so those open on the link alone. Admins can still revoke. */
  const proof = await shareProof(token);
  let vessel;
  try {
    if (proof) {
      vessel = (await getSharedVessel(token, proof)).vessel;
    } else if (!peek.requiresImo) {
      vessel = (await verifyShare(token, "")).vessel;
    }
  } catch {
    /* A stale or wrong proof just means the gate again, not an error page. */
    vessel = undefined;
  }

  if (!vessel) {
    return <ShareGate token={token} vesselHint={peek.vessel.name} />;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <span className="text-[15px] font-bold tracking-tight text-slate-900">
            CleanTrack
          </span>
          <span className="text-[13px] text-slate-500">
            Cleanship Marine Services
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <ClientVesselView vessel={vessel} />
        <p className="mt-8 text-center text-[12px] text-slate-500">
          Live progress{vessel.clientName ? ` for ${vessel.clientName}` : ""}.
          This link is private — please do not share it further.
        </p>
      </main>
    </div>
  );
}
