interface DeveloperToolsPanelProps {
  title: string
  devToolsTitle: string
  autoOpenLabel: string
  autoOpenDescription: string
  openMainButtonLabel: string
  openMascotButtonLabel: string
  runtimeInfoLabel: string
  storagePathsTitle: string
  storageModeLabel: string
  appRootLabel: string
  portableModeLabel: string
  userDataRootLabel: string
  configDataPathLabel: string
  electronDataPathLabel: string
  bootstrapFileLabel: string
  electronCurrentUserDataLabel: string
  settingsFileLabel: string
  responsesFileLabel: string
  logsDirectoryLabel: string
  visibleModelDataTitle: string
  modelNameLabel: string
  modelFormatLabel: string
  rendererTypeLabel: string
  modelPathLabel: string
  currentDisplaySizeLabel: string
  currentDisplayScaleLabel: string
  currentAreaSizeLabel: string
  currentMascotAlignLabel: string
  speechBubbleWritingModeLabel: string
  speechBubbleFontFamilyLabel: string
  speechBubbleFontSizeLabel: string
  speechBubbleTailConfigLabel: string
  speechBubbleBorderConfigLabel: string
  vrmMotionTitle: string
  vrmIdleMotionLabel: string
  vrmSpringBoneLabel: string
  vrmBlinkLabel: string
  vrmMouthMotionLabel: string
  unsetLabel: string
  debugSettingsTitle: string
  debugSpeechTitle: string
  debugSpeechEnabledLabel: string
  debugSpeechIntervalSecondsLabel: string
  debugSpeechIntervalDescription: string
  clickSpeechTitle: string
  clickSpeechCooldownLabel: string
  clickSpeechCooldownDescription: string
  mascotFocusableLabel: string
  mascotFocusableDescription: string
  speechLogSettingsTitle: string
  speechVerboseLoggingLabel: string
  speechVerboseLoggingDescription: string
  speechLogFileEnabledLabel: string
  speechLogDirectoryLabel: string
  speechLogSelectDirectoryLabel: string
  speechLogOpenDirectoryLabel: string
  speechLogClearLabel: string
  speechLogClearExternalLabel: string
  speechLogDirectoryDescription: string
  selectFolderMessage: string
  debugStatusMessage: string
  openDevToolsOnStartup: boolean
  debugSpeechEnabled: boolean
  debugSpeechIntervalSeconds: number
  clickSpeechCooldownMs: number
  mascotFocusable: boolean
  speechLogFileEnabled: boolean
  speechDebugVerboseLoggingEnabled: boolean
  speechLogDirectoryPath: string
  vrmIdleMotionEnabled: boolean
  vrmSpringBoneEnabled: boolean
  vrmBlinkEnabled: boolean
  vrmMouthMotionEnabled: boolean
  runtimeInfoText: string
  storagePaths: {
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
  } | null
  visibleModelData: {
    modelName: string
    modelFormat: string
    rendererType: string
    modelPath: string
    displaySize: string
    displayScale: string
    areaSize: string
    mascotAlign: string
    writingMode: string
    fontFamily: string
    fontSize: string
    tailConfig: string
    borderConfig: string
  }
  onToggleOpenDevToolsOnStartup: (nextValue: boolean) => void
  onOpenMainDevTools: () => void
  onOpenMascotDevTools: () => void
  onToggleDebugSpeechEnabled: (nextValue: boolean) => void
  onChangeDebugSpeechIntervalSeconds: (nextValue: number) => void
  onChangeClickSpeechCooldownMs: (nextValue: number) => void
  onToggleMascotFocusable: (nextValue: boolean) => void
  onToggleSpeechLogFileEnabled: (nextValue: boolean) => void
  onToggleSpeechDebugVerboseLoggingEnabled: (nextValue: boolean) => void
  onSelectSpeechLogDirectory: () => void
  onOpenSpeechLogDirectory: () => void
  onClearSpeechLogs: () => void
  onClearExternalSpeechLogs: () => void
  onToggleVrmIdleMotionEnabled: (nextValue: boolean) => void
  onToggleVrmSpringBoneEnabled: (nextValue: boolean) => void
  onToggleVrmBlinkEnabled: (nextValue: boolean) => void
  onToggleVrmMouthMotionEnabled: (nextValue: boolean) => void
}

