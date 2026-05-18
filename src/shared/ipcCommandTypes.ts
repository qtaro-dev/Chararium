export const ipcChannelNames = {
  getAppSettings: 'app-settings:get',
  updateAppSettings: 'app-settings:update',
  appSettingsChanged: 'app-settings:changed',
  openDevTools: 'dev-tools:open',
  scanCharacterModels: 'character-models:scan',
  readCharacterModelBinary: 'character-models:read-binary',
  mascotWindowBeginMove: 'mascot-window:begin-move',
  mascotWindowMoveBy: 'mascot-window:move-by',
  mascotWindowEndMove: 'mascot-window:end-move',
  mascotWindowSetClickThrough: 'mascot-window:set-click-through',
  mascotWindowGetSize: 'mascot-window:get-size',
  responseLibraryGet: 'response-library:get',
  responseLibraryGetRandom: 'response-library:get-random',
  responseLibraryAddEntry: 'response-library:add-entry',
  responseLibraryUpdateEntry: 'response-library:update-entry',
  responseLibraryDeleteEntry: 'response-library:delete-entry',
  responseLibraryToggleEntryEnabled: 'response-library:toggle-entry-enabled',
  responseLibraryAddCategory: 'response-library:add-category',
  responseLibraryUpdateCategory: 'response-library:update-category',
  responseLibraryToggleCategoryEnabled: 'response-library:toggle-category-enabled',
  responseLibraryReset: 'response-library:reset',
  responseLibraryExport: 'response-library:export',
  responseLibraryImport: 'response-library:import',
  speechLogList: 'speech-log:list',
  speechLogClear: 'speech-log:clear',
  speechLogSelectDirectory: 'speech-log:select-directory',
  speechLogOpenDirectory: 'speech-log:open-directory',
  speechLogClearExternal: 'speech-log:clear-external',
  getStoragePaths: 'app-storage:get-paths',
  selectUserDataDirectory: 'app-storage:select-user-data-directory',
  changeUserDataDirectory: 'app-storage:change-user-data-directory',
  useProjectUserDataDirectory: 'app-storage:use-project-user-data-directory',
  resetUserDataDirectory: 'app-storage:reset-user-data-directory',
  openUserDataDirectory: 'app-storage:open-user-data-directory'
} as const

export type DevToolsTarget = 'main' | 'mascot'

export interface IOpenDevToolsCommand {
  target: DevToolsTarget
}

export interface IReadCharacterModelBinaryCommand {
  relativePath: string
}

export interface IMoveMascotWindowByCommand {
  deltaX: number
  deltaY: number
}

export interface ISetMascotClickThroughCommand {
  enabled: boolean
  forward?: boolean
}

export interface IMascotWindowSizeSnapshot {
  requestedWidth: number
  requestedHeight: number
  windowWidth: number
  windowHeight: number
  contentWidth: number
  contentHeight: number
}

export interface ISpeechLogListCommand {
  limit?: number
}

export interface ISpeechLogChangeDirectoryCommand {
  directory: string
}
