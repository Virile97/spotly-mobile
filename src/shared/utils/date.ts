export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatLongDate(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function toISODateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const RELATIVE_UNITS = [
  { limit: 60, suffix: "m" },
  { limit: 24, suffix: "h" },
  { limit: 7, suffix: "d" }
] as const

export function formatRelativeTime(date: string | Date): string {
  const target = new Date(date)
  const diff = Math.floor((Date.now() - target.getTime()) / 1000)

  if (diff < 60) return "just now"

  let value = diff / 60

  for (const { limit, suffix } of RELATIVE_UNITS) {
    if (value < limit) return `${Math.floor(value)}${suffix} ago`
    value /= limit
  }

  return target.toLocaleDateString()
}

/** Compact variant for dense metadata rows, e.g. "40m" instead of "40m ago". */
export function formatShortRelativeTime(date: string | Date): string {
  const target = new Date(date)
  const diff = Math.floor((Date.now() - target.getTime()) / 1000)

  if (diff < 60) return "now"

  let value = diff / 60

  for (const { limit, suffix } of RELATIVE_UNITS) {
    if (value < limit) return `${Math.floor(value)}${suffix}`
    value /= limit
  }

  return target.toLocaleDateString()
}
