import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname } from 'path'
import { defaultAppSettings, type AppSettings } from '../shared'

let settingsFilePath: string | null = null

const characterVoiceProfiles = ['standard', 'soft_sister', 'soft_brother', 'assistant'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function readOptionalString(value: unknown, fallback?: string): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  return fallback
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function readEnum<T extends readonly string[]>(
  value: unknown,
  allowedValues: T,
  fallback: T[number]
): T[number] {
  return typeof value === 'string' && allowedValues.includes(value)
    ? value
    : fallback
}

export function initializeSettingsStore(filePath: string): void {
  settingsFilePath = filePath
}

function requireSettingsFilePath(): string {
  if (!settingsFilePath) {
    throw new Error('Settings store is not initialized.')
  }

  return settingsFilePath
}

export function normalizeAppSettings(input: unknown): AppSettings {
  const raw = isRecord(input) ? input : {}

  const merged = {
    ...defaultAppSettings,
    ...raw
  } as AppSettings

  const autoIdleSpeechMinMinutes = Math.round(
    clampNumber(
      readNumber(raw.autoIdleSpeechMinMinutes, defaultAppSettings.autoIdleSpeechMinMinutes),
      1,
      240
    )
  )

  const autoIdleSpeechMaxMinutesRaw = Math.round(
    clampNumber(
      readNumber(raw.autoIdleSpeechMaxMinutes, defaultAppSettings.autoIdleSpeechMaxMinutes),
      1,
      240
    )
  )

  const autoIdleSpeechMaxMinutes = Math.max(autoIdleSpeechMinMinutes, autoIdleSpeechMaxMinutesRaw)

  const legacyIdleSpeechEnabled = raw.idleSpeechEnabled
  const legacyIdleSpeechIntervalMinutes = raw.idleSpeechIntervalMinutes

  return {
    ...merged,

    theme: readEnum(raw.theme, ['light', 'dark'] as const, defaultAppSettings.theme),
    openDevToolsOnStartup: readBoolean(
      raw.openDevToolsOnStartup,
      defaultAppSettings.openDevToolsOnStartup
    ),

    characterRendererType: readString(
      raw.characterRendererType,
      defaultAppSettings.characterRendererType
    ) as AppSettings['characterRendererType'],

    selectedCharacterModelId: readOptionalString(
      raw.selectedCharacterModelId,
      defaultAppSettings.selectedCharacterModelId
    ),

    mascotDragMode: readString(raw.mascotDragMode, defaultAppSettings.mascotDragMode) as AppSettings['mascotDragMode'],
    mascotAlwaysOnTop: readBoolean(raw.mascotAlwaysOnTop, defaultAppSettings.mascotAlwaysOnTop),
    mascotFocusable: readBoolean(raw.mascotFocusable, defaultAppSettings.mascotFocusable),
    mascotWindowRenderMode: readString(
      raw.mascotWindowRenderMode,
      defaultAppSettings.mascotWindowRenderMode
    ) as AppSettings['mascotWindowRenderMode'],

    mascotWindowSizePreset: readString(
      raw.mascotWindowSizePreset,
      defaultAppSettings.mascotWindowSizePreset
    ) as AppSettings['mascotWindowSizePreset'],

    mascotDisplayCustomScale: clampNumber(
      readNumber(raw.mascotDisplayCustomScale, defaultAppSettings.mascotDisplayCustomScale ?? 1),
      0.1,
      5
    ),

    mascotWindowCustomWidth: Math.round(
      clampNumber(
        readNumber(raw.mascotWindowCustomWidth, defaultAppSettings.mascotWindowCustomWidth ?? 260),
        100,
        4000
      )
    ),
    mascotWindowCustomHeight: Math.round(
      clampNumber(
        readNumber(raw.mascotWindowCustomHeight, defaultAppSettings.mascotWindowCustomHeight ?? 500),
        100,
        4000
      )
    ),

    mascotWindowAreaSizePreset: readString(
      raw.mascotWindowAreaSizePreset,
      defaultAppSettings.mascotWindowAreaSizePreset
    ) as AppSettings['mascotWindowAreaSizePreset'],
    mascotWindowAreaCustomWidth: Math.round(
      clampNumber(
        readNumber(
          raw.mascotWindowAreaCustomWidth,
          defaultAppSettings.mascotWindowAreaCustomWidth ?? 220
        ),
        100,
        4000
      )
    ),
    mascotWindowAreaCustomHeight: Math.round(
      clampNumber(
        readNumber(
          raw.mascotWindowAreaCustomHeight,
          defaultAppSettings.mascotWindowAreaCustomHeight ?? 420
        ),
        100,
        4000
      )
    ),

    mascotShowHitArea: readBoolean(raw.mascotShowHitArea, defaultAppSettings.mascotShowHitArea),
    mascotClickThroughMode: readString(
      raw.mascotClickThroughMode,
      defaultAppSettings.mascotClickThroughMode
    ) as AppSettings['mascotClickThroughMode'],

    mascotSpeechBubblePlacement: readString(
      raw.mascotSpeechBubblePlacement,
      defaultAppSettings.mascotSpeechBubblePlacement
    ) as AppSettings['mascotSpeechBubblePlacement'],
    mascotSpeechBubbleOffsetX: readNumber(
      raw.mascotSpeechBubbleOffsetX,
      defaultAppSettings.mascotSpeechBubbleOffsetX
    ),
    mascotSpeechBubbleOffsetY: readNumber(
      raw.mascotSpeechBubbleOffsetY,
      defaultAppSettings.mascotSpeechBubbleOffsetY
    ),

    mascotOffsetX: readNumber(raw.mascotOffsetX, defaultAppSettings.mascotOffsetX),
    mascotOffsetY: readNumber(raw.mascotOffsetY, defaultAppSettings.mascotOffsetY),

    lifestyleProfile: readString(
      raw.lifestyleProfile,
      defaultAppSettings.lifestyleProfile
    ) as AppSettings['lifestyleProfile'],

    mascotType: readString(
      raw.mascotType,
      defaultAppSettings.mascotType
    ) as AppSettings['mascotType'],

    characterVoiceProfile: readEnum(
      raw.characterVoiceProfile,
      characterVoiceProfiles,
      defaultAppSettings.characterVoiceProfile
    ),

    hourlyChimeEnabled: readBoolean(
      raw.hourlyChimeEnabled,
      defaultAppSettings.hourlyChimeEnabled
    ),
    hourlyChimeIntervalMinutes:
      raw.hourlyChimeIntervalMinutes === 30 || raw.hourlyChimeIntervalMinutes === 60
        ? raw.hourlyChimeIntervalMinutes
        : defaultAppSettings.hourlyChimeIntervalMinutes,
    hourlyChimeQuietHoursEnabled: readBoolean(
      raw.hourlyChimeQuietHoursEnabled,
      defaultAppSettings.hourlyChimeQuietHoursEnabled
    ),
    hourlyChimeQuietStartHour: Math.round(
      clampNumber(
        readNumber(raw.hourlyChimeQuietStartHour, defaultAppSettings.hourlyChimeQuietStartHour),
        0,
        23
      )
    ),
    hourlyChimeQuietEndHour: Math.round(
      clampNumber(
        readNumber(raw.hourlyChimeQuietEndHour, defaultAppSettings.hourlyChimeQuietEndHour),
        0,
        23
      )
    ),

    idleSpeechEnabled: readBoolean(raw.idleSpeechEnabled, defaultAppSettings.idleSpeechEnabled),
    idleSpeechIntervalMinutes: Math.round(
      clampNumber(
        readNumber(raw.idleSpeechIntervalMinutes, defaultAppSettings.idleSpeechIntervalMinutes),
        1,
        240
      )
    ),
    idleSpeechCooldownMs: Math.round(
      clampNumber(
        readNumber(raw.idleSpeechCooldownMs, defaultAppSettings.idleSpeechCooldownMs),
        0,
        24 * 60 * 60 * 1000
      )
    ),

    debugSpeechEnabled: readBoolean(
      raw.debugSpeechEnabled,
      typeof legacyIdleSpeechEnabled === 'boolean'
        ? legacyIdleSpeechEnabled
        : defaultAppSettings.debugSpeechEnabled
    ),
    debugSpeechIntervalSeconds: Math.round(
      clampNumber(
        readNumber(
          raw.debugSpeechIntervalSeconds,
          typeof legacyIdleSpeechIntervalMinutes === 'number'
            ? legacyIdleSpeechIntervalMinutes * 60
            : defaultAppSettings.debugSpeechIntervalSeconds
        ),
        1,
        24 * 60 * 60
      )
    ),

    autoIdleSpeechEnabled: readBoolean(
      raw.autoIdleSpeechEnabled,
      defaultAppSettings.autoIdleSpeechEnabled
    ),
    autoIdleSpeechMinMinutes,
    autoIdleSpeechMaxMinutes,
    autoIdleSpeechAfterInteractionDelaySeconds: Math.round(
      clampNumber(
        readNumber(
          raw.autoIdleSpeechAfterInteractionDelaySeconds,
          defaultAppSettings.autoIdleSpeechAfterInteractionDelaySeconds
        ),
        0,
        24 * 60 * 60
      )
    ),

    clickSpeechCooldownMs: Math.round(
      clampNumber(
        readNumber(raw.clickSpeechCooldownMs, defaultAppSettings.clickSpeechCooldownMs),
        0,
        24 * 60 * 60 * 1000
      )
    ),

    vrmIdleMotionEnabled: readBoolean(
      raw.vrmIdleMotionEnabled,
      defaultAppSettings.vrmIdleMotionEnabled
    ),
    vrmSpringBoneEnabled: readBoolean(
      raw.vrmSpringBoneEnabled,
      defaultAppSettings.vrmSpringBoneEnabled
    ),
    vrmBlinkEnabled: readBoolean(raw.vrmBlinkEnabled, defaultAppSettings.vrmBlinkEnabled),
    vrmMouthMotionEnabled: readBoolean(
      raw.vrmMouthMotionEnabled,
      defaultAppSettings.vrmMouthMotionEnabled
    ),

    speechDebugVerboseLoggingEnabled: readBoolean(
      raw.speechDebugVerboseLoggingEnabled,
      defaultAppSettings.speechDebugVerboseLoggingEnabled
    ),
    speechLogFileEnabled: readBoolean(
      raw.speechLogFileEnabled,
      defaultAppSettings.speechLogFileEnabled
    ),
    speechLogDirectory: readOptionalString(
      raw.speechLogDirectory,
      defaultAppSettings.speechLogDirectory
    )
  }
}

export async function loadAppSettings(): Promise<AppSettings> {
  const filePath = requireSettingsFilePath()

  try {
    const text = await readFile(filePath, 'utf-8')
    return normalizeAppSettings(JSON.parse(text))
  } catch (error) {
    const code = isRecord(error) ? error.code : undefined

    if (code === 'ENOENT') {
      await saveAppSettings(defaultAppSettings)
      return normalizeAppSettings(defaultAppSettings)
    }

    console.warn('Failed to load app settings. Using defaults.', error)
    return normalizeAppSettings(defaultAppSettings)
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<AppSettings> {
  const filePath = requireSettingsFilePath()
  const normalizedSettings = normalizeAppSettings(settings)

  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(normalizedSettings, null, 2)}\n`, 'utf-8')

  return normalizedSettings
}