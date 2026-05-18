import { app } from 'electron'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type {
  CharacterVoiceProfile,
  IAddResponseCategoryCommand,
  IAddResponseEntryCommand,
  IDeleteResponseEntryCommand,
  IGetRandomResponseCommand,
  IToggleResponseCategoryEnabledCommand,
  IToggleResponseEntryEnabledCommand,
  IUpdateResponseCategoryCommand,
  IUpdateResponseEntryCommand,
  LifestyleProfile,
  MascotType,
  ResponseCategory,
  ResponseCharacterVoiceProfile,
  ResponseEntry,
  ResponseLibrary,
  ResponseTrigger
} from '../shared'

const appAssetsPath = 'assets'
const defaultLibraryPath = join(appAssetsPath, 'responses', 'defaultResponses.ja.json')
const responseFileName = 'responses.json'
let resolvedResponsesFilePath: string | null = null

let currentLibrary: ResponseLibrary | null = null
const lastPickedEntryByTrigger = new Map<ResponseTrigger, string>()

function getProjectRootCandidates(): string[] {
  const appPath = app.getAppPath()
  return [appPath, process.cwd()]
}

function getResponseLibraryFilePath(): string {
  if (resolvedResponsesFilePath) {
    return resolvedResponsesFilePath
  }
  return join(app.getPath('userData'), responseFileName)
}

export function initializeResponseLibraryStore(responsesFilePath: string): void {
  resolvedResponsesFilePath = responsesFilePath
}

export function getResponseLibraryPath(): string {
  return getResponseLibraryFilePath()
}

async function loadDefaultLibrary(): Promise<ResponseLibrary> {
  for (const root of getProjectRootCandidates()) {
    try {
      const raw = await readFile(join(root, defaultLibraryPath), 'utf-8')
      return JSON.parse(raw) as ResponseLibrary
    } catch {
      // try next candidate
    }
  }

  return {
    version: 1,
    categories: [{ id: 'click', label: 'クリック反応', enabled: true }],
    entries: []
  }
}

