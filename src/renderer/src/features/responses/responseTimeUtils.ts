export function normalizeTimeInput(input: string): string | undefined {
  const trimmed = input.trim()
  if (!trimmed) return undefined
  const match = trimmed.match(/^(\d{2}):(\d{2}):(\d{2})$/)
  if (!match) return undefined
  const hour = Number(match[1])
  const minute = Number(match[2])
  const second = Number(match[3])
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    !Number.isInteger(second) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return undefined
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

export function isValidTimeInput(input: string): boolean {
  return normalizeTimeInput(input) !== undefined
}

export function formatLegacyHourToTime(hour?: number): string {
  if (typeof hour !== 'number' || !Number.isInteger(hour) || hour < 0 || hour > 23) {
    return ''
  }
  return `${String(hour).padStart(2, '0')}:00:00`
}
