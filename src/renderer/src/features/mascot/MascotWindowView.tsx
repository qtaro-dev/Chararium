import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

import type {
  AppSettings,
  CharacterModelDefinition,
  CharacterModelFormat,
  CharacterRendererType,
  MascotDragMode
} from '@shared/index'

import { CharacterRenderer } from './CharacterRenderer'
interface MascotWindowViewProps {
  appSettings: AppSettings
  message: string
  messageSource?: 'normal' | 'debugSpeech'
  rendererSelectedModel?: CharacterModelDefinition
  onBubbleInteract: (event: React.MouseEvent<HTMLElement>) => void
  onCharacterInteract: (event: React.MouseEvent<HTMLElement>) => void
  strings: {
    mascotPlaceholder: string
    characterRendererNames: Record<CharacterRendererType, string>
    characterRendererDescriptions: Record<CharacterRendererType, string>
    live2DPreparingMessage: string
    threeDPreparingMessage: string
    modelFormatLabel: string
    supportedPlannedLabel: string
    rendererSupportedFormats: Record<'live2d' | '3d', string>
    selectedModelLabel: string
    modelNotSelectedLabel: string
    modelPathLabel: string
    modelFormatNames: Record<CharacterModelFormat, string>
    vrmLoadingLabel: string
    vrmLoadErrorTitle: string
    vrmLoadErrorHint: string
    threeDRenderingLabel: string
    modelNotSelected3DLabel: string
    unsupported3DFormatLabel: string
  }
}

const modifierDragThreshold = 4
const dragClickSuppressionMs = 300