function getSupplementalDefaultEntries(): Array<Omit<ResponseEntry, 'createdAt' | 'updatedAt'>> {
  return [
    { id: 'click-latenight-2', categoryId: 'lateNight', text: '夜はこれからって顔してるね。', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-latenight-3', categoryId: 'lateNight', text: '無理しすぎないでね？', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-latenight-4', categoryId: 'lateNight', text: 'まだ作業するの？ちょっと休憩も挟も？', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-latenight-5', categoryId: 'lateNight', text: '目、しょぼしょぼしてない？', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-morning-2', categoryId: 'morning', text: 'おはよう。今日の調子はどう？', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-afternoon-2', categoryId: 'afternoon', text: '午後もゆるく進めよう。', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-night-2', categoryId: 'night', text: '夜モードだね。集中できてる？', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-generic-4', categoryId: 'click', text: 'はいはい、聞いてるよ。', enabled: true, weight: 1, trigger: 'click' },
    { id: 'click-generic-5', categoryId: 'click', text: '呼ばれた気がした。', enabled: true, weight: 1, trigger: 'click' },
    { id: 'idle-generic-1', categoryId: 'idle', text: 'ふぅ、ちょっと一息つく？', enabled: true, weight: 1, trigger: 'idle' },
    { id: 'idle-generic-2', categoryId: 'idle', text: '今のうちに水分補給しよっか。', enabled: true, weight: 1, trigger: 'idle' },
    { id: 'idle-generic-3', categoryId: 'idle', text: '静かだね。作業中かな？', enabled: true, weight: 1, trigger: 'idle' },
    { id: 'idle-generic-4', categoryId: 'idle', text: '無理なくいこうね。', enabled: true, weight: 1, trigger: 'idle' },
    { id: 'idle-latenight-1', categoryId: 'lateNight', text: '夜の作業って集中できるけど、休憩も忘れないでね。', enabled: true, weight: 1, trigger: 'idle' },
    { id: 'idle-latenight-2', categoryId: 'lateNight', text: 'そろそろ肩まわそっか。', enabled: true, weight: 1, trigger: 'idle' },
    { id: 'hourly-3', categoryId: 'hourly', text: '{hour}時になったよ。区切りつける？', enabled: true, weight: 1, trigger: 'hourly', minute: 0 }
  ]
}

function hasEquivalentEntry(entries: ResponseEntry[], target: Omit<ResponseEntry, 'createdAt' | 'updatedAt'>): boolean {
  return entries.some((entry) =>
    entry.id === target.id ||
    (entry.text === target.text && entry.trigger === target.trigger && entry.categoryId === target.categoryId)
  )
}

function supplementLibraryEntries(library: ResponseLibrary): boolean {
  const supplementalEntries = getSupplementalDefaultEntries()
  const now = new Date().toISOString()
  let changed = false
  for (const entry of supplementalEntries) {
    if (hasEquivalentEntry(library.entries, entry)) {
      continue
    }
    library.entries.push({
      ...entry,
      createdAt: now,
      updatedAt: now
    })
    changed = true
  }
  return changed
}

function mergeLibrary(defaultLibrary: ResponseLibrary, loadedLibrary: Partial<ResponseLibrary>): ResponseLibrary {
  const loadedCategories = loadedLibrary.categories ?? []
  const loadedEntries = loadedLibrary.entries ?? []

  const categoryById = new Map<string, ResponseCategory>()
  for (const category of defaultLibrary.categories) {
    categoryById.set(category.id, { ...category })
  }
  for (const category of loadedCategories) {
    categoryById.set(category.id, { ...categoryById.get(category.id), ...category })
  }

  return {
    version: defaultLibrary.version,
    categories: Array.from(categoryById.values()),
    entries: loadedEntries.length > 0 ? loadedEntries : defaultLibrary.entries
  }
}

function normalizeResponseCharacter(value: unknown): ResponseCharacterVoiceProfile {
  return value === 'any' ||
    value === 'soft_sister' ||
    value === 'soft_brother' ||
    value === 'assistant' ||
    value === 'standard'
    ? value
    : 'standard'
}

function normalizeResponseLifestyle(value: unknown): ResponseEntry['lifestyleProfile'] {
  return value === 'any' ||
    value === 'nightOwl' ||
    value === 'earlyBird' ||
    value === 'irregular' ||
    value === 'standard'
    ? value
    : 'any'
}

function normalizeResponseMascotType(value: unknown): ResponseEntry['mascotType'] {
  return value === 'any' ||
    value === 'female' ||
    value === 'male' ||
    value === 'neutral' ||
    value === 'robot' ||
    value === 'creature' ||
    value === 'custom'
    ? value
    : 'any'
}

function normalizeResponseTrigger(value: unknown): ResponseTrigger | undefined {
  return value === 'click' ||
    value === 'idle' ||
    value === 'hourly' ||
    value === 'startup' ||
    value === 'manual'
    ? value
    : undefined
}

function normalizeResponseEntryForImport(raw: Partial<ResponseEntry>, nowIso: string): ResponseEntry {
  const weightRaw = Number(raw.weight)
  const minuteRaw = raw.minute === undefined ? undefined : Number(raw.minute)
  const normalizedMinute =
    typeof minuteRaw === 'number' &&
    Number.isInteger(minuteRaw) &&
    minuteRaw >= 0 &&
    minuteRaw <= 59
      ? minuteRaw
      : undefined
  return {
    id: raw.id ?? randomUUID(),
    categoryId: raw.categoryId ?? 'click',
    text: raw.text ?? '',
    enabled: typeof raw.enabled === 'boolean' ? raw.enabled : true,
    weight: Number.isInteger(weightRaw) && weightRaw > 0 ? weightRaw : 1,
    startHour: typeof raw.startHour === 'number' ? raw.startHour : undefined,
    endHour: typeof raw.endHour === 'number' ? raw.endHour : undefined,
    startTime: typeof raw.startTime === 'string' ? raw.startTime : undefined,
    endTime: typeof raw.endTime === 'string' ? raw.endTime : undefined,
    minute: normalizedMinute,
    lifestyleProfile: normalizeResponseLifestyle(raw.lifestyleProfile),
    mascotType: normalizeResponseMascotType(raw.mascotType),
    character: normalizeResponseCharacter(raw.character),
    trigger: normalizeResponseTrigger(raw.trigger),
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : nowIso,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : nowIso
  }
}

function normalizeImportedLibraryShape(payload: unknown): ResponseLibrary {
  if (!payload || typeof payload !== 'object') {
    throw new Error('invalid json root')
  }
  const source = payload as Partial<ResponseLibrary>
  if (!Array.isArray(source.categories) || !Array.isArray(source.entries)) {
    throw new Error('categories/entries are required')
  }
  const nowIso = new Date().toISOString()
  const categories = source.categories
    .filter((category): category is ResponseCategory => Boolean(category && typeof category.id === 'string' && typeof category.label === 'string'))
    .map((category) => ({
      id: category.id,
      label: category.label,
      description: typeof category.description === 'string' ? category.description : undefined,
      enabled: typeof category.enabled === 'boolean' ? category.enabled : true
    }))

  const entries = source.entries
    .filter((entry) => Boolean(entry && typeof entry === 'object'))
    .map((entry) => normalizeResponseEntryForImport(entry, nowIso))
    .filter((entry) => Boolean(entry.id && entry.categoryId && entry.text))

  return {
    version: typeof source.version === 'number' ? source.version : 1,
    categories,
    entries
  }
}

function normalizeLibraryEntries(library: ResponseLibrary): boolean {
  let changed = false
  library.entries = library.entries.map((entry) => {
    if (entry.character) return entry
    changed = true
    return {
      ...entry,
      character: 'standard'
    }
  })
  return changed
}

async function saveLibrary(library: ResponseLibrary): Promise<void> {
  const filePath = getResponseLibraryFilePath()
  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, JSON.stringify(library, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save responses.json', error)
  }
}

export async function loadResponseLibrary(): Promise<ResponseLibrary> {
  const defaultLibrary = await loadDefaultLibrary()
  const filePath = getResponseLibraryFilePath()

  try {
    const raw = await readFile(filePath, 'utf-8')
    const loaded = JSON.parse(raw) as Partial<ResponseLibrary>
    currentLibrary = mergeLibrary(defaultLibrary, loaded)
    const normalized = normalizeLibraryEntries(currentLibrary)
    const supplemented = supplementLibraryEntries(currentLibrary)
    if (normalized || supplemented) {
      await saveLibrary(currentLibrary)
    }
    return currentLibrary
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code !== 'ENOENT') {
      console.warn('Failed to load responses.json, fallback to default.', error)
    }
    currentLibrary = { ...defaultLibrary }
    normalizeLibraryEntries(currentLibrary)
    supplementLibraryEntries(currentLibrary)
    await saveLibrary(currentLibrary)
    return currentLibrary
  }
}

