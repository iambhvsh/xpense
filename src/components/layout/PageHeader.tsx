import React from 'react';
import { AppTab, TAB_TITLES } from '../../app/constants/navigation';

interface PageHeaderProps {
  activeTab: AppTab;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ activeTab }) => {
  const title = TAB_TITLES[activeTab];

  return (
    <>
      <header
        className="flex items-end mb-6 md:hidden"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)', minHeight: '52px' }}
      >
        <h2 className="text-[34px] font-bold text-white tracking-[0.37px] leading-[41px]">
          {title}
        </h2>
      </header>

      <header className="hidden md:block mb-8">
        <h2 className="text-[34px] font-bold text-[#1D1D1F] tracking-[0.37px] leading-[41px]">
          {title}
        </h2>
      </header>
    </>
  );
};

