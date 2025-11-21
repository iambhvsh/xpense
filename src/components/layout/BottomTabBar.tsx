import React from 'react';
import { Plus } from 'lucide-react';
import { AppTab, NAV_TABS } from '../../app/constants/navigation';
import { haptics, isNativePlatform } from '../../lib/utils/native';

interface BottomTabBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onAddTransaction: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = React.memo(({
  activeTab,
  onSelectTab,
  onAddTransaction
}) => {
  const handleAddClick = React.useCallback(() => {
    onAddTransaction();
  }, [onAddTransaction]);

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1024px] bg-ios-material-dark z-50"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
        paddingTop: '8px'
      }}
    >
      <div className="grid grid-cols-5 h-[49px] md:h-[56px] items-center max-w-[600px] mx-auto md:max-w-full">
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
          onClick={handleAddClick}
          className="flex flex-col items-center justify-center w-full h-full transition-none touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="w-[44px] h-[44px] aspect-square bg-ios-blue rounded-full flex items-center justify-center shadow-lg">
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
}, (prevProps, nextProps) => {
  return prevProps.activeTab === nextProps.activeTab;
});

interface TabButtonProps {
  tabId: AppTab;
  icon: typeof NAV_TABS[number]['icon'];
  label: string;
  activeTab: AppTab;
  onSelect: (tab: AppTab) => void;
}

const TabButton: React.FC<TabButtonProps> = React.memo(({
  tabId,
  icon: Icon,
  label,
  activeTab,
  onSelect
}) => {
  const handleClick = React.useCallback(() => {
    if (isNativePlatform()) {
      haptics.light();
    }
    onSelect(tabId);
  }, [tabId, onSelect]);

  const isActive = activeTab === tabId;

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-full h-full transition-none touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Icon
        size={26}
        strokeWidth={isActive ? 2.5 : 2}
        className={`transition-colors duration-150 mb-[2px] md:w-7 md:h-7 ${
          isActive ? 'text-ios-blue' : 'text-[#8E8E93]'
        }`}
      />
      <span
        className={`text-[10px] md:text-[11px] font-medium tracking-[-0.08px] transition-colors duration-150 ${
          isActive ? 'text-ios-blue' : 'text-[#8E8E93]'
        }`}
      >
        {label}
      </span>
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.tabId === nextProps.tabId &&
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.label === nextProps.label
  );
});