function getLibraryOrThrow(): ResponseLibrary {
  if (!currentLibrary) {
    throw new Error('Response library is not loaded.')
  }
  return currentLibrary
}

function getTimeBandCategoryId(date: Date): string {
  const h = date.getHours()
  if (h >= 5 && h <= 10) return 'morning'
  if (h >= 11 && h <= 16) return 'afternoon'
  if (h >= 17 && h <= 20) return 'evening'
  if (h >= 21 && h <= 23) return 'night'
  return 'lateNight'
}

function parseTimeToSecondOfDay(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return undefined
  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? '0')
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return undefined
  }
  return hours * 3600 + minutes * 60 + seconds
}

function isWithinTimeRange(entry: ResponseEntry, now: Date): boolean {
  const nowSecondOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  const startSecond = entry.startTime ? parseTimeToSecondOfDay(entry.startTime) : undefined
  const endSecond = entry.endTime ? parseTimeToSecondOfDay(entry.endTime) : undefined

  if (typeof startSecond === 'number' || typeof endSecond === 'number') {
    if (typeof startSecond === 'number' && typeof endSecond === 'number') {
      if (startSecond <= endSecond) {
        return nowSecondOfDay >= startSecond && nowSecondOfDay <= endSecond
      }
      return nowSecondOfDay >= startSecond || nowSecondOfDay <= endSecond
    }

    if (typeof startSecond === 'number') {
      return nowSecondOfDay >= startSecond
    }

    return nowSecondOfDay <= (endSecond ?? nowSecondOfDay)
  }

  if (typeof entry.startHour === 'number' && now.getHours() < entry.startHour) return false
  if (typeof entry.endHour === 'number' && now.getHours() > entry.endHour) return false
  return true
}

