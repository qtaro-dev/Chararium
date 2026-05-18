import type { CharacterRendererType } from './rendererTypes'
import type { CharacterVoiceProfile, LifestyleProfile, MascotType } from './responseTypes'

export const themeModes = ['light', 'dark'] as const

export type ThemeMode = (typeof themeModes)[number]
export const mascotDragModes = [
  'modifier-ctrl-or-shift',
  'modifier-ctrl',
  'modifier-shift',
  'transparent-drag-area',
  'disabled'
] as const

export type MascotDragMode = (typeof mascotDragModes)[number]
export type MascotWindowRenderMode = 'transparent-frameless' | 'solid-debug'
export type MascotClickThroughMode = 'off' | 'always' | 'whileHoldingModifier'
export type MascotWindowSizePreset = 'small' | 'medium' | 'large' | 'custom'
export type MascotWindowAreaSizePreset = 'small' | 'medium' | 'large' | 'custom'
export type MascotSpeechBubblePlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right'
export type MascotSpeechBubbleFontFamily = 'system' | 'sans' | 'serif' | 'rounded'
export type SpeechBubbleWritingMode = 'horizontal' | 'vertical'
export type SpeechBubbleWidthMode = 'auto' | 'custom'
export type SpeechBubbleHeightMode = 'auto' | 'custom'
export type SpeechBubbleTailDirection = 'auto' | 'left' | 'center' | 'right'
export type MascotVerticalAlign = 'top' | 'center' | 'bottom'
export type MascotHorizontalAlign = 'left' | 'center' | 'right'

export interface AppSettings {
  theme: ThemeMode
  openDevToolsOnStartup: boolean
  characterRendererType: CharacterRendererType
  selectedCharacterModelId?: string
  mascotDragMode: MascotDragMode
  mascotAlwaysOnTop: boolean
  mascotFocusable: boolean
  mascotWindowRenderMode: MascotWindowRenderMode
  mascotWindowSizePreset: MascotWindowSizePreset
  mascotDisplayCustomScale?: number
  mascotWindowCustomWidth?: number
  mascotWindowCustomHeight?: number
  mascotWindowAreaSizePreset: MascotWindowAreaSizePreset
  mascotWindowAreaCustomWidth?: number
  mascotWindowAreaCustomHeight?: number
  mascotShowHitArea: boolean
  mascotClickThroughMode: MascotClickThroughMode
  mascotSpeechBubblePlacement: MascotSpeechBubblePlacement
  mascotSpeechBubbleOffsetX: number
  mascotSpeechBubbleOffsetY: number
  speechBubbleTailOffsetX: number
  speechBubbleTailOffsetY: number
  speechBubbleTailSize: number
  speechBubbleTailRotationDeg: number
  speechBubbleTailDirection: SpeechBubbleTailDirection
  speechBubbleTailMirrored: boolean
  speechBubbleBorderEnabled: boolean
  speechBubbleBorderWidth: number
  speechBubbleWidthMode: SpeechBubbleWidthMode
  speechBubbleHeightMode: SpeechBubbleHeightMode
  speechBubbleMaxWidth: number
  speechBubbleMaxHeight: number
  mascotSpeechBubbleFontSize: number
  mascotSpeechBubbleFontFamily: MascotSpeechBubbleFontFamily
  speechBubbleWritingMode: SpeechBubbleWritingMode
  mascotVerticalAlign: MascotVerticalAlign
  mascotHorizontalAlign: MascotHorizontalAlign
  mascotOffsetX: number
  mascotOffsetY: number
  lifestyleProfile: LifestyleProfile
  mascotType: MascotType
  characterVoiceProfile: CharacterVoiceProfile
  hourlyChimeEnabled: boolean
  hourlyChimeIntervalMinutes: 60 | 30
  hourlyChimeQuietHoursEnabled: boolean
  hourlyChimeQuietStartHour: number
  hourlyChimeQuietEndHour: number
  idleSpeechEnabled: boolean
  idleSpeechIntervalMinutes: number
  idleSpeechCooldownMs: number
  debugSpeechEnabled: boolean
  debugSpeechIntervalSeconds: number
  autoIdleSpeechEnabled: boolean
  autoIdleSpeechMinMinutes: number
  autoIdleSpeechMaxMinutes: number
  autoIdleSpeechAfterInteractionDelaySeconds: number
  clickSpeechCooldownMs: number
  vrmIdleMotionEnabled: boolean
  vrmSpringBoneEnabled: boolean
  vrmBlinkEnabled: boolean
  vrmMouthMotionEnabled: boolean
  speechDebugVerboseLoggingEnabled: boolean
  speechLogFileEnabled: boolean
  speechLogDirectory?: string
}

