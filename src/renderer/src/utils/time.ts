export type TimeBandId = 'morning' | 'afternoon' | 'evening' | 'night' | 'lateNight'

export function getTimeBandByHour(hour: number): TimeBandId {
  if (hour >= 5 && hour <= 10) return 'morning'
  if (hour >= 11 && hour <= 16) return 'afternoon'
  if (hour >= 17 && hour <= 20) return 'evening'
  if (hour >= 21 && hour <= 23) return 'night'
  return 'lateNight'
}

export function getTimeBandByDate(date: Date): TimeBandId {
  return getTimeBandByHour(date.getHours())
}

export function formatLocalClock(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

export function getLocalTimeZone(): string | undefined {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return timeZone && timeZone.trim().length > 0 ? timeZone : undefined
}