function fillTemplate(text: string, now: Date): string {
  return text
    .replaceAll('{hour}', String(now.getHours()))
    .replaceAll('{minute}', String(now.getMinutes()).padStart(2, '0'))
}

function weightedPick(entries: ResponseEntry[]): ResponseEntry | undefined {
  const total = entries.reduce((sum, e) => sum + Math.max(1, e.weight || 1), 0)
  let cursor = Math.random() * total
  for (const entry of entries) {
    cursor -= Math.max(1, entry.weight || 1)
    if (cursor <= 0) return entry
  }
  return entries[0]
}

interface CandidateDebug {
  allEntries: number
  enabledEntries: number
  enabledCategoryEntries: number
  triggerMatchedEntries: number
  minuteMatchedEntries: number
  timeMatchedEntries: number
  lifestyleMatchedEntries: number
  mascotMatchedEntries: number
  characterMatchedEntries: number
  finalCandidates: number
}

export interface RandomResponseSelectionResult {
  text: string
  pickedEntry?: ResponseEntry
  candidates: ResponseEntry[]
  totalWeight: number
  selectedWeight?: number
  timePeriod: string
  reason?: string
  usedFallback: boolean
  debug: CandidateDebug
  repeatSuppressed?: boolean
  avoidedRepeatEntryId?: string
}

function matchesLifestyleProfile(
  entry: ResponseEntry,
  lifestyleProfile: LifestyleProfile | undefined
): boolean {
  const entryProfile = entry.lifestyleProfile
  if (!entryProfile || entryProfile === 'any') return true
  if (!lifestyleProfile) return true
  return entryProfile === lifestyleProfile
}

function matchesMascotType(
  entry: ResponseEntry,
  mascotType: MascotType | undefined
): boolean {
  const entryMascotType = entry.mascotType
  if (!entryMascotType || entryMascotType === 'any') return true
  if (!mascotType) return true
  return entryMascotType === mascotType
}

function resolveEntryCharacter(
  entry: ResponseEntry
): ResponseCharacterVoiceProfile {
  return entry.character ?? 'standard'
}

function matchesCharacterVoiceProfile(
  entry: ResponseEntry,
  characterVoiceProfile: CharacterVoiceProfile | undefined,
  allowStandardFallback: boolean
): boolean {
  const entryCharacter = resolveEntryCharacter(entry)
  if (entryCharacter === 'any') return true
  if (!characterVoiceProfile) return entryCharacter === 'standard'
  if (allowStandardFallback && entryCharacter === 'standard') return true
  return entryCharacter === characterVoiceProfile
}