export function DeveloperToolsPanel({
  title,
  devToolsTitle,
  autoOpenLabel,
  autoOpenDescription,
  openMainButtonLabel,
  openMascotButtonLabel,
  runtimeInfoLabel,
  storagePathsTitle,
  storageModeLabel,
  appRootLabel,
  portableModeLabel,
  userDataRootLabel,
  configDataPathLabel,
  electronDataPathLabel,
  bootstrapFileLabel,
  electronCurrentUserDataLabel,
  settingsFileLabel,
  responsesFileLabel,
  logsDirectoryLabel,
  visibleModelDataTitle,
  modelNameLabel,
  modelFormatLabel,
  rendererTypeLabel,
  modelPathLabel,
  currentDisplaySizeLabel,
  currentDisplayScaleLabel,
  currentAreaSizeLabel,
  currentMascotAlignLabel,
  speechBubbleWritingModeLabel,
  speechBubbleFontFamilyLabel,
  speechBubbleFontSizeLabel,
  speechBubbleTailConfigLabel,
  speechBubbleBorderConfigLabel,
  vrmMotionTitle,
  vrmIdleMotionLabel,
  vrmSpringBoneLabel,
  vrmBlinkLabel,
  vrmMouthMotionLabel,
  unsetLabel,
  debugSettingsTitle,
  debugSpeechTitle,
  debugSpeechEnabledLabel,
  debugSpeechIntervalSecondsLabel,
  debugSpeechIntervalDescription,
  clickSpeechTitle,
  clickSpeechCooldownLabel,
  clickSpeechCooldownDescription,
  mascotFocusableLabel,
  mascotFocusableDescription,
  speechLogSettingsTitle,
  speechVerboseLoggingLabel,
  speechVerboseLoggingDescription,
  speechLogFileEnabledLabel,
  speechLogDirectoryLabel,
  speechLogSelectDirectoryLabel,
  speechLogOpenDirectoryLabel,
  speechLogClearLabel,
  speechLogClearExternalLabel,
  speechLogDirectoryDescription,
  selectFolderMessage,
  debugStatusMessage,
  openDevToolsOnStartup,
  debugSpeechEnabled,
  debugSpeechIntervalSeconds,
  clickSpeechCooldownMs,
  mascotFocusable,
  speechLogFileEnabled,
  speechDebugVerboseLoggingEnabled,
  speechLogDirectoryPath,
  vrmIdleMotionEnabled,
  vrmSpringBoneEnabled,
  vrmBlinkEnabled,
  vrmMouthMotionEnabled,
  runtimeInfoText,
  storagePaths,
  visibleModelData,
  onToggleOpenDevToolsOnStartup,
  onOpenMainDevTools,
  onOpenMascotDevTools,
  onToggleDebugSpeechEnabled,
  onChangeDebugSpeechIntervalSeconds,
  onChangeClickSpeechCooldownMs,
  onToggleMascotFocusable,
  onToggleSpeechLogFileEnabled,
  onToggleSpeechDebugVerboseLoggingEnabled,
  onSelectSpeechLogDirectory,
  onOpenSpeechLogDirectory,
  onClearSpeechLogs,
  onClearExternalSpeechLogs,
  onToggleVrmIdleMotionEnabled,
  onToggleVrmSpringBoneEnabled,
  onToggleVrmBlinkEnabled,
  onToggleVrmMouthMotionEnabled
}: DeveloperToolsPanelProps): React.JSX.Element {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="settings-devtools">
        <h3>{devToolsTitle}</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={openDevToolsOnStartup}
            onChange={(event) => onToggleOpenDevToolsOnStartup(event.currentTarget.checked)}
          />
          <span>{autoOpenLabel}</span>
        </label>
        <p className="muted">{autoOpenDescription}</p>
        <div className="settings-actions">
          <button type="button" className="secondary-button" onClick={onOpenMainDevTools}>
            {openMainButtonLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onOpenMascotDevTools}>
            {openMascotButtonLabel}
          </button>
        </div>
      </div>
      <div className="settings-mascot-controls">
        <h3>{runtimeInfoLabel}</h3>
        <p className="muted">{runtimeInfoText}</p>
      </div>
      <div className="settings-mascot-controls">
        <h3>{storagePathsTitle}</h3>
        <p className="muted">{storageModeLabel}: {portableModeLabel}</p>
        <p className="muted">{appRootLabel}: {storagePaths?.appRootPath ?? '-'}</p>
        <p className="muted">{bootstrapFileLabel}: {storagePaths?.bootstrapFilePath ?? '-'}</p>
        <p className="muted">{userDataRootLabel}: {storagePaths?.userDataRootPath ?? '-'}</p>
        <p className="muted">{configDataPathLabel}: {storagePaths?.configDataPath ?? '-'}</p>
        <p className="muted">{electronDataPathLabel}: {storagePaths?.electronUserDataPath ?? '-'}</p>
        <p className="muted">{electronCurrentUserDataLabel}: {storagePaths?.currentElectronUserDataPath ?? '-'}</p>
        <p className="muted">{settingsFileLabel}: {storagePaths?.settingsFilePath ?? '-'}</p>
        <p className="muted">{responsesFileLabel}: {storagePaths?.responsesFilePath ?? '-'}</p>
        <p className="muted">{logsDirectoryLabel}: {storagePaths?.logsDataPath ?? '-'}</p>
      </div>
      <div className="settings-mascot-controls">
        <h3>{visibleModelDataTitle}</h3>
        <p className="muted">{modelNameLabel}: {visibleModelData.modelName || unsetLabel}</p>
        <p className="muted">{modelFormatLabel}: {visibleModelData.modelFormat || unsetLabel}</p>
        <p className="muted">{rendererTypeLabel}: {visibleModelData.rendererType || unsetLabel}</p>
        <p className="muted">{modelPathLabel}: {visibleModelData.modelPath || unsetLabel}</p>
        <p className="muted">{currentDisplaySizeLabel}: {visibleModelData.displaySize || unsetLabel}</p>
        <p className="muted">{currentDisplayScaleLabel}: {visibleModelData.displayScale || unsetLabel}</p>
        <p className="muted">{currentAreaSizeLabel}: {visibleModelData.areaSize || unsetLabel}</p>
        <p className="muted">{currentMascotAlignLabel}: {visibleModelData.mascotAlign || unsetLabel}</p>
        <p className="muted">{speechBubbleWritingModeLabel}: {visibleModelData.writingMode || unsetLabel}</p>
        <p className="muted">{speechBubbleFontFamilyLabel}: {visibleModelData.fontFamily || unsetLabel}</p>
        <p className="muted">{speechBubbleFontSizeLabel}: {visibleModelData.fontSize || unsetLabel}</p>
        <p className="muted">{speechBubbleTailConfigLabel}: {visibleModelData.tailConfig || unsetLabel}</p>
        <p className="muted">{speechBubbleBorderConfigLabel}: {visibleModelData.borderConfig || unsetLabel}</p>
      </div>
      <div className="settings-mascot-controls">
        <h3>{debugSettingsTitle}</h3>
        <h4>{vrmMotionTitle}</h4>
        <label className="settings-toggle">
          <input type="checkbox" checked={vrmIdleMotionEnabled} onChange={(event) => onToggleVrmIdleMotionEnabled(event.currentTarget.checked)} />
          <span>{vrmIdleMotionLabel}</span>
        </label>
        <label className="settings-toggle">
          <input type="checkbox" checked={vrmSpringBoneEnabled} onChange={(event) => onToggleVrmSpringBoneEnabled(event.currentTarget.checked)} />
          <span>{vrmSpringBoneLabel}</span>
        </label>
        <label className="settings-toggle">
          <input type="checkbox" checked={vrmBlinkEnabled} onChange={(event) => onToggleVrmBlinkEnabled(event.currentTarget.checked)} />
          <span>{vrmBlinkLabel}</span>
        </label>
        <label className="settings-toggle">
          <input type="checkbox" checked={vrmMouthMotionEnabled} onChange={(event) => onToggleVrmMouthMotionEnabled(event.currentTarget.checked)} />
          <span>{vrmMouthMotionLabel}</span>
        </label>

        <h4>{debugSpeechTitle}</h4>
        <label className="settings-toggle">
          <input type="checkbox" checked={debugSpeechEnabled} onChange={(event) => onToggleDebugSpeechEnabled(event.currentTarget.checked)} />
          <span>{debugSpeechEnabledLabel}</span>
        </label>
        <label className="settings-select-label">
          <span>{debugSpeechIntervalSecondsLabel}</span>
          <input
            className="settings-input"
            type="number"
            min={5}
            max={3600}
            step={1}
            value={debugSpeechIntervalSeconds}
            onChange={(event) => onChangeDebugSpeechIntervalSeconds(Number(event.currentTarget.value))}
          />
        </label>
        <p className="muted">{debugSpeechIntervalDescription}</p>

        <h4>{clickSpeechTitle}</h4>
        <label className="settings-select-label">
          <span>{clickSpeechCooldownLabel}</span>
          <input
            className="settings-input"
            type="number"
            min={0}
            max={10000}
            step={1}
            value={clickSpeechCooldownMs}
            onChange={(event) => onChangeClickSpeechCooldownMs(Number(event.currentTarget.value))}
          />
        </label>
        <p className="muted">{clickSpeechCooldownDescription}</p>
        <label className="settings-toggle">
          <input type="checkbox" checked={mascotFocusable} onChange={(event) => onToggleMascotFocusable(event.currentTarget.checked)} />
          <span>{mascotFocusableLabel}</span>
        </label>
        <p className="muted">{mascotFocusableDescription}</p>

        <h4>{speechLogSettingsTitle}</h4>
        <label className="settings-toggle">
          <input type="checkbox" checked={speechLogFileEnabled} onChange={(event) => onToggleSpeechLogFileEnabled(event.currentTarget.checked)} />
          <span>{speechLogFileEnabledLabel}</span>
        </label>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={speechDebugVerboseLoggingEnabled}
            onChange={(event) => onToggleSpeechDebugVerboseLoggingEnabled(event.currentTarget.checked)}
          />
          <span>{speechVerboseLoggingLabel}</span>
        </label>
        <p className="muted">{speechVerboseLoggingDescription}</p>
        <p className="muted">{speechLogDirectoryLabel}: {speechLogDirectoryPath || selectFolderMessage}</p>
        <p className="muted">{speechLogDirectoryDescription}</p>
        <div className="settings-actions">
          <button type="button" className="secondary-button" onClick={onSelectSpeechLogDirectory}>
            {speechLogSelectDirectoryLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onOpenSpeechLogDirectory}>
            {speechLogOpenDirectoryLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onClearSpeechLogs}>
            {speechLogClearLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onClearExternalSpeechLogs}>
            {speechLogClearExternalLabel}
          </button>
        </div>
        {debugStatusMessage ? <p className="muted">{debugStatusMessage}</p> : null}
      </div>
    </section>
  )
}
