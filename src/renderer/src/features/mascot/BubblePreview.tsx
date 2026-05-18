interface BubblePreviewProps {
  title: string
  text: string
  source?: 'normal' | 'debugSpeech'
  writingMode: 'horizontal' | 'vertical'
  placement: 'auto' | 'top' | 'bottom' | 'left' | 'right'
  widthMode: 'auto' | 'custom'
  heightMode: 'auto' | 'custom'
  offsetX: number
  offsetY: number
  tailOffsetX: number
  tailOffsetY: number
  tailSize: number
  tailRotationDeg: number
  tailDirection: 'auto' | 'left' | 'center' | 'right'
  tailMirrored: boolean
  borderEnabled: boolean
  borderWidth: number
  maxWidth: number
  maxHeight: number
  fontSize: number
  fontFamily: string
}

export function BubblePreview({
  title,
  text,
  source = 'normal',
  writingMode,
  placement,
  widthMode,
  heightMode,
  offsetX,
  offsetY,
  tailOffsetX,
  tailOffsetY,
  tailSize,
  tailRotationDeg,
  tailDirection,
  tailMirrored,
  borderEnabled,
  borderWidth,
  maxWidth,
  maxHeight,
  fontSize,
  fontFamily
}: BubblePreviewProps): React.JSX.Element {
  const isWidthCustom = widthMode === 'custom'
  const isHeightCustom = heightMode === 'custom'
  const bubbleWidthPx = `${Math.min(800, Math.max(80, maxWidth))}px`
  const bubbleHeightPx = `${Math.min(800, Math.max(40, maxHeight))}px`

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="bubble-preview">
        <div className="bubble-preview-positioner" style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
          <div
            className={`bubble speech-bubble ${
              source === 'debugSpeech' ? 'speech-bubble-debug' : ''
            } ${
              placement === 'bottom'
                ? 'speech-bubble--tail-top'
                : placement === 'left'
                  ? 'speech-bubble--tail-right'
                  : placement === 'right'
                    ? 'speech-bubble--tail-left'
                    : 'speech-bubble--tail-bottom'
            }${writingMode === 'vertical' ? ' speech-bubble-vertical' : ' speech-bubble-horizontal'} ${
              tailDirection === 'left' ? 'speech-bubble-tail-dir-left' : tailDirection === 'right' ? 'speech-bubble-tail-dir-right' : tailDirection === 'center' ? 'speech-bubble-tail-dir-center' : 'speech-bubble-tail-dir-auto'
            }`}
            role="status"
            aria-live="polite"
            style={{
              ['--mascot-bubble-tail-offset-x' as string]: `${tailOffsetX}px`,
              ['--mascot-bubble-tail-offset-y' as string]: `${tailOffsetY}px`,
              ['--mascot-bubble-tail-size' as string]: `${tailSize}px`,
              ['--mascot-bubble-tail-rotation-deg' as string]: `${tailRotationDeg}deg`,
              ['--mascot-bubble-tail-mirror-scale' as string]: tailMirrored ? '-1' : '1',
              ['--speech-bubble-border-width' as string]: `${Math.max(0, Math.min(8, borderWidth))}px`,
              ['--speech-bubble-border-alpha' as string]: borderEnabled ? '1' : '0',
              width: isWidthCustom ? bubbleWidthPx : 'auto',
              maxWidth: isWidthCustom ? bubbleWidthPx : writingMode === 'vertical' ? 'min(72vw, 320px)' : 'min(84vw, 360px)',
              height: isHeightCustom ? bubbleHeightPx : 'auto',
              maxHeight: isHeightCustom ? bubbleHeightPx : writingMode === 'vertical' ? 'min(66vh, 420px)' : 'min(78vh, 360px)',
              fontSize: `${fontSize}px`,
              fontFamily
            }}
          >
            <span
              aria-hidden="true"
              className={`speech-bubble-tail ${
                placement === 'bottom'
                  ? 'speech-bubble-tail--top'
                  : placement === 'left'
                    ? 'speech-bubble-tail--right'
                    : placement === 'right'
                      ? 'speech-bubble-tail--left'
                      : 'speech-bubble-tail--bottom'
              }`}
            />
            <span
              className={`speech-bubble-text ${writingMode === 'vertical' ? 'speech-bubble-text-vertical' : 'speech-bubble-text-horizontal'}`}
              style={{
                width: isWidthCustom ? '100%' : 'auto',
                maxWidth: isWidthCustom ? '100%' : undefined,
                minWidth: isWidthCustom ? '100%' : undefined,
                height: isHeightCustom ? '100%' : 'auto',
                maxHeight: isHeightCustom ? '100%' : undefined,
                minHeight: isHeightCustom ? '100%' : undefined
              }}
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