function filterEntriesForCommand(
  library: ResponseLibrary,
  command: IGetRandomResponseCommand
): { entries: ResponseEntry[]; timeBand: string; debug: CandidateDebug } {
  const now = command.nowIso ? new Date(command.nowIso) : new Date()
  const minute = now.getMinutes()
  const timeBand = getTimeBandCategoryId(now)
  const lifestyleProfile = command.lifestyleProfile
  const mascotType = command.mascotType
  const characterVoiceProfile = command.characterVoiceProfile ?? 'standard'
  const enabledCategories = new Set(
    library.categories.filter((category) => category.enabled).map((category) => category.id)
  )

  const enabledEntries = library.entries.filter((entry) => entry.enabled)
  const enabledCategoryEntries = enabledEntries.filter((entry) =>
    enabledCategories.has(entry.categoryId)
  )
  const triggerMatchedEntries = enabledCategoryEntries.filter(
    (entry) => !entry.trigger || entry.trigger === command.trigger
  )
  const minuteMatchedEntries = triggerMatchedEntries.filter(
    (entry) => typeof entry.minute !== 'number' || entry.minute === minute
  )
  const timeMatchedEntries = minuteMatchedEntries.filter((entry) =>
    isWithinTimeRange(entry, now)
  )
  const lifestyleMatchedEntries = timeMatchedEntries.filter((entry) =>
    matchesLifestyleProfile(entry, lifestyleProfile)
  )
  const mascotMatchedEntries = lifestyleMatchedEntries.filter((entry) =>
    matchesMascotType(entry, mascotType)
  )
  const characterMatchedEntries = mascotMatchedEntries.filter((entry) =>
    matchesCharacterVoiceProfile(entry, characterVoiceProfile, false)
  )

  const candidates = characterMatchedEntries.filter((entry) => {
    if (!entry.enabled) return false
    if (!enabledCategories.has(entry.categoryId)) return false
    if (entry.trigger && entry.trigger !== command.trigger) return false
    if (typeof entry.minute === 'number' && entry.minute !== minute) return false
    if (!isWithinTimeRange(entry, now)) return false
    if (!matchesLifestyleProfile(entry, lifestyleProfile)) return false
    if (!matchesMascotType(entry, mascotType)) return false
    if (!matchesCharacterVoiceProfile(entry, characterVoiceProfile, false)) return false
    return true
  })

  const candidatesWithStandardFallback =
    characterVoiceProfile === 'standard' || candidates.length > 0
      ? candidates
      : mascotMatchedEntries.filter((entry) =>
          matchesCharacterVoiceProfile(entry, characterVoiceProfile, true)
        )

  const timeBandCandidates = candidatesWithStandardFallback.filter((entry) => entry.categoryId === timeBand)
  if (timeBandCandidates.length > 0) {
    return {
      entries: timeBandCandidates,
      timeBand,
      debug: {
        allEntries: library.entries.length,
        enabledEntries: enabledEntries.length,
        enabledCategoryEntries: enabledCategoryEntries.length,
        triggerMatchedEntries: triggerMatchedEntries.length,
        minuteMatchedEntries: minuteMatchedEntries.length,
        timeMatchedEntries: timeMatchedEntries.length,
        lifestyleMatchedEntries: lifestyleMatchedEntries.length,
        mascotMatchedEntries: mascotMatchedEntries.length,
        characterMatchedEntries: characterMatchedEntries.length,
        finalCandidates: timeBandCandidates.length
      }
    }
  }

  const triggerBandCandidates = candidatesWithStandardFallback.filter((entry) => entry.categoryId === command.trigger)
  if (triggerBandCandidates.length > 0) {
    return {
      entries: triggerBandCandidates,
      timeBand,
      debug: {
        allEntries: library.entries.length,
        enabledEntries: enabledEntries.length,
        enabledCategoryEntries: enabledCategoryEntries.length,
        triggerMatchedEntries: triggerMatchedEntries.length,
        minuteMatchedEntries: minuteMatchedEntries.length,
        timeMatchedEntries: timeMatchedEntries.length,
        lifestyleMatchedEntries: lifestyleMatchedEntries.length,
        mascotMatchedEntries: mascotMatchedEntries.length,
        characterMatchedEntries: characterMatchedEntries.length,
        finalCandidates: triggerBandCandidates.length
      }
    }
  }

  const anyScopedCandidates = library.entries.filter((entry) => {
    if (!entry.enabled) return false
    if (!enabledCategories.has(entry.categoryId)) return false
    if (entry.trigger && entry.trigger !== command.trigger) return false
    if (typeof entry.minute === 'number' && entry.minute !== minute) return false
    if (!isWithinTimeRange(entry, now)) return false
    const entryProfile = entry.lifestyleProfile
    const entryMascotType = entry.mascotType
    const entryCharacter = resolveEntryCharacter(entry)
    const lifestyleMatches = !entryProfile || entryProfile === 'any'
    const mascotMatches = !entryMascotType || entryMascotType === 'any'
    const characterMatches = entryCharacter === 'any' || entryCharacter === 'standard'
    return lifestyleMatches && mascotMatches && characterMatches
  })

  const finalCandidates =
    anyScopedCandidates.length > 0 ? anyScopedCandidates : candidatesWithStandardFallback
  return {
    entries: finalCandidates,
    timeBand,
    debug: {
      allEntries: library.entries.length,
      enabledEntries: enabledEntries.length,
      enabledCategoryEntries: enabledCategoryEntries.length,
      triggerMatchedEntries: triggerMatchedEntries.length,
      minuteMatchedEntries: minuteMatchedEntries.length,
      timeMatchedEntries: timeMatchedEntries.length,
      lifestyleMatchedEntries: lifestyleMatchedEntries.length,
      mascotMatchedEntries: mascotMatchedEntries.length,
      characterMatchedEntries: characterMatchedEntries.length,
      finalCandidates: finalCandidates.length
    }
  }
}

