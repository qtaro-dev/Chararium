import { useMemo, useState, useEffect } from 'react'
import type {
  ResponseCharacterVoiceProfile,
  ResponseLibrary,
  ResponseLifestyleProfile,
  ResponseMascotType,
  ResponseTrigger,
  SpeechLogEntry
} from '@shared/index'
import { ResponseCategoryEditor } from './ResponseCategoryEditor'
import { ResponseEntryEditor } from './ResponseEntryEditor'
import { ResponseEntryList } from './ResponseEntryList'
import { ResponseLibraryTabs, type ResponseLibraryTab } from './ResponseLibraryTabs'
import { ResponseSpeechLogPanel } from './ResponseSpeechLogPanel'
import { getTimeBandByDate } from '../../utils/time'

interface ResponseLibraryPanelProps {
  title: string
  tabLabels: Record<ResponseLibraryTab, string>
  categoryLabel: string
  categoryListLabel: string
  responsesListLabel: string
  addResponseLabel: string
  editResponseLabel: string
  deleteResponseLabel: string
  enabledLabel: string
  disabledLabel: string
  weightLabel: string
  weightDescriptionLabel: string
  weightInlineHintLabel: string
  triggerLabel: string
  timeRangeLabel: string
  resetToDefaultLabel: string
  tryConditionLabel: string
  saveLabel: string
  reloadLabel: string
  cancelLabel: string
  textLabel: string
  startHourLabel: string
  endHourLabel: string
  minuteLabel: string
  timeInputHintLabel: string
  timeFullDayHintLabel: string
  timeStrictFormatHintLabel: string
  timeSecondsRangeHintLabel: string
  invalidTimeFormatLabel: string
  invalidWeightLabel: string
  minuteHintLabel: string
  hourlyEveryTopLabel: string
  unsetLabel: string
  allCategoriesLabel: string
  allTriggersLabel: string
  confirmResetMessage: string
  confirmDeleteMessage: string
  currentTimeLabel: string
  currentTimeBandLabel: string
  timeBandRulesLabel: string
  hourlyTestLabel: string
  hourlyChimeEnabledLabel: string
  hourlyChimeQuietHoursLabel: string
  responseLibraryPathLabel: string
  managementNoticeLabel: string
  exportResponsesLabel: string
  importResponsesMergeLabel: string
  importResponsesReplaceLabel: string
  importResultMessage: string
  confirmImportReplaceMessage: string
  speechLogTabLabel: string
  speechLogReloadLabel: string
  speechLogClearLabel: string
  speechLogSpokenAtLabel: string
  speechLogTriggerLabel: string
  speechLogResultLabel: string
  speechLogCategoryIdLabel: string
  speechLogEntryIdLabel: string
  speechLogTextLabel: string
  speechLogCandidateCountLabel: string
  speechLogTotalWeightLabel: string
  speechLogSelectedWeightLabel: string
  speechLogLifestyleProfileLabel: string
  speechLogMascotTypeLabel: string
  speechLogTimePeriodLabel: string
  speechLogReasonLabel: string
  speechLogLatestOnlyLabel: string
  speechLogShowingCountLabel: string
  speechLogRepeatSuppressedLabel: string
  yesLabel: string
  noLabel: string
  speechLogResultLabels: Record<'spoken' | 'noCandidate' | 'fallback' | 'skipped', string>
  entriesCountLabel: string
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
  triggerLabels: Record<ResponseTrigger, string>
  addedLabel: string
  updatedLabel: string
  deletedLabel: string
  missingFieldLabel: string
  library: ResponseLibrary | null
  speechLogs: readonly SpeechLogEntry[]
  isLoading: boolean
  hourlyChimeEnabled: boolean
  hourlyChimeQuietHoursEnabled: boolean
  hourlyChimeQuietStartHour: number
  hourlyChimeQuietEndHour: number
  onReload: () => void
  onReloadSpeechLogs: () => void
  onClearSpeechLogs: () => void
  onReset: () => void
  onExportLibrary: () => Promise<void>
  onImportLibraryMerge: () => Promise<void>
  onImportLibraryReplace: () => Promise<void>
  onToggleCategoryEnabled: (categoryId: string, enabled: boolean) => void
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
  onTryRandom: (trigger: ResponseTrigger) => void
  onToggleHourlyChimeEnabled: (nextValue: boolean) => void
  onToggleHourlyChimeQuietHoursEnabled: (nextValue: boolean) => void
  onChangeHourlyChimeQuietStartHour: (nextValue: number) => void
  onChangeHourlyChimeQuietEndHour: (nextValue: number) => void
}

