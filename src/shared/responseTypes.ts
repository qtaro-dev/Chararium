export const responseModes = ['local', 'openai', 'weather'] as const

export type ResponseMode = (typeof responseModes)[number]
export type LifestyleProfile = 'standard' | 'nightOwl' | 'earlyBird' | 'irregular'
export type ResponseLifestyleProfile = LifestyleProfile | 'any'
export type MascotType = 'female' | 'male' | 'neutral' | 'robot' | 'creature' | 'custom'
export type ResponseMascotType = MascotType | 'any'
export type CharacterVoiceProfile = 'standard' | 'soft_sister' | 'soft_brother' | 'assistant'
export type ResponseCharacterVoiceProfile = CharacterVoiceProfile | 'any'

export const mascotEmotions = ['normal', 'happy', 'surprised', 'worried'] as const

export type MascotEmotion = (typeof mascotEmotions)[number]

export interface MascotResponse {
  text: string
  emotion?: MascotEmotion
  motionKey?: string
}

export interface ResponseProvider {
  readonly mode: ResponseMode
  getResponse(input: string): Promise<MascotResponse>
}

export interface LocalResponseDictionary {
  click: string[]
  morning: string[]
  night: string[]
}

export type ResponseTrigger = 'click' | 'idle' | 'hourly' | 'startup' | 'manual'

export type ResponseCategoryId =
  | 'greeting'
  | 'idle'
  | 'click'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'lateNight'
  | 'hourly'
  | 'breakReminder'
  | 'encourage'
  | 'system'
  | string

export interface ResponseCategory {
  id: ResponseCategoryId
  label: string
  description?: string
  enabled: boolean
}

export interface ResponseEntry {
  id: string
  categoryId: string
  text: string
  enabled: boolean
  weight: number
  startHour?: number
  endHour?: number
  startTime?: string
  endTime?: string
  minute?: number
  lifestyleProfile?: ResponseLifestyleProfile
  mascotType?: ResponseMascotType
  character?: ResponseCharacterVoiceProfile
  trigger?: ResponseTrigger
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ResponseLibrary {
  version: number
  categories: ResponseCategory[]
  entries: ResponseEntry[]
}

export interface IGetRandomResponseCommand {
  trigger: ResponseTrigger
  source?: 'normal' | 'debugSpeech'
  nowIso?: string
  lifestyleProfile?: LifestyleProfile
  mascotType?: MascotType
  characterVoiceProfile?: CharacterVoiceProfile
}

export interface IAddResponseEntryCommand {
  entry: Omit<ResponseEntry, 'id' | 'createdAt' | 'updatedAt'>
}

export interface IUpdateResponseEntryCommand {
  entryId: string
  patch: Partial<Omit<ResponseEntry, 'id' | 'createdAt' | 'updatedAt'>>
}

export interface IDeleteResponseEntryCommand {
  entryId: string
}

export interface IToggleResponseEntryEnabledCommand {
  entryId: string
  enabled: boolean
}

export interface IAddResponseCategoryCommand {
  category: Omit<ResponseCategory, 'id'> & { id?: string }
}

export interface IUpdateResponseCategoryCommand {
  categoryId: string
  patch: Partial<Omit<ResponseCategory, 'id'>>
}

export interface IToggleResponseCategoryEnabledCommand {
  categoryId: string
  enabled: boolean
}

export interface IImportResponseLibraryCommand {
  mode: 'merge' | 'replace'
}

export interface IImportResponseLibraryResult {
  library: ResponseLibrary
  addedCategoryCount: number
  skippedCategoryCount: number
  addedEntryCount: number
  skippedEntryCount: number
}

export interface IExportResponseLibraryResult {
  filePath: string
}
