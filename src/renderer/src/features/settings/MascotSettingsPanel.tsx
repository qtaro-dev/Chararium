import type {
  CharacterVoiceProfile,
  CharacterRendererType,
  LifestyleProfile,
  MascotType,
  MascotHorizontalAlign,
  MascotClickThroughMode,
  MascotDragMode,
  MascotSpeechBubbleFontFamily,
  SpeechBubbleWritingMode,
  SpeechBubbleTailDirection,
  MascotSpeechBubblePlacement,
  MascotVerticalAlign,
  MascotWindowAreaSizePreset,
  MascotWindowSizePreset
} from '@shared/index'
import { CharacterRenderer } from '../mascot/CharacterRenderer'

interface MascotSettingsPanelProps {
  title: string
  sectionMascotDisplayTitle: string
  sectionClickThroughTitle: string
  sectionDisplaySizeTitle: string
  sectionAreaSizeTitle: string
  sectionLayoutTitle: string
  sectionPendingTitle: string
  sectionApplyResultTitle: string
  sectionPreviewTitle: string
  sectionCurrentValuesTitle: string
  sectionEditingValuesTitle: string
  rendererTitle: string
  rendererSelectionLabel: string
  rendererSelectionDescription: string
  applyRendererButtonLabel: string
  currentRendererLabel: string
  pendingChangesLabel: string
  hasPendingRendererChange: boolean
  warnings: readonly string[]
  rendererOptions: readonly { type: CharacterRendererType; label: string; description: string }[]
  draftRendererType: CharacterRendererType
  appliedRendererType: CharacterRendererType
  onDraftRendererChange: (nextType: CharacterRendererType) => void
  onApplyRenderer: () => void
  dragModeLabel: string
  dragModeDescription: string
  dragModeWarning: string
  dragModeOptions: readonly { value: MascotDragMode; label: string }[]
  dragMode: MascotDragMode
  onDragModeChange: (next: MascotDragMode) => void
  alwaysOnTopLabel: string
  alwaysOnTopDescription: string
  alwaysOnTop: boolean
  onToggleAlwaysOnTop: (next: boolean) => void
  showHitAreaLabel: string
  showHitAreaDescription: string
  showHitArea: boolean
  onToggleShowHitArea: (next: boolean) => void
  clickThroughModeLabel: string
  clickThroughModeDescription: string
  clickThroughModeWarning: string
  clickThroughMode: MascotClickThroughMode
  clickThroughModeOptions: readonly { value: MascotClickThroughMode; label: string }[]
  onClickThroughModeChange: (next: MascotClickThroughMode) => void
  displaySizeLabel: string
  displaySizeDescription: string
  currentDisplaySizePreset: MascotWindowSizePreset
  draftDisplaySizePreset: MascotWindowSizePreset
  displaySizeOptions: readonly { value: MascotWindowSizePreset; label: string }[]
  onDraftDisplaySizePresetChange: (next: MascotWindowSizePreset) => void
  displayScaleLabel: string
  displayScaleDescription: string
  displayScaleValidationLabel: string
  currentDisplayScaleLabel: string
  editingDisplayScaleLabel: string
  currentDisplayCustomScale: number
  draftDisplayCustomScale: number
  onDraftDisplayCustomScaleChange: (next: number) => void
  displayScaleErrorMessage?: string
  areaSizeLabel: string
  areaSizeDescription: string
  currentAreaSizePreset: MascotWindowAreaSizePreset
  draftAreaSizePreset: MascotWindowAreaSizePreset
  areaSizeOptions: readonly { value: MascotWindowAreaSizePreset; label: string }[]
  onDraftAreaSizePresetChange: (next: MascotWindowAreaSizePreset) => void
  customWidthLabel: string
  customHeightLabel: string
  currentAreaWidth: number
  currentAreaHeight: number
  draftAreaWidth: number
  draftAreaHeight: number
  onDraftAreaWidthChange: (next: number) => void
  onDraftAreaHeightChange: (next: number) => void
  speechBubblePlacementLabel: string
  speechBubblePlacementDescription: string
  speechBubblePlacementOptions: readonly { value: MascotSpeechBubblePlacement; label: string }[]
  draftSpeechBubblePlacement: MascotSpeechBubblePlacement
  onDraftSpeechBubblePlacementChange: (next: MascotSpeechBubblePlacement) => void
  speechBubbleOffsetLabel: string
  speechBubbleOffsetXLabel: string
  speechBubbleOffsetYLabel: string
  speechBubbleOffsetXDescription: string
  speechBubbleOffsetYDescription: string
  draftSpeechBubbleOffsetX: number
  draftSpeechBubbleOffsetY: number
  onDraftSpeechBubbleOffsetXChange: (next: number) => void
  onDraftSpeechBubbleOffsetYChange: (next: number) => void
  speechBubbleFontSizeLabel: string
  speechBubbleFontSizeDescription: string
  speechBubbleFontSizeValidationLabel: string
  draftSpeechBubbleFontSize: number
  onDraftSpeechBubbleFontSizeChange: (next: number) => void
  speechBubbleFontFamilyLabel: string
  speechBubbleFontFamilyOptions: readonly { value: MascotSpeechBubbleFontFamily; label: string }[]
  draftSpeechBubbleFontFamily: MascotSpeechBubbleFontFamily
  onDraftSpeechBubbleFontFamilyChange: (next: MascotSpeechBubbleFontFamily) => void
  speechBubbleWritingModeLabel: string
  speechBubbleWritingModeOptions: readonly { value: SpeechBubbleWritingMode; label: string }[]
  draftSpeechBubbleWritingMode: SpeechBubbleWritingMode
  onDraftSpeechBubbleWritingModeChange: (next: SpeechBubbleWritingMode) => void
  speechBubbleTailOffsetLabel: string
  speechBubbleTailOffsetXLabel: string
  speechBubbleTailOffsetYLabel: string
  speechBubbleSizeLabel: string
  speechBubbleWidthModeLabel: string
  speechBubbleHeightModeLabel: string
  speechBubbleAutoLabel: string
  speechBubbleCustomLabel: string
  speechBubbleWidthLabel: string
  speechBubbleHeightLabel: string
  speechBubbleWidthAutoDescription: string
  speechBubbleHeightAutoDescription: string
  speechBubbleCustomHintLabel: string
  speechBubbleSizeDescription: string
  speechBubbleTailSizeLabel: string
  speechBubbleTailSizeDescription: string
  speechBubbleTailRotationLabel: string
  speechBubbleTailRotationDescription: string
  speechBubbleTailDirectionLabel: string
  speechBubbleTailDirectionDescription: string
  speechBubbleTailDirectionOptions: readonly { value: SpeechBubbleTailDirection; label: string }[]
  speechBubbleTailMirroredLabel: string
  speechBubbleTailMirroredDescription: string
  speechBubbleBorderEnabledLabel: string
  speechBubbleBorderWidthLabel: string
  borderOnLabel: string
  borderOffLabel: string
  draftSpeechBubbleTailOffsetX: number
  draftSpeechBubbleTailOffsetY: number
  draftSpeechBubbleWidthMode: 'auto' | 'custom'
  draftSpeechBubbleHeightMode: 'auto' | 'custom'
  draftSpeechBubbleMaxWidth: number
  draftSpeechBubbleMaxHeight: number
  draftSpeechBubbleTailSize: number
  draftSpeechBubbleTailRotationDeg: number
  draftSpeechBubbleTailDirection: SpeechBubbleTailDirection
  draftSpeechBubbleTailMirrored: boolean
  draftSpeechBubbleBorderEnabled: boolean
  draftSpeechBubbleBorderWidth: number
  onDraftSpeechBubbleTailOffsetXChange: (next: number) => void
  onDraftSpeechBubbleTailOffsetYChange: (next: number) => void
  onDraftSpeechBubbleWidthModeChange: (next: 'auto' | 'custom') => void
  onDraftSpeechBubbleHeightModeChange: (next: 'auto' | 'custom') => void
  onDraftSpeechBubbleMaxWidthChange: (next: number) => void
  onDraftSpeechBubbleMaxHeightChange: (next: number) => void
  onDraftSpeechBubbleTailSizeChange: (next: number) => void
  onDraftSpeechBubbleTailRotationDegChange: (next: number) => void
  onDraftSpeechBubbleTailDirectionChange: (next: SpeechBubbleTailDirection) => void
  onDraftSpeechBubbleTailMirroredChange: (next: boolean) => void
  onDraftSpeechBubbleBorderEnabledChange: (next: boolean) => void
  onDraftSpeechBubbleBorderWidthChange: (next: number) => void
  mascotVerticalAlignLabel: string
  mascotHorizontalAlignLabel: string
  mascotAlignDescription: string
  mascotVerticalAlignOptions: readonly { value: MascotVerticalAlign; label: string }[]
  mascotHorizontalAlignOptions: readonly { value: MascotHorizontalAlign; label: string }[]
  draftMascotVerticalAlign: MascotVerticalAlign
  draftMascotHorizontalAlign: MascotHorizontalAlign
  onDraftMascotVerticalAlignChange: (next: MascotVerticalAlign) => void
  onDraftMascotHorizontalAlignChange: (next: MascotHorizontalAlign) => void
  mascotOffsetLabel: string
  mascotOffsetXLabel: string
  mascotOffsetYLabel: string
  mascotOffsetXDescription: string
  mascotOffsetYDescription: string
  draftMascotOffsetX: number
  draftMascotOffsetY: number
  onDraftMascotOffsetXChange: (next: number) => void
  onDraftMascotOffsetYChange: (next: number) => void
  lifestyleProfileLabel: string
  lifestyleProfileDescription: string
  lifestyleProfileOptions: readonly { value: LifestyleProfile; label: string }[]
  draftLifestyleProfile: LifestyleProfile
  onDraftLifestyleProfileChange: (next: LifestyleProfile) => void
  characterVoiceProfileLabel: string
  characterVoiceProfileDescription: string
  characterVoiceProfileOptions: readonly { value: CharacterVoiceProfile; label: string }[]
  draftCharacterVoiceProfile: CharacterVoiceProfile
  onDraftCharacterVoiceProfileChange: (next: CharacterVoiceProfile) => void
  autoIdleSpeechEnabledLabel: string
  autoIdleSpeechEnabledDescription: string
  autoIdleSpeechMinMinutesLabel: string
  autoIdleSpeechMaxMinutesLabel: string
  autoIdleSpeechAfterInteractionDelaySecondsLabel: string
  autoIdleSpeechRangeDescription: string
  draftAutoIdleSpeechEnabled: boolean
  draftAutoIdleSpeechMinMinutes: number
  draftAutoIdleSpeechMaxMinutes: number
  draftAutoIdleSpeechAfterInteractionDelaySeconds: number
  onDraftAutoIdleSpeechEnabledChange: (next: boolean) => void
  onDraftAutoIdleSpeechMinMinutesChange: (next: number) => void
  onDraftAutoIdleSpeechMaxMinutesChange: (next: number) => void
  onDraftAutoIdleSpeechAfterInteractionDelaySecondsChange: (next: number) => void
  mascotTypeLabel: string
  mascotTypeDescription: string
  mascotTypeOptions: readonly { value: MascotType; label: string }[]
  draftMascotType: MascotType
  onDraftMascotTypeChange: (next: MascotType) => void
  layoutOffsetValidationLabel: string
  currentBubblePlacementLabel: string
  editingBubblePlacementLabel: string
  currentBubbleFontSizeLabel: string
  editingBubbleFontSizeLabel: string
  currentBubbleTailLabel: string
  editingBubbleTailLabel: string
  currentBubbleBorderLabel: string
  editingBubbleBorderLabel: string
  currentMascotAlignLabel: string
  editingMascotAlignLabel: string
  currentSpeechBubblePlacement: MascotSpeechBubblePlacement
  currentSpeechBubbleFontSize: number
  currentSpeechBubbleTailOffsetX: number
  currentSpeechBubbleTailOffsetY: number
  currentSpeechBubbleTailSize: number
  currentSpeechBubbleTailRotationDeg: number
  currentSpeechBubbleTailDirection: SpeechBubbleTailDirection
  currentSpeechBubbleTailMirrored: boolean
  currentSpeechBubbleBorderEnabled: boolean
  currentSpeechBubbleBorderWidth: number
  currentSpeechBubbleWritingMode: SpeechBubbleWritingMode
  currentSpeechBubbleWidthMode: 'auto' | 'custom'
  currentSpeechBubbleHeightMode: 'auto' | 'custom'
  currentSpeechBubbleMaxWidth: number
  currentSpeechBubbleMaxHeight: number
  currentSpeechBubbleOffsetX: number
  currentSpeechBubbleOffsetY: number
  currentMascotVerticalAlign: MascotVerticalAlign
  currentMascotHorizontalAlign: MascotHorizontalAlign
  applyMascotViewButtonLabel: string
  hasPendingSizeChanges: boolean
  pendingSizeChangesLabel: string
  applySizeHelpLabel: string
  resetSectionTitle: string
  resetMascotSettingsButtonLabel: string
  resetDescriptionLabel: string
  resetDraftOnlyLabel: string
  resetResultLabel?: string
  appliedMessageLabel: string
  applyFailedMessageLabel: string
  requestedAreaSizeLabel: string
  actualWindowSizeLabel: string
  actualContentSizeLabel: string
  sizeMismatchLabel: string
  minSizeConstraintHintLabel: string
  currentDisplaySizeLabel: string
  currentAreaSizeLabel: string
  editingDisplaySizeLabel: string
  editingAreaSizeLabel: string
  onApplyMascotView: () => void
  onResetMascotDraft: () => void
  isApplyingMascotView: boolean
  applyResult: {
    status: 'idle' | 'success' | 'error'
    requestedWidth?: number
    requestedHeight?: number
    actualWindowWidth?: number
    actualWindowHeight?: number
    actualContentWidth?: number
    actualContentHeight?: number
  }
  selectedModelText: {
    selectedModelLabel: string
    modelNotSelectedLabel: string
    modelFormatLabel: string
    pathLabel: string
    formatLabel: Record<'placeholder' | 'live2d-model3-json' | 'vrm' | 'gltf' | 'glb', string>
  }
  rendererLabel: Record<'placeholder' | 'live2d' | '3d', string>
  placeholderLabel: string
  preparingMessage: Record<'live2d' | '3d', string>
  modelFormatLabel: string
  supportedLabel: string
  modelFormatsText: Record<'live2d' | '3d', string>
  selectedModel?: import('@shared/index').CharacterModelDefinition
  vrmLoadingLabel: string
  vrmLoadErrorTitle: string
  vrmLoadErrorHint: string
  threeDRenderingLabel: string
  modelNotSelected3DLabel: string
  unsupportedFormatLabel: string
  vrmMotionSettings: {
    idleMotionEnabled: boolean
    springBoneEnabled: boolean
    blinkEnabled: boolean
    mouthMotionEnabled: boolean
    isSpeaking?: boolean
  }
}

