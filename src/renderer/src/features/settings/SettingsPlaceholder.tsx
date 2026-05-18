import type { CharacterRendererType, MascotDragMode } from '@shared/index'

interface CharacterRendererOption {
  type: CharacterRendererType
  label: string
  description: string
}

interface SettingsPlaceholderProps {
  title: string
  description: string
  items: readonly string[]
  characterRendererTitle: string
  rendererSelectionLabel: string
  rendererSelectionDescription: string
  characterRendererOptions: readonly CharacterRendererOption[]
  draftCharacterRendererType: CharacterRendererType
  appliedCharacterRendererType: CharacterRendererType
  applyRendererButtonLabel: string
  currentRendererLabel: string
  pendingChangesLabel: string
  hasPendingRendererChange: boolean
  warnings: readonly string[]
  onDraftCharacterRendererTypeChange: (nextType: CharacterRendererType) => void
  onApplyCharacterRendererType: () => void
  devToolsTitle: string
  autoOpenLabel: string
  autoOpenDescription: string
  openMainButtonLabel: string
  openMascotButtonLabel: string
  openDevToolsOnStartup: boolean
  onToggleOpenDevToolsOnStartup: (nextValue: boolean) => void
  onOpenMainDevTools: () => void
  onOpenMascotDevTools: () => void
  mascotControlsTitle: string
  mascotDragModeLabel: string
  mascotDragModeDescription: string
  mascotDragModeWarning: string
  mascotDisplayTitle: string
  mascotAlwaysOnTopLabel: string
  mascotAlwaysOnTopDescription: string
  mascotFocusableLabel: string
  mascotFocusableDescription: string
  mascotFocusableRecommendation: string
  mascotFocusableRestartNotice: string
  hourlyChimeSectionTitle: string
  hourlyChimeEnabledLabel: string
  hourlyChimeHourlyLabel: string
  hourlyChimeQuietHoursLabel: string
  hourlyChimeEnabled: boolean
  onToggleHourlyChimeEnabled: (nextValue: boolean) => void
  mascotDragModeOptions: readonly {
    value: MascotDragMode
    label: string
  }[]
  mascotDragMode: MascotDragMode
  mascotAlwaysOnTop: boolean
  mascotFocusable: boolean
  onMascotDragModeChange: (nextMode: MascotDragMode) => void
  onToggleMascotAlwaysOnTop: (nextValue: boolean) => void
  onToggleMascotFocusable: (nextValue: boolean) => void
}

