export interface StorageLocationConfig {
  version: number
  storageMode?: 'portable'
  userDataRoot?: string
  configDirectory?: string
  electronUserDataDirectory?: string
}

export interface StoragePaths {
  storageMode: 'portable'
  appRootPath: string
  bootstrapFilePath: string
  userDataRootPath: string
  configDataPath: string
  logsDataPath: string
  electronUserDataPath: string
  currentElectronUserDataPath: string
  settingsFilePath: string
  responsesFilePath: string
}

export interface IChangeUserDataDirectoryCommand {
  userDataDirectory: string
}

export interface IStorageOperationResult {
  success: boolean
  message: string
  paths: StoragePaths
  copyResults?: {
    settingsCopied: boolean
    responsesCopied: boolean
    settingsMissingAtSource: boolean
    responsesMissingAtSource: boolean
    settingsBackupCreated: boolean
    responsesBackupCreated: boolean
  }
}
