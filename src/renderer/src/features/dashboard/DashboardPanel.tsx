import { useEffect, useMemo, useState } from 'react'
import type {
  AppSettings,
  CharacterModelDefinition,
  CharacterRendererType,
  MascotDragMode,
  MascotWindowAreaSizePreset,
  ThemeMode
} from '@shared/index'
import { formatLocalClock, getLocalTimeZone, getTimeBandByDate, type TimeBandId } from '../../utils/time'

interface DashboardPanelProps {
  title: string
  currentStateLabel: string
  currentModeLabel: string
  rendererTypeLabel: string
  selectedModelLabel: string
  themeLabel: string
  alwaysOnTopLabel: string
  focusableLabel: string
  dragModeLabel: string
  hourlyChimeLabel: string
  mascotSizeLabel: string
  mascotDisplaySizeLabel: string
  lifestyleProfileLabel: string
  mascotTypeLabel: string
  lifestyleProfileNames: Record<AppSettings['lifestyleProfile'], string>
  mascotTypeNames: Record<AppSettings['mascotType'], string>
  currentTimeLabel: string
  timeZoneLabel: string
  timeZoneUnknownLabel: string
  localTimeNoticeLabel: string
  currentTimeBandLabel: string
  openResponsesLabel: string
  openModelsLabel: string
  openMascotLabel: string
  openDeveloperLabel: string
  modeName: string
  theme: ThemeMode
  appSettings: AppSettings
  selectedModel?: CharacterModelDefinition
  timeBandNames: Record<TimeBandId, string>
  rendererNames: Record<CharacterRendererType, string>
  dragModeNames: Record<MascotDragMode, string>
  mascotSizePresetNames: Record<MascotWindowAreaSizePreset, string>
  mascotDisplaySizePresetNames: Record<'small' | 'medium' | 'large' | 'custom', string>
  onOpenResponses: () => void
  onOpenModels: () => void
  onOpenMascot: () => void
  onOpenDeveloper: () => void
}

export function DashboardPanel({
  title,
  currentStateLabel,
  currentModeLabel,
  rendererTypeLabel,
  selectedModelLabel,
  themeLabel,
  alwaysOnTopLabel,
  focusableLabel,
  dragModeLabel,
  hourlyChimeLabel,
  mascotSizeLabel,
  mascotDisplaySizeLabel,
  lifestyleProfileLabel,
  mascotTypeLabel,
  lifestyleProfileNames,
  mascotTypeNames,
  currentTimeLabel,
  timeZoneLabel,
  timeZoneUnknownLabel,
  localTimeNoticeLabel,
  currentTimeBandLabel,
  openResponsesLabel,
  openModelsLabel,
  openMascotLabel,
  openDeveloperLabel,
  modeName,
  theme,
  appSettings,
  selectedModel,
  timeBandNames,
  rendererNames,
  dragModeNames,
  mascotSizePresetNames,
  mascotDisplaySizePresetNames,
  onOpenResponses,
  onOpenModels,
  onOpenMascot,
  onOpenDeveloper
}: DashboardPanelProps): React.JSX.Element {
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const timeText = useMemo(() => formatLocalClock(now), [now])
  const timeZoneText = useMemo(() => getLocalTimeZone() ?? timeZoneUnknownLabel, [timeZoneUnknownLabel])
  const timeBand = useMemo(() => getTimeBandByDate(now), [now])

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <p className="muted">{currentStateLabel}</p>
      <div className="dashboard-grid">
        <article className="dashboard-card">
          <p>{currentModeLabel}</p>
          <strong>{modeName}</strong>
        </article>
        <article className="dashboard-card">
          <p>{rendererTypeLabel}</p>
          <strong>{rendererNames[appSettings.characterRendererType]}</strong>
        </article>
        <article className="dashboard-card">
          <p>{selectedModelLabel}</p>
          <strong>{selectedModel?.displayName ?? '-'}</strong>
        </article>
        <article className="dashboard-card">
          <p>{themeLabel}</p>
          <strong>{theme}</strong>
        </article>
        <article className="dashboard-card">
          <p>{alwaysOnTopLabel}</p>
          <strong>{appSettings.mascotAlwaysOnTop ? 'ON' : 'OFF'}</strong>
        </article>
        <article className="dashboard-card">
          <p>{focusableLabel}</p>
          <strong>{appSettings.mascotFocusable ? 'ON' : 'OFF'}</strong>
        </article>
        <article className="dashboard-card">
          <p>{dragModeLabel}</p>
          <strong>{dragModeNames[appSettings.mascotDragMode]}</strong>
        </article>
        <article className="dashboard-card">
          <p>{hourlyChimeLabel}</p>
          <strong>{appSettings.hourlyChimeEnabled ? 'ON' : 'OFF'}</strong>
        </article>
        <article className="dashboard-card">
          <p>{lifestyleProfileLabel}</p>
          <strong>{lifestyleProfileNames[appSettings.lifestyleProfile]}</strong>
        </article>
        <article className="dashboard-card">
          <p>{mascotTypeLabel}</p>
          <strong>{mascotTypeNames[appSettings.mascotType]}</strong>
        </article>
        <article className="dashboard-card">
          <p>{mascotDisplaySizeLabel}</p>
          <strong>
            {mascotDisplaySizePresetNames[appSettings.mascotWindowSizePreset]}
            {appSettings.mascotWindowSizePreset === 'custom'
              ? ` ${(appSettings.mascotDisplayCustomScale ?? 1).toFixed(2)}x`
              : ''}
          </strong>
        </article>
        <article className="dashboard-card">
          <p>{mascotSizeLabel}</p>
          <strong>
            {mascotSizePresetNames[appSettings.mascotWindowAreaSizePreset]}{' '}
            {appSettings.mascotWindowAreaSizePreset === 'small'
              ? '200 x 288'
              : appSettings.mascotWindowAreaSizePreset === 'large'
                ? '320 x 496'
                : appSettings.mascotWindowAreaSizePreset === 'custom'
                  ? `${appSettings.mascotWindowAreaCustomWidth ?? 220} x ${appSettings.mascotWindowAreaCustomHeight ?? 420}`
                  : '260 x 400'}
          </strong>
        </article>
        <article className="dashboard-card">
          <p>{currentTimeLabel}</p>
          <strong>{timeText}</strong>
          <small className="muted">{timeZoneLabel}: {timeZoneText}</small>
          <small className="muted">{localTimeNoticeLabel}</small>
        </article>
        <article className="dashboard-card">
          <p>{currentTimeBandLabel}</p>
          <strong>{timeBandNames[timeBand]}</strong>
        </article>
      </div>
      <div className="settings-actions">
        <button type="button" className="secondary-button" onClick={onOpenResponses}>
          {openResponsesLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onOpenModels}>
          {openModelsLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onOpenMascot}>
          {openMascotLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onOpenDeveloper}>
          {openDeveloperLabel}
        </button>
      </div>
    </section>
  )
}
