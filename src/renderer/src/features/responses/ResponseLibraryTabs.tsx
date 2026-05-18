export type ResponseLibraryTab = 'list' | 'add' | 'categories' | 'time' | 'speechLog' | 'manage'

interface ResponseLibraryTabsProps {
  activeTab: ResponseLibraryTab
  onChangeTab: (tab: ResponseLibraryTab) => void
  labels: Record<ResponseLibraryTab, string>
}

const tabOrder: readonly ResponseLibraryTab[] = ['list', 'add', 'categories', 'time', 'speechLog', 'manage']

export function ResponseLibraryTabs({
  activeTab,
  onChangeTab,
  labels
}: ResponseLibraryTabsProps): React.JSX.Element {
  return (
    <div className="response-tabs" role="tablist" aria-label="response-library-tabs">
      {tabOrder.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          className={`response-tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onChangeTab(tab)}
        >
          {labels[tab]}
        </button>
      ))}
    </div>
  )
}