export function getRandomResponse(command: IGetRandomResponseCommand): string {
  return getRandomResponseSelection(command).text
}

export function getRandomResponseSelection(
  command: IGetRandomResponseCommand
): RandomResponseSelectionResult {
  const library = getLibraryOrThrow()
  const now = command.nowIso ? new Date(command.nowIso) : new Date()
  const filtered = filterEntriesForCommand(library, command)
  const entries = filtered.entries
  const previousEntryId = lastPickedEntryByTrigger.get(command.trigger)
  let repeatSuppressed = false
  let avoidedRepeatEntryId: string | undefined
  let effectiveEntries = entries

  if (entries.length >= 2 && previousEntryId) {
    const hasPrevious = entries.some((entry) => entry.id === previousEntryId)
    if (hasPrevious) {
      const filteredEntries = entries.filter((entry) => entry.id !== previousEntryId)
      if (filteredEntries.length > 0) {
        effectiveEntries = filteredEntries
        repeatSuppressed = true
        avoidedRepeatEntryId = previousEntryId
      }
    }
  }

  const picked = weightedPick(effectiveEntries)
  const totalWeight = effectiveEntries.reduce((sum, entry) => sum + Math.max(1, entry.weight || 1), 0)
  if (!picked) {
    const debug = filtered.debug
    return {
      text: fillTemplate('こんにちは。', now),
      candidates: entries,
      totalWeight,
      timePeriod: filtered.timeBand,
      reason: `no-candidate: trigger=${command.trigger}, timePeriod=${filtered.timeBand}, lifestyle=${command.lifestyleProfile ?? 'any'}, mascotType=${command.mascotType ?? 'any'}, character=${command.characterVoiceProfile ?? 'standard'}, enabled=${debug.enabledEntries}/${debug.allEntries}, category=${debug.enabledCategoryEntries}, triggerMatched=${debug.triggerMatchedEntries}, minuteMatched=${debug.minuteMatchedEntries}, timeMatched=${debug.timeMatchedEntries}, lifestyleMatched=${debug.lifestyleMatchedEntries}, mascotMatched=${debug.mascotMatchedEntries}, characterMatched=${debug.characterMatchedEntries}`,
      usedFallback: true,
      debug: filtered.debug,
      repeatSuppressed,
      avoidedRepeatEntryId
    }
  }
  lastPickedEntryByTrigger.set(command.trigger, picked.id)
  return {
    text: fillTemplate(picked.text, now),
    pickedEntry: picked,
    candidates: effectiveEntries,
    totalWeight,
    selectedWeight: Math.max(1, picked.weight || 1),
    timePeriod: filtered.timeBand,
    usedFallback: false,
    debug: filtered.debug,
    repeatSuppressed,
    avoidedRepeatEntryId
  }
}

export function getResponseLibrarySnapshot(): ResponseLibrary {
  return getLibraryOrThrow()
}

export async function replaceResponseLibrary(library: ResponseLibrary): Promise<ResponseLibrary> {
  currentLibrary = library
  await saveLibrary(currentLibrary)
  return currentLibrary
}

