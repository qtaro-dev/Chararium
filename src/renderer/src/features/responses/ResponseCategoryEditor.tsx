import type { ResponseCategory, ResponseEntry } from '@shared/index'

interface ResponseCategoryEditorProps {
  title: string
  categoryLabel: string
  enabledLabel: string
  disabledLabel: string
  entriesCountLabel: string
  categories: readonly ResponseCategory[]
  entries: readonly ResponseEntry[]
  onToggleCategoryEnabled: (categoryId: string, enabled: boolean) => void
}

export function ResponseCategoryEditor({
  title,
  categoryLabel,
  enabledLabel,
  disabledLabel,
  entriesCountLabel,
  categories,
  entries,
  onToggleCategoryEnabled
}: ResponseCategoryEditorProps): React.JSX.Element {
  return (
    <section className="response-tab-panel">
      <h3>{title}</h3>
      <div className="response-entries-grid">
        {categories.map((category) => {
          const entriesCount = entries.filter((entry) => entry.categoryId === category.id).length
          return (
            <article key={category.id} className="response-entry-card">
              <p>
                <strong>{category.label}</strong>
              </p>
              <p className="muted">
                {categoryLabel}: {category.id}
              </p>
              {category.description ? <p className="muted">{category.description}</p> : null}
              <p className="muted">
                {entriesCountLabel}: {entriesCount}
              </p>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={category.enabled}
                  onChange={(event) => onToggleCategoryEnabled(category.id, event.currentTarget.checked)}
                />
                <span>{category.enabled ? enabledLabel : disabledLabel}</span>
              </label>
            </article>
          )
        })}
      </div>
    </section>
  )
}
