export type SpeechLogResult = 'spoken' | 'noCandidate' | 'fallback' | 'skipped'

export interface SpeechLogEntry {
  id: string
  spokenAt: string
  trigger: string
  source?: string
  result: SpeechLogResult
  categoryId?: string
  entryId?: string
  text?: string
  candidateCount: number
  totalWeight?: number
  selectedWeight?: number
  lifestyleProfile?: string
  mascotType?: string
  timePeriod?: string
  reason?: string
  repeatSuppressed?: boolean
  avoidedRepeatEntryId?: string
}

export type AppendSpeechLogEntry = Omit<SpeechLogEntry, 'id' | 'spokenAt'> & {
  id?: string
  spokenAt?: string
}