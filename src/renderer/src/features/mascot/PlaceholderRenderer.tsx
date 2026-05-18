interface PlaceholderRendererProps {
  variant: 'mascot' | 'preview'
  placeholderLabel: string
  onInteract?: (event: React.MouseEvent<HTMLElement>) => void
}

export function PlaceholderRenderer({
  variant,
  placeholderLabel,
  onInteract
}: PlaceholderRendererProps): React.JSX.Element {
  if (variant === 'mascot') {
    return (
      <button
        type="button"
        className="mascot-avatar mascot-interaction-target mascot-no-drag"
        onClick={onInteract}
      >
        <span>{placeholderLabel}</span>
      </button>
    )
  }

  return (
    <div className="renderer-preview-surface">
      <span>{placeholderLabel}</span>
    </div>
  )
}
