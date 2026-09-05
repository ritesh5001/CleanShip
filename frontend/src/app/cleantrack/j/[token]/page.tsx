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
    <div className="min-h-dvh bg-[#060b14] text-slate-200">
      {/* One faint pool of light behind everything, fixed so it does not
          travel with the scroll. It is what keeps a dark page from reading
          as an unstyled black background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(56,189,248,0.10), transparent 65%)",
        }}
      />

      <header className="relative border-b border-white/[0.07]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <span className="font-[family-name:var(--font-display)] text-[17px] font-bold tracking-tight text-white">
            CleanTrack
          </span>
          <span className="text-[12px] uppercase tracking-[0.14em] text-slate-500">
            Cleanship Marine Services
          </span>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-8 sm:py-10">
        <ClientVesselView vessel={vessel} />

        <footer className="mt-14 border-t border-white/[0.07] pt-6 text-center">
          <p className="text-[12px] text-slate-500">
            Live progress{vessel.clientName ? ` for ${vessel.clientName}` : ""}.
            This link is private — please do not share it further.
          </p>
        </footer>
      </main>
    </div>
  );
}
