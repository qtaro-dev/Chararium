import { useState } from 'react'
import type {
  ResponseCharacterVoiceProfile,
  ResponseCategory,
  ResponseLifestyleProfile,
  ResponseMascotType,
  ResponseTrigger
} from '@shared/index'
import { isValidTimeInput, normalizeTimeInput } from './responseTimeUtils'

type FilterTrigger = ResponseTrigger | 'all'

interface ResponseEntryEditorProps {
  title: string
  addLabel: string
  textLabel: string
  categoryLabel: string
  triggerLabel: string
  weightLabel: string
  weightDescriptionLabel: string
  enabledLabel: string
  startHourLabel: string
  endHourLabel: string
  minuteLabel: string
  unsetLabel: string
  timeRangeLabel: string
  timeInputHintLabel: string
  timeFullDayHintLabel: string
  timeStrictFormatHintLabel: string
  timeSecondsRangeHintLabel: string
  invalidTimeFormatLabel: string
  minuteHintLabel: string
  allTriggersLabel: string
  triggerLabels: Record<ResponseTrigger, string>
  lifestyleProfileLabel: string
  mascotTypeLabel: string
  characterVoiceProfileLabel: string
  lifestyleProfileOptions: readonly { value: ResponseLifestyleProfile; label: string }[]
  mascotTypeOptions: readonly { value: ResponseMascotType; label: string }[]
  characterVoiceProfileOptions: readonly { value: ResponseCharacterVoiceProfile; label: string }[]
  missingFieldLabel: string
  invalidWeightLabel: string
  addedLabel: string
  categories: readonly ResponseCategory[]
  onAddEntry: (entry: {
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
  }) => void
}

const triggerOptions: ReadonlyArray<FilterTrigger> = ['all', 'click', 'idle', 'hourly', 'startup', 'manual']

function parseMinute(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 59) return undefined
  return parsed
}

