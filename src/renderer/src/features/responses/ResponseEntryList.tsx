import { useMemo, useState } from 'react'
import type {
  ResponseCharacterVoiceProfile,
  ResponseCategory,
  ResponseEntry,
  ResponseLifestyleProfile,
  ResponseMascotType,
  ResponseTrigger
} from '@shared/index'
import { formatLegacyHourToTime, isValidTimeInput, normalizeTimeInput } from './responseTimeUtils'

type FilterTrigger = ResponseTrigger | 'all'

interface ResponseEntryListProps {
  title: string
  categoryLabel: string
  triggerLabel: string
  weightLabel: string
  weightDescriptionLabel: string
  weightInlineHintLabel: string
  timeRangeLabel: string
  startHourLabel: string
  endHourLabel: string
  minuteLabel: string
  unsetLabel: string
  timeInputHintLabel: string
  timeFullDayHintLabel: string
  timeStrictFormatHintLabel: string
  timeSecondsRangeHintLabel: string
  invalidTimeFormatLabel: string
  invalidWeightLabel: string
  minuteHintLabel: string
  hourlyEveryTopLabel: string
  enabledLabel: string
  disabledLabel: string
  editLabel: string
  deleteLabel: string
  saveLabel: string
  cancelLabel: string
  allCategoriesLabel: string
  allTriggersLabel: string
  triggerLabels: Record<ResponseTrigger, string>
  tryConditionLabel: string
  updatedLabel: string
  deletedLabel: string
  confirmDeleteMessage: string
  lifestyleProfileLabel: string
  mascotTypeLabel: string
  characterVoiceProfileLabel: string
  allProfilesLabel: string
  allMascotTypesLabel: string
  allCharacterVoiceProfilesLabel: string
  searchKeywordLabel: string
  searchKeywordPlaceholder: string
  searchClearLabel: string
  matchedCountLabel: string
  totalCountLabel: string
  lifestyleProfileOptions: readonly { value: ResponseLifestyleProfile; label: string }[]
  mascotTypeOptions: readonly { value: ResponseMascotType; label: string }[]
  characterVoiceProfileOptions: readonly { value: ResponseCharacterVoiceProfile; label: string }[]
  categories: readonly ResponseCategory[]
  entries: readonly ResponseEntry[]
  onTryRandom: (trigger: ResponseTrigger) => void
  onUpdateEntry: (
    entryId: string,
    patch: Partial<{
      categoryId: string
      text: string
      enabled: boolean
      weight: number
      trigger?: ResponseTrigger
      startHour?: number
      endHour?: number
      startTime?: string
      endTime?: string
      minute?: number
      lifestyleProfile?: ResponseLifestyleProfile
      mascotType?: ResponseMascotType
      character?: ResponseCharacterVoiceProfile
    }>
  ) => void
  onDeleteEntry: (entryId: string) => void
}

const triggerOptions: ReadonlyArray<FilterTrigger> = ['all', 'click', 'idle', 'hourly', 'startup', 'manual']

function parseMinute(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 59) return undefined
  return parsed
}

function getDisplayTime(value?: string, legacyHour?: number): string {
  if (value) return value
  const legacy = formatLegacyHourToTime(legacyHour)
  return legacy || ''
}

