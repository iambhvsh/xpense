import React from 'react';
import { Plus } from 'lucide-react';
import { AppTab, NAV_TABS } from '../../app/constants/navigation';

interface BottomTabBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onAddTransaction: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  onAddTransaction
}) => {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-ios-material-dark z-50 gpu-accelerated"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
        paddingTop: '8px',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      <div className="grid grid-cols-5 h-[49px] items-center">
        {NAV_TABS.slice(0, 2).map(tab => (
          <TabButton
            key={tab.id}
            tabId={tab.id}
            icon={tab.icon}
            label={tab.label}
            activeTab={activeTab}
            onSelect={onSelectTab}
          />
        ))}

        <button
          onClick={onAddTransaction}
          className="flex flex-col items-center justify-center w-full h-full transition-none touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="w-[44px] h-[44px] bg-ios-blue rounded-full flex items-center justify-center shadow-lg gpu-accelerated">
            <Plus size={24} strokeWidth={2.5} className="text-white" />
          </div>
        </button>

        {NAV_TABS.slice(2).map(tab => (
          <TabButton
            key={tab.id}
            tabId={tab.id}
            icon={tab.icon}
            label={tab.label}
            activeTab={activeTab}
            onSelect={onSelectTab}
          />
        ))}
      </div>
    </div>
  );
};

interface TabButtonProps {
  tabId: AppTab;
  icon: typeof NAV_TABS[number]['icon'];
  label: string;
  activeTab: AppTab;
  onSelect: (tab: AppTab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  tabId,
  icon: Icon,
  label,
  activeTab,
  onSelect
}) => (
  <button
    onClick={() => onSelect(tabId)}
    className="flex flex-col items-center justify-center w-full h-full transition-none touch-manipulation"
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    <Icon
      size={26}
      strokeWidth={activeTab === tabId ? 2.5 : 2}
      className={`transition-colors duration-150 mb-[2px] ${
        activeTab === tabId ? 'text-ios-blue' : 'text-[#8E8E93]'
      }`}
    />
    <span
      className={`text-[10px] font-medium tracking-[-0.08px] transition-colors duration-150 ${
        activeTab === tabId ? 'text-ios-blue' : 'text-[#8E8E93]'
      }`}
    >
      {label}
    </span>
  </button>
);