export async function mergeResponseLibrary(library: ResponseLibrary): Promise<{
  library: ResponseLibrary
  addedCategoryCount: number
  skippedCategoryCount: number
  addedEntryCount: number
  skippedEntryCount: number
}> {
  const target = getLibraryOrThrow()
  const existingCategoryIds = new Set(target.categories.map((category) => category.id))
  const existingEntryIds = new Set(target.entries.map((entry) => entry.id))

  let addedCategoryCount = 0
  let skippedCategoryCount = 0
  for (const category of library.categories) {
    if (existingCategoryIds.has(category.id)) {
      skippedCategoryCount += 1
      continue
    }
    target.categories.push(category)
    existingCategoryIds.add(category.id)
    addedCategoryCount += 1
  }

  let addedEntryCount = 0
  let skippedEntryCount = 0
  for (const entry of library.entries) {
    if (existingEntryIds.has(entry.id)) {
      skippedEntryCount += 1
      continue
    }
    target.entries.push(entry)
    existingEntryIds.add(entry.id)
    addedEntryCount += 1
  }

  await saveLibrary(target)
  return {
    library: target,
    addedCategoryCount,
    skippedCategoryCount,
    addedEntryCount,
    skippedEntryCount
  }
}

export function parseAndNormalizeResponseLibrary(payload: unknown): ResponseLibrary {
  return normalizeImportedLibraryShape(payload)
}

export async function addResponseEntry(command: IAddResponseEntryCommand): Promise<ResponseLibrary> {
  const library = getLibraryOrThrow()
  const now = new Date().toISOString()
  library.entries.push({
    id: randomUUID(),
    ...command.entry,
    character: command.entry.character ?? 'standard',
    createdAt: now,
    updatedAt: now
  })
  await saveLibrary(library)
  return library
}

export async function updateResponseEntry(command: IUpdateResponseEntryCommand): Promise<ResponseLibrary> {
  const library = getLibraryOrThrow()
  library.entries = library.entries.map((entry) =>
    entry.id === command.entryId
      ? {
          ...entry,
          ...command.patch,
          character:
            command.patch.character === undefined
              ? entry.character ?? 'standard'
              : command.patch.character,
          updatedAt: new Date().toISOString()
        }
      : entry
  )
  await saveLibrary(library)
  return library
}

export async function deleteResponseEntry(command: IDeleteResponseEntryCommand): Promise<ResponseLibrary> {
  const library = getLibraryOrThrow()
  library.entries = library.entries.filter((entry) => entry.id !== command.entryId)
  await saveLibrary(library)
  return library
}

export async function toggleResponseEntryEnabled(command: IToggleResponseEntryEnabledCommand): Promise<ResponseLibrary> {
  return updateResponseEntry({
    entryId: command.entryId,
    patch: { enabled: command.enabled }
  })
}

export async function addResponseCategory(command: IAddResponseCategoryCommand): Promise<ResponseLibrary> {
  const library = getLibraryOrThrow()
  const id = command.category.id ?? `category-${randomUUID().slice(0, 8)}`
  library.categories.push({
    id,
    label: command.category.label,
    description: command.category.description,
    enabled: command.category.enabled
  })
  await saveLibrary(library)
  return library
}

export async function updateResponseCategory(command: IUpdateResponseCategoryCommand): Promise<ResponseLibrary> {
  const library = getLibraryOrThrow()
  library.categories = library.categories.map((category) =>
    category.id === command.categoryId ? { ...category, ...command.patch } : category
  )
  await saveLibrary(library)
  return library
}

export async function toggleResponseCategoryEnabled(
  command: IToggleResponseCategoryEnabledCommand
): Promise<ResponseLibrary> {
  return updateResponseCategory({
    categoryId: command.categoryId,
    patch: { enabled: command.enabled }
  })
}

export async function resetResponseLibrary(): Promise<ResponseLibrary> {
  currentLibrary = await loadDefaultLibrary()
  await saveLibrary(currentLibrary)
  return currentLibrary
}