export function MascotWindowView({
  appSettings,
  message,
  messageSource = 'normal',
  rendererSelectedModel,
  onBubbleInteract,
  onCharacterInteract,
  strings
}: MascotWindowViewProps): React.JSX.Element {
  const speechBubbleFontFamilyMap: Record<AppSettings['mascotSpeechBubbleFontFamily'], string> = {
    system: 'system-ui, sans-serif',
    sans: '"Segoe UI", "Hiragino Sans", "Yu Gothic", sans-serif',
    serif: '"Yu Mincho", "Hiragino Mincho ProN", serif',
    rounded: '"Meiryo", "Yu Gothic", sans-serif'
  }
  const resolvedDisplayScale =
    appSettings.mascotWindowSizePreset === 'small'
      ? 0.75
      : appSettings.mascotWindowSizePreset === 'large'
        ? 1.25
        : appSettings.mascotWindowSizePreset === 'custom'
          ? Math.min(2.0, Math.max(0.3, appSettings.mascotDisplayCustomScale ?? 1.0))
          : 1.0
  const [isModifierDragReady, setIsModifierDragReady] = useState<boolean>(false)
  const [isDraggingWithModifier, setIsDraggingWithModifier] = useState<boolean>(false)
  const dragStateRef = useRef<{
    active: boolean
    hasMoved: boolean
    lastX: number
    lastY: number
  }>({
    active: false,
    hasMoved: false,
    lastX: 0,
    lastY: 0
  })
  const suppressNextInteractionRef = useRef<boolean>(false)
  const isTransparentDragAreaMode = appSettings.mascotDragMode === 'transparent-drag-area'
  const mascotVerticalAlignClass = `mascot-v-align-${appSettings.mascotVerticalAlign}`
  const mascotHorizontalAlignClass = `mascot-h-align-${appSettings.mascotHorizontalAlign}`
  const speechBubblePlacementClass = `mascot-bubble-placement-${appSettings.mascotSpeechBubblePlacement}`
  const isBubbleWidthCustom = (appSettings.speechBubbleWidthMode ?? 'auto') === 'custom'
  const isBubbleHeightCustom = (appSettings.speechBubbleHeightMode ?? 'auto') === 'custom'
  const bubbleWidthPx = `${Math.min(800, Math.max(80, appSettings.speechBubbleMaxWidth ?? 208))}px`
  const bubbleHeightPx = `${Math.min(800, Math.max(40, appSettings.speechBubbleMaxHeight ?? 220))}px`
  const bubbleAreaStyle: CSSProperties = (() => {
    if (appSettings.mascotSpeechBubblePlacement === 'left' || appSettings.mascotSpeechBubblePlacement === 'right') {
      return {
        transform: `translate(${appSettings.mascotSpeechBubbleOffsetX}px, ${appSettings.mascotSpeechBubbleOffsetY}px)`
      }
    }
    return {
      transform: `translate(calc(-50% + ${appSettings.mascotSpeechBubbleOffsetX}px), ${appSettings.mascotSpeechBubbleOffsetY}px)`
    }
  })()

  function canStartModifierDrag(event: Pick<MouseEvent, 'ctrlKey' | 'shiftKey'>, dragMode: MascotDragMode): boolean {
    if (dragMode === 'disabled' || dragMode === 'transparent-drag-area') {
      return false
    }

    if (dragMode === 'modifier-ctrl') {
      return event.ctrlKey
    }

    if (dragMode === 'modifier-shift') {
      return event.shiftKey
    }

    return event.ctrlKey || event.shiftKey
  }

  function isExcludedDragTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false
    }

    return Boolean(target.closest('[data-mascot-drag-exclude="true"]'))
  }

  function finalizeModifierDrag(): void {
    if (!dragStateRef.current.active) {
      return
    }

    dragStateRef.current.active = false
    setIsDraggingWithModifier(false)
    void window.chararium.mascotWindow.endMove()
  }

  useEffect(() => {
    if (isTransparentDragAreaMode || appSettings.mascotDragMode === 'disabled') {
      setIsModifierDragReady(false)
      return
    }

    const updateModifierState = (event: KeyboardEvent): void => {
      setIsModifierDragReady(canStartModifierDrag(event, appSettings.mascotDragMode))
    }

    const resetModifierState = (): void => setIsModifierDragReady(false)

    window.addEventListener('keydown', updateModifierState)
    window.addEventListener('keyup', updateModifierState)
    window.addEventListener('blur', resetModifierState)

    return () => {
      window.removeEventListener('keydown', updateModifierState)
      window.removeEventListener('keyup', updateModifierState)
      window.removeEventListener('blur', resetModifierState)
    }
  }, [appSettings.mascotDragMode, isTransparentDragAreaMode])

  useEffect(() => {
    if (!dragStateRef.current.active) {
      return
    }

    const handleMouseMove = (event: MouseEvent): void => {
      if (!dragStateRef.current.active) {
        return
      }

      const deltaX = event.screenX - dragStateRef.current.lastX
      const deltaY = event.screenY - dragStateRef.current.lastY
      if (deltaX === 0 && deltaY === 0) {
        return
      }

      dragStateRef.current.lastX = event.screenX
      dragStateRef.current.lastY = event.screenY

      if (!dragStateRef.current.hasMoved) {
        if (Math.abs(deltaX) >= modifierDragThreshold || Math.abs(deltaY) >= modifierDragThreshold) {
          dragStateRef.current.hasMoved = true
        } else {
          return
        }
      }

      void window.chararium.mascotWindow.moveBy({ deltaX, deltaY })
    }

    const handleMouseUp = (): void => {
      if (!dragStateRef.current.active) {
        return
      }

      suppressNextInteractionRef.current = true
      window.setTimeout(() => {
        suppressNextInteractionRef.current = false
      }, dragClickSuppressionMs)
      finalizeModifierDrag()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingWithModifier])

  useEffect(() => () => finalizeModifierDrag(), [])

  useEffect(() => {
    if (appSettings.mascotClickThroughMode !== 'whileHoldingModifier') {
      void window.chararium.mascotWindow.setClickThrough({ enabled: false })
      return
    }

    const update = (event: KeyboardEvent): void => {
      const enabled = event.ctrlKey || event.shiftKey
      void window.chararium.mascotWindow.setClickThrough({ enabled, forward: true })
    }

    const disable = (): void => {
      void window.chararium.mascotWindow.setClickThrough({ enabled: false })
    }

    window.addEventListener('keydown', update)
    window.addEventListener('keyup', update)
    window.addEventListener('blur', disable)
    return () => {
      window.removeEventListener('keydown', update)
      window.removeEventListener('keyup', update)
      window.removeEventListener('blur', disable)
      disable()
    }
  }, [appSettings.mascotClickThroughMode])

  function handleMouseDownCapture(event: React.MouseEvent<HTMLElement>): void {
    if (event.button !== 0 || isTransparentDragAreaMode) {
      return
    }

    if (!canStartModifierDrag(event, appSettings.mascotDragMode)) {
      return
    }

    if (isExcludedDragTarget(event.target)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressNextInteractionRef.current = true
    dragStateRef.current = {
      active: true,
      hasMoved: false,
      lastX: event.screenX,
      lastY: event.screenY
    }
    setIsDraggingWithModifier(true)
    void window.chararium.mascotWindow.beginMove()
  }

  function handleBubbleInteraction(event: React.MouseEvent<HTMLElement>): void {
    if (suppressNextInteractionRef.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressNextInteractionRef.current = false
      return
    }

    onBubbleInteract(event)
  }

  function handleCharacterInteraction(event: React.MouseEvent<HTMLElement>): void {
    if (suppressNextInteractionRef.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressNextInteractionRef.current = false
      return
    }

    onCharacterInteract(event)
  }

  return (
    <main
      className={`mascot-shell${isTransparentDragAreaMode ? ' mascot-drag-region' : ''}${
        isModifierDragReady ? ' mascot-modifier-ready' : ''
      }${isDraggingWithModifier ? ' mascot-modifier-dragging' : ''} mascot-display-size-${appSettings.mascotWindowSizePreset} mascot-area-size-${appSettings.mascotWindowAreaSizePreset} ${speechBubblePlacementClass}`}
      onMouseDownCapture={handleMouseDownCapture}
      style={{
        ['--mascot-display-scale' as string]: String(resolvedDisplayScale),
        ['--mascot-bubble-offset-x' as string]: `${appSettings.mascotSpeechBubbleOffsetX}px`,
        ['--mascot-bubble-offset-y' as string]: `${appSettings.mascotSpeechBubbleOffsetY}px`,
        ['--mascot-bubble-tail-offset-x' as string]: `${appSettings.speechBubbleTailOffsetX}px`,
        ['--mascot-bubble-tail-offset-y' as string]: `${appSettings.speechBubbleTailOffsetY}px`,
        ['--mascot-bubble-tail-size' as string]: `${appSettings.speechBubbleTailSize}px`,
        ['--mascot-bubble-tail-rotation-deg' as string]: `${appSettings.speechBubbleTailRotationDeg}deg`,
        ['--mascot-bubble-width' as string]:
          appSettings.speechBubbleWidthMode === 'custom' ? `${appSettings.speechBubbleMaxWidth}px` : 'auto',
        ['--mascot-bubble-height' as string]:
          appSettings.speechBubbleHeightMode === 'custom' ? `${appSettings.speechBubbleMaxHeight}px` : 'auto',
        ['--mascot-bubble-font-size' as string]: `${appSettings.mascotSpeechBubbleFontSize}px`,
        ['--mascot-bubble-font-family' as string]: speechBubbleFontFamilyMap[appSettings.mascotSpeechBubbleFontFamily],
        ['--mascot-offset-x' as string]: `${appSettings.mascotOffsetX}px`,
        ['--mascot-offset-y' as string]: `${appSettings.mascotOffsetY}px`
      }}
    >
      <article className={`mascot-compact-card${isTransparentDragAreaMode ? ' mascot-drag-region' : ''}${appSettings.mascotShowHitArea ? ' mascot-hit-area-visible' : ''}`}>
        <div className={`mascot-character-area ${mascotVerticalAlignClass} ${mascotHorizontalAlignClass}${appSettings.mascotShowHitArea ? ' mascot-hit-area-visible' : ''}`}>
          <div className="mascot-character-scale">
            <CharacterRenderer
              rendererType={appSettings.characterRendererType}
              variant="mascot"
              placeholderLabel={strings.mascotPlaceholder}
              rendererLabel={strings.characterRendererNames}
              preparingMessage={{
                live2d: strings.live2DPreparingMessage,
                '3d': strings.threeDPreparingMessage
              }}
              modelFormatLabel={strings.modelFormatLabel}
              supportedLabel={strings.supportedPlannedLabel}
              modelFormatsText={strings.rendererSupportedFormats}
              selectedModel={rendererSelectedModel}
              selectedModelText={{
                selectedModelLabel: strings.selectedModelLabel,
                modelNotSelectedLabel: strings.modelNotSelectedLabel,
                modelFormatLabel: strings.modelFormatLabel,
                pathLabel: strings.modelPathLabel,
                formatLabel: strings.modelFormatNames
              }}
              vrmLoadingLabel={strings.vrmLoadingLabel}
              vrmLoadErrorTitle={strings.vrmLoadErrorTitle}
              vrmLoadErrorHint={strings.vrmLoadErrorHint}
              threeDRenderingLabel={strings.threeDRenderingLabel}
              modelNotSelected3DLabel={strings.modelNotSelected3DLabel}
              unsupportedFormatLabel={strings.unsupported3DFormatLabel}
              showModelInfo={false}
              onInteract={handleCharacterInteraction}
              vrmMotionSettings={{
                idleMotionEnabled: appSettings.vrmIdleMotionEnabled,
                springBoneEnabled: appSettings.vrmSpringBoneEnabled,
                blinkEnabled: appSettings.vrmBlinkEnabled,
                mouthMotionEnabled: appSettings.vrmMouthMotionEnabled,
                isSpeaking: Boolean(message?.trim())
              }}
            />
          </div>
        </div>

        <div
          className={`mascot-bubble-area mascot-no-drag${appSettings.mascotShowHitArea ? ' mascot-hit-area-visible' : ''}`}
          style={bubbleAreaStyle}
        >
          <button
            type="button"
            className={`bubble compact-bubble speech-bubble mascot-bubble-button mascot-interaction-target mascot-no-drag ${
              messageSource === 'debugSpeech' ? 'speech-bubble-debug' : ''
            } ${
              appSettings.speechBubbleWritingMode === 'vertical' ? 'speech-bubble-vertical' : 'speech-bubble-horizontal'
            } ${
              appSettings.mascotSpeechBubblePlacement === 'bottom'
                ? 'speech-bubble--tail-top'
                : appSettings.mascotSpeechBubblePlacement === 'left'
                  ? 'speech-bubble--tail-right'
                  : appSettings.mascotSpeechBubblePlacement === 'right'
                    ? 'speech-bubble--tail-left'
                    : 'speech-bubble--tail-bottom'
            } ${
              (appSettings.speechBubbleTailDirection ?? 'auto') === 'left'
                ? 'speech-bubble-tail-dir-left'
                : (appSettings.speechBubbleTailDirection ?? 'auto') === 'right'
                  ? 'speech-bubble-tail-dir-right'
                  : (appSettings.speechBubbleTailDirection ?? 'auto') === 'center'
                    ? 'speech-bubble-tail-dir-center'
                    : 'speech-bubble-tail-dir-auto'
            }`}
            onClick={handleBubbleInteraction}
            style={{
              ['--speech-bubble-border-width' as string]: `${Math.max(0, Math.min(8, appSettings.speechBubbleBorderWidth ?? 1))}px`,
              ['--speech-bubble-border-alpha' as string]: appSettings.speechBubbleBorderEnabled ? '1' : '0',
              ['--mascot-bubble-tail-mirror-scale' as string]: appSettings.speechBubbleTailMirrored ? '-1' : '1',
              width: isBubbleWidthCustom ? bubbleWidthPx : 'auto',
              maxWidth:
                isBubbleWidthCustom
                  ? bubbleWidthPx
                  : appSettings.speechBubbleWritingMode === 'vertical'
                    ? 'min(72vw, 320px)'
                    : 'min(84vw, 360px)',
              height: isBubbleHeightCustom ? bubbleHeightPx : 'auto',
              maxHeight: isBubbleHeightCustom ? bubbleHeightPx : appSettings.speechBubbleWritingMode === 'vertical' ? 'min(66vh, 420px)' : 'min(78vh, 360px)'
            }}
          >
            <span
              aria-hidden="true"
              className={`speech-bubble-tail ${
                appSettings.mascotSpeechBubblePlacement === 'bottom'
                  ? 'speech-bubble-tail--top'
                  : appSettings.mascotSpeechBubblePlacement === 'left'
                    ? 'speech-bubble-tail--right'
                    : appSettings.mascotSpeechBubblePlacement === 'right'
                      ? 'speech-bubble-tail--left'
                      : 'speech-bubble-tail--bottom'
              }`}
            />
            <span
              className={`speech-bubble-text ${appSettings.speechBubbleWritingMode === 'vertical' ? 'speech-bubble-text-vertical' : 'speech-bubble-text-horizontal'}`}
              style={{
                width: isBubbleWidthCustom ? '100%' : 'auto',
                maxWidth: isBubbleWidthCustom ? '100%' : undefined,
                minWidth: isBubbleWidthCustom ? '100%' : undefined,
                height: isBubbleHeightCustom ? '100%' : 'auto',
                maxHeight: isBubbleHeightCustom ? '100%' : undefined,
                minHeight: isBubbleHeightCustom ? '100%' : undefined
              }}
            >
              {message}
            </span>
          </button>
        </div>
      </article>
    </main>
  )
}