export function SettingsPlaceholder({
  title,
  description,
  items,
  characterRendererTitle,
  rendererSelectionLabel,
  rendererSelectionDescription,
  characterRendererOptions,
  draftCharacterRendererType,
  appliedCharacterRendererType,
  applyRendererButtonLabel,
  currentRendererLabel,
  pendingChangesLabel,
  hasPendingRendererChange,
  warnings,
  onDraftCharacterRendererTypeChange,
  onApplyCharacterRendererType,
  devToolsTitle,
  autoOpenLabel,
  autoOpenDescription,
  openMainButtonLabel,
  openMascotButtonLabel,
  openDevToolsOnStartup,
  onToggleOpenDevToolsOnStartup,
  onOpenMainDevTools,
  onOpenMascotDevTools,
  mascotControlsTitle,
  mascotDragModeLabel,
  mascotDragModeDescription,
  mascotDragModeWarning,
  mascotDisplayTitle,
  mascotAlwaysOnTopLabel,
  mascotAlwaysOnTopDescription,
  mascotFocusableLabel,
  mascotFocusableDescription,
  mascotFocusableRecommendation,
  mascotFocusableRestartNotice,
  hourlyChimeSectionTitle,
  hourlyChimeEnabledLabel,
  hourlyChimeHourlyLabel,
  hourlyChimeQuietHoursLabel,
  hourlyChimeEnabled,
  onToggleHourlyChimeEnabled,
  mascotDragModeOptions,
  mascotDragMode,
  mascotAlwaysOnTop,
  mascotFocusable,
  onMascotDragModeChange,
  onToggleMascotAlwaysOnTop,
  onToggleMascotFocusable
}: SettingsPlaceholderProps): React.JSX.Element {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <p className="muted">{description}</p>
      <ul className="settings-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="settings-renderer">
        <h3>{characterRendererTitle}</h3>
        <p className="muted">{rendererSelectionDescription}</p>
        <label className="settings-select-label">
          <span>{rendererSelectionLabel}</span>
          <select
            className="settings-select"
            value={draftCharacterRendererType}
            onChange={(event) =>
              onDraftCharacterRendererTypeChange(event.currentTarget.value as CharacterRendererType)
            }
          >
            {characterRendererOptions.map((option) => (
              <option key={option.type} value={option.type}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">
          {
            characterRendererOptions.find((option) => option.type === draftCharacterRendererType)
              ?.description
          }
        </p>
        <p className="muted">
          {currentRendererLabel}:{' '}
          {
            characterRendererOptions.find((option) => option.type === appliedCharacterRendererType)
              ?.label
          }
        </p>
        {hasPendingRendererChange ? <p className="settings-pending">{pendingChangesLabel}</p> : null}
        <button
          type="button"
          className="secondary-button"
          onClick={onApplyCharacterRendererType}
          disabled={!hasPendingRendererChange}
        >
          {applyRendererButtonLabel}
        </button>
        {warnings.length > 0 ? (
          <div className="settings-warnings" role="status" aria-live="polite">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="settings-devtools">
        <h3>{devToolsTitle}</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={openDevToolsOnStartup}
            onChange={(event) => onToggleOpenDevToolsOnStartup(event.currentTarget.checked)}
          />
          <span>{autoOpenLabel}</span>
        </label>
        <p className="muted">{autoOpenDescription}</p>
        <div className="settings-actions">
          <button type="button" className="secondary-button" onClick={onOpenMainDevTools}>
            {openMainButtonLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onOpenMascotDevTools}>
            {openMascotButtonLabel}
          </button>
        </div>
      </div>
      <div className="settings-mascot-controls">
        <h3>{mascotControlsTitle}</h3>
        <label className="settings-select-label">
          <span>{mascotDragModeLabel}</span>
          <select
            className="settings-select"
            value={mascotDragMode}
            onChange={(event) => onMascotDragModeChange(event.currentTarget.value as MascotDragMode)}
          >
            {mascotDragModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{mascotDragModeDescription}</p>
        {mascotDragMode === 'transparent-drag-area' ? (
          <p className="settings-note">{mascotDragModeWarning}</p>
        ) : null}
      </div>
      <div className="settings-mascot-controls">
        <h3>{mascotDisplayTitle}</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={mascotAlwaysOnTop}
            onChange={(event) => onToggleMascotAlwaysOnTop(event.currentTarget.checked)}
          />
          <span>{mascotAlwaysOnTopLabel}</span>
        </label>
        <p className="muted">{mascotAlwaysOnTopDescription}</p>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={mascotFocusable}
            onChange={(event) => onToggleMascotFocusable(event.currentTarget.checked)}
          />
          <span>{mascotFocusableLabel}</span>
        </label>
        <p className="muted">{mascotFocusableDescription}</p>
        <p className="muted">{mascotFocusableRecommendation}</p>
        <p className="settings-note">{mascotFocusableRestartNotice}</p>
      </div>
      <div className="settings-mascot-controls">
        <h3>{hourlyChimeSectionTitle}</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={hourlyChimeEnabled}
            onChange={(event) => onToggleHourlyChimeEnabled(event.currentTarget.checked)}
          />
          <span>{hourlyChimeEnabledLabel}</span>
        </label>
        <p className="muted">{hourlyChimeHourlyLabel}</p>
        <p className="muted">{hourlyChimeQuietHoursLabel}</p>
      </div>
    </section>
  )
}