export function ResponseEntryList({
  title,
  categoryLabel,
  triggerLabel,
  weightLabel,
  weightDescriptionLabel,
  weightInlineHintLabel,
  timeRangeLabel,
  startHourLabel,
  endHourLabel,
  minuteLabel,
  unsetLabel,
  timeInputHintLabel,
  timeFullDayHintLabel,
  timeStrictFormatHintLabel,
  timeSecondsRangeHintLabel,
  invalidTimeFormatLabel,
  invalidWeightLabel,
  minuteHintLabel,
  hourlyEveryTopLabel,
  enabledLabel,
  disabledLabel,
  editLabel,
  deleteLabel,
  saveLabel,
  cancelLabel,
  allCategoriesLabel,
  allTriggersLabel,
  triggerLabels,
  tryConditionLabel,
  updatedLabel,
  deletedLabel,
  confirmDeleteMessage,
  lifestyleProfileLabel,
  mascotTypeLabel,
  characterVoiceProfileLabel,
  allProfilesLabel,
  allMascotTypesLabel,
  allCharacterVoiceProfilesLabel,
  searchKeywordLabel,
  searchKeywordPlaceholder,
  searchClearLabel,
  matchedCountLabel,
  totalCountLabel,
  lifestyleProfileOptions,
  mascotTypeOptions,
  characterVoiceProfileOptions,
  categories,
  entries,
  onTryRandom,
  onUpdateEntry,
  onDeleteEntry
}: ResponseEntryListProps): React.JSX.Element {
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all')
  const [filterTrigger, setFilterTrigger] = useState<FilterTrigger>('all')
  const [filterLifestyleProfile, setFilterLifestyleProfile] = useState<ResponseLifestyleProfile | 'all'>('all')
  const [filterMascotType, setFilterMascotType] = useState<ResponseMascotType | 'all'>('all')
  const [filterCharacterVoiceProfile, setFilterCharacterVoiceProfile] = useState<ResponseCharacterVoiceProfile | 'all'>('all')
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [editingText, setEditingText] = useState<string>('')
  const [editingStartTime, setEditingStartTime] = useState<string>('')
  const [editingEndTime, setEditingEndTime] = useState<string>('')
  const [editingMinute, setEditingMinute] = useState<string>('')
  const [editingWeight, setEditingWeight] = useState<string>('1')
  const [editingLifestyleProfile, setEditingLifestyleProfile] = useState<ResponseLifestyleProfile>('any')
  const [editingMascotType, setEditingMascotType] = useState<ResponseMascotType>('any')
  const [editingCharacterVoiceProfile, setEditingCharacterVoiceProfile] = useState<ResponseCharacterVoiceProfile>('standard')
  const [statusMessage, setStatusMessage] = useState<string>('')

  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase()
  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        if (filterCategoryId !== 'all' && entry.categoryId !== filterCategoryId) return false
        if (filterTrigger !== 'all' && entry.trigger !== filterTrigger) return false
        const lifestyle = entry.lifestyleProfile ?? 'any'
        const mascotType = entry.mascotType ?? 'any'
        const character = entry.character ?? 'standard'
        if (filterLifestyleProfile !== 'all' && lifestyle !== filterLifestyleProfile) return false
        if (filterMascotType !== 'all' && mascotType !== filterMascotType) return false
        if (filterCharacterVoiceProfile !== 'all' && character !== filterCharacterVoiceProfile) return false
        if (!normalizedSearchKeyword) return true
        const searchTargets = [
          entry.text,
          entry.id,
          entry.categoryId,
          entry.trigger ?? '',
          lifestyle,
          mascotType,
          character
        ]
          .join('\n')
          .toLowerCase()
        return searchTargets.includes(normalizedSearchKeyword)
      }),
    [entries, filterCategoryId, filterTrigger, filterLifestyleProfile, filterMascotType, filterCharacterVoiceProfile, normalizedSearchKeyword]
  )

  function beginEdit(entry: ResponseEntry): void {
    setEditingEntryId(entry.id)
    setEditingText(entry.text)
    setEditingStartTime(getDisplayTime(entry.startTime, entry.startHour))
    setEditingEndTime(getDisplayTime(entry.endTime, entry.endHour))
    setEditingMinute(typeof entry.minute === 'number' ? String(entry.minute) : '')
    setEditingWeight(String(entry.weight))
    setEditingLifestyleProfile(entry.lifestyleProfile ?? 'any')
    setEditingMascotType(entry.mascotType ?? 'any')
    setEditingCharacterVoiceProfile(entry.character ?? 'standard')
  }

  function cancelEdit(): void {
    setEditingEntryId(null)
    setEditingText('')
    setEditingStartTime('')
    setEditingEndTime('')
    setEditingMinute('')
    setEditingWeight('1')
    setEditingLifestyleProfile('any')
    setEditingMascotType('any')
    setEditingCharacterVoiceProfile('standard')
  }

  function submitEdit(entry: ResponseEntry): void {
    const nextText = editingText.trim()
    if (!nextText) return
    if (editingStartTime.trim() && !isValidTimeInput(editingStartTime)) {
      setStatusMessage(invalidTimeFormatLabel)
      return
    }
    if (editingEndTime.trim() && !isValidTimeInput(editingEndTime)) {
      setStatusMessage(invalidTimeFormatLabel)
      return
    }
    const parsedWeight = Number(editingWeight)
    if (!Number.isInteger(parsedWeight) || parsedWeight < 1 || parsedWeight > 100) {
      setStatusMessage(invalidWeightLabel)
      return
    }

    onUpdateEntry(entry.id, {
      text: nextText,
      weight: parsedWeight,
      startTime: normalizeTimeInput(editingStartTime),
      endTime: normalizeTimeInput(editingEndTime),
      startHour: undefined,
      endHour: undefined,
      minute: parseMinute(editingMinute),
      lifestyleProfile: editingLifestyleProfile,
      mascotType: editingMascotType,
      character: editingCharacterVoiceProfile
    })
    setStatusMessage(updatedLabel)
    cancelEdit()
  }

  function tryDelete(entryId: string): void {
    if (!window.confirm(confirmDeleteMessage)) return
    onDeleteEntry(entryId)
    setStatusMessage(deletedLabel)
  }

  return (
    <section className="response-tab-panel">
      <h3>{title}</h3>
      <div className="response-filters">
        <label className="settings-select-label">
          <span>{categoryLabel}</span>
          <select className="settings-select" value={filterCategoryId} onChange={(e) => setFilterCategoryId(e.currentTarget.value)}>
            <option value="all">{allCategoriesLabel}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{triggerLabel}</span>
          <select className="settings-select" value={filterTrigger} onChange={(e) => setFilterTrigger(e.currentTarget.value as FilterTrigger)}>
            {triggerOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? allTriggersLabel : triggerLabels[option]}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{lifestyleProfileLabel}</span>
          <select
            className="settings-select"
            value={filterLifestyleProfile}
            onChange={(e) => setFilterLifestyleProfile(e.currentTarget.value as ResponseLifestyleProfile | 'all')}
          >
            <option value="all">{allProfilesLabel}</option>
            {lifestyleProfileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{mascotTypeLabel}</span>
          <select
            className="settings-select"
            value={filterMascotType}
            onChange={(e) => setFilterMascotType(e.currentTarget.value as ResponseMascotType | 'all')}
          >
            <option value="all">{allMascotTypesLabel}</option>
            {mascotTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{characterVoiceProfileLabel}</span>
          <select
            className="settings-select"
            value={filterCharacterVoiceProfile}
            onChange={(e) => setFilterCharacterVoiceProfile(e.currentTarget.value as ResponseCharacterVoiceProfile | 'all')}
          >
            <option value="all">{allCharacterVoiceProfilesLabel}</option>
            {characterVoiceProfileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label response-search-field">
          <span>{searchKeywordLabel}</span>
          <input
            className="settings-input"
            placeholder={searchKeywordPlaceholder}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.currentTarget.value)}
          />
        </label>
        <button type="button" className="secondary-button" onClick={() => setSearchKeyword('')}>
          {searchClearLabel}
        </button>
        <button type="button" className="secondary-button" onClick={() => onTryRandom(filterTrigger === 'all' ? 'click' : filterTrigger)}>
          {tryConditionLabel}
        </button>
      </div>
      <p className="muted">
        {matchedCountLabel}: {filteredEntries.length}{totalCountLabel ? ` / ${totalCountLabel}: ${entries.length}` : ` / ${entries.length}`}
      </p>
      <p className="muted">{weightDescriptionLabel}</p>

      <div className="response-entries-grid response-entries-scroll">
        {filteredEntries.map((entry) => {
          const category = categories.find((item) => item.id === entry.categoryId)
          const isEditing = editingEntryId === entry.id
          const startDisplay = getDisplayTime(entry.startTime, entry.startHour)
          const endDisplay = getDisplayTime(entry.endTime, entry.endHour)
          return (
            <article key={entry.id} className="response-entry-card">
              <p className="muted">
                {categoryLabel}: {category?.label ?? entry.categoryId}
              </p>
              <p className="muted">
                {triggerLabel}: {entry.trigger ? triggerLabels[entry.trigger] : '-'}
              </p>
              <p className="muted">
                {lifestyleProfileLabel}: {lifestyleProfileOptions.find((o) => o.value === (entry.lifestyleProfile ?? 'any'))?.label ?? (entry.lifestyleProfile ?? 'any')}
              </p>
              <p className="muted">
                {mascotTypeLabel}: {mascotTypeOptions.find((o) => o.value === (entry.mascotType ?? 'any'))?.label ?? (entry.mascotType ?? 'any')}
              </p>
              <p className="muted">
                {characterVoiceProfileLabel}: {characterVoiceProfileOptions.find((o) => o.value === (entry.character ?? 'standard'))?.label ?? (entry.character ?? 'standard')}
              </p>
              <p className="muted">
                {weightLabel}: {entry.weight}（{weightInlineHintLabel}）
              </p>
              <p className="muted">
                {timeRangeLabel}: {startDisplay || unsetLabel} - {endDisplay || unsetLabel}
              </p>
              {entry.trigger === 'hourly' ? (
                <p className="muted">
                  {minuteLabel}:{' '}
                  {typeof entry.minute === 'number'
                    ? entry.minute === 0
                      ? hourlyEveryTopLabel
                      : entry.minute
                    : unsetLabel}
                </p>
              ) : null}
              <p className="muted">{entry.enabled ? enabledLabel : disabledLabel}</p>
              {isEditing ? (
                <label className="settings-select-label">
                  <span>{editLabel}</span>
                  <input className="settings-input" value={editingText} onChange={(e) => setEditingText(e.currentTarget.value)} />
                  <div className="response-edit-grid">
                    <label className="settings-select-label">
                      <span>{weightLabel}</span>
                      <input
                        className="settings-input"
                        type="number"
                        min={1}
                        max={100}
                        value={editingWeight}
                        onChange={(e) => setEditingWeight(e.currentTarget.value)}
                      />
                    </label>
                    <label className="settings-select-label">
                      <span>{startHourLabel}</span>
                      <input className="settings-input" placeholder="HH:mm:ss" value={editingStartTime} onChange={(e) => setEditingStartTime(e.currentTarget.value)} />
                    </label>
                    <label className="settings-select-label">
                      <span>{endHourLabel}</span>
                      <input className="settings-input" placeholder="HH:mm:ss" value={editingEndTime} onChange={(e) => setEditingEndTime(e.currentTarget.value)} />
                    </label>
                    {entry.trigger === 'hourly' ? (
                      <label className="settings-select-label">
                        <span>{minuteLabel}</span>
                        <input className="settings-input" placeholder={unsetLabel} type="number" min={0} max={59} value={editingMinute} onChange={(e) => setEditingMinute(e.currentTarget.value)} />
                      </label>
                    ) : null}
                    <label className="settings-select-label">
                      <span>{lifestyleProfileLabel}</span>
                      <select
                        className="settings-select"
                        value={editingLifestyleProfile}
                        onChange={(e) => setEditingLifestyleProfile(e.currentTarget.value as ResponseLifestyleProfile)}
                      >
                        {lifestyleProfileOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="settings-select-label">
                      <span>{mascotTypeLabel}</span>
                      <select
                        className="settings-select"
                        value={editingMascotType}
                        onChange={(e) => setEditingMascotType(e.currentTarget.value as ResponseMascotType)}
                      >
                        {mascotTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="settings-select-label">
                      <span>{characterVoiceProfileLabel}</span>
                      <select
                        className="settings-select"
                        value={editingCharacterVoiceProfile}
                        onChange={(e) => setEditingCharacterVoiceProfile(e.currentTarget.value as ResponseCharacterVoiceProfile)}
                      >
                        {characterVoiceProfileOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="muted">{timeFullDayHintLabel}</p>
                  <p className="muted">{timeStrictFormatHintLabel}</p>
                  <p className="muted">{timeSecondsRangeHintLabel}</p>
                  <p className="muted">{timeInputHintLabel}</p>
                  {entry.trigger === 'hourly' ? <p className="muted">{minuteHintLabel}</p> : null}
                </label>
              ) : (
                <p>{entry.text}</p>
              )}
              <div className="settings-actions">
                {isEditing ? (
                  <>
                    <button type="button" className="secondary-button" onClick={() => submitEdit(entry)}>
                      {saveLabel}
                    </button>
                    <button type="button" className="secondary-button" onClick={cancelEdit}>
                      {cancelLabel}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="secondary-button" onClick={() => beginEdit(entry)}>
                      {editLabel}
                    </button>
                    <button type="button" className="secondary-button" onClick={() => onUpdateEntry(entry.id, { enabled: !entry.enabled })}>
                      {entry.enabled ? disabledLabel : enabledLabel}
                    </button>
                    <button type="button" className="secondary-button" onClick={() => tryDelete(entry.id)}>
                      {deleteLabel}
                    </button>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </div>
      {statusMessage ? <p className="muted">{statusMessage}</p> : null}
    </section>
  )
}
