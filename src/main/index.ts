import { app, BrowserWindow, dialog, ipcMain, shell, type IpcMainInvokeEvent } from 'electron'
import { createHash } from 'node:crypto'
import { access, readdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { basename, dirname, extname, join, normalize, relative } from 'node:path'
import { mkdir } from 'node:fs/promises'
import {
  defaultAppSettings,
  getRendererTypeFromModelFormat,
  ipcChannelNames,
  type AppSettings,
  type CharacterModelDefinition,
  type CharacterModelFormat,
  type DevToolsTarget,
  type StoragePaths,
  type IOpenDevToolsCommand,
  type IReadCharacterModelBinaryCommand,
  type IMoveMascotWindowByCommand,
  type ISetMascotClickThroughCommand,
  type IUpdateAppSettingsCommand
} from '../shared'
import { initializeSettingsStore, loadAppSettings, saveAppSettings } from './settingsStore'
import {
  addResponseCategory,
  addResponseEntry,
  deleteResponseEntry,
  getRandomResponseSelection,
  getResponseLibrarySnapshot,
  initializeResponseLibraryStore,
  loadResponseLibrary,
  mergeResponseLibrary,
  parseAndNormalizeResponseLibrary,
  replaceResponseLibrary,
  resetResponseLibrary,
  toggleResponseCategoryEnabled,
  toggleResponseEntryEnabled,
  updateResponseCategory,
  updateResponseEntry
} from './responseLibraryStore'
import {
  appendSpeechLog,
  clearExternalSpeechLogs,
  clearSpeechLogs,
  configureSpeechLogFileOutput,
  initializeSpeechLogStore,
  listSpeechLogs
} from './speechLogStore'
import {
  configurePortableStorageForApp,
  changeUserDataDirectory,
  openUserDataDirectory,
  resetUserDataDirectoryToDefault,
  resolveStoragePaths,
  selectUserDataDirectory,
  useProjectUserDataDirectory
} from './storageLocationStore'
import type {
  IAddResponseCategoryCommand,
  IAddResponseEntryCommand,
  IDeleteResponseEntryCommand,
  IExportResponseLibraryResult,
  IGetRandomResponseCommand,
  IImportResponseLibraryCommand,
  IImportResponseLibraryResult,
  IChangeUserDataDirectoryCommand,
  IToggleResponseCategoryEnabledCommand,
  IToggleResponseEntryEnabledCommand,
  IUpdateResponseCategoryCommand,
  IUpdateResponseEntryCommand
} from '../shared'

const windowRouteQueryKey = 'window'
const mainWindowRouteValue = 'main'
const mascotWindowRouteValue = 'mascot'
const devToolsMode = { mode: 'detach' } as const
const appAssetsPath = 'assets'
const live2dAssetsPath = join(appAssetsPath, 'live2d')
const models3dAssetsPath = join(appAssetsPath, 'models3d')

let mainWindow: BrowserWindow | null = null
let mascotWindow: BrowserWindow | null = null
let appSettings: AppSettings = { ...defaultAppSettings }
let lastRequestedMascotAreaSize = resolveMascotWindowAreaSize(defaultAppSettings)
let storagePaths: StoragePaths = {
  storageMode: 'portable',
  appRootPath: '',
  bootstrapFilePath: '',
  userDataRootPath: '',
  configDataPath: '',
  electronUserDataPath: '',
  currentElectronUserDataPath: '',
  settingsFilePath: '',
  responsesFilePath: ''
  ,
  logsDataPath: ''
}

function getSpeechLogFilePathFromStoragePaths(paths: StoragePaths): string {
  return join(paths.configDataPath, 'speech-log.json')
}

function getDefaultSpeechLogDirectory(paths: StoragePaths): string {
  return paths.logsDataPath
}

storagePaths = configurePortableStorageForApp()
console.info('storage:init', {
  storageMode: storagePaths.storageMode,
  appRoot: storagePaths.appRootPath,
  bootstrapPath: storagePaths.bootstrapFilePath,
  userDataRootPath: storagePaths.userDataRootPath,
  configDataPath: storagePaths.configDataPath,
  electronUserDataPath: storagePaths.electronUserDataPath,
  settingsPath: storagePaths.settingsFilePath,
  responsesPath: storagePaths.responsesFilePath,
  electronUserData: storagePaths.currentElectronUserDataPath
})

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function resolveMascotWindowAreaSize(settings: AppSettings): { width: number; height: number } {
  if (settings.mascotWindowAreaSizePreset === 'small') {
    return { width: 200, height: 288 }
  }
  if (settings.mascotWindowAreaSizePreset === 'large') {
    return { width: 320, height: 496 }
  }
  if (settings.mascotWindowAreaSizePreset === 'custom') {
    const width = clamp(settings.mascotWindowAreaCustomWidth ?? 260, 120, 800)
    const height = clamp(settings.mascotWindowAreaCustomHeight ?? 180, 180, 1000)
    return { width, height }
  }
  return { width: 260, height: 400 }
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

function normalizePathSeparators(targetPath: string): string {
  return targetPath.replace(/\\/g, '/')
}

function getProjectRootCandidates(): string[] {
  const appPath = app.getAppPath()
  return [appPath, process.cwd()]
}

async function resolveAssetsRootDirectory(): Promise<string> {
  for (const candidateRoot of getProjectRootCandidates()) {
    const candidateAssetsDirectory = join(candidateRoot, appAssetsPath)
    if (await pathExists(candidateAssetsDirectory)) {
      return candidateRoot
    }
  }

  return app.getAppPath()
}

function mapExtensionToModelFormat(extension: string): CharacterModelFormat | undefined {
  if (extension === '.vrm') {
    return 'vrm'
  }

  if (extension === '.gltf') {
    return 'gltf'
  }

  if (extension === '.glb') {
    return 'glb'
  }

  return undefined
}

function sanitizeIdSegment(raw: string): string {
  const sanitized = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return sanitized || 'model'
}

function createStableModelId(sourcePrefix: string, normalizedRelativePath: string): string {
  const baseNameSegment = sanitizeIdSegment(basename(normalizedRelativePath, extname(normalizedRelativePath)))
  const hash = createHash('sha1').update(normalizedRelativePath).digest('hex').slice(0, 12)
  return `${sourcePrefix}-${baseNameSegment}-${hash}`
}

function createCharacterModelDefinition(params: {
  sourcePrefix: string
  filePath: string
  format: CharacterModelFormat
  assetsRootDirectory: string
}): CharacterModelDefinition {
  const normalizedRelativePath = normalizePathSeparators(
    relative(params.assetsRootDirectory, params.filePath)
  )
  const relativeDirectory = normalizePathSeparators(
    relative(params.assetsRootDirectory, dirname(params.filePath))
  )

  return {
    id: createStableModelId(params.sourcePrefix, normalizedRelativePath),
    displayName: basename(params.filePath),
    format: params.format,
    rendererType: getRendererTypeFromModelFormat(params.format),
    entryFilePath: params.filePath,
    relativePath: normalizedRelativePath,
    directoryPath: relativeDirectory,
    isBundled: true,
    isAvailable: true
  }
}

async function collectModelFiles(baseDirectory: string, predicate: (fileName: string) => boolean): Promise<string[]> {
  if (!(await pathExists(baseDirectory))) {
    return []
  }

  const entries = await readdir(baseDirectory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryPath = join(baseDirectory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectModelFiles(entryPath, predicate)))
      continue
    }

    if (entry.isFile() && predicate(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

async function scanCharacterModels(): Promise<CharacterModelDefinition[]> {
  const assetsRootDirectory = await resolveAssetsRootDirectory()
  const live2dDirectory = join(assetsRootDirectory, live2dAssetsPath)
  const models3dDirectory = join(assetsRootDirectory, models3dAssetsPath)

  const live2dModelFiles = await collectModelFiles(
    live2dDirectory,
    (fileName) => fileName.toLowerCase().endsWith('.model3.json')
  )

  const models3dFiles = await collectModelFiles(models3dDirectory, (fileName) => {
    const extension = extname(fileName).toLowerCase()
    return extension === '.vrm' || extension === '.gltf' || extension === '.glb'
  })

  const scannedModels: CharacterModelDefinition[] = []

  for (const filePath of live2dModelFiles) {
    scannedModels.push(
      createCharacterModelDefinition({
        sourcePrefix: 'live2d',
        filePath,
        format: 'live2d-model3-json',
        assetsRootDirectory
      })
    )
  }

  for (const filePath of models3dFiles) {
    const format = mapExtensionToModelFormat(extname(filePath).toLowerCase())
    if (!format) {
      continue
    }

    scannedModels.push(
      createCharacterModelDefinition({
        sourcePrefix: 'models3d',
        filePath,
        format,
        assetsRootDirectory
      })
    )
  }

  return scannedModels
}

async function readCharacterModelBinary(command: IReadCharacterModelBinaryCommand): Promise<Uint8Array> {
  const assetsRootDirectory = await resolveAssetsRootDirectory()
  const normalizedRelativePath = normalize(command.relativePath).replace(/\\/g, '/')

  if (!normalizedRelativePath.startsWith('assets/live2d/') && !normalizedRelativePath.startsWith('assets/models3d/')) {
    throw new Error(`Blocked model path: ${command.relativePath}`)
  }

  if (normalizedRelativePath.includes('..')) {
    throw new Error(`Invalid relative model path: ${command.relativePath}`)
  }

  const absolutePath = join(assetsRootDirectory, normalizedRelativePath)
  const modelBinary = await readFile(absolutePath)
  return new Uint8Array(modelBinary)
}

function getRendererEntryUrl(routeValue: string): string {
  const devServerUrl = process.env.ELECTRON_RENDERER_URL

  if (devServerUrl) {
    const url = new URL(devServerUrl)
    url.searchParams.set(windowRouteQueryKey, routeValue)
    return url.toString()
  }

  const filePath = join(__dirname, '../renderer/index.html')
  return `${filePath}?${windowRouteQueryKey}=${routeValue}`
}

function applyWindowSecurity(window: BrowserWindow): void {
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
}

function applyMascotWindowChromeOptions(targetWindow: BrowserWindow): void {
  if (targetWindow.isDestroyed()) {
    return
  }

  targetWindow.setMenuBarVisibility(false)
  targetWindow.setAutoHideMenuBar(true)
}

function applyMascotWindowStateOptions(targetWindow: BrowserWindow): void {
  if (targetWindow.isDestroyed()) {
    return
  }

  applyMascotWindowChromeOptions(targetWindow)
  targetWindow.setAlwaysOnTop(appSettings.mascotAlwaysOnTop)
  if (appSettings.mascotClickThroughMode === 'always') {
    targetWindow.setIgnoreMouseEvents(true, { forward: true })
  } else {
    targetWindow.setIgnoreMouseEvents(false)
  }
  if (typeof targetWindow.setFocusable === 'function') {
    targetWindow.setFocusable(appSettings.mascotFocusable)
  }
}

function ensureMascotWindowVisible(targetWindow: BrowserWindow): void {
  if (targetWindow.isDestroyed()) {
    return
  }

  if (targetWindow.isMinimized()) {
    targetWindow.restore()
  }

  if (!targetWindow.isVisible()) {
    targetWindow.show()
  }

  // OFF時でも起動直後やモデル再選択時に一度は視認できるよう前面へ出す。
  targetWindow.show()
  if (typeof targetWindow.moveTop === 'function') {
    targetWindow.moveTop()
  }
}

function getMascotWindowSizeSnapshot(targetWindow: BrowserWindow): {
  requestedWidth: number
  requestedHeight: number
  windowWidth: number
  windowHeight: number
  contentWidth: number
  contentHeight: number
} {
  const [windowWidth, windowHeight] = targetWindow.getSize()
  const [contentWidth, contentHeight] = targetWindow.getContentSize()
  return {
    requestedWidth: lastRequestedMascotAreaSize.width,
    requestedHeight: lastRequestedMascotAreaSize.height,
    windowWidth,
    windowHeight,
    contentWidth,
    contentHeight
  }
}

function applyMascotWindowAreaSize(
  targetWindow: BrowserWindow,
  nextSize: { width: number; height: number }
): {
  requestedWidth: number
  requestedHeight: number
  windowWidth: number
  windowHeight: number
  contentWidth: number
  contentHeight: number
} {
  lastRequestedMascotAreaSize = nextSize
  targetWindow.setContentSize(nextSize.width, nextSize.height)
  const [contentWidth, contentHeight] = targetWindow.getContentSize()
  if (contentWidth !== nextSize.width || contentHeight !== nextSize.height) {
    targetWindow.setSize(nextSize.width, nextSize.height)
  }
  return getMascotWindowSizeSnapshot(targetWindow)
}

function openDevToolsForWindow(targetWindow: BrowserWindow | null): boolean {
  if (!targetWindow || targetWindow.isDestroyed()) {
    return false
  }

  targetWindow.webContents.openDevTools(devToolsMode)
  return true
}

function openDevToolsByTarget(target: DevToolsTarget): boolean {
  if (target === mainWindowRouteValue) {
    return openDevToolsForWindow(mainWindow)
  }

  return openDevToolsForWindow(mascotWindow)
}

function isMascotWindowSender(event: IpcMainInvokeEvent): boolean {
  return Boolean(
    mascotWindow &&
      !mascotWindow.isDestroyed() &&
      event.sender.id === mascotWindow.webContents.id
  )
}

function broadcastAppSettings(): void {
  for (const window of BrowserWindow.getAllWindows()) {
    if (window.isDestroyed()) {
      continue
    }

    window.webContents.send(ipcChannelNames.appSettingsChanged, appSettings)
  }
}

function getResolvedSpeechLogDirectory(settings: AppSettings, paths: StoragePaths): string {
  const configured = settings.speechLogDirectory?.trim()
  if (configured) {
    return configured
  }
  return getDefaultSpeechLogDirectory(paths)
}

async function applySpeechLogFileConfiguration(): Promise<void> {
  const directory = getResolvedSpeechLogDirectory(appSettings, storagePaths)
  await mkdir(directory, { recursive: true })
  configureSpeechLogFileOutput({
    enabled: appSettings.speechLogFileEnabled,
    directory,
    verboseEnabled: appSettings.speechDebugVerboseLoggingEnabled
  })
}

function applyStartupDevTools(window: BrowserWindow): void {
  if (!appSettings.openDevToolsOnStartup) {
    return
  }

  openDevToolsForWindow(window)
}

async function loadRenderer(window: BrowserWindow, routeValue: string): Promise<void> {
  const entryUrl = getRendererEntryUrl(routeValue)
  const isDevelopment = Boolean(process.env.ELECTRON_RENDERER_URL)

  if (isDevelopment) {
    await window.loadURL(entryUrl)
    applyStartupDevTools(window)
    return
  }

  await window.loadFile(join(__dirname, '../renderer/index.html'), {
    search: `${windowRouteQueryKey}=${routeValue}`
  })
  applyStartupDevTools(window)
}

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1240,
    height: 860,
    minWidth: 1080,
    minHeight: 720,
    show: false,
    title: 'Chararium',
    backgroundColor: '#f3efe7',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  applyWindowSecurity(window)
  window.once('ready-to-show', () => {
    window.show()
    if (mascotWindow && !mascotWindow.isDestroyed()) {
      ensureMascotWindowVisible(mascotWindow)
      applyMascotWindowStateOptions(mascotWindow)
    }
  })
  window.on('closed', () => {
    if (mainWindow === window) {
      mainWindow = null
    }
  })

  void loadRenderer(window, mainWindowRouteValue)
  mainWindow = window

  return window
}

function createMascotWindow(): BrowserWindow {
  const useTransparentFrameless = appSettings.mascotWindowRenderMode === 'transparent-frameless'
  const mascotWindowSize = resolveMascotWindowAreaSize(appSettings)
  lastRequestedMascotAreaSize = mascotWindowSize
  const window = new BrowserWindow({
    width: mascotWindowSize.width,
    height: mascotWindowSize.height,
    minWidth: 120,
    minHeight: 180,
    show: false,
    frame: false,
    thickFrame: false,
    roundedCorners: false,
    transparent: useTransparentFrameless,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    focusable: appSettings.mascotFocusable,
    autoHideMenuBar: true,
    alwaysOnTop: appSettings.mascotAlwaysOnTop,
    hasShadow: false,
    backgroundColor: useTransparentFrameless ? '#00000000' : '#1e1a18',
    title: 'Chararium Mascot',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  applyWindowSecurity(window)
  applyMascotWindowAreaSize(window, mascotWindowSize)
  applyMascotWindowStateOptions(window)
  window.once('ready-to-show', () => {
    applyMascotWindowStateOptions(window)
    ensureMascotWindowVisible(window)
  })
  window.on('show', () => applyMascotWindowStateOptions(window))
  window.on('focus', () => applyMascotWindowStateOptions(window))
  window.on('restore', () => applyMascotWindowStateOptions(window))
  window.on('closed', () => {
    if (mascotWindow === window) {
      mascotWindow = null
    }
  })

  void loadRenderer(window, mascotWindowRouteValue)
  mascotWindow = window

  return window
}

ipcMain.handle(ipcChannelNames.getAppSettings, () => appSettings)

ipcMain.handle(
  ipcChannelNames.updateAppSettings,
  (_, command: IUpdateAppSettingsCommand): AppSettings => {
    const nextSettings: AppSettings = { ...appSettings }

    if (command.theme) {
      nextSettings.theme = command.theme
    }

    if (typeof command.openDevToolsOnStartup === 'boolean') {
      nextSettings.openDevToolsOnStartup = command.openDevToolsOnStartup
    }

    if (command.characterRendererType) {
      nextSettings.characterRendererType = command.characterRendererType
    }

    if ('selectedCharacterModelId' in command) {
      nextSettings.selectedCharacterModelId = command.selectedCharacterModelId ?? undefined
    }

    if (command.mascotDragMode) {
      nextSettings.mascotDragMode = command.mascotDragMode
    }

    if (typeof command.mascotAlwaysOnTop === 'boolean') {
      nextSettings.mascotAlwaysOnTop = command.mascotAlwaysOnTop
    }

    if (typeof command.mascotFocusable === 'boolean') {
      nextSettings.mascotFocusable = command.mascotFocusable
    }

    if (command.mascotWindowRenderMode) {
      nextSettings.mascotWindowRenderMode = command.mascotWindowRenderMode
    }
    if (command.mascotWindowSizePreset) {
      nextSettings.mascotWindowSizePreset = command.mascotWindowSizePreset
    }
    if (typeof command.mascotDisplayCustomScale === 'number') {
      nextSettings.mascotDisplayCustomScale = clamp(command.mascotDisplayCustomScale, 0.3, 2.0)
    }
    if (typeof command.mascotWindowCustomWidth === 'number') {
      nextSettings.mascotWindowCustomWidth = clamp(command.mascotWindowCustomWidth, 120, 800)
    }
    if (typeof command.mascotWindowCustomHeight === 'number') {
      nextSettings.mascotWindowCustomHeight = clamp(command.mascotWindowCustomHeight, 180, 1000)
    }
    if (command.mascotWindowAreaSizePreset) {
      nextSettings.mascotWindowAreaSizePreset = command.mascotWindowAreaSizePreset
    }
    if (typeof command.mascotWindowAreaCustomWidth === 'number') {
      nextSettings.mascotWindowAreaCustomWidth = clamp(command.mascotWindowAreaCustomWidth, 120, 800)
    }
    if (typeof command.mascotWindowAreaCustomHeight === 'number') {
      nextSettings.mascotWindowAreaCustomHeight = clamp(command.mascotWindowAreaCustomHeight, 180, 1000)
    }

    if (typeof command.mascotShowHitArea === 'boolean') {
      nextSettings.mascotShowHitArea = command.mascotShowHitArea
    }

    if (command.mascotClickThroughMode) {
      nextSettings.mascotClickThroughMode = command.mascotClickThroughMode
    }
    if (command.mascotSpeechBubblePlacement) {
      nextSettings.mascotSpeechBubblePlacement = command.mascotSpeechBubblePlacement
    }
    if (typeof command.mascotSpeechBubbleOffsetX === 'number') {
      nextSettings.mascotSpeechBubbleOffsetX = clamp(command.mascotSpeechBubbleOffsetX, -200, 200)
    }
    if (typeof command.mascotSpeechBubbleOffsetY === 'number') {
      nextSettings.mascotSpeechBubbleOffsetY = clamp(command.mascotSpeechBubbleOffsetY, -200, 200)
    }
    if (typeof command.speechBubbleTailOffsetX === 'number') {
      nextSettings.speechBubbleTailOffsetX = clamp(command.speechBubbleTailOffsetX, -200, 200)
    }
    if (typeof command.speechBubbleTailOffsetY === 'number') {
      nextSettings.speechBubbleTailOffsetY = clamp(command.speechBubbleTailOffsetY, -200, 200)
    }
    if (typeof command.speechBubbleTailSize === 'number') {
      nextSettings.speechBubbleTailSize = clamp(command.speechBubbleTailSize, 4, 40)
    }
    if (typeof command.speechBubbleTailRotationDeg === 'number') {
      nextSettings.speechBubbleTailRotationDeg = clamp(command.speechBubbleTailRotationDeg, -90, 90)
    }
    if (command.speechBubbleTailDirection) {
      nextSettings.speechBubbleTailDirection = command.speechBubbleTailDirection
    }
    if (typeof command.speechBubbleTailMirrored === 'boolean') {
      nextSettings.speechBubbleTailMirrored = command.speechBubbleTailMirrored
    }
    if (typeof command.speechBubbleBorderEnabled === 'boolean') {
      nextSettings.speechBubbleBorderEnabled = command.speechBubbleBorderEnabled
    }
    if (typeof command.speechBubbleBorderWidth === 'number') {
      nextSettings.speechBubbleBorderWidth = clamp(command.speechBubbleBorderWidth, 0, 8)
    }
    if (command.speechBubbleWidthMode) {
      nextSettings.speechBubbleWidthMode = command.speechBubbleWidthMode
    }
    if (command.speechBubbleHeightMode) {
      nextSettings.speechBubbleHeightMode = command.speechBubbleHeightMode
    }
    if (typeof command.speechBubbleMaxWidth === 'number') {
      nextSettings.speechBubbleMaxWidth = clamp(command.speechBubbleMaxWidth, 80, 800)
    }
    if (typeof command.speechBubbleMaxHeight === 'number') {
      nextSettings.speechBubbleMaxHeight = clamp(command.speechBubbleMaxHeight, 40, 800)
    }
    if (typeof command.mascotSpeechBubbleFontSize === 'number') {
      nextSettings.mascotSpeechBubbleFontSize = clamp(command.mascotSpeechBubbleFontSize, 10, 24)
    }
    if (command.mascotSpeechBubbleFontFamily) {
      nextSettings.mascotSpeechBubbleFontFamily = command.mascotSpeechBubbleFontFamily
    }
    if (command.speechBubbleWritingMode) {
      nextSettings.speechBubbleWritingMode = command.speechBubbleWritingMode
    }
    if (command.mascotVerticalAlign) {
      nextSettings.mascotVerticalAlign = command.mascotVerticalAlign
    }
    if (command.mascotHorizontalAlign) {
      nextSettings.mascotHorizontalAlign = command.mascotHorizontalAlign
    }
    if (typeof command.mascotOffsetX === 'number') {
      nextSettings.mascotOffsetX = clamp(command.mascotOffsetX, -200, 200)
    }
    if (typeof command.mascotOffsetY === 'number') {
      nextSettings.mascotOffsetY = clamp(command.mascotOffsetY, -200, 200)
    }
    if (command.lifestyleProfile) {
      nextSettings.lifestyleProfile = command.lifestyleProfile
    }
    if (command.mascotType) {
      nextSettings.mascotType = command.mascotType
    }
    if (command.characterVoiceProfile) {
      nextSettings.characterVoiceProfile = command.characterVoiceProfile
    }

    if (typeof command.hourlyChimeEnabled === 'boolean') {
      nextSettings.hourlyChimeEnabled = command.hourlyChimeEnabled
    }

    if (command.hourlyChimeIntervalMinutes) {
      nextSettings.hourlyChimeIntervalMinutes = command.hourlyChimeIntervalMinutes
    }

    if (typeof command.hourlyChimeQuietHoursEnabled === 'boolean') {
      nextSettings.hourlyChimeQuietHoursEnabled = command.hourlyChimeQuietHoursEnabled
    }

    if (typeof command.hourlyChimeQuietStartHour === 'number') {
      nextSettings.hourlyChimeQuietStartHour = command.hourlyChimeQuietStartHour
    }

    if (typeof command.hourlyChimeQuietEndHour === 'number') {
      nextSettings.hourlyChimeQuietEndHour = command.hourlyChimeQuietEndHour
    }

    if (typeof command.idleSpeechEnabled === 'boolean') {
      nextSettings.idleSpeechEnabled = command.idleSpeechEnabled
    }

    if (typeof command.idleSpeechIntervalMinutes === 'number') {
      nextSettings.idleSpeechIntervalMinutes = clamp(command.idleSpeechIntervalMinutes, 1, 120)
    }
    if (typeof command.idleSpeechCooldownMs === 'number') {
      nextSettings.idleSpeechCooldownMs = clamp(command.idleSpeechCooldownMs, 0, 10 * 60_000)
    }
    if (typeof command.debugSpeechEnabled === 'boolean') {
      nextSettings.debugSpeechEnabled = command.debugSpeechEnabled
    }
    if (typeof command.debugSpeechIntervalSeconds === 'number') {
      nextSettings.debugSpeechIntervalSeconds = clamp(command.debugSpeechIntervalSeconds, 5, 3600)
    }
    if (typeof command.autoIdleSpeechEnabled === 'boolean') {
      nextSettings.autoIdleSpeechEnabled = command.autoIdleSpeechEnabled
    }
    if (typeof command.autoIdleSpeechMinMinutes === 'number') {
      nextSettings.autoIdleSpeechMinMinutes = clamp(command.autoIdleSpeechMinMinutes, 1, 120)
    }
    if (typeof command.autoIdleSpeechMaxMinutes === 'number') {
      nextSettings.autoIdleSpeechMaxMinutes = clamp(command.autoIdleSpeechMaxMinutes, 1, 120)
    }
    if (nextSettings.autoIdleSpeechMinMinutes > nextSettings.autoIdleSpeechMaxMinutes) {
      const min = Math.min(nextSettings.autoIdleSpeechMinMinutes, nextSettings.autoIdleSpeechMaxMinutes)
      const max = Math.max(nextSettings.autoIdleSpeechMinMinutes, nextSettings.autoIdleSpeechMaxMinutes)
      nextSettings.autoIdleSpeechMinMinutes = min
      nextSettings.autoIdleSpeechMaxMinutes = max
    }
    if (typeof command.autoIdleSpeechAfterInteractionDelaySeconds === 'number') {
      nextSettings.autoIdleSpeechAfterInteractionDelaySeconds = clamp(
        command.autoIdleSpeechAfterInteractionDelaySeconds,
        0,
        3600
      )
    }
    if (typeof command.clickSpeechCooldownMs === 'number') {
      nextSettings.clickSpeechCooldownMs = clamp(command.clickSpeechCooldownMs, 0, 10_000)
    }
    if (typeof command.vrmIdleMotionEnabled === 'boolean') {
      nextSettings.vrmIdleMotionEnabled = command.vrmIdleMotionEnabled
    }
    if (typeof command.vrmSpringBoneEnabled === 'boolean') {
      nextSettings.vrmSpringBoneEnabled = command.vrmSpringBoneEnabled
    }
    if (typeof command.vrmBlinkEnabled === 'boolean') {
      nextSettings.vrmBlinkEnabled = command.vrmBlinkEnabled
    }
    if (typeof command.vrmMouthMotionEnabled === 'boolean') {
      nextSettings.vrmMouthMotionEnabled = command.vrmMouthMotionEnabled
    }
    if (typeof command.speechDebugVerboseLoggingEnabled === 'boolean') {
      nextSettings.speechDebugVerboseLoggingEnabled = command.speechDebugVerboseLoggingEnabled
    }
    if (typeof command.speechLogFileEnabled === 'boolean') {
      nextSettings.speechLogFileEnabled = command.speechLogFileEnabled
    }
    if (typeof command.speechLogDirectory === 'string') {
      nextSettings.speechLogDirectory = command.speechLogDirectory
    }

    appSettings = {
      ...nextSettings
    }
    void saveAppSettings(appSettings)
    void applySpeechLogFileConfiguration()

    if (appSettings.openDevToolsOnStartup) {
      openDevToolsForWindow(mainWindow)
      openDevToolsForWindow(mascotWindow)
    }

    if (mascotWindow && !mascotWindow.isDestroyed()) {
      const mascotWindowSize = resolveMascotWindowAreaSize(appSettings)
      applyMascotWindowAreaSize(mascotWindow, mascotWindowSize)
      applyMascotWindowStateOptions(mascotWindow)
      if ('selectedCharacterModelId' in command || Boolean(command.characterRendererType)) {
        ensureMascotWindowVisible(mascotWindow)
      }
    }

    broadcastAppSettings()

    return appSettings
  }
)

ipcMain.handle(ipcChannelNames.openDevTools, (_, command: IOpenDevToolsCommand): boolean =>
  openDevToolsByTarget(command.target)
)

ipcMain.handle(ipcChannelNames.scanCharacterModels, async (): Promise<CharacterModelDefinition[]> => {
  if (mascotWindow && !mascotWindow.isDestroyed()) {
    ensureMascotWindowVisible(mascotWindow)
    applyMascotWindowStateOptions(mascotWindow)
  }
  return scanCharacterModels()
})

ipcMain.handle(
  ipcChannelNames.readCharacterModelBinary,
  (_, command: IReadCharacterModelBinaryCommand): Promise<Uint8Array> => readCharacterModelBinary(command)
)

ipcMain.handle(ipcChannelNames.mascotWindowBeginMove, (event): boolean => isMascotWindowSender(event))

ipcMain.handle(
  ipcChannelNames.mascotWindowMoveBy,
  (event, command: IMoveMascotWindowByCommand): boolean => {
    if (!isMascotWindowSender(event) || !mascotWindow || mascotWindow.isDestroyed()) {
      return false
    }

    const [currentX, currentY] = mascotWindow.getPosition()
    mascotWindow.setPosition(
      Math.round(currentX + command.deltaX),
      Math.round(currentY + command.deltaY)
    )

    return true
  }
)

ipcMain.handle(ipcChannelNames.mascotWindowEndMove, (event): boolean => isMascotWindowSender(event))
ipcMain.handle(
  ipcChannelNames.mascotWindowSetClickThrough,
  (event, command: ISetMascotClickThroughCommand): boolean => {
    if (!isMascotWindowSender(event) || !mascotWindow || mascotWindow.isDestroyed()) {
      return false
    }
    if (appSettings.mascotClickThroughMode === 'off') {
      mascotWindow.setIgnoreMouseEvents(false)
      return true
    }
    mascotWindow.setIgnoreMouseEvents(command.enabled, command.enabled ? { forward: command.forward ?? true } : undefined)
    return true
  }
)
ipcMain.handle(ipcChannelNames.mascotWindowGetSize, (): {
  requestedWidth: number
  requestedHeight: number
  windowWidth: number
  windowHeight: number
  contentWidth: number
  contentHeight: number
} | null => {
  if (!mascotWindow || mascotWindow.isDestroyed()) {
    return null
  }
  return getMascotWindowSizeSnapshot(mascotWindow)
})

ipcMain.handle(ipcChannelNames.responseLibraryGet, () => getResponseLibrarySnapshot())
ipcMain.handle(ipcChannelNames.responseLibraryGetRandom, (_, command: IGetRandomResponseCommand) =>
  {
    const selected = getRandomResponseSelection(command)
    void appendSpeechLog({
      trigger: command.trigger,
      source: command.source ?? 'normal',
      categoryId: selected.pickedEntry?.categoryId,
      entryId: selected.pickedEntry?.id,
      text: selected.text,
      lifestyleProfile: command.lifestyleProfile,
      mascotType: command.mascotType,
      timePeriod: selected.timePeriod,
      candidateCount: selected.candidates.length,
      totalWeight: selected.totalWeight,
      selectedWeight: selected.selectedWeight,
      repeatSuppressed: selected.repeatSuppressed,
      avoidedRepeatEntryId: selected.avoidedRepeatEntryId,
      result: selected.usedFallback
        ? selected.candidates.length === 0
          ? 'noCandidate'
          : 'fallback'
        : 'spoken',
      reason: selected.reason
    })
    return selected.text
  }
)
ipcMain.handle(ipcChannelNames.responseLibraryAddEntry, (_, command: IAddResponseEntryCommand) =>
  addResponseEntry(command)
)
ipcMain.handle(ipcChannelNames.responseLibraryUpdateEntry, (_, command: IUpdateResponseEntryCommand) =>
  updateResponseEntry(command)
)
ipcMain.handle(ipcChannelNames.responseLibraryDeleteEntry, (_, command: IDeleteResponseEntryCommand) =>
  deleteResponseEntry(command)
)
ipcMain.handle(ipcChannelNames.responseLibraryToggleEntryEnabled, (_, command: IToggleResponseEntryEnabledCommand) =>
  toggleResponseEntryEnabled(command)
)
ipcMain.handle(ipcChannelNames.responseLibraryAddCategory, (_, command: IAddResponseCategoryCommand) =>
  addResponseCategory(command)
)
ipcMain.handle(ipcChannelNames.responseLibraryUpdateCategory, (_, command: IUpdateResponseCategoryCommand) =>
  updateResponseCategory(command)
)
ipcMain.handle(
  ipcChannelNames.responseLibraryToggleCategoryEnabled,
  (_, command: IToggleResponseCategoryEnabledCommand) => toggleResponseCategoryEnabled(command)
)
ipcMain.handle(ipcChannelNames.responseLibraryReset, () => resetResponseLibrary())
ipcMain.handle(ipcChannelNames.responseLibraryExport, async (): Promise<IExportResponseLibraryResult> => {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  const defaultFileName = `responses-export-${stamp}.json`
  const result = await dialog.showSaveDialog({
    title: 'Export responses',
    defaultPath: join(storagePaths.configDataPath, defaultFileName),
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (result.canceled || !result.filePath) {
    throw new Error('export cancelled')
  }
  const snapshot = getResponseLibrarySnapshot()
  await writeFile(result.filePath, JSON.stringify(snapshot, null, 2), 'utf-8')
  return { filePath: result.filePath }
})
ipcMain.handle(
  ipcChannelNames.responseLibraryImport,
  async (_event, command: IImportResponseLibraryCommand): Promise<IImportResponseLibraryResult> => {
    const picker = await dialog.showOpenDialog({
      title: 'Import responses',
      defaultPath: storagePaths.configDataPath,
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (picker.canceled || picker.filePaths.length === 0) {
      throw new Error('import cancelled')
    }
    const raw = await readFile(picker.filePaths[0], 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    const imported = parseAndNormalizeResponseLibrary(parsed)

    if (command.mode === 'replace') {
      const next = await replaceResponseLibrary(imported)
      return {
        library: next,
        addedCategoryCount: next.categories.length,
        skippedCategoryCount: 0,
        addedEntryCount: next.entries.length,
        skippedEntryCount: 0
      }
    }

    return mergeResponseLibrary(imported)
  }
)
ipcMain.handle(ipcChannelNames.speechLogList, (_, command?: { limit?: number }) => ({
  entries: listSpeechLogs(command?.limit)
}))
ipcMain.handle(ipcChannelNames.speechLogClear, async () => {
  await clearSpeechLogs()
  return true
})
ipcMain.handle(ipcChannelNames.speechLogSelectDirectory, async (): Promise<string | null> => {
  const result = await dialog.showOpenDialog({
    title: 'Select speech log directory',
    defaultPath: getResolvedSpeechLogDirectory(appSettings, storagePaths),
    properties: ['openDirectory', 'createDirectory']
  })
  if (result.canceled || result.filePaths.length === 0) {
    return null
  }
  return result.filePaths[0]
})
ipcMain.handle(ipcChannelNames.speechLogOpenDirectory, async (): Promise<boolean> => {
  try {
    const directory = getResolvedSpeechLogDirectory(appSettings, storagePaths)
    await mkdir(directory, { recursive: true })
    const openResult = await shell.openPath(directory)
    return openResult.length === 0
  } catch {
    return false
  }
})
ipcMain.handle(ipcChannelNames.speechLogClearExternal, async () => {
  await clearExternalSpeechLogs()
  return true
})
ipcMain.handle(ipcChannelNames.getStoragePaths, () => ({
  ...storagePaths
}))
ipcMain.handle(ipcChannelNames.selectUserDataDirectory, async () =>
  selectUserDataDirectory(storagePaths.userDataRootPath)
)
ipcMain.handle(
  ipcChannelNames.changeUserDataDirectory,
  async (_, command: IChangeUserDataDirectoryCommand) => {
    const result = await changeUserDataDirectory(command.userDataDirectory)
    storagePaths = result.paths
    return result
  }
)
ipcMain.handle(ipcChannelNames.resetUserDataDirectory, async () => {
  const result = await resetUserDataDirectoryToDefault()
  storagePaths = result.paths
  return result
})
ipcMain.handle(ipcChannelNames.useProjectUserDataDirectory, async () => {
  const result = await useProjectUserDataDirectory()
  storagePaths = result.paths
  return result
})
ipcMain.handle(ipcChannelNames.openUserDataDirectory, async () =>
  openUserDataDirectory(storagePaths.userDataRootPath)
)

app.whenReady().then(() => {
  void (async () => {
    storagePaths = await resolveStoragePaths()
    initializeSettingsStore(storagePaths.settingsFilePath)
    initializeResponseLibraryStore(storagePaths.responsesFilePath)
    await initializeSpeechLogStore(getSpeechLogFilePathFromStoragePaths(storagePaths))
    appSettings = await loadAppSettings()
    if (!appSettings.speechLogDirectory) {
      appSettings = {
        ...appSettings,
        speechLogDirectory: getDefaultSpeechLogDirectory(storagePaths)
      }
      await saveAppSettings(appSettings)
    }
    await applySpeechLogFileConfiguration()
    await loadResponseLibrary()
    createMainWindow()
    createMascotWindow()
  })()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
      createMascotWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