export function MascotSettingsPanel(props: MascotSettingsPanelProps): React.JSX.Element {
  const {
    title,
    sectionMascotDisplayTitle,
    sectionClickThroughTitle,
    sectionDisplaySizeTitle,
    sectionAreaSizeTitle,
    sectionLayoutTitle,
    sectionPendingTitle,
    sectionApplyResultTitle,
    sectionPreviewTitle,
    sectionCurrentValuesTitle,
    sectionEditingValuesTitle,
    rendererTitle,
    rendererSelectionLabel,
    rendererSelectionDescription,
    applyRendererButtonLabel,
    currentRendererLabel,
    pendingChangesLabel,
    hasPendingRendererChange,
    warnings,
    rendererOptions,
    draftRendererType,
    appliedRendererType,
    onDraftRendererChange,
    onApplyRenderer,
    dragModeLabel,
    dragModeDescription,
    dragModeWarning,
    dragModeOptions,
    dragMode,
    onDragModeChange,
    alwaysOnTopLabel,
    alwaysOnTopDescription,
    alwaysOnTop,
    onToggleAlwaysOnTop,
    showHitAreaLabel,
    showHitAreaDescription,
    showHitArea,
    onToggleShowHitArea,
    clickThroughModeLabel,
    clickThroughModeDescription,
    clickThroughModeWarning,
    clickThroughMode,
    clickThroughModeOptions,
    onClickThroughModeChange,
    displaySizeLabel,
    displaySizeDescription,
    currentDisplaySizePreset,
    draftDisplaySizePreset,
    displaySizeOptions,
    onDraftDisplaySizePresetChange,
    displayScaleLabel,
    displayScaleDescription,
    displayScaleValidationLabel,
    currentDisplayScaleLabel,
    editingDisplayScaleLabel,
    currentDisplayCustomScale,
    draftDisplayCustomScale,
    onDraftDisplayCustomScaleChange,
    displayScaleErrorMessage,
    areaSizeLabel,
    areaSizeDescription,
    currentAreaSizePreset,
    draftAreaSizePreset,
    areaSizeOptions,
    onDraftAreaSizePresetChange,
    customWidthLabel,
    customHeightLabel,
    currentAreaWidth,
    currentAreaHeight,
    draftAreaWidth,
    draftAreaHeight,
    onDraftAreaWidthChange,
    onDraftAreaHeightChange,
    speechBubblePlacementLabel,
    speechBubblePlacementDescription,
    speechBubblePlacementOptions,
    draftSpeechBubblePlacement,
    onDraftSpeechBubblePlacementChange,
    speechBubbleOffsetLabel,
    speechBubbleOffsetXLabel,
    speechBubbleOffsetYLabel,
    speechBubbleOffsetXDescription,
    speechBubbleOffsetYDescription,
    draftSpeechBubbleOffsetX,
    draftSpeechBubbleOffsetY,
    onDraftSpeechBubbleOffsetXChange,
    onDraftSpeechBubbleOffsetYChange,
    speechBubbleFontSizeLabel,
    speechBubbleFontSizeDescription,
    speechBubbleFontSizeValidationLabel,
    draftSpeechBubbleFontSize,
    onDraftSpeechBubbleFontSizeChange,
    speechBubbleFontFamilyLabel,
    speechBubbleFontFamilyOptions,
    draftSpeechBubbleFontFamily,
    onDraftSpeechBubbleFontFamilyChange,
    speechBubbleWritingModeLabel,
    speechBubbleWritingModeOptions,
    draftSpeechBubbleWritingMode,
    onDraftSpeechBubbleWritingModeChange,
    speechBubbleTailOffsetLabel,
    speechBubbleTailOffsetXLabel,
    speechBubbleTailOffsetYLabel,
    speechBubbleSizeLabel,
    speechBubbleWidthModeLabel,
    speechBubbleHeightModeLabel,
    speechBubbleAutoLabel,
    speechBubbleCustomLabel,
    speechBubbleWidthLabel,
    speechBubbleHeightLabel,
    speechBubbleWidthAutoDescription,
    speechBubbleHeightAutoDescription,
    speechBubbleCustomHintLabel,
    speechBubbleSizeDescription,
    speechBubbleTailSizeLabel,
    speechBubbleTailSizeDescription,
    speechBubbleTailRotationLabel,
    speechBubbleTailRotationDescription,
    speechBubbleTailDirectionLabel,
    speechBubbleTailDirectionDescription,
    speechBubbleTailDirectionOptions,
    speechBubbleTailMirroredLabel,
    speechBubbleTailMirroredDescription,
    speechBubbleBorderEnabledLabel,
    speechBubbleBorderWidthLabel,
    borderOnLabel,
    borderOffLabel,
    draftSpeechBubbleTailOffsetX,
    draftSpeechBubbleTailOffsetY,
    draftSpeechBubbleWidthMode,
    draftSpeechBubbleHeightMode,
    draftSpeechBubbleMaxWidth,
    draftSpeechBubbleMaxHeight,
    draftSpeechBubbleTailSize,
    draftSpeechBubbleTailRotationDeg,
    draftSpeechBubbleTailDirection,
    draftSpeechBubbleTailMirrored,
    draftSpeechBubbleBorderEnabled,
    draftSpeechBubbleBorderWidth,
    onDraftSpeechBubbleTailOffsetXChange,
    onDraftSpeechBubbleTailOffsetYChange,
    onDraftSpeechBubbleWidthModeChange,
    onDraftSpeechBubbleHeightModeChange,
    onDraftSpeechBubbleMaxWidthChange,
    onDraftSpeechBubbleMaxHeightChange,
    onDraftSpeechBubbleTailSizeChange,
    onDraftSpeechBubbleTailRotationDegChange,
    onDraftSpeechBubbleTailDirectionChange,
    onDraftSpeechBubbleTailMirroredChange,
    onDraftSpeechBubbleBorderEnabledChange,
    onDraftSpeechBubbleBorderWidthChange,
    mascotVerticalAlignLabel,
    mascotHorizontalAlignLabel,
    mascotAlignDescription,
    mascotVerticalAlignOptions,
    mascotHorizontalAlignOptions,
    draftMascotVerticalAlign,
    draftMascotHorizontalAlign,
    onDraftMascotVerticalAlignChange,
    onDraftMascotHorizontalAlignChange,
    mascotOffsetLabel,
    mascotOffsetXLabel,
    mascotOffsetYLabel,
    mascotOffsetXDescription,
    mascotOffsetYDescription,
    draftMascotOffsetX,
    draftMascotOffsetY,
    onDraftMascotOffsetXChange,
    onDraftMascotOffsetYChange,
    lifestyleProfileLabel,
    lifestyleProfileDescription,
    lifestyleProfileOptions,
    draftLifestyleProfile,
    onDraftLifestyleProfileChange,
    characterVoiceProfileLabel,
    characterVoiceProfileDescription,
    characterVoiceProfileOptions,
    draftCharacterVoiceProfile,
    onDraftCharacterVoiceProfileChange,
    autoIdleSpeechEnabledLabel,
    autoIdleSpeechEnabledDescription,
    autoIdleSpeechMinMinutesLabel,
    autoIdleSpeechMaxMinutesLabel,
    autoIdleSpeechAfterInteractionDelaySecondsLabel,
    autoIdleSpeechRangeDescription,
    draftAutoIdleSpeechEnabled,
    draftAutoIdleSpeechMinMinutes,
    draftAutoIdleSpeechMaxMinutes,
    draftAutoIdleSpeechAfterInteractionDelaySeconds,
    onDraftAutoIdleSpeechEnabledChange,
    onDraftAutoIdleSpeechMinMinutesChange,
    onDraftAutoIdleSpeechMaxMinutesChange,
    onDraftAutoIdleSpeechAfterInteractionDelaySecondsChange,
    mascotTypeLabel,
    mascotTypeDescription,
    mascotTypeOptions,
    draftMascotType,
    onDraftMascotTypeChange,
    layoutOffsetValidationLabel,
    currentBubblePlacementLabel,
    editingBubblePlacementLabel,
    currentBubbleFontSizeLabel,
    editingBubbleFontSizeLabel,
    currentBubbleTailLabel,
    editingBubbleTailLabel,
    currentBubbleBorderLabel,
    editingBubbleBorderLabel,
    currentMascotAlignLabel,
    editingMascotAlignLabel,
    currentSpeechBubblePlacement,
    currentSpeechBubbleFontSize,
    currentSpeechBubbleTailOffsetX,
    currentSpeechBubbleTailOffsetY,
    currentSpeechBubbleTailSize,
    currentSpeechBubbleTailRotationDeg,
    currentSpeechBubbleTailDirection,
    currentSpeechBubbleTailMirrored,
    currentSpeechBubbleBorderEnabled,
    currentSpeechBubbleBorderWidth,
    currentSpeechBubbleWritingMode,
    currentSpeechBubbleWidthMode,
    currentSpeechBubbleHeightMode,
    currentSpeechBubbleMaxWidth,
    currentSpeechBubbleMaxHeight,
    currentSpeechBubbleOffsetX,
    currentSpeechBubbleOffsetY,
    currentMascotVerticalAlign,
    currentMascotHorizontalAlign,
    applyMascotViewButtonLabel,
    hasPendingSizeChanges,
    pendingSizeChangesLabel,
    applySizeHelpLabel,
    resetSectionTitle,
    resetMascotSettingsButtonLabel,
    resetDescriptionLabel,
    resetDraftOnlyLabel,
    resetResultLabel,
    appliedMessageLabel,
    applyFailedMessageLabel,
    requestedAreaSizeLabel,
    actualWindowSizeLabel,
    actualContentSizeLabel,
    sizeMismatchLabel,
    minSizeConstraintHintLabel,
    currentDisplaySizeLabel,
    currentAreaSizeLabel,
    editingDisplaySizeLabel,
    editingAreaSizeLabel,
    onApplyMascotView,
    onResetMascotDraft,
    isApplyingMascotView,
    applyResult,
    selectedModelText,
    rendererLabel,
    placeholderLabel,
    preparingMessage,
    modelFormatLabel,
    supportedLabel,
    modelFormatsText,
    selectedModel,
    vrmLoadingLabel,
    vrmLoadErrorTitle,
    vrmLoadErrorHint,
    threeDRenderingLabel,
    modelNotSelected3DLabel,
    unsupportedFormatLabel,
    vrmMotionSettings
  } = props
  const applyButtonDisabled = !hasPendingSizeChanges || isApplyingMascotView
  const handleApplyMascotViewClick = (): void => onApplyMascotView()

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{rendererTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <p className="muted">{rendererSelectionDescription}</p>
        <label className="settings-select-label">
          <span>{rendererSelectionLabel}</span>
          <select className="settings-select" value={draftRendererType} onChange={(e) => onDraftRendererChange(e.currentTarget.value as CharacterRendererType)}>
            {rendererOptions.map((option) => (
              <option key={option.type} value={option.type}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{rendererOptions.find((option) => option.type === draftRendererType)?.description}</p>
        <p className="muted">
          {currentRendererLabel}: {rendererOptions.find((option) => option.type === appliedRendererType)?.label}
        </p>
        {hasPendingRendererChange ? <p className="settings-pending">{pendingChangesLabel}</p> : null}
        <button type="button" className="secondary-button" onClick={onApplyRenderer} disabled={!hasPendingRendererChange}>
          {applyRendererButtonLabel}
        </button>
        {warnings.length ? (
          <div className="settings-warnings">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionLayoutTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        {hasPendingSizeChanges ? <p className="settings-pending">{pendingSizeChangesLabel}</p> : null}
        {hasPendingSizeChanges ? <p className="muted">{applySizeHelpLabel}</p> : null}
        <div className="settings-subdivider" />
        <label className="settings-select-label">
          <span>{speechBubblePlacementLabel}</span>
          <select
            className="settings-select"
            value={draftSpeechBubblePlacement}
            onChange={(e) => onDraftSpeechBubblePlacementChange(e.currentTarget.value as MascotSpeechBubblePlacement)}
          >
            {speechBubblePlacementOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{speechBubblePlacementDescription}</p>
        <div className="response-edit-grid response-edit-grid--two">
          <label className="settings-select-label">
            <span>{speechBubbleOffsetXLabel}</span>
            <input className="settings-input" type="number" min={-200} max={200} value={draftSpeechBubbleOffsetX} onChange={(e) => onDraftSpeechBubbleOffsetXChange(Number(e.currentTarget.value) || 0)} />
            <span className="muted">{speechBubbleOffsetXDescription}</span>
          </label>
          <label className="settings-select-label">
            <span>{speechBubbleOffsetYLabel}</span>
            <input className="settings-input" type="number" min={-200} max={200} value={draftSpeechBubbleOffsetY} onChange={(e) => onDraftSpeechBubbleOffsetYChange(Number(e.currentTarget.value) || 0)} />
            <span className="muted">{speechBubbleOffsetYDescription}</span>
          </label>
        </div>
        <p className="muted">{speechBubbleOffsetLabel}</p>
        <label className="settings-select-label">
          <span>{speechBubbleFontSizeLabel}</span>
          <input className="settings-input" type="number" min={10} max={24} value={draftSpeechBubbleFontSize} onChange={(e) => onDraftSpeechBubbleFontSizeChange(Number(e.currentTarget.value) || 10)} />
        </label>
        <p className="muted">{speechBubbleFontSizeDescription}</p>
        <p className="muted">{speechBubbleFontSizeValidationLabel}</p>
        <label className="settings-select-label">
          <span>{speechBubbleFontFamilyLabel}</span>
          <select
            className="settings-select"
            value={draftSpeechBubbleFontFamily}
            onChange={(e) => onDraftSpeechBubbleFontFamilyChange(e.currentTarget.value as MascotSpeechBubbleFontFamily)}
          >
            {speechBubbleFontFamilyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{speechBubbleWritingModeLabel}</span>
          <select
            className="settings-select"
            value={draftSpeechBubbleWritingMode}
            onChange={(e) => onDraftSpeechBubbleWritingModeChange(e.currentTarget.value as SpeechBubbleWritingMode)}
          >
            {speechBubbleWritingModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="settings-subdivider" />
        <div className="response-edit-grid response-edit-grid--two">
          <label className="settings-select-label">
            <span>{speechBubbleWidthModeLabel}</span>
            <select
              className="settings-select"
              value={draftSpeechBubbleWidthMode}
              onChange={(e) => onDraftSpeechBubbleWidthModeChange(e.currentTarget.value as 'auto' | 'custom')}
            >
              <option value="auto">{speechBubbleAutoLabel}</option>
              <option value="custom">{speechBubbleCustomLabel}</option>
            </select>
            <span className="muted">{speechBubbleWidthAutoDescription}</span>
          </label>
          <label className="settings-select-label">
            <span>{speechBubbleHeightModeLabel}</span>
            <select
              className="settings-select"
              value={draftSpeechBubbleHeightMode}
              onChange={(e) => onDraftSpeechBubbleHeightModeChange(e.currentTarget.value as 'auto' | 'custom')}
            >
              <option value="auto">{speechBubbleAutoLabel}</option>
              <option value="custom">{speechBubbleCustomLabel}</option>
            </select>
            <span className="muted">{speechBubbleHeightAutoDescription}</span>
          </label>
        </div>
        <div className="response-edit-grid">
          {draftSpeechBubbleWidthMode === 'custom' ? (
            <label className="settings-select-label">
              <span>{speechBubbleWidthLabel}</span>
              <input
                className="settings-input"
                type="number"
                min={80}
                max={800}
                value={draftSpeechBubbleMaxWidth}
                onChange={(e) => onDraftSpeechBubbleMaxWidthChange(Number(e.currentTarget.value) || 80)}
              />
            </label>
          ) : null}
          {draftSpeechBubbleHeightMode === 'custom' ? (
            <label className="settings-select-label">
              <span>{speechBubbleHeightLabel}</span>
              <input
                className="settings-input"
                type="number"
                min={40}
                max={800}
                value={draftSpeechBubbleMaxHeight}
                onChange={(e) => onDraftSpeechBubbleMaxHeightChange(Number(e.currentTarget.value) || 40)}
              />
            </label>
          ) : null}
        </div>
        <p className="muted">{speechBubbleSizeLabel}</p>
        <p className="muted">{speechBubbleSizeDescription}</p>
        <p className="muted">{speechBubbleCustomHintLabel}</p>
        <div className="settings-subdivider" />
        <div className="response-edit-grid">
          <label className="settings-select-label">
            <span>{speechBubbleTailOffsetXLabel}</span>
            <input className="settings-input" type="number" min={-200} max={200} value={draftSpeechBubbleTailOffsetX} onChange={(e) => onDraftSpeechBubbleTailOffsetXChange(Number(e.currentTarget.value) || 0)} />
          </label>
          <label className="settings-select-label">
            <span>{speechBubbleTailOffsetYLabel}</span>
            <input className="settings-input" type="number" min={-200} max={200} value={draftSpeechBubbleTailOffsetY} onChange={(e) => onDraftSpeechBubbleTailOffsetYChange(Number(e.currentTarget.value) || 0)} />
          </label>
        </div>
        <div className="response-edit-grid">
          <label className="settings-select-label">
            <span>{speechBubbleTailSizeLabel}</span>
            <input
              className="settings-input"
              type="number"
              min={4}
              max={40}
              value={draftSpeechBubbleTailSize}
              onChange={(e) => onDraftSpeechBubbleTailSizeChange(Number(e.currentTarget.value) || 4)}
            />
          </label>
          <label className="settings-select-label">
            <span>{speechBubbleTailRotationLabel}</span>
            <input
              className="settings-input"
              type="number"
              min={-90}
              max={90}
              value={draftSpeechBubbleTailRotationDeg}
              onChange={(e) => onDraftSpeechBubbleTailRotationDegChange(Number(e.currentTarget.value) || 0)}
            />
          </label>
          <label className="settings-select-label">
            <span>{speechBubbleTailDirectionLabel}</span>
            <select
              className="settings-select"
              value={draftSpeechBubbleTailDirection}
              onChange={(e) => onDraftSpeechBubbleTailDirectionChange(e.currentTarget.value as SpeechBubbleTailDirection)}
            >
              {speechBubbleTailDirectionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={draftSpeechBubbleTailMirrored}
              onChange={(e) => onDraftSpeechBubbleTailMirroredChange(e.currentTarget.checked)}
            />
            <span>{speechBubbleTailMirroredLabel}</span>
          </label>
        </div>
        <p className="muted">{speechBubbleTailOffsetLabel}</p>
        <p className="muted">{speechBubbleTailSizeDescription}</p>
        <p className="muted">{speechBubbleTailRotationDescription}</p>
        <p className="muted">{speechBubbleTailDirectionDescription}</p>
        <p className="muted">{speechBubbleTailMirroredDescription}</p>
        <div className="settings-subdivider" />
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={draftSpeechBubbleBorderEnabled}
            onChange={(e) => onDraftSpeechBubbleBorderEnabledChange(e.currentTarget.checked)}
          />
          <span>{speechBubbleBorderEnabledLabel}</span>
        </label>
        <label className="settings-select-label">
          <span>{speechBubbleBorderWidthLabel}</span>
          <input
            className="settings-input"
            type="number"
            min={0}
            max={8}
            value={draftSpeechBubbleBorderWidth}
            onChange={(e) => onDraftSpeechBubbleBorderWidthChange(Number(e.currentTarget.value) || 0)}
          />
        </label>
        <label className="settings-select-label">
          <span>{mascotVerticalAlignLabel}</span>
          <select
            className="settings-select"
            value={draftMascotVerticalAlign}
            onChange={(e) => onDraftMascotVerticalAlignChange(e.currentTarget.value as MascotVerticalAlign)}
          >
            {mascotVerticalAlignOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="settings-select-label">
          <span>{mascotHorizontalAlignLabel}</span>
          <select
            className="settings-select"
            value={draftMascotHorizontalAlign}
            onChange={(e) => onDraftMascotHorizontalAlignChange(e.currentTarget.value as MascotHorizontalAlign)}
          >
            {mascotHorizontalAlignOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{mascotAlignDescription}</p>
        <div className="response-edit-grid">
          <label className="settings-select-label">
            <span>{mascotOffsetXLabel}</span>
            <input className="settings-input" type="number" min={-200} max={200} value={draftMascotOffsetX} onChange={(e) => onDraftMascotOffsetXChange(Number(e.currentTarget.value) || 0)} />
            <span className="muted">{mascotOffsetXDescription}</span>
          </label>
          <label className="settings-select-label">
            <span>{mascotOffsetYLabel}</span>
            <input className="settings-input" type="number" min={-200} max={200} value={draftMascotOffsetY} onChange={(e) => onDraftMascotOffsetYChange(Number(e.currentTarget.value) || 0)} />
            <span className="muted">{mascotOffsetYDescription}</span>
          </label>
        </div>
        <p className="muted">{mascotOffsetLabel}</p>
        <p className="muted">{layoutOffsetValidationLabel}</p>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionMascotDisplayTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <label className="settings-select-label">
          <span>{dragModeLabel}</span>
          <select className="settings-select" value={dragMode} onChange={(e) => onDragModeChange(e.currentTarget.value as MascotDragMode)}>
            {dragModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{dragModeDescription}</p>
        {dragMode === 'transparent-drag-area' ? <p className="settings-note">{dragModeWarning}</p> : null}
        <label className="settings-toggle">
          <input type="checkbox" checked={alwaysOnTop} onChange={(e) => onToggleAlwaysOnTop(e.currentTarget.checked)} />
          <span>{alwaysOnTopLabel}</span>
        </label>
        <p className="muted">{alwaysOnTopDescription}</p>
        <label className="settings-toggle">
          <input type="checkbox" checked={showHitArea} onChange={(e) => onToggleShowHitArea(e.currentTarget.checked)} />
          <span>{showHitAreaLabel}</span>
        </label>
        <p className="muted">{showHitAreaDescription}</p>
        <label className="settings-select-label">
          <span>{lifestyleProfileLabel}</span>
          <select
            className="settings-select"
            value={draftLifestyleProfile}
            onChange={(e) => onDraftLifestyleProfileChange(e.currentTarget.value as LifestyleProfile)}
          >
            {lifestyleProfileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{lifestyleProfileDescription}</p>
        <label className="settings-select-label">
          <span>{mascotTypeLabel}</span>
          <select
            className="settings-select"
            value={draftMascotType}
            onChange={(e) => onDraftMascotTypeChange(e.currentTarget.value as MascotType)}
          >
            {mascotTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{mascotTypeDescription}</p>
        <label className="settings-select-label">
          <span>{characterVoiceProfileLabel}</span>
          <select
            className="settings-select"
            value={draftCharacterVoiceProfile}
            onChange={(e) => onDraftCharacterVoiceProfileChange(e.currentTarget.value as CharacterVoiceProfile)}
          >
            {characterVoiceProfileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{characterVoiceProfileDescription}</p>
        <div className="settings-section__divider" />
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={draftAutoIdleSpeechEnabled}
            onChange={(e) => onDraftAutoIdleSpeechEnabledChange(e.currentTarget.checked)}
          />
          <span>{autoIdleSpeechEnabledLabel}</span>
        </label>
        <p className="muted">{autoIdleSpeechEnabledDescription}</p>
        <div className="response-edit-grid">
          <label className="settings-select-label">
            <span>{autoIdleSpeechMinMinutesLabel}</span>
            <input
              className="settings-input"
              type="number"
              min={1}
              max={120}
              value={draftAutoIdleSpeechMinMinutes}
              onChange={(e) => onDraftAutoIdleSpeechMinMinutesChange(Number(e.currentTarget.value) || 1)}
            />
          </label>
          <label className="settings-select-label">
            <span>{autoIdleSpeechMaxMinutesLabel}</span>
            <input
              className="settings-input"
              type="number"
              min={1}
              max={120}
              value={draftAutoIdleSpeechMaxMinutes}
              onChange={(e) => onDraftAutoIdleSpeechMaxMinutesChange(Number(e.currentTarget.value) || 1)}
            />
          </label>
          <label className="settings-select-label">
            <span>{autoIdleSpeechAfterInteractionDelaySecondsLabel}</span>
            <input
              className="settings-input"
              type="number"
              min={0}
              max={3600}
              value={draftAutoIdleSpeechAfterInteractionDelaySeconds}
              onChange={(e) => onDraftAutoIdleSpeechAfterInteractionDelaySecondsChange(Number(e.currentTarget.value) || 0)}
            />
          </label>
        </div>
        <p className="muted">{autoIdleSpeechRangeDescription}</p>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionClickThroughTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <label className="settings-select-label">
          <span>{clickThroughModeLabel}</span>
          <select className="settings-select" value={clickThroughMode} onChange={(e) => onClickThroughModeChange(e.currentTarget.value as MascotClickThroughMode)}>
            {clickThroughModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{clickThroughModeDescription}</p>
        {clickThroughMode !== 'off' ? <p className="settings-note">{clickThroughModeWarning}</p> : null}
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionDisplaySizeTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <label className="settings-select-label">
          <span>{displaySizeLabel}</span>
          <select className="settings-select" value={draftDisplaySizePreset} onChange={(e) => onDraftDisplaySizePresetChange(e.currentTarget.value as MascotWindowSizePreset)}>
            {displaySizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{displaySizeDescription}</p>
        <p className="muted">
          {currentDisplaySizeLabel}: {displaySizeOptions.find((option) => option.value === currentDisplaySizePreset)?.label}
        </p>
        <p className="muted">
          {editingDisplaySizeLabel}: {displaySizeOptions.find((option) => option.value === draftDisplaySizePreset)?.label}
        </p>
        {draftDisplaySizePreset === 'custom' ? (
          <>
            <label className="settings-select-label">
              <span>{displayScaleLabel}</span>
              <input
                className="settings-input"
                type="number"
                min={0.3}
                max={2.0}
                step={0.05}
                value={draftDisplayCustomScale}
                onChange={(e) => onDraftDisplayCustomScaleChange(Number(e.currentTarget.value))}
              />
            </label>
            <p className="muted">{displayScaleDescription}</p>
            <p className="muted">{displayScaleValidationLabel}</p>
            {displayScaleErrorMessage ? <p className="settings-note">{displayScaleErrorMessage}</p> : null}
          </>
        ) : null}
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionAreaSizeTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <label className="settings-select-label">
          <span>{areaSizeLabel}</span>
          <select className="settings-select" value={draftAreaSizePreset} onChange={(e) => onDraftAreaSizePresetChange(e.currentTarget.value as MascotWindowAreaSizePreset)}>
            {areaSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">{areaSizeDescription}</p>
        {draftAreaSizePreset === 'custom' ? (
          <div className="response-edit-grid">
            <label className="settings-select-label">
              <span>{customWidthLabel}</span>
              <input className="settings-input" type="number" min={120} max={800} value={draftAreaWidth} onChange={(e) => onDraftAreaWidthChange(Number(e.currentTarget.value) || 120)} />
            </label>
            <label className="settings-select-label">
              <span>{customHeightLabel}</span>
              <input className="settings-input" type="number" min={180} max={1000} value={draftAreaHeight} onChange={(e) => onDraftAreaHeightChange(Number(e.currentTarget.value) || 180)} />
            </label>
          </div>
        ) : null}
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionCurrentValuesTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <div className="settings-state-box">
          <p className="muted">
            {currentDisplaySizeLabel}: {displaySizeOptions.find((option) => option.value === currentDisplaySizePreset)?.label}
          </p>
          <p className="muted">{currentDisplayScaleLabel}: {currentDisplayCustomScale.toFixed(2)}x</p>
          <p className="muted">
            {currentBubblePlacementLabel}: {speechBubblePlacementOptions.find((option) => option.value === currentSpeechBubblePlacement)?.label}
          </p>
          <p className="muted">{currentBubbleFontSizeLabel}: {currentSpeechBubbleFontSize}px</p>
          <p className="muted">
            {speechBubbleWritingModeLabel}: {speechBubbleWritingModeOptions.find((option) => option.value === currentSpeechBubbleWritingMode)?.label}
          </p>
          <p className="muted">
            {speechBubbleWidthModeLabel}: {currentSpeechBubbleWidthMode === 'custom' ? speechBubbleCustomLabel : speechBubbleAutoLabel} ({currentSpeechBubbleMaxWidth}px)
          </p>
          <p className="muted">
            {speechBubbleHeightModeLabel}: {currentSpeechBubbleHeightMode === 'custom' ? speechBubbleCustomLabel : speechBubbleAutoLabel} ({currentSpeechBubbleMaxHeight}px)
          </p>
          <p className="muted">
            {speechBubbleOffsetLabel}: X {currentSpeechBubbleOffsetX} / Y {currentSpeechBubbleOffsetY}
          </p>
          <p className="muted">
            {currentBubbleTailLabel}: {speechBubbleTailDirectionOptions.find((option) => option.value === currentSpeechBubbleTailDirection)?.label} / {currentSpeechBubbleTailMirrored ? borderOnLabel : borderOffLabel} / X {currentSpeechBubbleTailOffsetX} / Y {currentSpeechBubbleTailOffsetY} / S {currentSpeechBubbleTailSize} / R {currentSpeechBubbleTailRotationDeg}
          </p>
          <p className="muted">
            {currentBubbleBorderLabel}: {currentSpeechBubbleBorderEnabled ? borderOnLabel : borderOffLabel} ({currentSpeechBubbleBorderWidth}px)
          </p>
          <p className="muted">
            {currentMascotAlignLabel}: {mascotVerticalAlignOptions.find((option) => option.value === currentMascotVerticalAlign)?.label} / {mascotHorizontalAlignOptions.find((option) => option.value === currentMascotHorizontalAlign)?.label}
          </p>
          <p className="muted">
            {currentAreaSizeLabel}: {areaSizeOptions.find((option) => option.value === currentAreaSizePreset)?.label} {currentAreaWidth} x {currentAreaHeight}
          </p>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionEditingValuesTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <div className="settings-state-box">
          <p className="muted">
            {editingDisplaySizeLabel}: {displaySizeOptions.find((option) => option.value === draftDisplaySizePreset)?.label}
          </p>
          <p className="muted">{editingDisplayScaleLabel}: {draftDisplayCustomScale.toFixed(2)}x</p>
          <p className="muted">
            {editingBubblePlacementLabel}: {speechBubblePlacementOptions.find((option) => option.value === draftSpeechBubblePlacement)?.label}
          </p>
          <p className="muted">{editingBubbleFontSizeLabel}: {draftSpeechBubbleFontSize}px</p>
          <p className="muted">
            {speechBubbleWritingModeLabel}: {speechBubbleWritingModeOptions.find((option) => option.value === draftSpeechBubbleWritingMode)?.label}
          </p>
          <p className="muted">
            {speechBubbleWidthModeLabel}: {draftSpeechBubbleWidthMode === 'custom' ? speechBubbleCustomLabel : speechBubbleAutoLabel} ({draftSpeechBubbleMaxWidth}px)
          </p>
          <p className="muted">
            {speechBubbleHeightModeLabel}: {draftSpeechBubbleHeightMode === 'custom' ? speechBubbleCustomLabel : speechBubbleAutoLabel} ({draftSpeechBubbleMaxHeight}px)
          </p>
          <p className="muted">
            {speechBubbleOffsetLabel}: X {draftSpeechBubbleOffsetX} / Y {draftSpeechBubbleOffsetY}
          </p>
          <p className="muted">
            {editingBubbleTailLabel}: {speechBubbleTailDirectionOptions.find((option) => option.value === draftSpeechBubbleTailDirection)?.label} / {draftSpeechBubbleTailMirrored ? borderOnLabel : borderOffLabel} / X {draftSpeechBubbleTailOffsetX} / Y {draftSpeechBubbleTailOffsetY} / S {draftSpeechBubbleTailSize} / R {draftSpeechBubbleTailRotationDeg}
          </p>
          <p className="muted">
            {editingBubbleBorderLabel}: {draftSpeechBubbleBorderEnabled ? borderOnLabel : borderOffLabel} ({draftSpeechBubbleBorderWidth}px)
          </p>
          <p className="muted">
            {editingMascotAlignLabel}: {mascotVerticalAlignOptions.find((option) => option.value === draftMascotVerticalAlign)?.label} / {mascotHorizontalAlignOptions.find((option) => option.value === draftMascotHorizontalAlign)?.label}
          </p>
          <p className="muted">
            {editingAreaSizeLabel}: {areaSizeOptions.find((option) => option.value === draftAreaSizePreset)?.label} {draftAreaWidth} x {draftAreaHeight}
          </p>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionPendingTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        {hasPendingSizeChanges ? <p className="settings-pending">{pendingSizeChangesLabel}</p> : null}
        {hasPendingSizeChanges ? <p className="muted">{applySizeHelpLabel}</p> : null}
        <div className="settings-state-box settings-reset-box">
          <p className="muted"><strong>{resetSectionTitle}</strong></p>
          <p className="muted">{resetDescriptionLabel}</p>
          <p className="muted">{resetDraftOnlyLabel}</p>
          <div className="settings-reset-actions">
            <button type="button" className="secondary-button" onClick={onResetMascotDraft}>
              {resetMascotSettingsButtonLabel}
            </button>
          </div>
          {resetResultLabel ? <p className="muted">{resetResultLabel}</p> : null}
        </div>
        {applyResult.status === 'success' ? (
          <div className="settings-result-box">
            <p className="muted">{appliedMessageLabel}</p>
          </div>
        ) : null}
        {applyResult.status === 'error' ? <p className="settings-note">{applyFailedMessageLabel}</p> : null}
        <div className="settings-apply-actions">
          <button type="button" className="secondary-button" onClick={handleApplyMascotViewClick} disabled={applyButtonDisabled}>
            {applyMascotViewButtonLabel}
          </button>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionApplyResultTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        {applyResult.status === 'success' ? (
          <div className="settings-result-box">
            <p className="muted">
              {requestedAreaSizeLabel}: {applyResult.requestedWidth} x {applyResult.requestedHeight}
            </p>
            <p className="muted">
              {actualWindowSizeLabel}: {applyResult.actualWindowWidth} x {applyResult.actualWindowHeight}
            </p>
            <p className="muted">
              {actualContentSizeLabel}: {applyResult.actualContentWidth} x {applyResult.actualContentHeight}
            </p>
            {(applyResult.requestedWidth !== applyResult.actualContentWidth ||
              applyResult.requestedHeight !== applyResult.actualContentHeight) ? (
              <>
                <p className="settings-note">{sizeMismatchLabel}</p>
                <p className="muted">{minSizeConstraintHintLabel}</p>
              </>
            ) : null}
          </div>
        ) : (
          <p className="muted">-</p>
        )}
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{sectionPreviewTitle}</h3>
        </div>
        <div className="settings-section__divider" />
        <CharacterRenderer
          rendererType={appliedRendererType}
          variant="preview"
          placeholderLabel={placeholderLabel}
          rendererLabel={rendererLabel}
          preparingMessage={preparingMessage}
          modelFormatLabel={modelFormatLabel}
          supportedLabel={supportedLabel}
          modelFormatsText={modelFormatsText}
          selectedModel={selectedModel}
          selectedModelText={selectedModelText}
          vrmLoadingLabel={vrmLoadingLabel}
          vrmLoadErrorTitle={vrmLoadErrorTitle}
          vrmLoadErrorHint={vrmLoadErrorHint}
          threeDRenderingLabel={threeDRenderingLabel}
          modelNotSelected3DLabel={modelNotSelected3DLabel}
          unsupportedFormatLabel={unsupportedFormatLabel}
          showModelInfo={true}
          vrmMotionSettings={vrmMotionSettings}
        />
      </section>
    </section>
  )
}
