import type { CharacterModelDefinition, CharacterModelFormat, CharacterRendererType } from '@shared/index'

import { PlaceholderRenderer } from './PlaceholderRenderer'
import { ThreeDRenderer } from './ThreeDRenderer'

export type RendererBranchState =
  | 'placeholder'
  | 'live2d-pending'
  | '3d-vrm-loading'
  | '3d-vrm-ready'
  | '3d-vrm-error'
  | '3d-unsupported-format'
  | 'model-not-selected'

interface SelectedModelText {
  selectedModelLabel: string
  modelNotSelectedLabel: string
  modelFormatLabel: string
  pathLabel: string
  formatLabel: Record<CharacterModelFormat, string>
}

interface CharacterRendererProps {
  rendererType: CharacterRendererType
  variant: 'mascot' | 'preview'
  placeholderLabel: string
  rendererLabel: Record<CharacterRendererType, string>
  preparingMessage: Record<'live2d' | '3d', string>
  modelFormatLabel: string
  supportedLabel: string
  modelFormatsText: Record<'live2d' | '3d', string>
  selectedModel?: CharacterModelDefinition
  selectedModelText: SelectedModelText
  vrmLoadingLabel: string
  vrmLoadErrorTitle: string
  vrmLoadErrorHint: string
  threeDRenderingLabel: string
  modelNotSelected3DLabel: string
  unsupportedFormatLabel: string
  showModelInfo: boolean
  onRendererLoadStateChange?: (state: 'idle' | 'loading' | 'ready' | 'error') => void
  onRendererBranchStateChange?: (state: RendererBranchState) => void
  onRendererModelUrlChange?: (url?: string) => void
  onInteract?: (event: React.MouseEvent<HTMLElement>) => void
  vrmMotionSettings?: {
    idleMotionEnabled: boolean
    springBoneEnabled: boolean
    blinkEnabled: boolean
    mouthMotionEnabled: boolean
    isSpeaking?: boolean
  }
}

function Live2DPreparingRenderer({
  variant,
  rendererName,
  preparingText,
  modelFormatLabel,
  supportedLabel,
  formatsText,
  selectedModel,
  selectedModelText,
  showModelInfo,
  onInteract
}: {
  variant: CharacterRendererProps['variant']
  rendererName: string
  preparingText: string
  modelFormatLabel: string
  supportedLabel: string
  formatsText: string
  selectedModel?: CharacterModelDefinition
  selectedModelText: SelectedModelText
  showModelInfo: boolean
  onInteract?: CharacterRendererProps['onInteract']
}): React.JSX.Element {
  const content = (
    <div className="renderer-preparing-body">
      <strong>{rendererName}</strong>
      <p>{preparingText}</p>
      {showModelInfo && selectedModel ? (
        <>
          <p>
            {selectedModelText.selectedModelLabel}: {selectedModel.displayName}
          </p>
          <p>
            {selectedModelText.modelFormatLabel}: {selectedModelText.formatLabel[selectedModel.format]}
          </p>
          <p className="renderer-model-path">
            {selectedModelText.pathLabel}: {selectedModel.relativePath ?? '-'}
          </p>
        </>
      ) : showModelInfo ? (
        <p>{selectedModelText.modelNotSelectedLabel}</p>
      ) : null}
      {showModelInfo ? (
        <p className="renderer-model-format">
          {modelFormatLabel}: {supportedLabel} {formatsText}
        </p>
      ) : null}
    </div>
  )

  if (variant === 'mascot') {
    return (
      <button
        type="button"
        className="renderer-preparing-card mascot-interaction-target mascot-no-drag"
        onClick={onInteract}
      >
        {content}
      </button>
    )
  }

  return <div className="renderer-preparing-card">{content}</div>
}

export function CharacterRenderer({
  rendererType,
  variant,
  placeholderLabel,
  rendererLabel,
  preparingMessage,
  modelFormatLabel,
  supportedLabel,
  modelFormatsText,
  selectedModel,
  selectedModelText,
  vrmLoadingLabel,
  vrmLoadErrorTitle,
  vrmLoadErrorHint,
  threeDRenderingLabel,
  modelNotSelected3DLabel,
  unsupportedFormatLabel,
  showModelInfo,
  onRendererLoadStateChange,
  onRendererBranchStateChange,
  onRendererModelUrlChange,
  onInteract,
  vrmMotionSettings
}: CharacterRendererProps): React.JSX.Element {
  if (rendererType === 'placeholder') {
    return (
      <PlaceholderRenderer variant={variant} placeholderLabel={placeholderLabel} onInteract={onInteract} />
    )
  }

  if (rendererType === 'live2d') {
    return (
      <Live2DPreparingRenderer
        variant={variant}
        rendererName={rendererLabel.live2d}
        preparingText={preparingMessage.live2d}
        modelFormatLabel={modelFormatLabel}
        supportedLabel={supportedLabel}
        formatsText={modelFormatsText.live2d}
        selectedModel={selectedModel}
        selectedModelText={selectedModelText}
        showModelInfo={showModelInfo}
        onInteract={onInteract}
      />
    )
  }

  return (
    <ThreeDRenderer
      variant={variant}
      rendererName={rendererLabel['3d']}
      preparingText={preparingMessage['3d']}
      modelFormatLabel={modelFormatLabel}
      supportedLabel={supportedLabel}
      formatsText={modelFormatsText['3d']}
      selectedModel={selectedModel}
      selectedModelText={selectedModelText}
      vrmLoadingLabel={vrmLoadingLabel}
      vrmLoadErrorTitle={vrmLoadErrorTitle}
      vrmLoadErrorHint={vrmLoadErrorHint}
      threeDRenderingLabel={threeDRenderingLabel}
      modelNotSelected3DLabel={modelNotSelected3DLabel}
      unsupportedFormatLabel={unsupportedFormatLabel}
      showModelInfo={showModelInfo}
      onRendererLoadStateChange={onRendererLoadStateChange}
      onRendererBranchStateChange={onRendererBranchStateChange}
      onRendererModelUrlChange={onRendererModelUrlChange}
      onInteract={onInteract}
      vrmMotionSettings={vrmMotionSettings}
    />
  )
}
