import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { AppTab, NAV_TABS } from '../../app/constants/navigation';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onAddTransaction: () => void;
  dimmed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onAddTransaction,
  dimmed
}) => {
  return (
    <aside
      className="hidden md:flex flex-col w-64 bg-[#F5F5F7] h-full border-r border-[#D1D1D6] page-scalable"
      data-scaled={dimmed}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-8 mt-2">
          <div className="bg-gradient-to-br from-ios-blue to-ios-indigo p-2.5 rounded-[14px] shadow-sm">
            <Wallet className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Xpense</h1>
        </div>

        <nav className="space-y-1">
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition-colors w-full text-left contain-layout ${
                activeTab === tab.id
                  ? 'bg-[#E5E5EA] text-[#1D1D1F]'
                  : 'text-[#3C3C43] hover:bg-[#E5E5EA]/50 active:bg-[#E5E5EA]'
              }`}
            >
              <tab.icon
                size={20}
                strokeWidth={2}
                className={activeTab === tab.id ? 'text-ios-blue' : 'text-[#8E8E93]'}
              />
              <span className="text-[15px] font-medium tracking-[-0.24px]">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-5">
        <button
          onClick={onAddTransaction}
          className="w-full bg-ios-blue hover:bg-[#0051D5] active:bg-[#004FC7] text-white py-3.5 rounded-[14px] font-semibold transition-colors flex items-center justify-center gap-2 text-[17px] shadow-sm"
        >
          <Plus size={20} strokeWidth={2.5} />
          Add Transaction
        </button>
      </div>
    </aside>
  );
};

