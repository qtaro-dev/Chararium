import type { SpeechLogEntry } from '@shared/index'

interface ResponseSpeechLogPanelProps {
  title: string
  reloadLabel: string
  clearLabel: string
  spokenAtLabel: string
  triggerLabel: string
  resultLabel: string
  categoryLabel: string
  entryIdLabel: string
  textLabel: string
  candidateCountLabel: string
  totalWeightLabel: string
  selectedWeightLabel: string
  lifestyleProfileLabel: string
  mascotTypeLabel: string
  timePeriodLabel: string
  reasonLabel: string
  latestOnlyLabel: string
  showingCountLabel: string
  repeatSuppressedLabel: string
  yesLabel: string
  noLabel: string
  resultLabels: Record<'spoken' | 'noCandidate' | 'fallback' | 'skipped', string>
  entries: readonly SpeechLogEntry[]
  onReload: () => void
  onClear: () => void
}

export function ResponseSpeechLogPanel({
  title,
  reloadLabel,
  clearLabel,
  spokenAtLabel,
  triggerLabel,
  resultLabel,
  categoryLabel,
  entryIdLabel,
  textLabel,
  candidateCountLabel,
  totalWeightLabel,
  selectedWeightLabel,
  lifestyleProfileLabel,
  mascotTypeLabel,
  timePeriodLabel,
  reasonLabel,
  latestOnlyLabel,
  showingCountLabel,
  repeatSuppressedLabel,
  yesLabel,
  noLabel,
  resultLabels,
  entries,
  onReload,
  onClear
}: ResponseSpeechLogPanelProps): React.JSX.Element {
  return (
    <section className="response-tab-panel">
      <h3>{title}</h3>
      <div className="settings-actions">
        <button type="button" className="secondary-button" onClick={onReload}>
          {reloadLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onClear}>
          {clearLabel}
        </button>
      </div>
      <p className="muted">{latestOnlyLabel}</p>
      <p className="muted">{showingCountLabel}: {entries.length}</p>
      <div className="response-entries-grid response-entries-scroll">
        {entries.map((entry) => (
          <article key={entry.id} className="response-entry-card">
            <p className="muted">{spokenAtLabel}: {new Date(entry.spokenAt).toLocaleString()}</p>
            <p className="muted">{triggerLabel}: {entry.trigger}</p>
            <p className="muted">{resultLabel}: {resultLabels[entry.result]}</p>
            <p className="muted">{categoryLabel}: {entry.categoryId ?? '-'}</p>
            <p className="muted">{entryIdLabel}: {entry.entryId ?? '-'}</p>
            <p>{textLabel}: {entry.text ?? '-'}</p>
            <p className="muted">{candidateCountLabel}: {entry.candidateCount}</p>
            <p className="muted">{selectedWeightLabel}: {entry.selectedWeight ?? '-'}</p>
            <p className="muted">{totalWeightLabel}: {entry.totalWeight ?? '-'}</p>
            <p className="muted">{lifestyleProfileLabel}: {entry.lifestyleProfile ?? 'any'}</p>
            <p className="muted">{mascotTypeLabel}: {entry.mascotType ?? 'any'}</p>
            <p className="muted">{timePeriodLabel}: {entry.timePeriod ?? '-'}</p>
            <p className="muted">{reasonLabel}: {entry.reason ?? '-'}</p>
            <p className="muted">
              {repeatSuppressedLabel}: {entry.repeatSuppressed ? `${yesLabel} (${entry.avoidedRepeatEntryId ?? '-'})` : noLabel}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
