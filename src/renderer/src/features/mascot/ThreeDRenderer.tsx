import type { CharacterModelDefinition, CharacterModelFormat } from '@shared/index'
import { useEffect } from 'react'

import { VrmRenderer } from './VrmRenderer'
import type { RendererBranchState } from './CharacterRenderer'

interface SelectedModelText {
  selectedModelLabel: string
  modelNotSelectedLabel: string
  modelFormatLabel: string
  pathLabel: string
  formatLabel: Record<CharacterModelFormat, string>
}

interface ThreeDRendererProps {
  variant: 'mascot' | 'preview'
  rendererName: string
  preparingText: string
  modelFormatLabel: string
  supportedLabel: string
  formatsText: string
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

function PreparingCard({
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
  variant: ThreeDRendererProps['variant']
  rendererName: string
  preparingText: string
  modelFormatLabel: string
  supportedLabel: string
  formatsText: string
  selectedModel?: CharacterModelDefinition
  selectedModelText: SelectedModelText
  showModelInfo: boolean
  onInteract?: ThreeDRendererProps['onInteract']
}): React.JSX.Element {
  const body = (
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
        {body}
      </button>
    )
  }

  return <div className="renderer-preparing-card">{body}</div>
}

export function ThreeDRenderer({
  variant,
  rendererName,
  preparingText,
  modelFormatLabel,
  supportedLabel,
  formatsText,
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
}: ThreeDRendererProps): React.JSX.Element {
  const selectedFormat = selectedModel?.format
  const isVrmSelected = selectedFormat === 'vrm'
  const hasSelectedModel = Boolean(selectedModel)
  const hasRelativePath = Boolean(selectedModel?.relativePath)
  const isUnsupported3DFormat = selectedFormat === 'gltf' || selectedFormat === 'glb'

  useEffect(() => {
    if (!hasSelectedModel) {
      onRendererBranchStateChange?.('model-not-selected')
      onRendererLoadStateChange?.('idle')
      onRendererModelUrlChange?.(undefined)
      return
    }

    if (isUnsupported3DFormat) {
      onRendererBranchStateChange?.('3d-unsupported-format')
      onRendererLoadStateChange?.('idle')
      onRendererModelUrlChange?.(undefined)
      return
    }

    if (isVrmSelected && !hasRelativePath) {
      onRendererBranchStateChange?.('3d-vrm-error')
      onRendererLoadStateChange?.('error')
      onRendererModelUrlChange?.(undefined)
      return
    }
  }, [
    hasRelativePath,
    hasSelectedModel,
    isUnsupported3DFormat,
    isVrmSelected,
    onRendererBranchStateChange,
    onRendererLoadStateChange,
    onRendererModelUrlChange
  ])

  if (!hasSelectedModel) {
    return (
      <PreparingCard
        variant={variant}
        rendererName={rendererName}
        preparingText={modelNotSelected3DLabel}
        modelFormatLabel={modelFormatLabel}
        supportedLabel={supportedLabel}
        formatsText={formatsText}
        selectedModel={selectedModel}
        selectedModelText={selectedModelText}
        showModelInfo={showModelInfo}
        onInteract={onInteract}
      />
    )
  }

  if (isUnsupported3DFormat) {
    return (
      <PreparingCard
        variant={variant}
        rendererName={rendererName}
        preparingText={unsupportedFormatLabel}
        modelFormatLabel={modelFormatLabel}
        supportedLabel={supportedLabel}
        formatsText={formatsText}
        selectedModel={selectedModel}
        selectedModelText={selectedModelText}
        showModelInfo={showModelInfo}
        onInteract={onInteract}
      />
    )
  }

  if (isVrmSelected && !hasRelativePath) {
    return (
      <PreparingCard
        variant={variant}
        rendererName={rendererName}
        preparingText={vrmLoadErrorTitle}
        modelFormatLabel={modelFormatLabel}
        supportedLabel={supportedLabel}
        formatsText={formatsText}
        selectedModel={selectedModel}
        selectedModelText={selectedModelText}
        showModelInfo={showModelInfo}
        onInteract={onInteract}
      />
    )
  }

  if (!isVrmSelected) {
    return (
      <PreparingCard
        variant={variant}
        rendererName={rendererName}
        preparingText={preparingText}
        modelFormatLabel={modelFormatLabel}
        supportedLabel={supportedLabel}
        formatsText={formatsText}
        selectedModel={selectedModel}
        selectedModelText={selectedModelText}
        showModelInfo={showModelInfo}
        onInteract={onInteract}
      />
    )
  }

  const vrmModel = selectedModel as CharacterModelDefinition

  return (
    <VrmRenderer
      modelRelativePath={vrmModel.relativePath as string}
      variant={variant}
      loadingLabel={vrmLoadingLabel}
      errorTitle={vrmLoadErrorTitle}
      errorHint={vrmLoadErrorHint}
      renderingLabel={threeDRenderingLabel}
      selectedModelLabel={selectedModelText.selectedModelLabel}
      selectedModelName={vrmModel.displayName}
      modelFormatLabel={selectedModelText.modelFormatLabel}
      modelFormatName={selectedModelText.formatLabel[vrmModel.format]}
      modelPathLabel={selectedModelText.pathLabel}
      showMeta={showModelInfo}
      onRendererLoadStateChange={onRendererLoadStateChange}
      onRendererBranchStateChange={onRendererBranchStateChange}
      onRendererModelUrlChange={onRendererModelUrlChange}
      onInteract={onInteract}
      vrmMotionSettings={vrmMotionSettings}
    />
  )
}
