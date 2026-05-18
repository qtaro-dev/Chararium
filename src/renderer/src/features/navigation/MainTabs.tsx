export type MainTab = 'dashboard' | 'mascot' | 'responses' | 'models' | 'settings' | 'developer'

interface MainTabsProps {
  activeTab: MainTab
  onChangeTab: (tab: MainTab) => void
  labels: Record<MainTab, string>
}

const tabs: readonly MainTab[] = ['dashboard', 'mascot', 'responses', 'models', 'settings', 'developer']

export function MainTabs({ activeTab, onChangeTab, labels }: MainTabsProps): React.JSX.Element {
  return (
    <nav className="main-tabs" aria-label="main-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`main-tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onChangeTab(tab)}
        >
          {labels[tab]}
        </button>
      ))}
    </nav>
  )
}
