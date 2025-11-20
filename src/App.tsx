import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Transaction } from './lib/types';
import { INITIAL_TRANSACTIONS } from './lib/constants';
import { LayoutGrid, Plus, List, Sparkles, Wallet, Settings } from 'lucide-react';

// Lazy load features
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const TransactionForm = lazy(() => import('./features/transactions/TransactionForm').then(m => ({ default: m.TransactionForm })));
const TransactionList = lazy(() => import('./features/transactions/TransactionList').then(m => ({ default: m.TransactionList })));
const AiInsights = lazy(() => import('./features/insights/AiInsights').then(m => ({ default: m.AiInsights })));
const SettingsPage = lazy(() => import('./features/settings/Settings').then(m => ({ default: m.Settings })));

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('gemini-expenses');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'insights' | 'settings'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini-expenses', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleClearData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('gemini-expenses');
      setTransactions(INITIAL_TRANSACTIONS);
      setActiveTab('overview');
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsClosing(false);
    setIsAddModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsAddModalOpen(false);
      setIsClosing(false);
    }, 300);
  }, []);

  const TabItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className="flex flex-col items-center justify-center w-full h-full transition-none touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Icon 
        size={26} 
        strokeWidth={activeTab === id ? 2.5 : 2} 
        className={`transition-colors duration-150 mb-[2px] ${activeTab === id ? 'text-ios-blue' : 'text-[#8E8E93]'}`} 
      />
      <span className={`text-[10px] font-medium tracking-[-0.08px] transition-colors duration-150 ${activeTab === id ? 'text-ios-blue' : 'text-[#8E8E93]'}`}>
        {label}
      </span>
    </button>
  );

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition-colors w-full text-left ${
        activeTab === id 
          ? 'bg-[#E5E5EA] text-[#1D1D1F]' 
          : 'text-[#3C3C43] hover:bg-[#E5E5EA]/50 active:bg-[#E5E5EA]'
      }`}
    >
      <Icon size={20} strokeWidth={2} className={activeTab === id ? 'text-ios-blue' : 'text-[#8E8E93]'} />
      <span className="text-[15px] font-medium tracking-[-0.24px]">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 flex overflow-hidden transition-colors duration-300" style={{ backgroundColor: isAddModalOpen && !isClosing ? '#1A1A1A' : '#000000' }}>
      
      {/* macOS Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 bg-[#F5F5F7] h-full border-r border-[#D1D1D6] ${isAddModalOpen && !isClosing ? 'page-scale-back' : 'page-scale-normal'}`}>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8 mt-2">
            <div className="bg-gradient-to-br from-ios-blue to-ios-indigo p-2.5 rounded-[14px] shadow-sm">
              <Wallet className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Wallet</h1>
          </div>

          <nav className="space-y-1">
            <SidebarItem id="overview" icon={LayoutGrid} label="Overview" />
            <SidebarItem id="history" icon={List} label="Transactions" />
            <SidebarItem id="insights" icon={Sparkles} label="For You" />
          </nav>
        </div>

        <div className="mt-auto p-5">
          <button 
            onClick={handleOpenModal}
            className="w-full bg-ios-blue hover:bg-[#0051D5] active:bg-[#004FC7] text-white py-3.5 rounded-[14px] font-semibold transition-colors flex items-center justify-center gap-2 text-[17px] shadow-sm"
          >
            <Plus size={20} strokeWidth={2.5} />
            Add Transaction
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 relative flex flex-col h-full overflow-hidden bg-[#000000] md:bg-white ${isAddModalOpen && !isClosing ? 'page-scale-back' : 'page-scale-normal'}`}>
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar bg-[#000000] md:bg-white">
          <div className="max-w-5xl mx-auto px-4 pt-2 pb-20 md:px-8 md:pt-6 md:pb-8">
            
            {/* iOS Large Title Navigation Bar */}
            <header className="flex items-end mb-6 md:hidden" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)', minHeight: '52px' }}>
              <h2 className="text-[34px] font-bold text-white tracking-[0.37px] leading-[41px]">
                {activeTab === 'overview' ? 'Overview' : activeTab === 'history' ? 'Transactions' : activeTab === 'insights' ? 'For You' : 'Settings'}
              </h2>
            </header>

            {/* macOS Header */}
            <header className="hidden md:block mb-8">
               <h2 className="text-[34px] font-bold text-[#1D1D1F] tracking-[0.37px] leading-[41px]">
                  {activeTab === 'overview' ? 'Overview' : activeTab === 'history' ? 'Transactions' : activeTab === 'insights' ? 'For You' : 'Settings'}
                </h2>
            </header>

            {/* Content */}
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-8 h-8 border-3 border-ios-blue border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <div 
                key={activeTab}
                className="min-h-[200px] animate-fade-in"
              >
                {activeTab === 'overview' && <Dashboard transactions={transactions} />}
                {activeTab === 'history' && <TransactionList transactions={transactions} onDelete={deleteTransaction} />}
                {activeTab === 'insights' && <AiInsights transactions={transactions} />}
                {activeTab === 'settings' && <SettingsPage onClearData={handleClearData} />}
              </div>
            </Suspense>
          </div>
        </div>
      </main>

      {/* iOS Tab Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-ios-material-dark z-30 gpu-accelerated" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)', paddingTop: '8px' }}>
        <div className="grid grid-cols-5 h-[49px] items-center">
          <TabItem id="overview" icon={LayoutGrid} label="Overview" />
          <TabItem id="history" icon={List} label="Transactions" />
          <button
            onClick={handleOpenModal}
            className="flex flex-col items-center justify-center w-full h-full transition-none touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-[44px] h-[44px] bg-ios-blue rounded-full flex items-center justify-center shadow-lg">
              <Plus 
                size={24} 
                strokeWidth={2.5} 
                className="text-white" 
              />
            </div>
          </button>
          <TabItem id="insights" icon={Sparkles} label="For You" />
          <TabItem id="settings" icon={Settings} label="Settings" />
        </div>
      </div>

      {/* iOS Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div 
            className={`absolute inset-0 bg-black/40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={handleCloseModal}
            style={{ 
              animationDuration: '0.3s',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transform: 'translateZ(0)',
              willChange: 'opacity',
              touchAction: 'none'
            }}
          />
          
          <div 
            className={`relative w-full max-h-[94vh] md:h-auto md:w-full md:max-w-[540px] rounded-t-[28px] md:rounded-[28px] flex flex-col md:max-h-[85vh] gpu-accelerated shadow-2xl overflow-hidden ${isClosing ? 'md:animate-scale-out animate-slide-down' : 'md:animate-scale-in animate-slide-up'}`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              willChange: 'transform, opacity', 
              animationDuration: '0.3s',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)',
              transform: 'translateZ(0)',
              touchAction: 'auto'
            }}
          >
             <div className="flex-none flex items-center justify-between h-14 px-4 border-b border-white/5" style={{ 
               background: 'rgba(28, 28, 30, 0.7)',
               transform: 'translateZ(0)'
             }}>
                <h3 className="text-[20px] font-bold text-white tracking-tight">New Transaction</h3>
                <button 
                  onClick={handleCloseModal} 
                  className="text-ios-blue text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]"
                >
                  Cancel
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar" style={{ 
               background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)',
               WebkitOverflowScrolling: 'touch',
               touchAction: 'pan-y'
             }}>
               <Suspense fallback={
                 <div className="flex items-center justify-center h-full">
                   <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                 </div>
               }>
                 <TransactionForm onAddTransaction={addTransaction} onClose={handleCloseModal} />
               </Suspense>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
