import { ApiError } from "@/lib/api";
import { Card } from "./ui";

/**
 * What a page shows when the API cannot be reached.
 *
 * Worth its own component because the failure is common and specific: a Render
 * service on the free tier sleeps, and the first request after an idle spell
 * takes ~30 seconds to wake it. Rendering a blank 500 for that teaches people
 * the system is broken when it is merely cold.
 */
export function ApiUnavailable({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError
      ? error.message
      : "The CleanTrack service did not respond.";
  const cold = error instanceof ApiError && error.code === "unreachable";

  return (
    <Card className="mt-6 p-8 text-center">
      <h2 className="text-base font-semibold text-slate-900">
        CleanTrack is not responding
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{message}</p>
      {cold && (
        <p className="mx-auto mt-2 max-w-lg text-[13px] text-slate-500">
          If the API has been idle it can take up to half a minute to start.
          Reload the page.
        </p>
      )}
    </Card>
  );
}
