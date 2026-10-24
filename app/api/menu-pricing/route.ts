import { areUpdatedMenuPricesActive, MENU_PRICE_CHANGE_AT_MS } from "@/lib/menu-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Server clock: the switch must not depend on a visitor's device date/time. */
export function GET() {
  const serverNowMs = Date.now();
  return Response.json(
    {
      serverNowMs,
      effectiveAtMs: MENU_PRICE_CHANGE_AT_MS,
      active: areUpdatedMenuPricesActive(serverNowMs),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