export function ResponseLibraryPanel(props: ResponseLibraryPanelProps): React.JSX.Element {
  const {
    title,
    tabLabels,
    categoryLabel,
    categoryListLabel,
    responsesListLabel,
    addResponseLabel,
    editResponseLabel,
    deleteResponseLabel,
    enabledLabel,
    disabledLabel,
    weightLabel,
    weightDescriptionLabel,
    weightInlineHintLabel,
    triggerLabel,
    timeRangeLabel,
    resetToDefaultLabel,
    tryConditionLabel,
    saveLabel,
    reloadLabel,
    cancelLabel,
    textLabel,
    startHourLabel,
    endHourLabel,
    minuteLabel,
    timeInputHintLabel,
    timeFullDayHintLabel,
    timeStrictFormatHintLabel,
    timeSecondsRangeHintLabel,
    invalidTimeFormatLabel,
    invalidWeightLabel,
    minuteHintLabel,
    hourlyEveryTopLabel,
    unsetLabel,
    allCategoriesLabel,
    allTriggersLabel,
    confirmResetMessage,
    confirmDeleteMessage,
    currentTimeLabel,
    currentTimeBandLabel,
    timeBandRulesLabel,
    hourlyTestLabel,
    hourlyChimeEnabledLabel,
    hourlyChimeQuietHoursLabel,
    responseLibraryPathLabel,
    managementNoticeLabel,
    exportResponsesLabel,
    importResponsesMergeLabel,
    importResponsesReplaceLabel,
    importResultMessage,
    confirmImportReplaceMessage,
    speechLogTabLabel,
    speechLogReloadLabel,
    speechLogClearLabel,
    speechLogSpokenAtLabel,
    speechLogTriggerLabel,
    speechLogResultLabel,
    speechLogCategoryIdLabel,
    speechLogEntryIdLabel,
    speechLogTextLabel,
    speechLogCandidateCountLabel,
    speechLogTotalWeightLabel,
    speechLogSelectedWeightLabel,
    speechLogLifestyleProfileLabel,
    speechLogMascotTypeLabel,
    speechLogTimePeriodLabel,
    speechLogReasonLabel,
    speechLogLatestOnlyLabel,
    speechLogShowingCountLabel,
    speechLogRepeatSuppressedLabel,
    yesLabel,
    noLabel,
    speechLogResultLabels,
    entriesCountLabel,
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
    triggerLabels,
    addedLabel,
    updatedLabel,
    deletedLabel,
    missingFieldLabel,
    library,
    speechLogs,
    isLoading,
    hourlyChimeEnabled,
    hourlyChimeQuietHoursEnabled,
    hourlyChimeQuietStartHour,
    hourlyChimeQuietEndHour,
    onReload,
    onReloadSpeechLogs,
    onClearSpeechLogs,
    onReset,
    onExportLibrary,
    onImportLibraryMerge,
    onImportLibraryReplace,
    onToggleCategoryEnabled,
    onAddEntry,
    onUpdateEntry,
    onDeleteEntry,
    onTryRandom,
    onToggleHourlyChimeEnabled,
    onToggleHourlyChimeQuietHoursEnabled,
    onChangeHourlyChimeQuietStartHour,
    onChangeHourlyChimeQuietEndHour
  } = props

  const [activeTab, setActiveTab] = useState<ResponseLibraryTab>('list')
  const [manageStatus, setManageStatus] = useState<string>('')
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const currentTimeText = useMemo(() => now.toLocaleString(), [now])
  const timeBand = useMemo(() => getTimeBandByDate(now), [now])

  const categories = library?.categories ?? []
  const entries = library?.entries ?? []

  function tryReset(): void {
    if (!window.confirm(confirmResetMessage)) return
    onReset()
  }

  async function tryImportReplace(): Promise<void> {
    if (!window.confirm(confirmImportReplaceMessage)) return
    await onImportLibraryReplace()
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>

      <ResponseLibraryTabs activeTab={activeTab} onChangeTab={setActiveTab} labels={tabLabels} />

      {activeTab === 'list' ? (
        <ResponseEntryList
          title={responsesListLabel}
          categoryLabel={categoryLabel}
          triggerLabel={triggerLabel}
          weightLabel={weightLabel}
          weightDescriptionLabel={weightDescriptionLabel}
          weightInlineHintLabel={weightInlineHintLabel}
          timeRangeLabel={timeRangeLabel}
          startHourLabel={startHourLabel}
          endHourLabel={endHourLabel}
          minuteLabel={minuteLabel}
          timeInputHintLabel={timeInputHintLabel}
          timeFullDayHintLabel={timeFullDayHintLabel}
          timeStrictFormatHintLabel={timeStrictFormatHintLabel}
          timeSecondsRangeHintLabel={timeSecondsRangeHintLabel}
          invalidTimeFormatLabel={invalidTimeFormatLabel}
          invalidWeightLabel={invalidWeightLabel}
          minuteHintLabel={minuteHintLabel}
          hourlyEveryTopLabel={hourlyEveryTopLabel}
          unsetLabel={unsetLabel}
          enabledLabel={enabledLabel}
          disabledLabel={disabledLabel}
          editLabel={editResponseLabel}
          deleteLabel={deleteResponseLabel}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          allCategoriesLabel={allCategoriesLabel}
          allTriggersLabel={allTriggersLabel}
          triggerLabels={triggerLabels}
          tryConditionLabel={tryConditionLabel}
          updatedLabel={updatedLabel}
          deletedLabel={deletedLabel}
          confirmDeleteMessage={confirmDeleteMessage}
          lifestyleProfileLabel={lifestyleProfileLabel}
          mascotTypeLabel={mascotTypeLabel}
          characterVoiceProfileLabel={characterVoiceProfileLabel}
          allProfilesLabel={allProfilesLabel}
          allMascotTypesLabel={allMascotTypesLabel}
          allCharacterVoiceProfilesLabel={allCharacterVoiceProfilesLabel}
          searchKeywordLabel={searchKeywordLabel}
          searchKeywordPlaceholder={searchKeywordPlaceholder}
          searchClearLabel={searchClearLabel}
          matchedCountLabel={matchedCountLabel}
          totalCountLabel={totalCountLabel}
          lifestyleProfileOptions={lifestyleProfileOptions}
          mascotTypeOptions={mascotTypeOptions}
          characterVoiceProfileOptions={characterVoiceProfileOptions}
          categories={categories}
          entries={entries}
          onTryRandom={onTryRandom}
          onUpdateEntry={onUpdateEntry}
          onDeleteEntry={onDeleteEntry}
        />
      ) : null}

      {activeTab === 'add' ? (
        <ResponseEntryEditor
          title={addResponseLabel}
          addLabel={addResponseLabel}
          textLabel={textLabel}
          categoryLabel={categoryLabel}
          triggerLabel={triggerLabel}
          weightLabel={weightLabel}
          weightDescriptionLabel={weightDescriptionLabel}
          enabledLabel={enabledLabel}
          startHourLabel={startHourLabel}
          endHourLabel={endHourLabel}
          timeRangeLabel={timeRangeLabel}
          minuteLabel={minuteLabel}
          timeInputHintLabel={timeInputHintLabel}
          timeFullDayHintLabel={timeFullDayHintLabel}
          timeStrictFormatHintLabel={timeStrictFormatHintLabel}
          timeSecondsRangeHintLabel={timeSecondsRangeHintLabel}
          invalidTimeFormatLabel={invalidTimeFormatLabel}
          invalidWeightLabel={invalidWeightLabel}
          minuteHintLabel={minuteHintLabel}
          unsetLabel={unsetLabel}
          allTriggersLabel={allTriggersLabel}
          triggerLabels={triggerLabels}
          lifestyleProfileLabel={lifestyleProfileLabel}
          mascotTypeLabel={mascotTypeLabel}
          characterVoiceProfileLabel={characterVoiceProfileLabel}
          lifestyleProfileOptions={lifestyleProfileOptions}
          mascotTypeOptions={mascotTypeOptions}
          characterVoiceProfileOptions={characterVoiceProfileOptions}
          missingFieldLabel={missingFieldLabel}
          addedLabel={addedLabel}
          categories={categories}
          onAddEntry={(entry) => {
            onAddEntry(entry)
            setActiveTab('list')
          }}
        />
      ) : null}

      {activeTab === 'categories' ? (
        <ResponseCategoryEditor
          title={categoryListLabel}
          categoryLabel={categoryLabel}
          enabledLabel={enabledLabel}
          disabledLabel={disabledLabel}
          entriesCountLabel={entriesCountLabel}
          categories={categories}
          entries={entries}
          onToggleCategoryEnabled={onToggleCategoryEnabled}
        />
      ) : null}

      {activeTab === 'time' ? (
        <section className="response-tab-panel">
          <h3>{tabLabels.time}</h3>
          <p className="muted">
            {currentTimeLabel}: {currentTimeText}
          </p>
          <p className="muted">
            {currentTimeBandLabel}: {timeBand}
          </p>
          <div className="response-time-rules">
            <strong>{timeBandRulesLabel}</strong>
            <p className="muted">morning: 5:00-10:59</p>
            <p className="muted">afternoon: 11:00-16:59</p>
            <p className="muted">evening: 17:00-20:59</p>
            <p className="muted">night: 21:00-23:59</p>
            <p className="muted">lateNight: 0:00-4:59</p>
          </div>
          <label className="settings-toggle">
            <input type="checkbox" checked={hourlyChimeEnabled} onChange={(e) => onToggleHourlyChimeEnabled(e.currentTarget.checked)} />
            <span>{hourlyChimeEnabledLabel}</span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={hourlyChimeQuietHoursEnabled}
              onChange={(e) => onToggleHourlyChimeQuietHoursEnabled(e.currentTarget.checked)}
            />
            <span>{hourlyChimeQuietHoursLabel}</span>
          </label>
          <div className="response-time-range">
            <label className="settings-select-label">
              <span>{startHourLabel}</span>
              <input
                className="settings-input"
                type="number"
                min={0}
                max={23}
                value={hourlyChimeQuietStartHour}
                onChange={(e) => onChangeHourlyChimeQuietStartHour(Math.min(23, Math.max(0, Number(e.currentTarget.value) || 0)))}
              />
            </label>
            <label className="settings-select-label">
              <span>{endHourLabel}</span>
              <input
                className="settings-input"
                type="number"
                min={0}
                max={23}
                value={hourlyChimeQuietEndHour}
                onChange={(e) => onChangeHourlyChimeQuietEndHour(Math.min(23, Math.max(0, Number(e.currentTarget.value) || 0)))}
              />
            </label>
          </div>
          <button type="button" className="secondary-button" onClick={() => onTryRandom('hourly')}>
            {hourlyTestLabel}
          </button>
        </section>
      ) : null}

      {activeTab === 'manage' ? (
        <section className="response-tab-panel">
          <h3>{tabLabels.manage}</h3>
          <div className="settings-actions">
            <button type="button" className="secondary-button" onClick={() => { onReload(); setManageStatus(reloadLabel) }} disabled={isLoading}>
              {reloadLabel}
            </button>
            <button type="button" className="secondary-button" onClick={() => { tryReset(); setManageStatus(resetToDefaultLabel) }} disabled={isLoading}>
              {resetToDefaultLabel}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => void onExportLibrary()}
              disabled={isLoading}
            >
              {exportResponsesLabel}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => void onImportLibraryMerge()}
              disabled={isLoading}
            >
              {importResponsesMergeLabel}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => void tryImportReplace()}
              disabled={isLoading}
            >
              {importResponsesReplaceLabel}
            </button>
          </div>
          <p className="muted">{responseLibraryPathLabel}: userData/responses.json</p>
          <p className="muted">{managementNoticeLabel}</p>
          {importResultMessage ? <p className="muted">{importResultMessage}</p> : null}
          {manageStatus ? <p className="muted">{manageStatus}</p> : null}
        </section>
      ) : null}

      {activeTab === 'speechLog' ? (
        <ResponseSpeechLogPanel
          title={speechLogTabLabel}
          reloadLabel={speechLogReloadLabel}
          clearLabel={speechLogClearLabel}
          spokenAtLabel={speechLogSpokenAtLabel}
          triggerLabel={speechLogTriggerLabel}
          resultLabel={speechLogResultLabel}
          categoryLabel={speechLogCategoryIdLabel}
          entryIdLabel={speechLogEntryIdLabel}
          textLabel={speechLogTextLabel}
          candidateCountLabel={speechLogCandidateCountLabel}
          totalWeightLabel={speechLogTotalWeightLabel}
          selectedWeightLabel={speechLogSelectedWeightLabel}
          lifestyleProfileLabel={speechLogLifestyleProfileLabel}
          mascotTypeLabel={speechLogMascotTypeLabel}
          timePeriodLabel={speechLogTimePeriodLabel}
          reasonLabel={speechLogReasonLabel}
          latestOnlyLabel={speechLogLatestOnlyLabel}
          showingCountLabel={speechLogShowingCountLabel}
          repeatSuppressedLabel={speechLogRepeatSuppressedLabel}
          yesLabel={yesLabel}
          noLabel={noLabel}
          resultLabels={speechLogResultLabels}
          entries={speechLogs}
          onReload={onReloadSpeechLogs}
          onClear={onClearSpeechLogs}
        />
      ) : null}
    </section>
  )
}