export function ResponseEntryEditor({
  title,
  addLabel,
  textLabel,
  categoryLabel,
  triggerLabel,
  weightLabel,
  weightDescriptionLabel,
  enabledLabel,
  startHourLabel,
  endHourLabel,
  minuteLabel,
  unsetLabel,
  timeRangeLabel,
  timeInputHintLabel,
  timeFullDayHintLabel,
  timeStrictFormatHintLabel,
  timeSecondsRangeHintLabel,
  invalidTimeFormatLabel,
  minuteHintLabel,
  allTriggersLabel,
  triggerLabels,
  lifestyleProfileLabel,
  mascotTypeLabel,
  characterVoiceProfileLabel,
  lifestyleProfileOptions,
  mascotTypeOptions,
  characterVoiceProfileOptions,
  missingFieldLabel,
  invalidWeightLabel,
  addedLabel,
  categories,
  onAddEntry
}: ResponseEntryEditorProps): React.JSX.Element {
  const [newText, setNewText] = useState<string>('')
  const [newCategoryId, setNewCategoryId] = useState<string>(categories[0]?.id ?? 'click')
  const [newTrigger, setNewTrigger] = useState<FilterTrigger>('click')
  const [newWeight, setNewWeight] = useState<string>('1')
  const [newEnabled, setNewEnabled] = useState<boolean>(true)
  const [newStartTime, setNewStartTime] = useState<string>('')
  const [newEndTime, setNewEndTime] = useState<string>('')
  const [newMinute, setNewMinute] = useState<string>('')
  const [newLifestyleProfile, setNewLifestyleProfile] = useState<ResponseLifestyleProfile>('any')
  const [newMascotType, setNewMascotType] = useState<ResponseMascotType>('any')
  const [newCharacterVoiceProfile, setNewCharacterVoiceProfile] = useState<ResponseCharacterVoiceProfile>('standard')
  const [statusMessage, setStatusMessage] = useState<string>('')

  function submitAddEntry(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!newText.trim()) {
      setStatusMessage(missingFieldLabel)
      return
    }
    if (newStartTime.trim() && !isValidTimeInput(newStartTime)) {
      setStatusMessage(invalidTimeFormatLabel)
      return
    }
    if (newEndTime.trim() && !isValidTimeInput(newEndTime)) {
      setStatusMessage(invalidTimeFormatLabel)
      return
    }
    const parsedWeight = Number(newWeight)
    if (!Number.isInteger(parsedWeight) || parsedWeight < 1 || parsedWeight > 100) {
      setStatusMessage(invalidWeightLabel)
      return
    }

    onAddEntry({
      categoryId: newCategoryId,
      text: newText.trim(),
      enabled: newEnabled,
      weight: parsedWeight,
      trigger: newTrigger === 'all' ? undefined : newTrigger,
      startTime: normalizeTimeInput(newStartTime),
      endTime: normalizeTimeInput(newEndTime),
      minute: parseMinute(newMinute),
      lifestyleProfile: newLifestyleProfile,
      mascotType: newMascotType,
      character: newCharacterVoiceProfile
    })
    setNewText('')
    setNewWeight('1')
    setNewEnabled(true)
    setNewStartTime('')
    setNewEndTime('')
    setNewMinute('')
    setNewLifestyleProfile('any')
    setNewMascotType('any')
    setNewCharacterVoiceProfile('standard')
    setStatusMessage(addedLabel)
  }

  return (
    <section className="response-tab-panel">
      <h3>{title}</h3>
      <form className="response-entry-form" onSubmit={submitAddEntry}>
        <label className="settings-select-label">
          <span>{textLabel}</span>
          <input className="settings-input" value={newText} onChange={(e) => setNewText(e.currentTarget.value)} />
        </label>
        <label className="settings-select-label">
          <span>{categoryLabel}</span>
          <select className="settings-select" value={newCategoryId} onChange={(e) => setNewCategoryId(e.currentTarget.value)}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{triggerLabel}</span>
          <select className="settings-select" value={newTrigger} onChange={(e) => setNewTrigger(e.currentTarget.value as FilterTrigger)}>
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
            value={newLifestyleProfile}
            onChange={(e) => setNewLifestyleProfile(e.currentTarget.value as ResponseLifestyleProfile)}
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
            value={newMascotType}
            onChange={(e) => setNewMascotType(e.currentTarget.value as ResponseMascotType)}
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
            value={newCharacterVoiceProfile}
            onChange={(e) => setNewCharacterVoiceProfile(e.currentTarget.value as ResponseCharacterVoiceProfile)}
          >
            {characterVoiceProfileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{weightLabel}</span>
          <input className="settings-input" type="number" min={1} max={100} value={newWeight} onChange={(e) => setNewWeight(e.currentTarget.value)} />
        </label>
        <p className="muted">{weightDescriptionLabel}</p>
        <label className="settings-toggle">
          <input type="checkbox" checked={newEnabled} onChange={(e) => setNewEnabled(e.currentTarget.checked)} />
          <span>{enabledLabel}</span>
        </label>
        <div className="response-time-range">
          <span>{timeRangeLabel}</span>
          <p className="muted">{timeFullDayHintLabel}</p>
          <p className="muted">{timeStrictFormatHintLabel}</p>
          <p className="muted">{timeSecondsRangeHintLabel}</p>
          <p className="muted">{timeInputHintLabel}</p>
          <label className="settings-select-label">
            <span>{startHourLabel}</span>
            <input className="settings-input" placeholder="HH:mm:ss" value={newStartTime} onChange={(e) => setNewStartTime(e.currentTarget.value)} />
          </label>
          <label className="settings-select-label">
            <span>{endHourLabel}</span>
            <input className="settings-input" placeholder="HH:mm:ss" value={newEndTime} onChange={(e) => setNewEndTime(e.currentTarget.value)} />
          </label>
          {newTrigger === 'hourly' ? (
            <label className="settings-select-label">
              <span>{minuteLabel}</span>
              <input className="settings-input" placeholder={unsetLabel} type="number" min={0} max={59} value={newMinute} onChange={(e) => setNewMinute(e.currentTarget.value)} />
              <p className="muted">{minuteHintLabel}</p>
            </label>
          ) : null}
        </div>
        <button type="submit" className="primary-button">
          {addLabel}
        </button>
        {statusMessage ? <p className="muted">{statusMessage}</p> : null}
      </form>
    </section>
  )
}
