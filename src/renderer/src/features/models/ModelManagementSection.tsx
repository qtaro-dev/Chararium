import type { CharacterModelDefinition } from '@shared/index'

interface ModelManagementSectionProps {
  title: string
  reloadButtonLabel: string
  listTitle: string
  modelNameLabel: string
  modelFormatLabel: string
  rendererTypeLabel: string
  relativePathLabel: string
  selectedLabel: string
  selectButtonLabel: string
  emptyTitle: string
  emptyDescription: string
  rendererLabel: Record<'placeholder' | 'live2d' | '3d', string>
  formatLabel: Record<'placeholder' | 'live2d-model3-json' | 'vrm' | 'gltf' | 'glb', string>
  models: readonly CharacterModelDefinition[]
  selectedModelId?: string
  isLoading: boolean
  onReload: () => void
  onSelectModel: (modelId: string) => void
}

export function ModelManagementSection({
  title,
  reloadButtonLabel,
  listTitle,
  modelNameLabel,
  modelFormatLabel,
  rendererTypeLabel,
  relativePathLabel,
  selectedLabel,
  selectButtonLabel,
  emptyTitle,
  emptyDescription,
  rendererLabel,
  formatLabel,
  models,
  selectedModelId,
  isLoading,
  onReload,
  onSelectModel
}: ModelManagementSectionProps): React.JSX.Element {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        <button type="button" className="secondary-button" onClick={onReload} disabled={isLoading}>
          {reloadButtonLabel}
        </button>
      </div>
      <h3 className="models-list-title">{listTitle}</h3>
      {models.length === 0 ? (
        <div className="models-empty">
          <p>{emptyTitle}</p>
          <p className="muted">{emptyDescription}</p>
        </div>
      ) : (
        <div className="models-grid">
          {models.map((model) => {
            const isSelected = model.id === selectedModelId
            return (
              <article
                key={model.id}
                className={`model-card ${isSelected ? 'selected' : ''}`}
                aria-current={isSelected}
              >
                <p className="model-card-title">
                  <span>{modelNameLabel}</span>
                  <strong>{model.displayName}</strong>
                </p>
                <p>
                  <span>{modelFormatLabel}</span>
                  <strong>{formatLabel[model.format]}</strong>
                </p>
                <p>
                  <span>{rendererTypeLabel}</span>
                  <strong>{rendererLabel[model.rendererType]}</strong>
                </p>
                <p className="model-path">
                  <span>{relativePathLabel}</span>
                  <strong>{model.relativePath ?? '-'}</strong>
                </p>
                <div className="model-card-actions">
                  {isSelected ? <span className="model-selected-label">{selectedLabel}</span> : null}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => onSelectModel(model.id)}
                    disabled={isLoading}
                  >
                    {selectButtonLabel}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
