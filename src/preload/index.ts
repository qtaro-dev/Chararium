import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import {
  ipcChannelNames,
  type AppSettings,
  type CharacterModelDefinition,
  type IAddResponseCategoryCommand,
  type IAddResponseEntryCommand,
  type IChangeUserDataDirectoryCommand,
  type IDeleteResponseEntryCommand,
  type IExportResponseLibraryResult,
  type IGetRandomResponseCommand,
  type IImportResponseLibraryCommand,
  type IImportResponseLibraryResult,
  type IOpenDevToolsCommand,
  type IReadCharacterModelBinaryCommand,
  type IMoveMascotWindowByCommand,
  type IMascotWindowSizeSnapshot,
  type ISetMascotClickThroughCommand,
  type ISpeechLogListCommand,
  type IToggleResponseCategoryEnabledCommand,
  type IToggleResponseEntryEnabledCommand,
  type IUpdateResponseCategoryCommand,
  type IUpdateResponseEntryCommand,
  type ResponseLibrary,
  type StoragePaths,
  type IStorageOperationResult,
  type IUpdateAppSettingsCommand
} from '../shared'

const appBridge = {
  getRuntimeInfo: () => ({
    appName: 'Chararium',
    platform: process.platform,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node
  }),
  storage: {
    getPaths: (): Promise<StoragePaths> => ipcRenderer.invoke(ipcChannelNames.getStoragePaths),
    selectUserDataDirectory: (): Promise<string | null> =>
      ipcRenderer.invoke(ipcChannelNames.selectUserDataDirectory),
    changeUserDataDirectory: (command: IChangeUserDataDirectoryCommand): Promise<IStorageOperationResult> =>
      ipcRenderer.invoke(ipcChannelNames.changeUserDataDirectory, command),
    useProjectUserDataDirectory: (): Promise<IStorageOperationResult> =>
      ipcRenderer.invoke(ipcChannelNames.useProjectUserDataDirectory),
    resetUserDataDirectory: (): Promise<IStorageOperationResult> =>
      ipcRenderer.invoke(ipcChannelNames.resetUserDataDirectory),
    openUserDataDirectory: (): Promise<IStorageOperationResult> =>
      ipcRenderer.invoke(ipcChannelNames.openUserDataDirectory)
  },
  settings: {
    getAppSettings: (): Promise<AppSettings> => ipcRenderer.invoke(ipcChannelNames.getAppSettings),
    updateAppSettings: (command: IUpdateAppSettingsCommand): Promise<AppSettings> =>
      ipcRenderer.invoke(ipcChannelNames.updateAppSettings, command),
    onAppSettingsChanged: (listener: (settings: AppSettings) => void): (() => void) => {
      const wrappedListener = (_event: IpcRendererEvent, settings: AppSettings): void => {
        listener(settings)
      }

      ipcRenderer.on(ipcChannelNames.appSettingsChanged, wrappedListener)
      return () => {
        ipcRenderer.removeListener(ipcChannelNames.appSettingsChanged, wrappedListener)
      }
    }
  },
  devTools: {
    openMain: (): Promise<boolean> =>
      ipcRenderer.invoke(ipcChannelNames.openDevTools, {
        target: 'main'
      } as IOpenDevToolsCommand),
    openMascot: (): Promise<boolean> =>
      ipcRenderer.invoke(ipcChannelNames.openDevTools, {
        target: 'mascot'
      } as IOpenDevToolsCommand)
  },
  models: {
    scanModels: (): Promise<CharacterModelDefinition[]> =>
      ipcRenderer.invoke(ipcChannelNames.scanCharacterModels),
    readModelBinary: (command: IReadCharacterModelBinaryCommand): Promise<Uint8Array> =>
      ipcRenderer.invoke(ipcChannelNames.readCharacterModelBinary, command)
  },
  mascotWindow: {
    beginMove: (): Promise<boolean> => ipcRenderer.invoke(ipcChannelNames.mascotWindowBeginMove),
    moveBy: (command: IMoveMascotWindowByCommand): Promise<boolean> =>
      ipcRenderer.invoke(ipcChannelNames.mascotWindowMoveBy, command),
    endMove: (): Promise<boolean> => ipcRenderer.invoke(ipcChannelNames.mascotWindowEndMove),
    setClickThrough: (command: ISetMascotClickThroughCommand): Promise<boolean> =>
      ipcRenderer.invoke(ipcChannelNames.mascotWindowSetClickThrough, command),
    getSize: (): Promise<IMascotWindowSizeSnapshot | null> =>
      ipcRenderer.invoke(ipcChannelNames.mascotWindowGetSize)
  },
  responseLibrary: {
    get: (): Promise<ResponseLibrary> => ipcRenderer.invoke(ipcChannelNames.responseLibraryGet),
    getRandomResponse: (command: IGetRandomResponseCommand): Promise<string> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryGetRandom, command),
    addEntry: (command: IAddResponseEntryCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryAddEntry, command),
    updateEntry: (command: IUpdateResponseEntryCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryUpdateEntry, command),
    deleteEntry: (command: IDeleteResponseEntryCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryDeleteEntry, command),
    toggleEntryEnabled: (command: IToggleResponseEntryEnabledCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryToggleEntryEnabled, command),
    addCategory: (command: IAddResponseCategoryCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryAddCategory, command),
    updateCategory: (command: IUpdateResponseCategoryCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryUpdateCategory, command),
    toggleCategoryEnabled: (command: IToggleResponseCategoryEnabledCommand): Promise<ResponseLibrary> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryToggleCategoryEnabled, command),
    reset: (): Promise<ResponseLibrary> => ipcRenderer.invoke(ipcChannelNames.responseLibraryReset),
    export: (): Promise<IExportResponseLibraryResult> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryExport),
    import: (command: IImportResponseLibraryCommand): Promise<IImportResponseLibraryResult> =>
      ipcRenderer.invoke(ipcChannelNames.responseLibraryImport, command)
  },
  speechLog: {
    list: (command?: ISpeechLogListCommand) =>
      ipcRenderer.invoke(ipcChannelNames.speechLogList, command),
    clear: () => ipcRenderer.invoke(ipcChannelNames.speechLogClear),
    selectDirectory: (): Promise<string | null> =>
      ipcRenderer.invoke(ipcChannelNames.speechLogSelectDirectory),
    openDirectory: (): Promise<boolean> =>
      ipcRenderer.invoke(ipcChannelNames.speechLogOpenDirectory),
    clearExternal: (): Promise<boolean> =>
      ipcRenderer.invoke(ipcChannelNames.speechLogClearExternal)
  }
}

contextBridge.exposeInMainWorld('chararium', appBridge)

export type AppBridge = typeof appBridge
