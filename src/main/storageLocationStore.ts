import { app, dialog, shell } from 'electron'
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type {
  IStorageOperationResult,
  StorageLocationConfig,
  StoragePaths
} from '../shared'

const bootstrapFileName = 'bootstrap.json'
const settingsFileName = 'settings.json'
const responsesFileName = 'responses.json'
const userDataDirectoryName = 'user-data'
const configDirectoryName = 'config'
const logsDirectoryName = 'logs'
const electronDirectoryName = 'electron'

let appRootPath = ''
let bootstrapFilePath = ''
let userDataRootPath = ''
let configDataPath = ''
let logsDataPath = ''
let electronUserDataPath = ''
let activePaths: StoragePaths | null = null

function resolvePortableAppRoot(): string {
  if (app.isPackaged) {
    return dirname(process.execPath)
  }

  const cwd = resolve(process.cwd())
  if (existsSync(join(cwd, 'package.json'))) {
    return cwd
  }

  const appPath = resolve(app.getAppPath())
  if (existsSync(join(appPath, 'package.json'))) {
    return appPath
  }

  return resolve(appPath, '..')
}

function buildStoragePaths(): StoragePaths {
  return {
    storageMode: 'portable',
    appRootPath,
    bootstrapFilePath,
    userDataRootPath,
    configDataPath,
    logsDataPath,
    electronUserDataPath,
    currentElectronUserDataPath: app.getPath('userData'),
    settingsFilePath: join(configDataPath, settingsFileName),
    responsesFilePath: join(configDataPath, responsesFileName)
  }
}

async function ensureDirectory(targetPath: string): Promise<void> {
  await mkdir(targetPath, { recursive: true })
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    const s = await stat(targetPath)
    return s.isFile()
  } catch {
    return false
  }
}

async function copyIfMissing(sourcePath: string, destinationPath: string): Promise<boolean> {
  if (!(await fileExists(sourcePath)) || (await fileExists(destinationPath))) {
    return false
  }
  await ensureDirectory(dirname(destinationPath))
  await copyFile(sourcePath, destinationPath)
  return true
}

async function copyLegacyRootFilesToConfig(): Promise<void> {
  const legacySettingsPath = join(userDataRootPath, settingsFileName)
  const legacyResponsesPath = join(userDataRootPath, responsesFileName)

  if (await copyIfMissing(legacySettingsPath, join(configDataPath, settingsFileName))) {
    console.info('storage:migrate-legacy-root-to-config', {
      file: settingsFileName
    })
  }

  if (await copyIfMissing(legacyResponsesPath, join(configDataPath, responsesFileName))) {
    console.info('storage:migrate-legacy-root-to-config', {
      file: responsesFileName
    })
  }

  const legacyEntries = await readdir(userDataRootPath, { withFileTypes: true })
  for (const entry of legacyEntries) {
    if (!entry.isFile()) {
      continue
    }
    if (
      entry.name.startsWith(`${settingsFileName}.backup-`) ||
      entry.name.startsWith(`${responsesFileName}.backup-`)
    ) {
      const sourcePath = join(userDataRootPath, entry.name)
      const destinationPath = join(configDataPath, entry.name)
      if (await copyIfMissing(sourcePath, destinationPath)) {
        console.info('storage:migrate-legacy-backup-to-config', {
          file: entry.name
        })
      }
    }
  }
}

async function writeBootstrap(config: StorageLocationConfig): Promise<void> {
  await ensureDirectory(dirname(bootstrapFilePath))
  await writeFile(bootstrapFilePath, JSON.stringify(config, null, 2), 'utf-8')
}

async function ensureBootstrap(): Promise<void> {
  if (await fileExists(bootstrapFilePath)) {
    try {
      const raw = await readFile(bootstrapFilePath, 'utf-8')
      const parsed = JSON.parse(raw) as StorageLocationConfig
      const next: StorageLocationConfig = {
        version: 1,
        storageMode: 'portable',
        userDataRoot: parsed.userDataRoot ?? './user-data',
        configDirectory: parsed.configDirectory ?? './user-data/config',
        electronUserDataDirectory: parsed.electronUserDataDirectory ?? './user-data/electron'
      }
      await writeBootstrap(next)
      return
    } catch {
      // overwrite invalid bootstrap with portable default
    }
  }

  await writeBootstrap({
    version: 1,
    storageMode: 'portable',
    userDataRoot: './user-data',
    configDirectory: './user-data/config',
    electronUserDataDirectory: './user-data/electron'
  })
}

export function configurePortableStorageForApp(): StoragePaths {
  appRootPath = resolvePortableAppRoot()
  userDataRootPath = join(appRootPath, userDataDirectoryName)
  configDataPath = join(userDataRootPath, configDirectoryName)
  logsDataPath = join(userDataRootPath, logsDirectoryName)
  electronUserDataPath = join(userDataRootPath, electronDirectoryName)
  bootstrapFilePath = join(appRootPath, bootstrapFileName)

  mkdirSync(configDataPath, { recursive: true })
  mkdirSync(logsDataPath, { recursive: true })
  mkdirSync(electronUserDataPath, { recursive: true })

  app.setPath('userData', electronUserDataPath)

  activePaths = buildStoragePaths()
  return activePaths
}

export async function resolveStoragePaths(): Promise<StoragePaths> {
  if (!activePaths) {
    activePaths = configurePortableStorageForApp()
  }

  await ensureDirectory(configDataPath)
  await ensureDirectory(logsDataPath)
  await ensureDirectory(electronUserDataPath)
  await copyLegacyRootFilesToConfig()
  await ensureBootstrap()

  activePaths = buildStoragePaths()
  return activePaths
}

export async function selectUserDataDirectory(currentDirectory: string): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    title: 'Select user-data root directory',
    defaultPath: currentDirectory,
    properties: ['openDirectory', 'createDirectory']
  })
  if (result.canceled || result.filePaths.length === 0) {
    return null
  }
  return result.filePaths[0]
}

function createUnsupportedResult(message: string): IStorageOperationResult {
  const paths = activePaths ?? buildStoragePaths()
  return { success: false, message, paths }
}

export async function changeUserDataDirectory(_: string): Promise<IStorageOperationResult> {
  return createUnsupportedResult('Portable mode is fixed. Use appRoot/user-data.')
}

export async function resetUserDataDirectoryToDefault(): Promise<IStorageOperationResult> {
  const paths = await resolveStoragePaths()
  return {
    success: true,
    message: 'Already using portable default storage.',
    paths
  }
}

export async function openUserDataDirectory(targetDirectory: string): Promise<IStorageOperationResult> {
  const paths = await resolveStoragePaths()
  try {
    await ensureDirectory(targetDirectory)
    const openResult = await shell.openPath(targetDirectory)
    if (openResult) {
      return {
        success: false,
        message: openResult,
        paths
      }
    }
    return {
      success: true,
      message: 'Opened directory.',
      paths
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to open directory: ${(error as Error).message}`,
      paths
    }
  }
}

export async function useProjectUserDataDirectory(): Promise<IStorageOperationResult> {
  const paths = await resolveStoragePaths()
  return {
    success: true,
    message: 'Already using project portable user-data.',
    paths
  }
}
