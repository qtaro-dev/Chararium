import { useEffect, useMemo, useRef, useState } from 'react'
import { BubblePreview } from './features/mascot/BubblePreview'
import { MascotWindowView } from './features/mascot/MascotWindowView'
import { ModelManagementSection } from './features/models/ModelManagementSection'
import { ResponseLibraryPanel } from './features/responses/ResponseLibraryPanel'
import { DashboardPanel } from './features/dashboard/DashboardPanel'
import { MainTabs, type MainTab } from './features/navigation/MainTabs'
import { MascotSettingsPanel } from './features/settings/MascotSettingsPanel'
import { DeveloperToolsPanel } from './features/developer/DeveloperToolsPanel'
import { StorageLocationPanel } from './features/settings/StorageLocationPanel'
import { stringsJa } from './resources/strings.ja'
import { characterRendererInfos, defaultAppSettings, getRendererTypeFromModelFormat } from '@shared/index'
import type {
  AppSettings,
  CharacterModelDefinition,
  CharacterRendererType,
  IImportResponseLibraryResult,
  IStorageOperationResult,
  MascotHorizontalAlign,
  MascotSpeechBubbleFontFamily,
  MascotSpeechBubblePlacement,
  SpeechBubbleHeightMode,
  SpeechBubbleTailDirection,
  SpeechBubbleWidthMode,
  SpeechBubbleWritingMode,
  MascotVerticalAlign,
  MascotWindowAreaSizePreset,
  MascotWindowSizePreset,
  ResponseLibrary,
  ResponseMode,
  ResponseTrigger,
  SpeechLogEntry,
  StoragePaths,
  ThemeMode
} from '@shared/index'

const activeMode: ResponseMode = 'local'

function getWindowVariant(): 'main' | 'mascot' {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('window') === 'mascot' ? 'mascot' : 'main'
}

