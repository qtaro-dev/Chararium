import { randomUUID } from 'node:crypto'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { AppendSpeechLogEntry, SpeechLogEntry } from '../shared'

interface SpeechLogFileOutputConfig {
  enabled: boolean
  directory: string
  verboseEnabled: boolean
}

const maxInMemoryEntries = 500

let speechLogFilePath: string | null = null
let speechLogs: SpeechLogEntry[] = []
let fileOutputConfig: SpeechLogFileOutputConfig = {
  enabled: false,
  directory: '',
  verboseEnabled: false
}

function requireSpeechLogFilePath(): string {
  if (!speechLogFilePath) {
    throw new Error('Speech log store is not initialized.')
  }

  return speechLogFilePath
}

function normalizeSpeechLogEntry(input: AppendSpeechLogEntry): SpeechLogEntry {
  return {
    id: input.id ?? randomUUID(),
    spokenAt: input.spokenAt ?? new Date().toISOString(),
    trigger: input.trigger,
    source: input.source,
    result: input.result ?? 'spoken',
    categoryId: input.categoryId,
    entryId: input.entryId,
    text: input.text,
    candidateCount: input.candidateCount ?? 0,
    totalWeight: input.totalWeight,
    selectedWeight: input.selectedWeight,
    lifestyleProfile: input.lifestyleProfile,
    mascotType: input.mascotType,
    timePeriod: input.timePeriod,
    reason: input.reason,
    repeatSuppressed: input.repeatSuppressed,
    avoidedRepeatEntryId: input.avoidedRepeatEntryId
  }
}

async function saveSpeechLogs(): Promise<void> {
  const filePath = requireSpeechLogFilePath()

  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(speechLogs, null, 2)}\n`, 'utf-8')
}

async function appendExternalSpeechLog(entry: SpeechLogEntry): Promise<void> {
  if (!fileOutputConfig.enabled || !fileOutputConfig.directory) {
    return
  }

  if (entry.result === 'skipped' && !fileOutputConfig.verboseEnabled) {
    return
  }

  await mkdir(fileOutputConfig.directory, { recursive: true })

  const datePart = new Date().toISOString().slice(0, 10)
  const externalLogPath = join(fileOutputConfig.directory, `speech-log-${datePart}.jsonl`)
  const existingText = await readFile(externalLogPath, 'utf-8').catch(() => '')

  await writeFile(externalLogPath, `${existingText}${JSON.stringify(entry)}\n`, 'utf-8')
}

export async function initializeSpeechLogStore(filePath: string): Promise<void> {
  speechLogFilePath = filePath

  try {
    const text = await readFile(filePath, 'utf-8')
    const parsed = JSON.parse(text)

    speechLogs = Array.isArray(parsed)
      ? parsed.filter((entry): entry is SpeechLogEntry => {
          return typeof entry === 'object' && entry !== null && typeof entry.id === 'string'
        })
      : []
  } catch {
    speechLogs = []
    await saveSpeechLogs()
  }
}

export function configureSpeechLogFileOutput(config: SpeechLogFileOutputConfig): void {
  fileOutputConfig = config
}

export async function appendSpeechLog(input: AppendSpeechLogEntry): Promise<SpeechLogEntry> {
  const entry = normalizeSpeechLogEntry(input)

  speechLogs = [entry, ...speechLogs].slice(0, maxInMemoryEntries)

  await saveSpeechLogs()
  await appendExternalSpeechLog(entry)

  return entry
}

export function listSpeechLogs(limit = 100): SpeechLogEntry[] {
  return speechLogs.slice(0, Math.max(0, limit))
}

export async function clearSpeechLogs(): Promise<void> {
  speechLogs = []
  await saveSpeechLogs()
}

export async function clearExternalSpeechLogs(): Promise<void> {
  if (!fileOutputConfig.directory) {
    return
  }

  const fileNames = await readdir(fileOutputConfig.directory).catch(() => [])

  await Promise.all(
    fileNames
      .filter((fileName) => fileName.startsWith('speech-log-') && fileName.endsWith('.jsonl'))
      .map((fileName) => unlink(join(fileOutputConfig.directory, fileName)).catch(() => undefined))
  )
}