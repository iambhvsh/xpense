import React from 'react';
import { AppTab, TAB_TITLES } from '../../app/constants/navigation';

interface PageHeaderProps {
  activeTab: AppTab;
}

export const PageHeader: React.FC<PageHeaderProps> = React.memo(({ activeTab }) => {
  const title = TAB_TITLES[activeTab];

  return (
    <header
      className="flex items-end mb-6 md:mb-8"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)', minHeight: '52px' }}
    >
      <h2 className="text-[34px] md:text-[40px] font-bold text-white tracking-[0.37px] leading-[41px] md:leading-[48px]">
        {title}
      </h2>
    </header>
  );
}, (prevProps, nextProps) => {
  return prevProps.activeTab === nextProps.activeTab;
});

