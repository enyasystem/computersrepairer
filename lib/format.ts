/**
 * Shared formatting utilities
 */
export function formatCurrencyNGN(value: number | bigint): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(value))
}

export function formatNumber(n: number): string {
  return n.toLocaleString()
}
