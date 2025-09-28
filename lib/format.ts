/**
 * Shared formatting utilities
 */
export function formatCurrencyNGN(value: number | bigint): string {
  const num = Number(value)
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  let formatted = formatter.format(num)
  // Some runtimes may return the currency code (NGN) instead of the symbol. Normalize to ₦.
  if (!formatted.includes("₦") && formatted.includes("NGN")) {
    formatted = formatted.replace(/NGN\s?/, "₦")
  }
  return formatted
}

export function formatNumber(n: number): string {
  return n.toLocaleString()
}