function App(): React.JSX.Element {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [message, setMessage] = useState<string>(stringsJa.bubblePreviewFallback)
  const [messageSource, setMessageSource] = useState<'normal' | 'debugSpeech'>('normal')
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('dashboard')
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings)
  const [draftRendererType, setDraftRendererType] = useState<CharacterRendererType>(defaultAppSettings.characterRendererType)
  const [models, setModels] = useState<CharacterModelDefinition[]>([])
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(false)
  const [responseLibrary, setResponseLibrary] = useState<ResponseLibrary | null>(null)
  const [speechLogEntries, setSpeechLogEntries] = useState<SpeechLogEntry[]>([])
  const [isResponseLibraryLoading, setIsResponseLibraryLoading] = useState<boolean>(false)
  const [responseLibraryManageMessage, setResponseLibraryManageMessage] = useState<string>('')
  const [storagePaths, setStoragePaths] = useState<StoragePaths | null>(null)
  const [storageStatusMessage, setStorageStatusMessage] = useState<string>('')
  const [developerStatusMessage, setDeveloperStatusMessage] = useState<string>('')
  const [draftMascotDisplaySizePreset, setDraftMascotDisplaySizePreset] = useState<MascotWindowSizePreset>(defaultAppSettings.mascotWindowSizePreset)
  const [draftMascotAreaSizePreset, setDraftMascotAreaSizePreset] = useState<MascotWindowAreaSizePreset>(defaultAppSettings.mascotWindowAreaSizePreset)
  const [draftMascotAreaWidth, setDraftMascotAreaWidth] = useState<number>(defaultAppSettings.mascotWindowAreaCustomWidth ?? 220)
  const [draftMascotAreaHeight, setDraftMascotAreaHeight] = useState<number>(defaultAppSettings.mascotWindowAreaCustomHeight ?? 420)
  const [draftMascotDisplayCustomScale, setDraftMascotDisplayCustomScale] = useState<number>(defaultAppSettings.mascotDisplayCustomScale ?? 1.0)
  const [draftMascotDragMode, setDraftMascotDragMode] = useState(defaultAppSettings.mascotDragMode)
  const [draftMascotAlwaysOnTop, setDraftMascotAlwaysOnTop] = useState(defaultAppSettings.mascotAlwaysOnTop)
  const [draftMascotShowHitArea, setDraftMascotShowHitArea] = useState(defaultAppSettings.mascotShowHitArea)
  const [draftMascotClickThroughMode, setDraftMascotClickThroughMode] = useState(defaultAppSettings.mascotClickThroughMode)
  const [draftSpeechBubblePlacement, setDraftSpeechBubblePlacement] = useState<MascotSpeechBubblePlacement>(defaultAppSettings.mascotSpeechBubblePlacement)
  const [draftSpeechBubbleOffsetX, setDraftSpeechBubbleOffsetX] = useState<number>(defaultAppSettings.mascotSpeechBubbleOffsetX)
  const [draftSpeechBubbleOffsetY, setDraftSpeechBubbleOffsetY] = useState<number>(defaultAppSettings.mascotSpeechBubbleOffsetY)
  const [draftSpeechBubbleTailOffsetX, setDraftSpeechBubbleTailOffsetX] = useState<number>(defaultAppSettings.speechBubbleTailOffsetX)
  const [draftSpeechBubbleTailOffsetY, setDraftSpeechBubbleTailOffsetY] = useState<number>(defaultAppSettings.speechBubbleTailOffsetY)
  const [draftSpeechBubbleTailSize, setDraftSpeechBubbleTailSize] = useState<number>(defaultAppSettings.speechBubbleTailSize)
  const [draftSpeechBubbleTailRotationDeg, setDraftSpeechBubbleTailRotationDeg] = useState<number>(defaultAppSettings.speechBubbleTailRotationDeg)
  const [draftSpeechBubbleTailDirection, setDraftSpeechBubbleTailDirection] = useState<SpeechBubbleTailDirection>(defaultAppSettings.speechBubbleTailDirection)
  const [draftSpeechBubbleTailMirrored, setDraftSpeechBubbleTailMirrored] = useState<boolean>(defaultAppSettings.speechBubbleTailMirrored)
  const [draftSpeechBubbleBorderEnabled, setDraftSpeechBubbleBorderEnabled] = useState<boolean>(defaultAppSettings.speechBubbleBorderEnabled)
  const [draftSpeechBubbleBorderWidth, setDraftSpeechBubbleBorderWidth] = useState<number>(defaultAppSettings.speechBubbleBorderWidth)
  const [draftSpeechBubbleWidthMode, setDraftSpeechBubbleWidthMode] = useState<SpeechBubbleWidthMode>(defaultAppSettings.speechBubbleWidthMode)
  const [draftSpeechBubbleHeightMode, setDraftSpeechBubbleHeightMode] = useState<SpeechBubbleHeightMode>(defaultAppSettings.speechBubbleHeightMode)
  const [draftSpeechBubbleMaxWidth, setDraftSpeechBubbleMaxWidth] = useState<number>(defaultAppSettings.speechBubbleMaxWidth)
  const [draftSpeechBubbleMaxHeight, setDraftSpeechBubbleMaxHeight] = useState<number>(defaultAppSettings.speechBubbleMaxHeight)
  const [draftSpeechBubbleFontSize, setDraftSpeechBubbleFontSize] = useState<number>(defaultAppSettings.mascotSpeechBubbleFontSize)
  const [draftSpeechBubbleFontFamily, setDraftSpeechBubbleFontFamily] = useState<MascotSpeechBubbleFontFamily>(defaultAppSettings.mascotSpeechBubbleFontFamily)
  const [draftSpeechBubbleWritingMode, setDraftSpeechBubbleWritingMode] = useState<SpeechBubbleWritingMode>(defaultAppSettings.speechBubbleWritingMode)
  const [draftMascotVerticalAlign, setDraftMascotVerticalAlign] = useState<MascotVerticalAlign>(defaultAppSettings.mascotVerticalAlign)
  const [draftMascotHorizontalAlign, setDraftMascotHorizontalAlign] = useState<MascotHorizontalAlign>(defaultAppSettings.mascotHorizontalAlign)
  const [draftMascotOffsetX, setDraftMascotOffsetX] = useState<number>(defaultAppSettings.mascotOffsetX)
  const [draftMascotOffsetY, setDraftMascotOffsetY] = useState<number>(defaultAppSettings.mascotOffsetY)
  const [draftLifestyleProfile, setDraftLifestyleProfile] = useState(defaultAppSettings.lifestyleProfile)
  const [draftMascotType, setDraftMascotType] = useState(defaultAppSettings.mascotType)
  const [draftCharacterVoiceProfile, setDraftCharacterVoiceProfile] = useState(defaultAppSettings.characterVoiceProfile)
  const [draftAutoIdleSpeechEnabled, setDraftAutoIdleSpeechEnabled] = useState(defaultAppSettings.autoIdleSpeechEnabled)
  const [draftAutoIdleSpeechMinMinutes, setDraftAutoIdleSpeechMinMinutes] = useState(defaultAppSettings.autoIdleSpeechMinMinutes)
  const [draftAutoIdleSpeechMaxMinutes, setDraftAutoIdleSpeechMaxMinutes] = useState(defaultAppSettings.autoIdleSpeechMaxMinutes)
  const [draftAutoIdleSpeechAfterInteractionDelaySeconds, setDraftAutoIdleSpeechAfterInteractionDelaySeconds] = useState(
    defaultAppSettings.autoIdleSpeechAfterInteractionDelaySeconds
  )
  const [mascotDisplayScaleErrorMessage, setMascotDisplayScaleErrorMessage] = useState<string>('')
  const [mascotResetMessage, setMascotResetMessage] = useState<string>('')
  const [isApplyingMascotView, setIsApplyingMascotView] = useState<boolean>(false)
  const [mascotViewApplyResult, setMascotViewApplyResult] = useState<{
    status: 'idle' | 'success' | 'error'
    requestedWidth?: number
    requestedHeight?: number
    actualWindowWidth?: number
    actualWindowHeight?: number
    actualContentWidth?: number
    actualContentHeight?: number
  }>({ status: 'idle' })
  const lastHourlyChimeKeyRef = useRef<string>('')
  const lastInteractionAtRef = useRef<number>(Date.now())
  const lastSpeechAtRef = useRef<number>(0)
  const lastIdleSpeechAtRef = useRef<number>(0)
  const lastClickSpeechAtRef = useRef<number>(0)
  const debugSpeechTimerRef = useRef<number | null>(null)
  const autoIdleTimerRef = useRef<number | null>(null)

  const runtimeInfo = useMemo(() => window.chararium?.getRuntimeInfo(), [])
  const windowVariant = useMemo(() => getWindowVariant(), [])

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { document.documentElement.dataset.windowVariant = windowVariant }, [windowVariant])

  useEffect(() => {
    let isMounted = true
    const unsubscribe = window.chararium.settings.onAppSettingsChanged((settings) => {
      if (isMounted) setAppSettings(settings)
    })
    void window.chararium.settings.getAppSettings().then((settings) => {
      if (isMounted) {
        setAppSettings(settings)
        setTheme(settings.theme)
        setDraftRendererType(settings.characterRendererType)
      }
    })
    void window.chararium.storage.getPaths().then((paths) => {
      if (isMounted) setStoragePaths(paths)
    })
    return () => { isMounted = false; unsubscribe() }
  }, [])

  useEffect(() => {
    setTheme(appSettings.theme)
  }, [appSettings.theme])

  useEffect(() => { setDraftRendererType(appSettings.characterRendererType) }, [appSettings.characterRendererType])
  useEffect(() => {
    setDraftMascotDisplaySizePreset(appSettings.mascotWindowSizePreset)
    setDraftMascotAreaSizePreset(appSettings.mascotWindowAreaSizePreset)
    setDraftMascotAreaWidth(appSettings.mascotWindowAreaCustomWidth ?? 220)
    setDraftMascotAreaHeight(appSettings.mascotWindowAreaCustomHeight ?? 420)
    setDraftMascotDisplayCustomScale(appSettings.mascotDisplayCustomScale ?? 1.0)
    setDraftMascotDragMode(appSettings.mascotDragMode)
    setDraftMascotAlwaysOnTop(appSettings.mascotAlwaysOnTop)
    setDraftMascotShowHitArea(appSettings.mascotShowHitArea)
    setDraftMascotClickThroughMode(appSettings.mascotClickThroughMode)
    setDraftSpeechBubblePlacement(appSettings.mascotSpeechBubblePlacement)
    setDraftSpeechBubbleOffsetX(appSettings.mascotSpeechBubbleOffsetX)
    setDraftSpeechBubbleOffsetY(appSettings.mascotSpeechBubbleOffsetY)
    setDraftSpeechBubbleTailOffsetX(appSettings.speechBubbleTailOffsetX)
    setDraftSpeechBubbleTailOffsetY(appSettings.speechBubbleTailOffsetY)
    setDraftSpeechBubbleTailSize(appSettings.speechBubbleTailSize)
    setDraftSpeechBubbleTailRotationDeg(appSettings.speechBubbleTailRotationDeg)
    setDraftSpeechBubbleTailDirection(appSettings.speechBubbleTailDirection ?? 'auto')
    setDraftSpeechBubbleTailMirrored(appSettings.speechBubbleTailMirrored ?? false)
    setDraftSpeechBubbleBorderEnabled(appSettings.speechBubbleBorderEnabled)
    setDraftSpeechBubbleBorderWidth(appSettings.speechBubbleBorderWidth)
    setDraftSpeechBubbleWidthMode(appSettings.speechBubbleWidthMode ?? 'auto')
    setDraftSpeechBubbleHeightMode(appSettings.speechBubbleHeightMode ?? 'auto')
    setDraftSpeechBubbleMaxWidth(appSettings.speechBubbleMaxWidth)
    setDraftSpeechBubbleMaxHeight(appSettings.speechBubbleMaxHeight)
    setDraftSpeechBubbleFontSize(appSettings.mascotSpeechBubbleFontSize)
    setDraftSpeechBubbleFontFamily(appSettings.mascotSpeechBubbleFontFamily)
    setDraftSpeechBubbleWritingMode(appSettings.speechBubbleWritingMode)
    setDraftMascotVerticalAlign(appSettings.mascotVerticalAlign)
    setDraftMascotHorizontalAlign(appSettings.mascotHorizontalAlign)
    setDraftMascotOffsetX(appSettings.mascotOffsetX)
    setDraftMascotOffsetY(appSettings.mascotOffsetY)
    setDraftLifestyleProfile(appSettings.lifestyleProfile)
    setDraftMascotType(appSettings.mascotType)
    setDraftCharacterVoiceProfile(appSettings.characterVoiceProfile)
    setDraftAutoIdleSpeechEnabled(appSettings.autoIdleSpeechEnabled)
    setDraftAutoIdleSpeechMinMinutes(appSettings.autoIdleSpeechMinMinutes)
    setDraftAutoIdleSpeechMaxMinutes(appSettings.autoIdleSpeechMaxMinutes)
    setDraftAutoIdleSpeechAfterInteractionDelaySeconds(appSettings.autoIdleSpeechAfterInteractionDelaySeconds)
    setMascotDisplayScaleErrorMessage('')
    setMascotResetMessage('')
  }, [
    appSettings.mascotAlwaysOnTop,
    appSettings.mascotClickThroughMode,
    appSettings.mascotDragMode,
    appSettings.mascotHorizontalAlign,
    appSettings.mascotOffsetX,
    appSettings.mascotOffsetY,
    appSettings.mascotSpeechBubbleFontFamily,
    appSettings.mascotSpeechBubbleFontSize,
    appSettings.mascotSpeechBubbleOffsetX,
    appSettings.mascotSpeechBubbleOffsetY,
    appSettings.speechBubbleTailOffsetX,
    appSettings.speechBubbleTailOffsetY,
    appSettings.speechBubbleTailSize,
    appSettings.speechBubbleTailRotationDeg,
    appSettings.speechBubbleTailDirection,
    appSettings.speechBubbleTailMirrored,
    appSettings.speechBubbleBorderEnabled,
    appSettings.speechBubbleBorderWidth,
    appSettings.speechBubbleWidthMode,
    appSettings.speechBubbleHeightMode,
    appSettings.speechBubbleMaxWidth,
    appSettings.speechBubbleMaxHeight,
    appSettings.mascotSpeechBubblePlacement,
    appSettings.speechBubbleWritingMode,
    appSettings.mascotVerticalAlign,
    appSettings.lifestyleProfile,
    appSettings.mascotType,
    appSettings.characterVoiceProfile,
    appSettings.autoIdleSpeechEnabled,
    appSettings.autoIdleSpeechMinMinutes,
    appSettings.autoIdleSpeechMaxMinutes,
    appSettings.autoIdleSpeechAfterInteractionDelaySeconds,
    appSettings.mascotShowHitArea,
    appSettings.mascotDisplayCustomScale,
    appSettings.mascotWindowAreaCustomHeight,
    appSettings.mascotWindowAreaCustomWidth,
    appSettings.mascotWindowAreaSizePreset,
    appSettings.mascotWindowSizePreset
  ])

  useEffect(() => {
    let mounted = true
    setIsModelsLoading(true)
    void window.chararium.models.scanModels().then((scannedModels) => { if (mounted) setModels(scannedModels) }).finally(() => { if (mounted) setIsModelsLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => { void reloadResponseLibrary() }, [])
  useEffect(() => { void reloadSpeechLogs() }, [])

  useEffect(() => {
    if (!appSettings.hourlyChimeEnabled) return
    const timer = window.setInterval(() => {
      const now = new Date()
      if (now.getMinutes() !== 0) return
      const hour = now.getHours()
      if (appSettings.hourlyChimeQuietHoursEnabled) {
        const { hourlyChimeQuietStartHour: start, hourlyChimeQuietEndHour: end } = appSettings
        if (start <= end) {
          if (hour >= start && hour < end) return
        } else if (hour >= start || hour < end) return
      }
      const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${hour}-0`
      if (lastHourlyChimeKeyRef.current === key) return
      lastHourlyChimeKeyRef.current = key
      void handleMascotInteraction('hourly')
    }, 1000)
    return () => { window.clearInterval(timer) }
  }, [appSettings])

  useEffect(() => {
    if (debugSpeechTimerRef.current !== null) {
      window.clearInterval(debugSpeechTimerRef.current)
      debugSpeechTimerRef.current = null
    }

    if (!appSettings.debugSpeechEnabled) {
      return
    }

    const intervalMs = Math.max(5, appSettings.debugSpeechIntervalSeconds) * 1000
    const cooldownMs = Math.max(0, appSettings.idleSpeechCooldownMs ?? 30_000)

    debugSpeechTimerRef.current = window.setInterval(() => {
      const nowMs = Date.now()
      if (nowMs - lastInteractionAtRef.current < intervalMs) return
      if (nowMs - lastIdleSpeechAtRef.current < cooldownMs) return
      if (nowMs - lastSpeechAtRef.current < 5_000) return
      lastIdleSpeechAtRef.current = nowMs
      void handleMascotInteraction('idle', 'debugSpeech')
    }, intervalMs)

    return () => {
      if (debugSpeechTimerRef.current !== null) {
        window.clearInterval(debugSpeechTimerRef.current)
        debugSpeechTimerRef.current = null
      }
    }
  }, [appSettings.debugSpeechEnabled, appSettings.debugSpeechIntervalSeconds, appSettings.idleSpeechCooldownMs, appSettings.lifestyleProfile, appSettings.mascotType, appSettings.characterVoiceProfile])

  useEffect(() => {
    if (autoIdleTimerRef.current !== null) {
      window.clearTimeout(autoIdleTimerRef.current)
      autoIdleTimerRef.current = null
    }

    if (!appSettings.autoIdleSpeechEnabled) {
      return
    }

    const scheduleNext = (): void => {
      const minMs = Math.max(1, appSettings.autoIdleSpeechMinMinutes) * 60_000
      const maxMs = Math.max(appSettings.autoIdleSpeechMinMinutes, appSettings.autoIdleSpeechMaxMinutes) * 60_000
      const waitMs = minMs + Math.floor(Math.random() * Math.max(1, maxMs - minMs + 1))

      autoIdleTimerRef.current = window.setTimeout(() => {
        const nowMs = Date.now()
        const requiredDelayMs = Math.max(0, appSettings.autoIdleSpeechAfterInteractionDelaySeconds) * 1000
        const elapsedAfterInteraction = nowMs - lastInteractionAtRef.current
        const elapsedAfterSpeech = nowMs - lastSpeechAtRef.current
        if (elapsedAfterInteraction < requiredDelayMs || elapsedAfterSpeech < 3_000) {
          scheduleNext()
          return
        }
        void handleMascotInteraction('idle').finally(() => {
          scheduleNext()
        })
      }, waitMs)
    }

    scheduleNext()
    return () => {
      if (autoIdleTimerRef.current !== null) {
        window.clearTimeout(autoIdleTimerRef.current)
        autoIdleTimerRef.current = null
      }
    }
  }, [
    appSettings.autoIdleSpeechEnabled,
    appSettings.autoIdleSpeechMinMinutes,
    appSettings.autoIdleSpeechMaxMinutes,
    appSettings.autoIdleSpeechAfterInteractionDelaySeconds,
    appSettings.characterVoiceProfile,
    appSettings.lifestyleProfile,
    appSettings.mascotType
  ])

  async function handleMascotInteraction(
    trigger: ResponseTrigger = 'click',
    source: 'normal' | 'debugSpeech' = 'normal'
  ): Promise<void> {
    const nowMs = Date.now()
    if (trigger === 'click') {
      const cooldownMs = Math.max(0, appSettings.clickSpeechCooldownMs ?? 1000)
      if (cooldownMs > 0 && nowMs - lastClickSpeechAtRef.current < cooldownMs) {
        return
      }
      lastClickSpeechAtRef.current = nowMs
    }
    lastInteractionAtRef.current = Date.now()
    const text = await window.chararium.responseLibrary.getRandomResponse({
      trigger,
      source,
      lifestyleProfile: appSettings.lifestyleProfile,
      mascotType: appSettings.mascotType,
      characterVoiceProfile: appSettings.characterVoiceProfile
    })
    setMessage(text)
    setMessageSource(source)
    lastSpeechAtRef.current = Date.now()
    await reloadSpeechLogs()
  }

  function runMascotInteraction(): void { void handleMascotInteraction('click') }
  function handleThemeToggle(): void {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    void updateSettings({ theme: nextTheme })
  }
  function handleElementInteractionClick(event: React.MouseEvent<HTMLElement>): void { event.stopPropagation(); runMascotInteraction() }

  async function updateSettings(command: Partial<AppSettings>): Promise<void> {
    const next = await window.chararium.settings.updateAppSettings(command)
    setAppSettings(next)
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
  }

  function resolveDraftAreaSize(): { width: number; height: number } {
    if (draftMascotAreaSizePreset === 'small') {
      return { width: 200, height: 288 }
    }
    if (draftMascotAreaSizePreset === 'large') {
      return { width: 320, height: 496 }
    }
    if (draftMascotAreaSizePreset === 'custom') {
      return {
        width: clamp(draftMascotAreaWidth, 120, 800),
        height: clamp(draftMascotAreaHeight, 180, 1000)
      }
    }
    return { width: 260, height: 400 }
  }

  function resolveAreaSizeFromSettings(settings: AppSettings): { width: number; height: number } {
    if (settings.mascotWindowAreaSizePreset === 'small') {
      return { width: 200, height: 288 }
    }
    if (settings.mascotWindowAreaSizePreset === 'large') {
      return { width: 320, height: 496 }
    }
    if (settings.mascotWindowAreaSizePreset === 'custom') {
      return {
        width: clamp(settings.mascotWindowAreaCustomWidth ?? 220, 120, 800),
        height: clamp(settings.mascotWindowAreaCustomHeight ?? 420, 180, 1000)
      }
    }
    return { width: 260, height: 400 }
  }

  function resetMascotDraftSettings(): void {
    setDraftMascotDragMode('modifier-ctrl-or-shift')
    setDraftMascotAlwaysOnTop(false)
    setDraftMascotShowHitArea(false)
    setDraftMascotClickThroughMode('off')
    setDraftSpeechBubblePlacement('auto')
    setDraftSpeechBubbleOffsetX(0)
    setDraftSpeechBubbleOffsetY(0)
    setDraftSpeechBubbleTailOffsetX(0)
    setDraftSpeechBubbleTailOffsetY(0)
    setDraftSpeechBubbleTailSize(12)
    setDraftSpeechBubbleTailRotationDeg(0)
    setDraftSpeechBubbleTailDirection('auto')
    setDraftSpeechBubbleTailMirrored(false)
    setDraftSpeechBubbleBorderEnabled(true)
    setDraftSpeechBubbleBorderWidth(1)
    setDraftSpeechBubbleWidthMode('auto')
    setDraftSpeechBubbleHeightMode('auto')
    setDraftSpeechBubbleMaxWidth(208)
    setDraftSpeechBubbleMaxHeight(220)
    setDraftSpeechBubbleFontSize(12)
    setDraftSpeechBubbleFontFamily('sans')
    setDraftSpeechBubbleWritingMode('horizontal')
    setDraftMascotVerticalAlign('center')
    setDraftMascotHorizontalAlign('center')
    setDraftMascotOffsetX(0)
    setDraftMascotOffsetY(0)
    setDraftLifestyleProfile('standard')
    setDraftMascotType('female')
    setDraftCharacterVoiceProfile('standard')
    setDraftAutoIdleSpeechEnabled(false)
    setDraftAutoIdleSpeechMinMinutes(3)
    setDraftAutoIdleSpeechMaxMinutes(8)
    setDraftAutoIdleSpeechAfterInteractionDelaySeconds(60)
    setMascotResetMessage(stringsJa.mascotResetDoneDraftLabel)
  }

  async function handleApplyMascotView(): Promise<void> {
    const resolvedSize = resolveDraftAreaSize()
    if (draftMascotDisplaySizePreset === 'custom') {
      if (!Number.isFinite(draftMascotDisplayCustomScale) || draftMascotDisplayCustomScale < 0.3 || draftMascotDisplayCustomScale > 2.0) {
        setMascotDisplayScaleErrorMessage(stringsJa.mascotDisplayScaleValidationLabel)
        return
      }
    }
    if (!Number.isFinite(draftSpeechBubbleFontSize) || draftSpeechBubbleFontSize < 10 || draftSpeechBubbleFontSize > 24) {
      setMascotDisplayScaleErrorMessage(stringsJa.mascotSpeechBubbleFontSizeValidationLabel)
      return
    }
    if (
      draftSpeechBubbleOffsetX < -200 ||
      draftSpeechBubbleOffsetX > 200 ||
      draftSpeechBubbleOffsetY < -200 ||
      draftSpeechBubbleOffsetY > 200 ||
      draftSpeechBubbleTailOffsetX < -200 ||
      draftSpeechBubbleTailOffsetX > 200 ||
      draftSpeechBubbleTailOffsetY < -200 ||
      draftSpeechBubbleTailOffsetY > 200 ||
      draftSpeechBubbleTailSize < 4 ||
      draftSpeechBubbleTailSize > 40 ||
      draftSpeechBubbleTailRotationDeg < -90 ||
      draftSpeechBubbleTailRotationDeg > 90 ||
      draftSpeechBubbleBorderWidth < 0 ||
      draftSpeechBubbleBorderWidth > 8 ||
      (draftSpeechBubbleWidthMode === 'custom' && (draftSpeechBubbleMaxWidth < 80 || draftSpeechBubbleMaxWidth > 800)) ||
      (draftSpeechBubbleHeightMode === 'custom' && (draftSpeechBubbleMaxHeight < 40 || draftSpeechBubbleMaxHeight > 800)) ||
      draftMascotOffsetX < -200 ||
      draftMascotOffsetX > 200 ||
      draftMascotOffsetY < -200 ||
      draftMascotOffsetY > 200
    ) {
      setMascotDisplayScaleErrorMessage(stringsJa.mascotLayoutOffsetValidationLabel)
      return
    }
    setMascotDisplayScaleErrorMessage('')
    setIsApplyingMascotView(true)
    setMascotViewApplyResult({ status: 'idle' })
    try {
      await updateSettings({
        mascotDragMode: draftMascotDragMode,
        mascotAlwaysOnTop: draftMascotAlwaysOnTop,
        mascotShowHitArea: draftMascotShowHitArea,
        mascotClickThroughMode: draftMascotClickThroughMode,
        mascotWindowSizePreset: draftMascotDisplaySizePreset,
        mascotDisplayCustomScale: Math.min(2.0, Math.max(0.3, draftMascotDisplayCustomScale)),
        mascotSpeechBubblePlacement: draftSpeechBubblePlacement,
        mascotSpeechBubbleOffsetX: clamp(draftSpeechBubbleOffsetX, -200, 200),
        mascotSpeechBubbleOffsetY: clamp(draftSpeechBubbleOffsetY, -200, 200),
        speechBubbleTailOffsetX: clamp(draftSpeechBubbleTailOffsetX, -200, 200),
        speechBubbleTailOffsetY: clamp(draftSpeechBubbleTailOffsetY, -200, 200),
        speechBubbleTailSize: clamp(draftSpeechBubbleTailSize, 4, 40),
        speechBubbleTailRotationDeg: clamp(draftSpeechBubbleTailRotationDeg, -90, 90),
        speechBubbleTailDirection: draftSpeechBubbleTailDirection,
        speechBubbleTailMirrored: draftSpeechBubbleTailMirrored,
        speechBubbleBorderEnabled: draftSpeechBubbleBorderEnabled,
        speechBubbleBorderWidth: clamp(draftSpeechBubbleBorderWidth, 0, 8),
        speechBubbleWidthMode: draftSpeechBubbleWidthMode,
        speechBubbleHeightMode: draftSpeechBubbleHeightMode,
        speechBubbleMaxWidth: clamp(draftSpeechBubbleMaxWidth, 80, 800),
        speechBubbleMaxHeight: clamp(draftSpeechBubbleMaxHeight, 40, 800),
        mascotSpeechBubbleFontSize: clamp(draftSpeechBubbleFontSize, 10, 24),
        mascotSpeechBubbleFontFamily: draftSpeechBubbleFontFamily,
        speechBubbleWritingMode: draftSpeechBubbleWritingMode,
        mascotVerticalAlign: draftMascotVerticalAlign,
        mascotHorizontalAlign: draftMascotHorizontalAlign,
        mascotOffsetX: clamp(draftMascotOffsetX, -200, 200),
        mascotOffsetY: clamp(draftMascotOffsetY, -200, 200),
        lifestyleProfile: draftLifestyleProfile,
        mascotType: draftMascotType,
        characterVoiceProfile: draftCharacterVoiceProfile,
        autoIdleSpeechEnabled: draftAutoIdleSpeechEnabled,
        autoIdleSpeechMinMinutes: clamp(draftAutoIdleSpeechMinMinutes, 1, 120),
        autoIdleSpeechMaxMinutes: clamp(draftAutoIdleSpeechMaxMinutes, 1, 120),
        autoIdleSpeechAfterInteractionDelaySeconds: clamp(draftAutoIdleSpeechAfterInteractionDelaySeconds, 0, 3600),
        mascotWindowAreaSizePreset: draftMascotAreaSizePreset,
        mascotWindowAreaCustomWidth: resolvedSize.width,
        mascotWindowAreaCustomHeight: resolvedSize.height
      })
      lastInteractionAtRef.current = Date.now()
      setMascotResetMessage('')
      const actual = await window.chararium.mascotWindow.getSize()
      setMascotViewApplyResult({
        status: 'success',
        requestedWidth: resolvedSize.width,
        requestedHeight: resolvedSize.height,
        actualWindowWidth: actual?.windowWidth ?? resolvedSize.width,
        actualWindowHeight: actual?.windowHeight ?? resolvedSize.height,
        actualContentWidth: actual?.contentWidth ?? resolvedSize.width,
        actualContentHeight: actual?.contentHeight ?? resolvedSize.height
      })
    } catch {
      setMascotViewApplyResult({ status: 'error', requestedWidth: resolvedSize.width, requestedHeight: resolvedSize.height })
    } finally {
      setIsApplyingMascotView(false)
    }
  }

  async function handleReloadModels(): Promise<void> {
    setIsModelsLoading(true)
    try { setModels(await window.chararium.models.scanModels()) } finally { setIsModelsLoading(false) }
  }

  async function reloadResponseLibrary(): Promise<void> {
    setIsResponseLibraryLoading(true)
    try { setResponseLibrary(await window.chararium.responseLibrary.get()) } finally { setIsResponseLibraryLoading(false) }
  }

  async function reloadSpeechLogs(): Promise<void> {
    const result = await window.chararium.speechLog.list({ limit: 100 })
    setSpeechLogEntries(result.entries)
  }

  async function clearSpeechLogs(): Promise<void> {
    await window.chararium.speechLog.clear()
    await reloadSpeechLogs()
  }

  async function clearExternalSpeechLogs(): Promise<void> {
    await window.chararium.speechLog.clearExternal()
    setDeveloperStatusMessage(stringsJa.speechLogExternalClearedLabel)
  }

  async function reloadStoragePaths(): Promise<void> {
    setStoragePaths(await window.chararium.storage.getPaths())
  }

  async function handleSelectModel(modelId: string): Promise<void> {
    const targetModel = models.find((model) => model.id === modelId)
    if (!targetModel) return
    await updateSettings({ selectedCharacterModelId: targetModel.id, characterRendererType: getRendererTypeFromModelFormat(targetModel.format) })
  }

  async function handleAddResponseEntry(entry: {
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
    lifestyleProfile?: import('@shared/index').ResponseLifestyleProfile
    mascotType?: import('@shared/index').ResponseMascotType
    character?: import('@shared/index').ResponseCharacterVoiceProfile
  }): Promise<void> { setResponseLibrary(await window.chararium.responseLibrary.addEntry({ entry })) }

  async function handleUpdateResponseEntry(
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
      lifestyleProfile?: import('@shared/index').ResponseLifestyleProfile
      mascotType?: import('@shared/index').ResponseMascotType
      character?: import('@shared/index').ResponseCharacterVoiceProfile
    }>
  ): Promise<void> { setResponseLibrary(await window.chararium.responseLibrary.updateEntry({ entryId, patch })) }

  function buildStorageStatusMessage(result: IStorageOperationResult, baseSuccessLabel: string, baseFailedLabel: string): string {
    const base = result.success ? baseSuccessLabel : baseFailedLabel
    const copy = result.copyResults
    if (!copy) return base

    const settingsState = copy.settingsCopied
      ? stringsJa.storageSettingsCopiedLabel
      : copy.settingsMissingAtSource
        ? stringsJa.storageSettingsWillBeGeneratedLabel
        : stringsJa.storageCopySkippedLabel
    const responsesState = copy.responsesCopied
      ? stringsJa.storageResponsesCopiedLabel
      : copy.responsesMissingAtSource
        ? stringsJa.storageResponsesWillBeGeneratedLabel
        : stringsJa.storageCopySkippedLabel

    return `${base}\n${settingsState}\n${responsesState}`
  }

  async function handleDeleteResponseEntry(entryId: string): Promise<void> { setResponseLibrary(await window.chararium.responseLibrary.deleteEntry({ entryId })) }
  async function handleToggleResponseCategoryEnabled(categoryId: string, enabled: boolean): Promise<void> { setResponseLibrary(await window.chararium.responseLibrary.toggleCategoryEnabled({ categoryId, enabled })) }
  async function handleResetResponseLibrary(): Promise<void> { setResponseLibrary(await window.chararium.responseLibrary.reset()) }

  function buildImportResultMessage(result: IImportResponseLibraryResult, isReplace: boolean): string {
    if (isReplace) {
      return stringsJa.responseImportReplaceSuccessLabel
        .replace('{categories}', String(result.library.categories.length))
        .replace('{entries}', String(result.library.entries.length))
    }
    return stringsJa.responseImportMergeSuccessLabel
      .replace('{addedCategories}', String(result.addedCategoryCount))
      .replace('{skippedCategories}', String(result.skippedCategoryCount))
      .replace('{addedEntries}', String(result.addedEntryCount))
      .replace('{skippedEntries}', String(result.skippedEntryCount))
  }

  async function handleExportResponseLibrary(): Promise<void> {
    try {
      const result = await window.chararium.responseLibrary.export()
      setResponseLibraryManageMessage(
        stringsJa.responseExportSuccessLabel.replace('{path}', result.filePath)
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('cancelled')) {
        setResponseLibraryManageMessage(stringsJa.responseImportExportCancelledLabel)
        return
      }
      setResponseLibraryManageMessage(stringsJa.responseExportFailedLabel)
    }
  }

  async function handleImportResponseLibraryMerge(): Promise<void> {
    try {
      const result = await window.chararium.responseLibrary.import({ mode: 'merge' })
      setResponseLibrary(result.library)
      setResponseLibraryManageMessage(buildImportResultMessage(result, false))
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('cancelled')) {
        setResponseLibraryManageMessage(stringsJa.responseImportExportCancelledLabel)
        return
      }
      setResponseLibraryManageMessage(stringsJa.responseImportFailedLabel)
    }
  }

  async function handleImportResponseLibraryReplace(): Promise<void> {
    try {
      const result = await window.chararium.responseLibrary.import({ mode: 'replace' })
      setResponseLibrary(result.library)
      setResponseLibraryManageMessage(buildImportResultMessage(result, true))
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('cancelled')) {
        setResponseLibraryManageMessage(stringsJa.responseImportExportCancelledLabel)
        return
      }
      setResponseLibraryManageMessage(stringsJa.responseImportFailedLabel)
    }
  }
  async function handleTryRandomResponse(trigger: ResponseTrigger): Promise<void> {
    lastInteractionAtRef.current = Date.now()
    setMessage(
      await window.chararium.responseLibrary.getRandomResponse({
        trigger,
        lifestyleProfile: appSettings.lifestyleProfile,
        mascotType: appSettings.mascotType,
        characterVoiceProfile: appSettings.characterVoiceProfile
      })
    )
    await reloadSpeechLogs()
  }

  async function handleSelectAndChangeStorageDirectory(): Promise<void> {
    const selectedPath = await window.chararium.storage.selectUserDataDirectory()
    if (!selectedPath) {
      setStorageStatusMessage(stringsJa.storageCancelledLabel)
      return
    }
    const result = await window.chararium.storage.changeUserDataDirectory({ userDataDirectory: selectedPath })
    setStoragePaths(result.paths)
    setStorageStatusMessage(buildStorageStatusMessage(result, stringsJa.storageChangedLabel, stringsJa.storageFailedLabel))
  }

  async function handleUseProjectStorageDirectory(): Promise<void> {
    const result = await window.chararium.storage.useProjectUserDataDirectory()
    setStoragePaths(result.paths)
    setStorageStatusMessage(buildStorageStatusMessage(result, stringsJa.storageChangedLabel, stringsJa.storageFailedLabel))
  }

  async function handleResetStorageDirectory(): Promise<void> {
    const result = await window.chararium.storage.resetUserDataDirectory()
    setStoragePaths(result.paths)
    setStorageStatusMessage(buildStorageStatusMessage(result, stringsJa.storageResetLabel, stringsJa.storageFailedLabel))
  }

  async function handleOpenStorageDirectory(): Promise<void> {
    const result = await window.chararium.storage.openUserDataDirectory()
    setStorageStatusMessage(result.success ? result.message : stringsJa.storageFailedLabel)
  }

  async function handleSelectSpeechLogDirectory(): Promise<void> {
    const selectedPath = await window.chararium.speechLog.selectDirectory()
    if (!selectedPath) {
      setDeveloperStatusMessage(stringsJa.storageCancelledLabel)
      return
    }
    await updateSettings({ speechLogDirectory: selectedPath })
    setDeveloperStatusMessage(stringsJa.storageChangedLabel)
  }

  async function handleOpenSpeechLogDirectory(): Promise<void> {
    const opened = await window.chararium.speechLog.openDirectory()
    setDeveloperStatusMessage(opened ? stringsJa.storageChangedLabel : stringsJa.speechLogOpenDirectoryFailedLabel)
  }

  const characterRendererOptions = useMemo(() => characterRendererInfos.map((info) => ({
    type: info.type,
    label: stringsJa.characterRendererNames[info.type],
    description: stringsJa.characterRendererDescriptions[info.type]
  })), [])

  const mascotDragModeOptions = useMemo(() => [
    { value: 'modifier-ctrl-or-shift' as const, label: stringsJa.mascotDragModeCtrlOrShift },
    { value: 'modifier-ctrl' as const, label: stringsJa.mascotDragModeCtrl },
    { value: 'modifier-shift' as const, label: stringsJa.mascotDragModeShift },
    { value: 'transparent-drag-area' as const, label: stringsJa.mascotDragModeTransparentArea },
    { value: 'disabled' as const, label: stringsJa.mascotDragModeDisabled }
  ], [])
  const mascotSizeOptions = useMemo(() => [
    { value: 'small' as const, label: stringsJa.mascotSizeSmallLabel },
    { value: 'medium' as const, label: stringsJa.mascotSizeMediumLabel },
    { value: 'large' as const, label: stringsJa.mascotSizeLargeLabel },
    { value: 'custom' as const, label: stringsJa.mascotSizeCustomLabel }
  ], [])
  const mascotAreaSizeOptions = useMemo(() => [
    { value: 'small' as const, label: stringsJa.mascotAreaSizeSmallLabel },
    { value: 'medium' as const, label: stringsJa.mascotAreaSizeMediumLabel },
    { value: 'large' as const, label: stringsJa.mascotAreaSizeLargeLabel },
    { value: 'custom' as const, label: stringsJa.mascotAreaSizeCustomLabel }
  ], [])
  const speechBubblePlacementOptions = useMemo(() => [
    { value: 'auto' as const, label: stringsJa.mascotSpeechBubblePlacementAutoLabel },
    { value: 'top' as const, label: stringsJa.mascotSpeechBubblePlacementTopLabel },
    { value: 'bottom' as const, label: stringsJa.mascotSpeechBubblePlacementBottomLabel },
    { value: 'left' as const, label: stringsJa.mascotSpeechBubblePlacementLeftLabel },
    { value: 'right' as const, label: stringsJa.mascotSpeechBubblePlacementRightLabel }
  ], [])
  const speechBubbleFontFamilyOptions = useMemo(() => [
    { value: 'system' as const, label: stringsJa.mascotSpeechBubbleFontSystemLabel },
    { value: 'sans' as const, label: stringsJa.mascotSpeechBubbleFontSansLabel },
    { value: 'serif' as const, label: stringsJa.mascotSpeechBubbleFontSerifLabel },
    { value: 'rounded' as const, label: stringsJa.mascotSpeechBubbleFontRoundedLabel }
  ], [])
  const speechBubbleWritingModeOptions = useMemo(() => [
    { value: 'horizontal' as const, label: stringsJa.speechBubbleWritingModeHorizontalLabel },
    { value: 'vertical' as const, label: stringsJa.speechBubbleWritingModeVerticalLabel }
  ], [])
  const speechBubbleTailDirectionOptions = useMemo(() => [
    { value: 'auto' as const, label: stringsJa.speechBubbleTailDirectionAutoLabel },
    { value: 'left' as const, label: stringsJa.speechBubbleTailDirectionLeftLabel },
    { value: 'center' as const, label: stringsJa.speechBubbleTailDirectionCenterLabel },
    { value: 'right' as const, label: stringsJa.speechBubbleTailDirectionRightLabel }
  ], [])
  const mascotVerticalAlignOptions = useMemo(() => [
    { value: 'top' as const, label: stringsJa.mascotVerticalAlignTopLabel },
    { value: 'center' as const, label: stringsJa.mascotAlignCenterLabel },
    { value: 'bottom' as const, label: stringsJa.mascotVerticalAlignBottomLabel }
  ], [])
  const mascotHorizontalAlignOptions = useMemo(() => [
    { value: 'left' as const, label: stringsJa.mascotHorizontalAlignLeftLabel },
    { value: 'center' as const, label: stringsJa.mascotAlignCenterLabel },
    { value: 'right' as const, label: stringsJa.mascotHorizontalAlignRightLabel }
  ], [])
  const lifestyleProfileOptions = useMemo(() => [
    { value: 'standard' as const, label: stringsJa.lifestyleProfileStandardLabel },
    { value: 'nightOwl' as const, label: stringsJa.lifestyleProfileNightOwlLabel },
    { value: 'earlyBird' as const, label: stringsJa.lifestyleProfileEarlyBirdLabel },
    { value: 'irregular' as const, label: stringsJa.lifestyleProfileIrregularLabel }
  ], [])
  const mascotTypeOptions = useMemo(() => [
    { value: 'female' as const, label: stringsJa.mascotTypeFemaleLabel },
    { value: 'male' as const, label: stringsJa.mascotTypeMaleLabel },
    { value: 'neutral' as const, label: stringsJa.mascotTypeNeutralLabel },
    { value: 'robot' as const, label: stringsJa.mascotTypeRobotLabel },
    { value: 'creature' as const, label: stringsJa.mascotTypeCreatureLabel },
    { value: 'custom' as const, label: stringsJa.mascotTypeCustomLabel }
  ], [])
  const characterVoiceProfileOptions = useMemo(() => [
    { value: 'standard' as const, label: stringsJa.characterVoiceProfileStandardLabel },
    { value: 'soft_sister' as const, label: stringsJa.characterVoiceProfileSoftSisterLabel },
    { value: 'soft_brother' as const, label: stringsJa.characterVoiceProfileSoftBrotherLabel },
    { value: 'assistant' as const, label: stringsJa.characterVoiceProfileAssistantLabel }
  ], [])
  const speechBubbleFontFamilyCssMap: Record<AppSettings['mascotSpeechBubbleFontFamily'], string> = {
    system: 'system-ui, sans-serif',
    sans: '"Segoe UI", "Hiragino Sans", "Yu Gothic", sans-serif',
    serif: '"Yu Mincho", "Hiragino Mincho ProN", serif',
    rounded: '"Meiryo", "Yu Gothic", sans-serif'
  }

  const selectedModel = useMemo(() => models.find((model) => model.id === appSettings.selectedCharacterModelId), [appSettings.selectedCharacterModelId, models])
  const currentAreaSize = resolveAreaSizeFromSettings(appSettings)
  const draftAreaSize = resolveDraftAreaSize()
  const displaySizeLabelMap: Record<MascotWindowSizePreset, string> = {
    small: stringsJa.mascotSizeSmallLabel,
    medium: stringsJa.mascotSizeMediumLabel,
    large: stringsJa.mascotSizeLargeLabel,
    custom: stringsJa.mascotSizeCustomLabel
  }
  const speechBubbleWritingModeLabelMap: Record<SpeechBubbleWritingMode, string> = {
    horizontal: stringsJa.speechBubbleWritingModeHorizontalLabel,
    vertical: stringsJa.speechBubbleWritingModeVerticalLabel
  }
  const speechBubbleFontFamilyLabelMap: Record<MascotSpeechBubbleFontFamily, string> = {
    system: stringsJa.mascotSpeechBubbleFontSystemLabel,
    sans: stringsJa.mascotSpeechBubbleFontSansLabel,
    serif: stringsJa.mascotSpeechBubbleFontSerifLabel,
    rounded: stringsJa.mascotSpeechBubbleFontRoundedLabel
  }
  const selectedModelForRenderer = selectedModel && selectedModel.rendererType === appSettings.characterRendererType ? selectedModel : undefined
  const hasPendingRendererChange = draftRendererType !== appSettings.characterRendererType
  const normalizedDraftBubbleWidthMode = draftSpeechBubbleWidthMode ?? 'auto'
  const normalizedAppliedBubbleWidthMode = appSettings.speechBubbleWidthMode ?? 'auto'
  const normalizedDraftBubbleHeightMode = draftSpeechBubbleHeightMode ?? 'auto'
  const normalizedAppliedBubbleHeightMode = appSettings.speechBubbleHeightMode ?? 'auto'
  const hasPendingMascotSizeChanges =
    draftMascotDragMode !== appSettings.mascotDragMode ||
    draftMascotAlwaysOnTop !== appSettings.mascotAlwaysOnTop ||
    draftMascotShowHitArea !== appSettings.mascotShowHitArea ||
    draftMascotClickThroughMode !== appSettings.mascotClickThroughMode ||
    draftMascotDisplaySizePreset !== appSettings.mascotWindowSizePreset ||
    Math.abs(draftMascotDisplayCustomScale - (appSettings.mascotDisplayCustomScale ?? 1.0)) > 0.0001 ||
    draftMascotAreaSizePreset !== appSettings.mascotWindowAreaSizePreset ||
    draftAreaSize.width !== currentAreaSize.width ||
    draftAreaSize.height !== currentAreaSize.height ||
    draftSpeechBubblePlacement !== appSettings.mascotSpeechBubblePlacement ||
    clamp(draftSpeechBubbleOffsetX, -200, 200) !== appSettings.mascotSpeechBubbleOffsetX ||
    clamp(draftSpeechBubbleOffsetY, -200, 200) !== appSettings.mascotSpeechBubbleOffsetY ||
    clamp(draftSpeechBubbleTailOffsetX, -200, 200) !== appSettings.speechBubbleTailOffsetX ||
    clamp(draftSpeechBubbleTailOffsetY, -200, 200) !== appSettings.speechBubbleTailOffsetY ||
    clamp(draftSpeechBubbleTailSize, 4, 40) !== appSettings.speechBubbleTailSize ||
    clamp(draftSpeechBubbleTailRotationDeg, -90, 90) !== appSettings.speechBubbleTailRotationDeg ||
    draftSpeechBubbleTailDirection !== (appSettings.speechBubbleTailDirection ?? 'auto') ||
    draftSpeechBubbleTailMirrored !== (appSettings.speechBubbleTailMirrored ?? false) ||
    draftSpeechBubbleBorderEnabled !== appSettings.speechBubbleBorderEnabled ||
    clamp(draftSpeechBubbleBorderWidth, 0, 8) !== appSettings.speechBubbleBorderWidth ||
    normalizedDraftBubbleWidthMode !== normalizedAppliedBubbleWidthMode ||
    normalizedDraftBubbleHeightMode !== normalizedAppliedBubbleHeightMode ||
    (normalizedDraftBubbleWidthMode === 'custom' &&
      clamp(draftSpeechBubbleMaxWidth, 80, 800) !== clamp(appSettings.speechBubbleMaxWidth, 80, 800)) ||
    (normalizedDraftBubbleHeightMode === 'custom' &&
      clamp(draftSpeechBubbleMaxHeight, 40, 800) !== clamp(appSettings.speechBubbleMaxHeight, 40, 800)) ||
    clamp(draftSpeechBubbleFontSize, 10, 24) !== appSettings.mascotSpeechBubbleFontSize ||
    draftSpeechBubbleFontFamily !== appSettings.mascotSpeechBubbleFontFamily ||
    draftSpeechBubbleWritingMode !== appSettings.speechBubbleWritingMode ||
    draftMascotVerticalAlign !== appSettings.mascotVerticalAlign ||
    draftMascotHorizontalAlign !== appSettings.mascotHorizontalAlign ||
    clamp(draftMascotOffsetX, -200, 200) !== appSettings.mascotOffsetX ||
    clamp(draftMascotOffsetY, -200, 200) !== appSettings.mascotOffsetY ||
    draftLifestyleProfile !== appSettings.lifestyleProfile ||
    draftMascotType !== appSettings.mascotType ||
    draftCharacterVoiceProfile !== appSettings.characterVoiceProfile ||
    draftAutoIdleSpeechEnabled !== appSettings.autoIdleSpeechEnabled ||
    clamp(draftAutoIdleSpeechMinMinutes, 1, 120) !== clamp(appSettings.autoIdleSpeechMinMinutes, 1, 120) ||
    clamp(draftAutoIdleSpeechMaxMinutes, 1, 120) !== clamp(appSettings.autoIdleSpeechMaxMinutes, 1, 120) ||
    clamp(draftAutoIdleSpeechAfterInteractionDelaySeconds, 0, 3600) !== clamp(appSettings.autoIdleSpeechAfterInteractionDelaySeconds, 0, 3600)
  const settingsWarnings = useMemo(() => {
    const warnings: string[] = []
    if (selectedModel?.format === 'vrm' && appSettings.characterRendererType !== '3d') warnings.push(stringsJa.warningVrmNeeds3DRenderer)
    if (selectedModel?.format === 'live2d-model3-json' && appSettings.characterRendererType !== 'live2d') warnings.push(stringsJa.warningLive2DNeedsLive2DRenderer)
    if (appSettings.characterRendererType === '3d' && (!selectedModel || selectedModel.rendererType !== '3d')) warnings.push(stringsJa.warning3DRendererNeeds3DModel)
    return warnings
  }, [appSettings.characterRendererType, selectedModel])

  if (windowVariant === 'mascot') {
    return (
      <MascotWindowView
        appSettings={appSettings}
        message={message}
        messageSource={messageSource}
        rendererSelectedModel={selectedModelForRenderer}
        onBubbleInteract={handleElementInteractionClick}
        onCharacterInteract={handleElementInteractionClick}
        strings={{
          mascotPlaceholder: stringsJa.mascotPlaceholder,
          characterRendererNames: stringsJa.characterRendererNames,
          characterRendererDescriptions: stringsJa.characterRendererDescriptions,
          live2DPreparingMessage: stringsJa.live2DPreparingMessage,
          threeDPreparingMessage: stringsJa.threeDPreparingMessage,
          modelFormatLabel: stringsJa.modelFormatLabel,
          supportedPlannedLabel: stringsJa.supportedPlannedLabel,
          rendererSupportedFormats: stringsJa.rendererSupportedFormats,
          selectedModelLabel: stringsJa.selectedModelLabel,
          modelNotSelectedLabel: stringsJa.modelNotSelectedLabel,
          modelPathLabel: stringsJa.modelPathLabel,
          modelFormatNames: stringsJa.modelFormatNames,
          vrmLoadingLabel: stringsJa.vrmLoadingLabel,
          vrmLoadErrorTitle: stringsJa.vrmLoadErrorTitle,
          vrmLoadErrorHint: stringsJa.vrmLoadErrorHint,
          threeDRenderingLabel: stringsJa.threeDRenderingLabel,
          modelNotSelected3DLabel: stringsJa.modelNotSelected3DLabel,
          unsupported3DFormatLabel: stringsJa.unsupported3DFormatLabel
        }}
      />
    )
  }

  return (
    <main className="app-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">{stringsJa.appName}</p>
          <h1>{stringsJa.appName}</h1>
          <p>{stringsJa.appDescription}</p>
        </div>
        <div className="hero-actions">
          <div className="meta-card"><span>{stringsJa.currentModeLabel}</span><strong>{stringsJa.modeNames[activeMode]}</strong></div>
          <div className="meta-card"><span>{stringsJa.currentThemeLabel}</span><strong>{stringsJa.themeNames[theme]}</strong></div>
          <button type="button" className="secondary-button" onClick={handleThemeToggle}>{stringsJa.themeToggleLabel}</button>
        </div>
      </section>

      <MainTabs
        activeTab={activeMainTab}
        onChangeTab={setActiveMainTab}
        labels={{
          dashboard: stringsJa.mainTabDashboard,
          mascot: stringsJa.mainTabMascot,
          responses: stringsJa.mainTabResponses,
          models: stringsJa.mainTabModels,
          settings: stringsJa.mainTabSettings,
          developer: stringsJa.mainTabDeveloper
        }}
      />

      {activeMainTab === 'dashboard' ? (
        <DashboardPanel
          title={stringsJa.mainTabDashboard}
          currentStateLabel={stringsJa.dashboardCurrentState}
          currentModeLabel={stringsJa.currentModeLabel}
          rendererTypeLabel={stringsJa.rendererTypeLabel}
          selectedModelLabel={stringsJa.selectedModelLabel}
          themeLabel={stringsJa.currentThemeLabel}
          alwaysOnTopLabel={stringsJa.mascotAlwaysOnTopLabel}
          focusableLabel={stringsJa.mascotFocusableLabel}
          dragModeLabel={stringsJa.mascotDragModeLabel}
          hourlyChimeLabel={stringsJa.hourlyChimeEnabledLabel}
          mascotSizeLabel={stringsJa.currentMascotAreaSizeLabel}
          mascotDisplaySizeLabel={stringsJa.currentMascotDisplaySizeLabel}
          lifestyleProfileLabel={stringsJa.lifestyleProfileLabel}
          mascotTypeLabel={stringsJa.mascotTypeLabel}
          lifestyleProfileNames={{
            standard: stringsJa.lifestyleProfileStandardLabel,
            nightOwl: stringsJa.lifestyleProfileNightOwlLabel,
            earlyBird: stringsJa.lifestyleProfileEarlyBirdLabel,
            irregular: stringsJa.lifestyleProfileIrregularLabel
          }}
          mascotTypeNames={{
            female: stringsJa.mascotTypeFemaleLabel,
            male: stringsJa.mascotTypeMaleLabel,
            neutral: stringsJa.mascotTypeNeutralLabel,
            robot: stringsJa.mascotTypeRobotLabel,
            creature: stringsJa.mascotTypeCreatureLabel,
            custom: stringsJa.mascotTypeCustomLabel
          }}
          currentTimeLabel={stringsJa.currentTimeLabel}
          timeZoneLabel={stringsJa.timeZoneLabel}
          timeZoneUnknownLabel={stringsJa.timeZoneUnknownLabel}
          localTimeNoticeLabel={stringsJa.localTimeNoticeLabel}
          currentTimeBandLabel={stringsJa.currentTimeBandLabel}
          openResponsesLabel={stringsJa.dashboardOpenResponses}
          openModelsLabel={stringsJa.dashboardOpenModels}
          openMascotLabel={stringsJa.dashboardOpenMascot}
          openDeveloperLabel={stringsJa.dashboardOpenDeveloper}
          modeName={stringsJa.modeNames[activeMode]}
          theme={theme}
          appSettings={appSettings}
          selectedModel={selectedModel}
          timeBandNames={stringsJa.timeBandNames}
          rendererNames={stringsJa.characterRendererNames}
          dragModeNames={{
            'modifier-ctrl-or-shift': stringsJa.mascotDragModeCtrlOrShift,
            'modifier-ctrl': stringsJa.mascotDragModeCtrl,
            'modifier-shift': stringsJa.mascotDragModeShift,
            'transparent-drag-area': stringsJa.mascotDragModeTransparentArea,
            disabled: stringsJa.mascotDragModeDisabled
          }}
          mascotSizePresetNames={{
            small: stringsJa.mascotAreaSizeSmallLabel,
            medium: stringsJa.mascotAreaSizeMediumLabel,
            large: stringsJa.mascotAreaSizeLargeLabel,
            custom: stringsJa.mascotAreaSizeCustomLabel
          }}
          mascotDisplaySizePresetNames={{
            small: stringsJa.mascotSizeSmallLabel,
            medium: stringsJa.mascotSizeMediumLabel,
            large: stringsJa.mascotSizeLargeLabel,
            custom: stringsJa.mascotSizeCustomLabel
          }}
          onOpenResponses={() => setActiveMainTab('responses')}
          onOpenModels={() => setActiveMainTab('models')}
          onOpenMascot={() => setActiveMainTab('mascot')}
          onOpenDeveloper={() => setActiveMainTab('developer')}
        />
      ) : null}

      {activeMainTab === 'mascot' ? (
        <MascotSettingsPanel
          title={stringsJa.mainTabMascot}
          sectionMascotDisplayTitle={stringsJa.mascotSectionDisplayTitle}
          sectionClickThroughTitle={stringsJa.mascotSectionClickThroughTitle}
          sectionDisplaySizeTitle={stringsJa.mascotSectionDisplaySizeTitle}
          sectionAreaSizeTitle={stringsJa.mascotSectionAreaSizeTitle}
          sectionLayoutTitle={stringsJa.mascotSectionLayoutTitle}
          sectionPendingTitle={stringsJa.mascotSectionPendingTitle}
          sectionApplyResultTitle={stringsJa.mascotSectionApplyResultTitle}
          sectionPreviewTitle={stringsJa.mascotSectionPreviewTitle}
          sectionCurrentValuesTitle={stringsJa.mascotSectionCurrentValuesTitle}
          sectionEditingValuesTitle={stringsJa.mascotSectionEditingValuesTitle}
          rendererTitle={stringsJa.characterRendererSectionTitle}
          rendererSelectionLabel={stringsJa.characterRendererSelectionLabel}
          rendererSelectionDescription={stringsJa.characterRendererSelectionDescription}
          applyRendererButtonLabel={stringsJa.applyRendererTypeButtonLabel}
          currentRendererLabel={stringsJa.currentRendererTypeLabel}
          pendingChangesLabel={stringsJa.unappliedRendererChangeLabel}
          hasPendingRendererChange={hasPendingRendererChange}
          warnings={settingsWarnings}
          rendererOptions={characterRendererOptions}
          draftRendererType={draftRendererType}
          appliedRendererType={appSettings.characterRendererType}
          onDraftRendererChange={setDraftRendererType}
          onApplyRenderer={() => void updateSettings({ characterRendererType: draftRendererType })}
          dragModeLabel={stringsJa.mascotDragModeLabel}
          dragModeDescription={stringsJa.mascotDragModeDescription}
          dragModeWarning={stringsJa.mascotDragModeTransparentWarning}
          dragModeOptions={mascotDragModeOptions}
          dragMode={draftMascotDragMode}
          onDragModeChange={setDraftMascotDragMode}
          alwaysOnTopLabel={stringsJa.mascotAlwaysOnTopLabel}
          alwaysOnTopDescription={stringsJa.mascotAlwaysOnTopDescription}
          alwaysOnTop={draftMascotAlwaysOnTop}
          onToggleAlwaysOnTop={setDraftMascotAlwaysOnTop}
          showHitAreaLabel={stringsJa.mascotShowHitAreaLabel}
          showHitAreaDescription={stringsJa.mascotShowHitAreaDescription}
          showHitArea={draftMascotShowHitArea}
          onToggleShowHitArea={setDraftMascotShowHitArea}
          clickThroughModeLabel={stringsJa.mascotClickThroughModeLabel}
          clickThroughModeDescription={stringsJa.mascotClickThroughModeDescription}
          clickThroughModeWarning={stringsJa.mascotClickThroughModeWarning}
          clickThroughMode={draftMascotClickThroughMode}
          clickThroughModeOptions={[
            { value: 'off', label: stringsJa.mascotClickThroughModeOff },
            { value: 'always', label: stringsJa.mascotClickThroughModeAlways },
            { value: 'whileHoldingModifier', label: stringsJa.mascotClickThroughModeWhileHoldingModifier }
          ]}
          onClickThroughModeChange={setDraftMascotClickThroughMode}
          displaySizeLabel={stringsJa.mascotDisplaySizeLabel}
          displaySizeDescription={stringsJa.mascotDisplaySizeDescription}
          currentDisplaySizePreset={appSettings.mascotWindowSizePreset}
          draftDisplaySizePreset={draftMascotDisplaySizePreset}
          displaySizeOptions={mascotSizeOptions}
          onDraftDisplaySizePresetChange={setDraftMascotDisplaySizePreset}
          displayScaleLabel={stringsJa.mascotDisplayScaleLabel}
          displayScaleDescription={stringsJa.mascotDisplayScaleDescription}
          displayScaleValidationLabel={stringsJa.mascotDisplayScaleValidationLabel}
          currentDisplayScaleLabel={stringsJa.currentDisplayScaleLabel}
          editingDisplayScaleLabel={stringsJa.editingDisplayScaleLabel}
          currentDisplayCustomScale={appSettings.mascotDisplayCustomScale ?? 1.0}
          draftDisplayCustomScale={draftMascotDisplayCustomScale}
          onDraftDisplayCustomScaleChange={setDraftMascotDisplayCustomScale}
          displayScaleErrorMessage={mascotDisplayScaleErrorMessage}
          areaSizeLabel={stringsJa.mascotAreaSizeLabel}
          areaSizeDescription={stringsJa.mascotAreaSizeDescription}
          currentAreaSizePreset={appSettings.mascotWindowAreaSizePreset}
          draftAreaSizePreset={draftMascotAreaSizePreset}
          areaSizeOptions={mascotAreaSizeOptions}
          onDraftAreaSizePresetChange={setDraftMascotAreaSizePreset}
          customWidthLabel={stringsJa.mascotSizeWidthLabel}
          customHeightLabel={stringsJa.mascotSizeHeightLabel}
          currentAreaWidth={currentAreaSize.width}
          currentAreaHeight={currentAreaSize.height}
          draftAreaWidth={draftAreaSize.width}
          draftAreaHeight={draftAreaSize.height}
          onDraftAreaWidthChange={setDraftMascotAreaWidth}
          onDraftAreaHeightChange={setDraftMascotAreaHeight}
          speechBubblePlacementLabel={stringsJa.mascotSpeechBubblePlacementLabel}
          speechBubblePlacementDescription={stringsJa.mascotSpeechBubblePlacementDescription}
          speechBubblePlacementOptions={speechBubblePlacementOptions}
          draftSpeechBubblePlacement={draftSpeechBubblePlacement}
          onDraftSpeechBubblePlacementChange={setDraftSpeechBubblePlacement}
          speechBubbleOffsetLabel={stringsJa.mascotSpeechBubbleOffsetLabel}
          speechBubbleOffsetXLabel={stringsJa.mascotSpeechBubbleOffsetXLabel}
          speechBubbleOffsetYLabel={stringsJa.mascotSpeechBubbleOffsetYLabel}
          speechBubbleOffsetXDescription={stringsJa.mascotOffsetXDirectionDescription}
          speechBubbleOffsetYDescription={stringsJa.mascotOffsetYDirectionDescription}
          draftSpeechBubbleOffsetX={draftSpeechBubbleOffsetX}
          draftSpeechBubbleOffsetY={draftSpeechBubbleOffsetY}
          onDraftSpeechBubbleOffsetXChange={setDraftSpeechBubbleOffsetX}
          onDraftSpeechBubbleOffsetYChange={setDraftSpeechBubbleOffsetY}
          speechBubbleFontSizeLabel={stringsJa.mascotSpeechBubbleFontSizeLabel}
          speechBubbleFontSizeDescription={stringsJa.mascotSpeechBubbleFontSizeDescription}
          speechBubbleFontSizeValidationLabel={stringsJa.mascotSpeechBubbleFontSizeValidationLabel}
          draftSpeechBubbleFontSize={draftSpeechBubbleFontSize}
          onDraftSpeechBubbleFontSizeChange={setDraftSpeechBubbleFontSize}
          speechBubbleFontFamilyLabel={stringsJa.mascotSpeechBubbleFontFamilyLabel}
          speechBubbleFontFamilyOptions={speechBubbleFontFamilyOptions}
          draftSpeechBubbleFontFamily={draftSpeechBubbleFontFamily}
          onDraftSpeechBubbleFontFamilyChange={setDraftSpeechBubbleFontFamily}
          speechBubbleWritingModeLabel={stringsJa.speechBubbleWritingModeLabel}
          speechBubbleWritingModeOptions={speechBubbleWritingModeOptions}
          draftSpeechBubbleWritingMode={draftSpeechBubbleWritingMode}
          onDraftSpeechBubbleWritingModeChange={setDraftSpeechBubbleWritingMode}
          speechBubbleTailOffsetLabel={stringsJa.speechBubbleTailOffsetLabel}
          speechBubbleTailOffsetXLabel={stringsJa.speechBubbleTailOffsetXLabel}
          speechBubbleTailOffsetYLabel={stringsJa.speechBubbleTailOffsetYLabel}
          speechBubbleSizeLabel={stringsJa.speechBubbleSizeLabel}
          speechBubbleWidthModeLabel={stringsJa.speechBubbleWidthModeLabel}
          speechBubbleHeightModeLabel={stringsJa.speechBubbleHeightModeLabel}
          speechBubbleAutoLabel={stringsJa.autoLabel}
          speechBubbleCustomLabel={stringsJa.customLabel}
          speechBubbleWidthLabel={stringsJa.speechBubbleWidthLabel}
          speechBubbleHeightLabel={stringsJa.speechBubbleHeightLabel}
          speechBubbleWidthAutoDescription={stringsJa.speechBubbleWidthAutoDescription}
          speechBubbleHeightAutoDescription={stringsJa.speechBubbleHeightAutoDescription}
          speechBubbleCustomHintLabel={stringsJa.speechBubbleCustomHintLabel}
          speechBubbleSizeDescription={stringsJa.speechBubbleSizeDescription}
          speechBubbleTailSizeLabel={stringsJa.speechBubbleTailSizeLabel}
          speechBubbleTailSizeDescription={stringsJa.speechBubbleTailSizeDescription}
          speechBubbleTailRotationLabel={stringsJa.speechBubbleTailRotationLabel}
          speechBubbleTailRotationDescription={stringsJa.speechBubbleTailRotationDescription}
          speechBubbleTailDirectionLabel={stringsJa.speechBubbleTailDirectionLabel}
          speechBubbleTailDirectionDescription={stringsJa.speechBubbleTailDirectionDescription}
          speechBubbleTailDirectionOptions={speechBubbleTailDirectionOptions}
          speechBubbleTailMirroredLabel={stringsJa.speechBubbleTailMirroredLabel}
          speechBubbleTailMirroredDescription={stringsJa.speechBubbleTailMirroredDescription}
          speechBubbleBorderEnabledLabel={stringsJa.speechBubbleBorderEnabledLabel}
          speechBubbleBorderWidthLabel={stringsJa.speechBubbleBorderWidthLabel}
          borderOnLabel={stringsJa.enabledLabel}
          borderOffLabel={stringsJa.disabledLabel}
          draftSpeechBubbleTailOffsetX={draftSpeechBubbleTailOffsetX}
          draftSpeechBubbleTailOffsetY={draftSpeechBubbleTailOffsetY}
          draftSpeechBubbleWidthMode={draftSpeechBubbleWidthMode}
          draftSpeechBubbleHeightMode={draftSpeechBubbleHeightMode}
          draftSpeechBubbleMaxWidth={draftSpeechBubbleMaxWidth}
          draftSpeechBubbleMaxHeight={draftSpeechBubbleMaxHeight}
          draftSpeechBubbleTailSize={draftSpeechBubbleTailSize}
          draftSpeechBubbleTailRotationDeg={draftSpeechBubbleTailRotationDeg}
          draftSpeechBubbleTailDirection={draftSpeechBubbleTailDirection}
          draftSpeechBubbleTailMirrored={draftSpeechBubbleTailMirrored}
          draftSpeechBubbleBorderEnabled={draftSpeechBubbleBorderEnabled}
          draftSpeechBubbleBorderWidth={draftSpeechBubbleBorderWidth}
          onDraftSpeechBubbleTailOffsetXChange={setDraftSpeechBubbleTailOffsetX}
          onDraftSpeechBubbleTailOffsetYChange={setDraftSpeechBubbleTailOffsetY}
          onDraftSpeechBubbleWidthModeChange={setDraftSpeechBubbleWidthMode}
          onDraftSpeechBubbleHeightModeChange={setDraftSpeechBubbleHeightMode}
          onDraftSpeechBubbleMaxWidthChange={setDraftSpeechBubbleMaxWidth}
          onDraftSpeechBubbleMaxHeightChange={setDraftSpeechBubbleMaxHeight}
          onDraftSpeechBubbleTailSizeChange={setDraftSpeechBubbleTailSize}
          onDraftSpeechBubbleTailRotationDegChange={setDraftSpeechBubbleTailRotationDeg}
          onDraftSpeechBubbleTailDirectionChange={setDraftSpeechBubbleTailDirection}
          onDraftSpeechBubbleTailMirroredChange={setDraftSpeechBubbleTailMirrored}
          onDraftSpeechBubbleBorderEnabledChange={setDraftSpeechBubbleBorderEnabled}
          onDraftSpeechBubbleBorderWidthChange={setDraftSpeechBubbleBorderWidth}
          mascotVerticalAlignLabel={stringsJa.mascotVerticalAlignLabel}
          mascotHorizontalAlignLabel={stringsJa.mascotHorizontalAlignLabel}
          mascotAlignDescription={stringsJa.mascotAlignDescription}
          mascotVerticalAlignOptions={mascotVerticalAlignOptions}
          mascotHorizontalAlignOptions={mascotHorizontalAlignOptions}
          draftMascotVerticalAlign={draftMascotVerticalAlign}
          draftMascotHorizontalAlign={draftMascotHorizontalAlign}
          onDraftMascotVerticalAlignChange={setDraftMascotVerticalAlign}
          onDraftMascotHorizontalAlignChange={setDraftMascotHorizontalAlign}
          mascotOffsetLabel={stringsJa.mascotOffsetLabel}
          mascotOffsetXLabel={stringsJa.mascotOffsetXLabel}
          mascotOffsetYLabel={stringsJa.mascotOffsetYLabel}
          mascotOffsetXDescription={stringsJa.mascotOffsetXDirectionDescription}
          mascotOffsetYDescription={stringsJa.mascotOffsetYDirectionDescription}
          draftMascotOffsetX={draftMascotOffsetX}
          draftMascotOffsetY={draftMascotOffsetY}
          onDraftMascotOffsetXChange={setDraftMascotOffsetX}
          onDraftMascotOffsetYChange={setDraftMascotOffsetY}
          lifestyleProfileLabel={stringsJa.lifestyleProfileLabel}
          lifestyleProfileDescription={stringsJa.lifestyleProfileDescription}
          lifestyleProfileOptions={lifestyleProfileOptions}
          draftLifestyleProfile={draftLifestyleProfile}
          onDraftLifestyleProfileChange={setDraftLifestyleProfile}
          characterVoiceProfileLabel={stringsJa.characterVoiceProfileLabel}
          characterVoiceProfileDescription={stringsJa.characterVoiceProfileDescription}
          characterVoiceProfileOptions={characterVoiceProfileOptions}
          draftCharacterVoiceProfile={draftCharacterVoiceProfile}
          onDraftCharacterVoiceProfileChange={setDraftCharacterVoiceProfile}
          autoIdleSpeechEnabledLabel={stringsJa.autoIdleSpeechEnabledLabel}
          autoIdleSpeechEnabledDescription={stringsJa.autoIdleSpeechEnabledDescription}
          autoIdleSpeechMinMinutesLabel={stringsJa.autoIdleSpeechMinMinutesLabel}
          autoIdleSpeechMaxMinutesLabel={stringsJa.autoIdleSpeechMaxMinutesLabel}
          autoIdleSpeechAfterInteractionDelaySecondsLabel={stringsJa.autoIdleSpeechAfterInteractionDelaySecondsLabel}
          autoIdleSpeechRangeDescription={stringsJa.autoIdleSpeechRangeDescription}
          draftAutoIdleSpeechEnabled={draftAutoIdleSpeechEnabled}
          draftAutoIdleSpeechMinMinutes={draftAutoIdleSpeechMinMinutes}
          draftAutoIdleSpeechMaxMinutes={draftAutoIdleSpeechMaxMinutes}
          draftAutoIdleSpeechAfterInteractionDelaySeconds={draftAutoIdleSpeechAfterInteractionDelaySeconds}
          onDraftAutoIdleSpeechEnabledChange={setDraftAutoIdleSpeechEnabled}
          onDraftAutoIdleSpeechMinMinutesChange={setDraftAutoIdleSpeechMinMinutes}
          onDraftAutoIdleSpeechMaxMinutesChange={setDraftAutoIdleSpeechMaxMinutes}
          onDraftAutoIdleSpeechAfterInteractionDelaySecondsChange={setDraftAutoIdleSpeechAfterInteractionDelaySeconds}
          mascotTypeLabel={stringsJa.mascotTypeLabel}
          mascotTypeDescription={stringsJa.mascotTypeDescription}
          mascotTypeOptions={mascotTypeOptions}
          draftMascotType={draftMascotType}
          onDraftMascotTypeChange={setDraftMascotType}
          layoutOffsetValidationLabel={stringsJa.mascotLayoutOffsetValidationLabel}
          currentBubblePlacementLabel={stringsJa.currentSpeechBubblePlacementLabel}
          editingBubblePlacementLabel={stringsJa.editingSpeechBubblePlacementLabel}
          currentBubbleFontSizeLabel={stringsJa.currentSpeechBubbleFontSizeLabel}
          editingBubbleFontSizeLabel={stringsJa.editingSpeechBubbleFontSizeLabel}
          currentBubbleTailLabel={stringsJa.currentSpeechBubbleTailLabel}
          editingBubbleTailLabel={stringsJa.editingSpeechBubbleTailLabel}
          currentBubbleBorderLabel={stringsJa.currentSpeechBubbleBorderLabel}
          editingBubbleBorderLabel={stringsJa.editingSpeechBubbleBorderLabel}
          currentMascotAlignLabel={stringsJa.currentMascotAlignLabel}
          editingMascotAlignLabel={stringsJa.editingMascotAlignLabel}
          currentSpeechBubblePlacement={appSettings.mascotSpeechBubblePlacement}
          currentSpeechBubbleFontSize={appSettings.mascotSpeechBubbleFontSize}
          currentSpeechBubbleTailOffsetX={appSettings.speechBubbleTailOffsetX}
          currentSpeechBubbleTailOffsetY={appSettings.speechBubbleTailOffsetY}
          currentSpeechBubbleTailSize={appSettings.speechBubbleTailSize}
          currentSpeechBubbleTailRotationDeg={appSettings.speechBubbleTailRotationDeg}
          currentSpeechBubbleTailDirection={appSettings.speechBubbleTailDirection}
          currentSpeechBubbleTailMirrored={appSettings.speechBubbleTailMirrored}
          currentSpeechBubbleBorderEnabled={appSettings.speechBubbleBorderEnabled}
          currentSpeechBubbleBorderWidth={appSettings.speechBubbleBorderWidth}
          currentSpeechBubbleWritingMode={appSettings.speechBubbleWritingMode}
          currentSpeechBubbleWidthMode={appSettings.speechBubbleWidthMode ?? 'auto'}
          currentSpeechBubbleHeightMode={appSettings.speechBubbleHeightMode ?? 'auto'}
          currentSpeechBubbleMaxWidth={appSettings.speechBubbleMaxWidth}
          currentSpeechBubbleMaxHeight={appSettings.speechBubbleMaxHeight}
          currentSpeechBubbleOffsetX={appSettings.mascotSpeechBubbleOffsetX}
          currentSpeechBubbleOffsetY={appSettings.mascotSpeechBubbleOffsetY}
          currentMascotVerticalAlign={appSettings.mascotVerticalAlign}
          currentMascotHorizontalAlign={appSettings.mascotHorizontalAlign}
          applyMascotViewButtonLabel={stringsJa.applyMascotViewButtonLabel}
          hasPendingSizeChanges={hasPendingMascotSizeChanges}
          pendingSizeChangesLabel={stringsJa.pendingMascotSizeChangesLabel}
          applySizeHelpLabel={stringsJa.mascotApplyHelpLabel}
          resetSectionTitle={stringsJa.mascotResetSectionTitle}
          resetMascotSettingsButtonLabel={stringsJa.mascotResetButtonLabel}
          resetDescriptionLabel={stringsJa.mascotResetDescriptionLabel}
          resetDraftOnlyLabel={stringsJa.mascotResetDraftOnlyLabel}
          resetResultLabel={mascotResetMessage}
          appliedMessageLabel={stringsJa.mascotApplySuccessLabel}
          applyFailedMessageLabel={stringsJa.mascotApplyFailedLabel}
          requestedAreaSizeLabel={stringsJa.requestedAreaSizeLabel}
          actualWindowSizeLabel={stringsJa.actualWindowSizeLabel}
          actualContentSizeLabel={stringsJa.actualContentSizeLabel}
          sizeMismatchLabel={stringsJa.sizeMismatchLabel}
          minSizeConstraintHintLabel={stringsJa.minSizeConstraintHintLabel}
          currentDisplaySizeLabel={stringsJa.currentDisplaySizeLabel}
          currentAreaSizeLabel={stringsJa.currentAreaSizeLabel}
          editingDisplaySizeLabel={stringsJa.editingDisplaySizeLabel}
          editingAreaSizeLabel={stringsJa.editingAreaSizeLabel}
          onApplyMascotView={() => void handleApplyMascotView()}
          onResetMascotDraft={resetMascotDraftSettings}
          isApplyingMascotView={isApplyingMascotView}
          applyResult={mascotViewApplyResult}
          selectedModelText={{
            selectedModelLabel: stringsJa.selectedModelLabel,
            modelNotSelectedLabel: stringsJa.modelNotSelectedLabel,
            modelFormatLabel: stringsJa.modelFormatLabel,
            pathLabel: stringsJa.modelPathLabel,
            formatLabel: stringsJa.modelFormatNames
          }}
          rendererLabel={stringsJa.characterRendererNames}
          placeholderLabel={stringsJa.mascotPlaceholder}
          preparingMessage={{ live2d: stringsJa.live2DPreparingMessage, '3d': stringsJa.threeDPreparingMessage }}
          modelFormatLabel={stringsJa.modelFormatLabel}
          supportedLabel={stringsJa.supportedPlannedLabel}
          modelFormatsText={stringsJa.rendererSupportedFormats}
          selectedModel={selectedModelForRenderer}
          vrmLoadingLabel={stringsJa.vrmLoadingLabel}
          vrmLoadErrorTitle={stringsJa.vrmLoadErrorTitle}
          vrmLoadErrorHint={stringsJa.vrmLoadErrorHint}
          threeDRenderingLabel={stringsJa.threeDRenderingLabel}
          modelNotSelected3DLabel={stringsJa.modelNotSelected3DLabel}
          unsupportedFormatLabel={stringsJa.unsupported3DFormatLabel}
          vrmMotionSettings={{
            idleMotionEnabled: appSettings.vrmIdleMotionEnabled,
            springBoneEnabled: appSettings.vrmSpringBoneEnabled,
            blinkEnabled: appSettings.vrmBlinkEnabled,
            mouthMotionEnabled: appSettings.vrmMouthMotionEnabled,
            isSpeaking: Boolean(message?.trim())
          }}
        />
      ) : null}

      {activeMainTab === 'responses' ? (
        <ResponseLibraryPanel
          title={stringsJa.responseLibraryTitle}
          tabLabels={{ list: stringsJa.responseTabList, add: stringsJa.responseTabAdd, categories: stringsJa.responseTabCategories, time: stringsJa.responseTabTime, speechLog: stringsJa.responseTabSpeechLog, manage: stringsJa.responseTabManage }}
          categoryLabel={stringsJa.responseCategoryLabel}
          categoryListLabel={stringsJa.responseCategoryListLabel}
          responsesListLabel={stringsJa.responseListLabel}
          addResponseLabel={stringsJa.responseAddLabel}
          editResponseLabel={stringsJa.responseEditLabel}
          deleteResponseLabel={stringsJa.responseDeleteLabel}
          enabledLabel={stringsJa.enabledLabel}
          disabledLabel={stringsJa.disabledLabel}
          weightLabel={stringsJa.weightLabel}
          weightDescriptionLabel={stringsJa.weightDescriptionLabel}
          weightInlineHintLabel={stringsJa.easeOfSelectionLabel}
          triggerLabel={stringsJa.triggerLabel}
          timeRangeLabel={stringsJa.timeRangeLabel}
          resetToDefaultLabel={stringsJa.resetResponsesLabel}
          tryConditionLabel={stringsJa.tryCurrentConditionLabel}
          saveLabel={stringsJa.saveLabel}
          reloadLabel={stringsJa.reloadLabel}
          cancelLabel={stringsJa.cancelLabel}
          textLabel={stringsJa.responseTextLabel}
          startHourLabel={stringsJa.startHourLabel}
          endHourLabel={stringsJa.endHourLabel}
          minuteLabel={stringsJa.hourlyMinuteLabel}
          timeInputHintLabel={stringsJa.timeInputHintLabel}
          timeFullDayHintLabel={stringsJa.timeFullDayHintLabel}
          timeStrictFormatHintLabel={stringsJa.timeStrictFormatHintLabel}
          timeSecondsRangeHintLabel={stringsJa.timeSecondsRangeHintLabel}
          invalidTimeFormatLabel={stringsJa.invalidTimeFormatLabel}
          invalidWeightLabel={stringsJa.invalidWeightLabel}
          minuteHintLabel={stringsJa.minuteHintLabel}
          hourlyEveryTopLabel={stringsJa.hourlyEveryTopLabel}
          unsetLabel={stringsJa.unsetLabel}
          allCategoriesLabel={stringsJa.allCategoriesLabel}
          allTriggersLabel={stringsJa.allTriggersLabel}
          confirmResetMessage={stringsJa.confirmResetResponsesMessage}
          confirmDeleteMessage={stringsJa.confirmDeleteResponseMessage}
          currentTimeLabel={stringsJa.currentTimeLabel}
          currentTimeBandLabel={stringsJa.currentTimeBandLabel}
          timeBandRulesLabel={stringsJa.timeBandRulesLabel}
          hourlyTestLabel={stringsJa.hourlyTestLabel}
          hourlyChimeEnabledLabel={stringsJa.hourlyChimeEnabledLabel}
          hourlyChimeQuietHoursLabel={stringsJa.hourlyChimeQuietHoursLabel}
          responseLibraryPathLabel={stringsJa.responseLibraryPathLabel}
          managementNoticeLabel={stringsJa.responseManagementNoticeLabel}
          exportResponsesLabel={stringsJa.responseExportLabel}
          importResponsesMergeLabel={stringsJa.responseImportMergeLabel}
          importResponsesReplaceLabel={stringsJa.responseImportReplaceLabel}
          importResultMessage={responseLibraryManageMessage}
          confirmImportReplaceMessage={stringsJa.responseImportReplaceConfirmMessage}
          speechLogTabLabel={stringsJa.responseTabSpeechLog}
          speechLogReloadLabel={stringsJa.speechLogReloadLabel}
          speechLogClearLabel={stringsJa.speechLogClearLabel}
          speechLogSpokenAtLabel={stringsJa.speechLogSpokenAtLabel}
          speechLogTriggerLabel={stringsJa.speechLogTriggerLabel}
          speechLogResultLabel={stringsJa.speechLogResultLabel}
          speechLogCategoryIdLabel={stringsJa.speechLogCategoryIdLabel}
          speechLogEntryIdLabel={stringsJa.speechLogEntryIdLabel}
          speechLogTextLabel={stringsJa.speechLogTextLabel}
          speechLogCandidateCountLabel={stringsJa.speechLogCandidateCountLabel}
          speechLogTotalWeightLabel={stringsJa.speechLogTotalWeightLabel}
          speechLogSelectedWeightLabel={stringsJa.speechLogSelectedWeightLabel}
          speechLogLifestyleProfileLabel={stringsJa.speechLogLifestyleProfileLabel}
          speechLogMascotTypeLabel={stringsJa.speechLogMascotTypeLabel}
          speechLogTimePeriodLabel={stringsJa.speechLogTimePeriodLabel}
          speechLogReasonLabel={stringsJa.speechLogReasonLabel}
          speechLogLatestOnlyLabel={stringsJa.speechLogLatestOnlyLabel}
          speechLogShowingCountLabel={stringsJa.speechLogShowingCountLabel}
          speechLogRepeatSuppressedLabel={stringsJa.speechLogRepeatSuppressedLabel}
          yesLabel={stringsJa.booleanYesLabel}
          noLabel={stringsJa.booleanNoLabel}
          speechLogResultLabels={{
            spoken: stringsJa.speechLogResultSpoken,
            noCandidate: stringsJa.speechLogResultNoCandidate,
            fallback: stringsJa.speechLogResultFallback,
            skipped: stringsJa.speechLogResultSkipped
          }}
          entriesCountLabel={stringsJa.responseEntriesCountLabel}
          lifestyleProfileLabel={stringsJa.lifestyleProfileLabel}
          mascotTypeLabel={stringsJa.mascotTypeLabel}
          characterVoiceProfileLabel={stringsJa.characterVoiceProfileLabel}
          allProfilesLabel={stringsJa.allProfilesLabel}
          allMascotTypesLabel={stringsJa.allMascotTypesLabel}
          allCharacterVoiceProfilesLabel={stringsJa.allCharacterVoiceProfilesLabel}
          searchKeywordLabel={stringsJa.responseSearchKeywordLabel}
          searchKeywordPlaceholder={stringsJa.responseSearchKeywordPlaceholder}
          searchClearLabel={stringsJa.responseSearchClearLabel}
          matchedCountLabel={stringsJa.responseMatchedCountLabel}
          totalCountLabel={stringsJa.responseTotalCountLabel}
          lifestyleProfileOptions={[
            { value: 'any', label: stringsJa.allLabel },
            { value: 'standard', label: stringsJa.lifestyleProfileStandardLabel },
            { value: 'nightOwl', label: stringsJa.lifestyleProfileNightOwlLabel },
            { value: 'earlyBird', label: stringsJa.lifestyleProfileEarlyBirdLabel },
            { value: 'irregular', label: stringsJa.lifestyleProfileIrregularLabel }
          ]}
          mascotTypeOptions={[
            { value: 'any', label: stringsJa.allLabel },
            { value: 'female', label: stringsJa.mascotTypeFemaleLabel },
            { value: 'male', label: stringsJa.mascotTypeMaleLabel },
            { value: 'neutral', label: stringsJa.mascotTypeNeutralLabel },
            { value: 'robot', label: stringsJa.mascotTypeRobotLabel },
            { value: 'creature', label: stringsJa.mascotTypeCreatureLabel },
            { value: 'custom', label: stringsJa.mascotTypeCustomLabel }
          ]}
          characterVoiceProfileOptions={[
            { value: 'any', label: stringsJa.allLabel },
            { value: 'standard', label: stringsJa.characterVoiceProfileStandardLabel },
            { value: 'soft_sister', label: stringsJa.characterVoiceProfileSoftSisterLabel },
            { value: 'soft_brother', label: stringsJa.characterVoiceProfileSoftBrotherLabel },
            { value: 'assistant', label: stringsJa.characterVoiceProfileAssistantLabel }
          ]}
          triggerLabels={{ click: stringsJa.triggerClick, idle: stringsJa.triggerIdle, hourly: stringsJa.triggerHourly, startup: stringsJa.triggerStartup, manual: stringsJa.triggerManual }}
          addedLabel={stringsJa.responseAddedLabel}
          updatedLabel={stringsJa.responseUpdatedLabel}
          deletedLabel={stringsJa.responseDeletedLabel}
          missingFieldLabel={stringsJa.responseMissingFieldLabel}
          library={responseLibrary}
          speechLogs={speechLogEntries}
          isLoading={isResponseLibraryLoading}
          hourlyChimeEnabled={appSettings.hourlyChimeEnabled}
          hourlyChimeQuietHoursEnabled={appSettings.hourlyChimeQuietHoursEnabled}
          hourlyChimeQuietStartHour={appSettings.hourlyChimeQuietStartHour}
          hourlyChimeQuietEndHour={appSettings.hourlyChimeQuietEndHour}
          onReload={() => void reloadResponseLibrary()}
          onReloadSpeechLogs={() => void reloadSpeechLogs()}
          onClearSpeechLogs={() => void clearSpeechLogs()}
          onReset={() => void handleResetResponseLibrary()}
          onExportLibrary={handleExportResponseLibrary}
          onImportLibraryMerge={handleImportResponseLibraryMerge}
          onImportLibraryReplace={handleImportResponseLibraryReplace}
          onToggleCategoryEnabled={(categoryId, enabled) => void handleToggleResponseCategoryEnabled(categoryId, enabled)}
          onAddEntry={(entry) => void handleAddResponseEntry(entry)}
          onUpdateEntry={(entryId, patch) => void handleUpdateResponseEntry(entryId, patch)}
          onDeleteEntry={(entryId) => void handleDeleteResponseEntry(entryId)}
          onTryRandom={(trigger) => void handleTryRandomResponse(trigger)}
          onToggleHourlyChimeEnabled={(next) => void updateSettings({ hourlyChimeEnabled: next })}
          onToggleHourlyChimeQuietHoursEnabled={(next) => void updateSettings({ hourlyChimeQuietHoursEnabled: next })}
          onChangeHourlyChimeQuietStartHour={(next) => void updateSettings({ hourlyChimeQuietStartHour: next })}
          onChangeHourlyChimeQuietEndHour={(next) => void updateSettings({ hourlyChimeQuietEndHour: next })}
        />
      ) : null}

      {activeMainTab === 'models' ? (
        <ModelManagementSection
          title={stringsJa.modelManagementTitle}
          reloadButtonLabel={stringsJa.reloadModelsButton}
          listTitle={stringsJa.modelsListTitle}
          modelNameLabel={stringsJa.modelNameLabel}
          modelFormatLabel={stringsJa.modelFormatLabel}
          rendererTypeLabel={stringsJa.rendererTypeLabel}
          relativePathLabel={stringsJa.relativePathLabel}
          selectedLabel={stringsJa.selectedLabel}
          selectButtonLabel={stringsJa.selectModelButton}
          emptyTitle={stringsJa.modelsEmptyTitle}
          emptyDescription={stringsJa.modelsEmptyDescription}
          rendererLabel={stringsJa.characterRendererNames}
          formatLabel={stringsJa.modelFormatNames}
          models={models}
          selectedModelId={appSettings.selectedCharacterModelId}
          isLoading={isModelsLoading}
          onReload={() => void handleReloadModels()}
          onSelectModel={(modelId) => void handleSelectModel(modelId)}
        />
      ) : null}

      {activeMainTab === 'settings' ? (
        <>
          <section className="panel">
            <div className="panel-header"><h2>{stringsJa.mainTabSettings}</h2></div>
            <div className="settings-actions">
              <button type="button" className="secondary-button" onClick={handleThemeToggle}>{stringsJa.themeToggleLabel}</button>
            </div>
            <p className="muted">{stringsJa.currentModeLabel}: {stringsJa.modeNames[activeMode]}</p>
            <BubblePreview
              title={stringsJa.bubblePreviewTitle}
              text={message}
              source={messageSource}
              writingMode={draftSpeechBubbleWritingMode}
              placement={draftSpeechBubblePlacement}
              offsetX={draftSpeechBubbleOffsetX}
              offsetY={draftSpeechBubbleOffsetY}
              tailOffsetX={draftSpeechBubbleTailOffsetX}
              tailOffsetY={draftSpeechBubbleTailOffsetY}
              tailSize={draftSpeechBubbleTailSize}
              tailRotationDeg={draftSpeechBubbleTailRotationDeg}
              tailDirection={draftSpeechBubbleTailDirection}
              tailMirrored={draftSpeechBubbleTailMirrored}
              borderEnabled={draftSpeechBubbleBorderEnabled}
              borderWidth={draftSpeechBubbleBorderWidth}
              widthMode={draftSpeechBubbleWidthMode}
              heightMode={draftSpeechBubbleHeightMode}
              maxWidth={draftSpeechBubbleMaxWidth}
              maxHeight={draftSpeechBubbleMaxHeight}
              fontSize={draftSpeechBubbleFontSize}
              fontFamily={speechBubbleFontFamilyCssMap[draftSpeechBubbleFontFamily]}
            />
          </section>
          <StorageLocationPanel
            title={stringsJa.storageLocationTitle}
            storageModeLabel={stringsJa.storageModeLabel}
            portableModeLabel={stringsJa.storageModePortableLabel}
            appRootLabel={stringsJa.appRootLabel}
            userDataRootLabel={stringsJa.userDataRootLabel}
            configDataPathLabel={stringsJa.configDataPathLabel}
            electronDataPathLabel={stringsJa.electronDataPathLabel}
            settingsFileLabel={stringsJa.settingsFileLabel}
            responsesFileLabel={stringsJa.responsesFileLabel}
            bootstrapFileLabel={stringsJa.bootstrapFileLabel}
            electronCurrentUserDataLabel={stringsJa.currentElectronUserDataLabel}
            changeButtonLabel={stringsJa.changeStorageLocationButton}
            openButtonLabel={stringsJa.openStorageLocationButton}
            resetButtonLabel={stringsJa.resetStorageLocationButton}
            reloadButtonLabel={stringsJa.reloadStorageLocationButton}
            useProjectButtonLabel={stringsJa.useProjectUserDataButton}
            changeableGroupTitle={stringsJa.storageGroupChangeable}
            autoResolvedGroupTitle={stringsJa.storageGroupAutoResolved}
            fixedGroupTitle={stringsJa.storageGroupFixed}
            changeableHintLabel={stringsJa.storageChangeableHint}
            autoResolvedHintLabel={stringsJa.storageAutoResolvedHint}
            fixedHintLabel={stringsJa.storageFixedHint}
            copyNoticeLabel={stringsJa.storageCopyNotice}
            nextLaunchNoticeLabel={stringsJa.storageNextLaunchNotice}
            selectFolderHintLabel={stringsJa.storageSelectFolderHint}
            cancelledLabel={stringsJa.storageCancelledLabel}
            changedLabel={stringsJa.storageChangedLabel}
            failedLabel={stringsJa.storageFailedLabel}
            resetDoneLabel={stringsJa.storageResetLabel}
            paths={storagePaths}
            message={storageStatusMessage}
            onReload={() => void reloadStoragePaths()}
            onOpen={() => void handleOpenStorageDirectory()}
            onSelectAndChange={() => void handleSelectAndChangeStorageDirectory()}
            onUseProjectDirectory={() => void handleUseProjectStorageDirectory()}
            onResetDefault={() => void handleResetStorageDirectory()}
          />
        </>
      ) : null}

      {activeMainTab === 'developer' ? (
        <DeveloperToolsPanel
          title={stringsJa.mainTabDeveloper}
          devToolsTitle={stringsJa.devToolsSectionTitle}
          autoOpenLabel={stringsJa.devToolsOpenOnStartupLabel}
          autoOpenDescription={stringsJa.devToolsOpenOnStartupDescription}
          openMainButtonLabel={stringsJa.openMainDevToolsButton}
          openMascotButtonLabel={stringsJa.openMascotDevToolsButton}
          runtimeInfoLabel={stringsJa.runtimeInfoLabel}
          storagePathsTitle={stringsJa.storagePathsTitle}
          storageModeLabel={stringsJa.storageModeLabel}
          appRootLabel={stringsJa.appRootLabel}
          portableModeLabel={stringsJa.storageModePortableLabel}
          userDataRootLabel={stringsJa.userDataRootLabel}
          configDataPathLabel={stringsJa.configDataPathLabel}
          electronDataPathLabel={stringsJa.electronDataPathLabel}
          bootstrapFileLabel={stringsJa.bootstrapFileLabel}
          electronCurrentUserDataLabel={stringsJa.currentElectronUserDataLabel}
          settingsFileLabel={stringsJa.settingsFileLabel}
          responsesFileLabel={stringsJa.responsesFileLabel}
          logsDirectoryLabel={stringsJa.logsDirectoryLabel}
          visibleModelDataTitle={stringsJa.visibleModelDataTitle}
          modelNameLabel={stringsJa.modelNameLabel}
          modelFormatLabel={stringsJa.modelFormatLabel}
          rendererTypeLabel={stringsJa.rendererTypeLabel}
          modelPathLabel={stringsJa.modelPathLabel}
          currentDisplaySizeLabel={stringsJa.currentDisplaySizeLabel}
          currentDisplayScaleLabel={stringsJa.currentDisplayScaleLabel}
          currentAreaSizeLabel={stringsJa.currentAreaSizeLabel}
          currentMascotAlignLabel={stringsJa.currentMascotAlignLabel}
          speechBubbleWritingModeLabel={stringsJa.speechBubbleWritingModeLabel}
          speechBubbleFontFamilyLabel={stringsJa.mascotSpeechBubbleFontFamilyLabel}
          speechBubbleFontSizeLabel={stringsJa.mascotSpeechBubbleFontSizeLabel}
          speechBubbleTailConfigLabel={stringsJa.currentSpeechBubbleTailLabel}
          speechBubbleBorderConfigLabel={stringsJa.currentSpeechBubbleBorderLabel}
          vrmMotionTitle={stringsJa.vrmMotionSettingsTitle}
          vrmIdleMotionLabel={stringsJa.vrmIdleMotionEnabledLabel}
          vrmSpringBoneLabel={stringsJa.vrmSpringBoneEnabledLabel}
          vrmBlinkLabel={stringsJa.vrmBlinkEnabledLabel}
          vrmMouthMotionLabel={stringsJa.vrmMouthMotionEnabledLabel}
          unsetLabel={stringsJa.unsetLabel}
          debugSettingsTitle={stringsJa.debugSettingsTitle}
          debugSpeechTitle={stringsJa.debugSpeechSectionTitle}
          debugSpeechEnabledLabel={stringsJa.debugSpeechEnabledLabel}
          debugSpeechIntervalSecondsLabel={stringsJa.debugSpeechIntervalSecondsLabel}
          debugSpeechIntervalDescription={stringsJa.debugSpeechIntervalDescription}
          clickSpeechTitle={stringsJa.clickSpeechSectionTitle}
          clickSpeechCooldownLabel={stringsJa.clickSpeechCooldownLabel}
          clickSpeechCooldownDescription={stringsJa.clickSpeechCooldownDescription}
          mascotFocusableLabel={stringsJa.mascotFocusableLabel}
          mascotFocusableDescription={stringsJa.mascotFocusableDevDescription}
          speechLogSettingsTitle={stringsJa.speechLogSettingsTitle}
          speechVerboseLoggingLabel={stringsJa.speechVerboseLoggingLabel}
          speechVerboseLoggingDescription={stringsJa.speechVerboseLoggingDescription}
          speechLogFileEnabledLabel={stringsJa.speechLogFileEnabledLabel}
          speechLogDirectoryLabel={stringsJa.speechLogDirectoryLabel}
          speechLogSelectDirectoryLabel={stringsJa.speechLogSelectDirectoryLabel}
          speechLogOpenDirectoryLabel={stringsJa.speechLogOpenDirectoryLabel}
          speechLogClearLabel={stringsJa.speechLogClearLabel}
          speechLogClearExternalLabel={stringsJa.speechLogClearExternalLabel}
          speechLogDirectoryDescription={stringsJa.speechLogDirectoryDescription}
          selectFolderMessage={stringsJa.storageSelectFolderHint}
          debugStatusMessage={developerStatusMessage}
          openDevToolsOnStartup={appSettings.openDevToolsOnStartup}
          debugSpeechEnabled={appSettings.debugSpeechEnabled}
          debugSpeechIntervalSeconds={appSettings.debugSpeechIntervalSeconds}
          clickSpeechCooldownMs={appSettings.clickSpeechCooldownMs}
          mascotFocusable={!appSettings.mascotFocusable}
          speechLogFileEnabled={appSettings.speechLogFileEnabled}
          speechDebugVerboseLoggingEnabled={appSettings.speechDebugVerboseLoggingEnabled}
          speechLogDirectoryPath={appSettings.speechLogDirectory ?? storagePaths?.logsDataPath ?? ''}
          vrmIdleMotionEnabled={appSettings.vrmIdleMotionEnabled}
          vrmSpringBoneEnabled={appSettings.vrmSpringBoneEnabled}
          vrmBlinkEnabled={appSettings.vrmBlinkEnabled}
          vrmMouthMotionEnabled={appSettings.vrmMouthMotionEnabled}
          visibleModelData={{
            modelName: selectedModel?.displayName ?? stringsJa.unsetLabel,
            modelFormat: selectedModel ? stringsJa.modelFormatNames[selectedModel.format] : stringsJa.unsetLabel,
            rendererType: stringsJa.characterRendererNames[appSettings.characterRendererType],
            modelPath: selectedModel?.relativePath ?? stringsJa.unsetLabel,
            displaySize: displaySizeLabelMap[appSettings.mascotWindowSizePreset],
            displayScale:
              appSettings.mascotWindowSizePreset === 'custom'
                ? `${(appSettings.mascotDisplayCustomScale ?? 1).toFixed(2)}x`
                : appSettings.mascotWindowSizePreset === 'small'
                  ? '0.75x'
                  : appSettings.mascotWindowSizePreset === 'large'
                    ? '1.25x'
                    : '1.00x',
            areaSize: `${currentAreaSize.width} x ${currentAreaSize.height}`,
            mascotAlign: `${mascotVerticalAlignOptions.find((option) => option.value === appSettings.mascotVerticalAlign)?.label ?? stringsJa.unsetLabel} / ${mascotHorizontalAlignOptions.find((option) => option.value === appSettings.mascotHorizontalAlign)?.label ?? stringsJa.unsetLabel}`,
            writingMode: speechBubbleWritingModeLabelMap[appSettings.speechBubbleWritingMode],
            fontFamily: speechBubbleFontFamilyLabelMap[appSettings.mascotSpeechBubbleFontFamily],
            fontSize: `${appSettings.mascotSpeechBubbleFontSize}px`,
            tailConfig: `${speechBubbleTailDirectionOptions.find((option) => option.value === appSettings.speechBubbleTailDirection)?.label ?? stringsJa.speechBubbleTailDirectionAutoLabel} / ${appSettings.speechBubbleTailMirrored ? stringsJa.enabledLabel : stringsJa.disabledLabel} / X ${appSettings.speechBubbleTailOffsetX} / Y ${appSettings.speechBubbleTailOffsetY} / S ${appSettings.speechBubbleTailSize} / R ${appSettings.speechBubbleTailRotationDeg}`,
            borderConfig: `${appSettings.speechBubbleBorderEnabled ? stringsJa.enabledLabel : stringsJa.disabledLabel} (${appSettings.speechBubbleBorderWidth}px)`
          }}
          runtimeInfoText={runtimeInfo ? `${runtimeInfo.appName} / ${runtimeInfo.platform} / Electron ${runtimeInfo.electronVersion}` : stringsJa.runtimeInfoFallback}
          storagePaths={storagePaths}
          onToggleOpenDevToolsOnStartup={(next) => void updateSettings({ openDevToolsOnStartup: next })}
          onOpenMainDevTools={() => void window.chararium.devTools.openMain()}
          onOpenMascotDevTools={() => void window.chararium.devTools.openMascot()}
          onToggleDebugSpeechEnabled={(next) => void updateSettings({ debugSpeechEnabled: next })}
          onChangeDebugSpeechIntervalSeconds={(next) => void updateSettings({ debugSpeechIntervalSeconds: Math.max(5, Math.min(3600, Math.floor(next || 5))) })}
          onChangeClickSpeechCooldownMs={(next) => void updateSettings({ clickSpeechCooldownMs: Math.max(0, Math.min(10000, Math.floor(next || 0))) })}
          onToggleMascotFocusable={(next) => void updateSettings({ mascotFocusable: !next })}
          onToggleSpeechLogFileEnabled={(next) => void updateSettings({ speechLogFileEnabled: next })}
          onToggleSpeechDebugVerboseLoggingEnabled={(next) => void updateSettings({ speechDebugVerboseLoggingEnabled: next })}
          onSelectSpeechLogDirectory={() => void handleSelectSpeechLogDirectory()}
          onOpenSpeechLogDirectory={() => void handleOpenSpeechLogDirectory()}
          onClearSpeechLogs={() => void clearSpeechLogs()}
          onClearExternalSpeechLogs={() => void clearExternalSpeechLogs()}
          onToggleVrmIdleMotionEnabled={(next) => void updateSettings({ vrmIdleMotionEnabled: next })}
          onToggleVrmSpringBoneEnabled={(next) => void updateSettings({ vrmSpringBoneEnabled: next })}
          onToggleVrmBlinkEnabled={(next) => void updateSettings({ vrmBlinkEnabled: next })}
          onToggleVrmMouthMotionEnabled={(next) => void updateSettings({ vrmMouthMotionEnabled: next })}
        />
      ) : null}
    </main>
  )
}

export default App
