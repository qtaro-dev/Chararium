import type { IStorageOperationResult, StoragePaths } from '@shared/index'

interface StorageLocationPanelProps {
  title: string
  storageModeLabel: string
  portableModeLabel: string
  appRootLabel: string
  changeableGroupTitle: string
  autoResolvedGroupTitle: string
  fixedGroupTitle: string
  changeableHintLabel: string
  autoResolvedHintLabel: string
  fixedHintLabel: string
  userDataRootLabel: string
  configDataPathLabel: string
  electronDataPathLabel: string
  settingsFileLabel: string
  responsesFileLabel: string
  bootstrapFileLabel: string
  electronCurrentUserDataLabel: string
  changeButtonLabel: string
  openButtonLabel: string
  resetButtonLabel: string
  reloadButtonLabel: string
  useProjectButtonLabel: string
  copyNoticeLabel: string
  nextLaunchNoticeLabel: string
  selectFolderHintLabel: string
  cancelledLabel: string
  changedLabel: string
  failedLabel: string
  resetDoneLabel: string
  paths: StoragePaths | null
  message: string
  onReload: () => void
  onOpen: () => void
  onSelectAndChange: () => void
  onUseProjectDirectory: () => void
  onResetDefault: () => void
}

export function getStorageMessage(result: IStorageOperationResult | null): string {
  if (!result) return ''
  return result.message
}

export function StorageLocationPanel(props: StorageLocationPanelProps): React.JSX.Element {
  const {
    title,
    storageModeLabel,
    portableModeLabel,
    appRootLabel,
    changeableGroupTitle,
    autoResolvedGroupTitle,
    fixedGroupTitle,
    changeableHintLabel,
    autoResolvedHintLabel,
    fixedHintLabel,
    userDataRootLabel,
    configDataPathLabel,
    electronDataPathLabel,
    settingsFileLabel,
    responsesFileLabel,
    bootstrapFileLabel,
    electronCurrentUserDataLabel,
    changeButtonLabel,
    openButtonLabel,
    resetButtonLabel,
    reloadButtonLabel,
    useProjectButtonLabel,
    copyNoticeLabel,
    nextLaunchNoticeLabel,
    message,
    paths,
    onReload,
    onOpen,
    onSelectAndChange,
    onUseProjectDirectory,
    onResetDefault
  } = props

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="storage-groups">
        <div className="storage-group">
          <h3>{storageModeLabel}</h3>
          <p className="muted">{portableModeLabel}</p>
          <p className="muted">{appRootLabel}: {paths?.appRootPath ?? '-'}</p>
        </div>
        <div className="storage-group">
          <h3>{changeableGroupTitle}</h3>
          <p className="muted">{userDataRootLabel}: {paths?.userDataRootPath ?? '-'}</p>
          <p className="muted">{configDataPathLabel}: {paths?.configDataPath ?? '-'}</p>
          <p className="muted">{electronDataPathLabel}: {paths?.electronUserDataPath ?? '-'}</p>
          <p className="muted">{changeableHintLabel}</p>
        </div>
        <div className="storage-group">
          <h3>{autoResolvedGroupTitle}</h3>
          <p className="muted">{settingsFileLabel}: {paths?.settingsFilePath ?? '-'}</p>
          <p className="muted">{responsesFileLabel}: {paths?.responsesFilePath ?? '-'}</p>
          <p className="muted">{autoResolvedHintLabel}</p>
        </div>
        <div className="storage-group">
          <h3>{fixedGroupTitle}</h3>
          <p className="muted">{bootstrapFileLabel}: {paths?.bootstrapFilePath ?? '-'}</p>
          <p className="muted">{electronCurrentUserDataLabel}: {paths?.currentElectronUserDataPath ?? '-'}</p>
          <p className="muted">{fixedHintLabel}</p>
        </div>
      </div>
      <p className="muted">{copyNoticeLabel}</p>
      <p className="muted">{nextLaunchNoticeLabel}</p>
      <div className="settings-actions">
        <button type="button" className="secondary-button" onClick={onSelectAndChange}>{changeButtonLabel}</button>
        <button type="button" className="secondary-button" onClick={onUseProjectDirectory}>{useProjectButtonLabel}</button>
        <button type="button" className="secondary-button" onClick={onOpen}>{openButtonLabel}</button>
        <button type="button" className="secondary-button" onClick={onResetDefault}>{resetButtonLabel}</button>
        <button type="button" className="secondary-button" onClick={onReload}>{reloadButtonLabel}</button>
      </div>
      {message
        ? message.split('\n').map((line) => (
            <p key={line} className="settings-note">{line}</p>
          ))
        : null}
    </section>
  )
}