export const defaultAppSettings: AppSettings = {
  theme: 'light',
  openDevToolsOnStartup: false,
  characterRendererType: 'placeholder',
  mascotDragMode: 'modifier-ctrl-or-shift',
  mascotAlwaysOnTop: false,
  mascotFocusable: true,
  mascotWindowRenderMode: 'transparent-frameless',
  mascotWindowSizePreset: 'medium',
  mascotDisplayCustomScale: 1.0,
  mascotWindowCustomWidth: 260,
  mascotWindowCustomHeight: 500,
  mascotWindowAreaSizePreset: 'small',
  mascotWindowAreaCustomWidth: 220,
  mascotWindowAreaCustomHeight: 420,
  mascotShowHitArea: false,
  mascotClickThroughMode: 'off',
  mascotSpeechBubblePlacement: 'auto',
  mascotSpeechBubbleOffsetX: 0,
  mascotSpeechBubbleOffsetY: 0,
  speechBubbleTailOffsetX: 0,
  speechBubbleTailOffsetY: 0,
  speechBubbleTailSize: 12,
  speechBubbleTailRotationDeg: 0,
  speechBubbleTailDirection: 'auto',
  speechBubbleTailMirrored: false,
  speechBubbleBorderEnabled: true,
  speechBubbleBorderWidth: 1,
  speechBubbleWidthMode: 'auto',
  speechBubbleHeightMode: 'auto',
  speechBubbleMaxWidth: 208,
  speechBubbleMaxHeight: 220,
  mascotSpeechBubbleFontSize: 14,
  mascotSpeechBubbleFontFamily: 'system',
  speechBubbleWritingMode: 'horizontal',
  mascotVerticalAlign: 'center',
  mascotHorizontalAlign: 'center',
  mascotOffsetX: 0,
  mascotOffsetY: 0,
  lifestyleProfile: 'standard',
  mascotType: 'female',
  characterVoiceProfile: 'standard',
  hourlyChimeEnabled: false,
  hourlyChimeIntervalMinutes: 60,
  hourlyChimeQuietHoursEnabled: true,
  hourlyChimeQuietStartHour: 0,
  hourlyChimeQuietEndHour: 6,
  idleSpeechEnabled: true,
  idleSpeechIntervalMinutes: 10,
  idleSpeechCooldownMs: 30_000,
  debugSpeechEnabled: false,
  debugSpeechIntervalSeconds: 60,
  autoIdleSpeechEnabled: false,
  autoIdleSpeechMinMinutes: 3,
  autoIdleSpeechMaxMinutes: 8,
  autoIdleSpeechAfterInteractionDelaySeconds: 60,
  clickSpeechCooldownMs: 1000,
  vrmIdleMotionEnabled: true,
  vrmSpringBoneEnabled: true,
  vrmBlinkEnabled: true,
  vrmMouthMotionEnabled: false,
  speechDebugVerboseLoggingEnabled: false,
  speechLogFileEnabled: true
}

export interface IUpdateAppSettingsCommand {
  theme?: ThemeMode
  openDevToolsOnStartup?: boolean
  characterRendererType?: CharacterRendererType
  selectedCharacterModelId?: string | null
  mascotDragMode?: MascotDragMode
  mascotAlwaysOnTop?: boolean
  mascotFocusable?: boolean
  mascotWindowRenderMode?: MascotWindowRenderMode
  mascotWindowSizePreset?: MascotWindowSizePreset
  mascotDisplayCustomScale?: number
  mascotWindowCustomWidth?: number
  mascotWindowCustomHeight?: number
  mascotWindowAreaSizePreset?: MascotWindowAreaSizePreset
  mascotWindowAreaCustomWidth?: number
  mascotWindowAreaCustomHeight?: number
  mascotShowHitArea?: boolean
  mascotClickThroughMode?: MascotClickThroughMode
  mascotSpeechBubblePlacement?: MascotSpeechBubblePlacement
  mascotSpeechBubbleOffsetX?: number
  mascotSpeechBubbleOffsetY?: number
  speechBubbleTailOffsetX?: number
  speechBubbleTailOffsetY?: number
  speechBubbleTailSize?: number
  speechBubbleTailRotationDeg?: number
  speechBubbleTailDirection?: SpeechBubbleTailDirection
  speechBubbleTailMirrored?: boolean
  speechBubbleBorderEnabled?: boolean
  speechBubbleBorderWidth?: number
  speechBubbleWidthMode?: SpeechBubbleWidthMode
  speechBubbleHeightMode?: SpeechBubbleHeightMode
  speechBubbleMaxWidth?: number
  speechBubbleMaxHeight?: number
  mascotSpeechBubbleFontSize?: number
  mascotSpeechBubbleFontFamily?: MascotSpeechBubbleFontFamily
  speechBubbleWritingMode?: SpeechBubbleWritingMode
  mascotVerticalAlign?: MascotVerticalAlign
  mascotHorizontalAlign?: MascotHorizontalAlign
  mascotOffsetX?: number
  mascotOffsetY?: number
  lifestyleProfile?: LifestyleProfile
  mascotType?: MascotType
  characterVoiceProfile?: CharacterVoiceProfile
  hourlyChimeEnabled?: boolean
  hourlyChimeIntervalMinutes?: 60 | 30
  hourlyChimeQuietHoursEnabled?: boolean
  hourlyChimeQuietStartHour?: number
  hourlyChimeQuietEndHour?: number
  idleSpeechEnabled?: boolean
  idleSpeechIntervalMinutes?: number
  idleSpeechCooldownMs?: number
  debugSpeechEnabled?: boolean
  debugSpeechIntervalSeconds?: number
  autoIdleSpeechEnabled?: boolean
  autoIdleSpeechMinMinutes?: number
  autoIdleSpeechMaxMinutes?: number
  autoIdleSpeechAfterInteractionDelaySeconds?: number
  clickSpeechCooldownMs?: number
  vrmIdleMotionEnabled?: boolean
  vrmSpringBoneEnabled?: boolean
  vrmBlinkEnabled?: boolean
  vrmMouthMotionEnabled?: boolean
  speechDebugVerboseLoggingEnabled?: boolean
  speechLogFileEnabled?: boolean
  speechLogDirectory?: string
}
