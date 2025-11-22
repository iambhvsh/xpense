import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { TransactionRecord } from './lib/db';
import { useDatabaseInit, useTransactions } from './lib/hooks/useDatabase';
import { dbHelpers, seedDefaultCategories } from './lib/db';
import { useAppStore } from './lib/store';
import { AlertProvider } from './components/context/AlertProvider';
import { ErrorBoundary } from './lib/utils/errorBoundary';
import { isNativePlatform, haptics } from './lib/utils/native';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { PageHeader } from './components/layout/PageHeader';
import { AddTransactionModal } from './components/layout/AddTransactionModal';
import { Spinner } from './components/ui/Spinner';
import { AppTab } from './app/constants/navigation';

// Lazy load features
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const TransactionForm = lazy(() => import('./features/transactions/TransactionForm').then(m => ({ default: m.TransactionForm })));
const TransactionList = lazy(() => import('./features/transactions/TransactionList').then(m => ({ default: m.TransactionList })));
const Budget = lazy(() => import('./features/budget/Budget').then(m => ({ default: m.Budget })));
const AiInsights = lazy(() => import('./features/insights/AiInsights').then(m => ({ default: m.AiInsights })));
const SettingsPage = lazy(() => import('./features/settings/Settings').then(m => ({ default: m.Settings })));
const Onboarding = lazy(() => import('./features/onboarding/Onboarding').then(m => ({ default: m.Onboarding })));

const App: React.FC = () => {
  const { isInitialized } = useDatabaseInit();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isClosingAddModal, setIsClosingAddModal] = useState(false);
  
  const { 
    transactions: dbTransactions, 
    addTransaction: addDbTransaction,
    deleteTransaction: deleteDbTransaction
  } = useTransactions();
  
  // Use Zustand store
  const activeTab = useAppStore(state => state.activeTab) as AppTab;
  const isAddModalOpen = useAppStore(state => state.isAddModalOpen);
  const setActiveTab = useAppStore(state => state.setActiveTab);
  const setIsAddModalOpen = useAppStore(state => state.setIsAddModalOpen);
  const setTransactions = useAppStore(state => state.setTransactions);
  
  // Sync DB transactions to store
  useEffect(() => {
    if (dbTransactions.length > 0) {
      setTransactions(dbTransactions);
    }
  }, [dbTransactions, setTransactions]);

  // Initialize native features - hide splash screen immediately
  useEffect(() => {
    const initNative = async () => {
      if (isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#000000' });
          await Keyboard.setAccessoryBarVisible({ isVisible: false });
          // Hide splash screen as soon as React renders
          await SplashScreen.hide({ fadeOutDuration: 300 });
        } catch (e) {
          // Silently fail but ensure splash is hidden
          try {
            await SplashScreen.hide({ fadeOutDuration: 0 });
          } catch {}
        }
      }
    };

    initNative();
  }, []);

  // Initialize app data after native setup
  useEffect(() => {
    if (!isInitialized) return;
    
    // Initialize currency cache
    import('./lib/utils/currency').then(({ initializeCurrencyCache }) => {
      initializeCurrencyCache();
    });
    
    // Check onboarding
    dbHelpers.getSetting('xpense-onboarding-complete').then(completed => {
      setShowOnboarding(!completed);
    });
  }, [isInitialized]);

  // Browser history navigation
  useEffect(() => {
    if (!isInitialized || showOnboarding) return;

    const hash = window.location.hash.slice(1) as AppTab;
    const validTabs: AppTab[] = ['overview', 'history', 'budget', 'settings'];
    const initialTab = validTabs.includes(hash) ? hash : 'overview';
    
    if (initialTab !== activeTab) {
      setActiveTab(initialTab);
    }

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#overview');
    }

    const handlePopState = () => {
      if (isAddModalOpen) {
        setIsAddModalOpen(false);
        return;
      }
      
      const newHash = window.location.hash.slice(1) as AppTab;
      const newTab = validTabs.includes(newHash) ? newHash : 'overview';
      
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Android back button
    const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (isAddModalOpen) {
        setIsAddModalOpen(false);
        return;
      }

      if (activeTab !== 'overview') {
        window.history.back();
        return;
      }

      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      backButtonListener.then(listener => listener.remove());
    };
  }, [isInitialized, showOnboarding, activeTab, isAddModalOpen]);

  const addTransaction = useCallback(async (t: Omit<TransactionRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDbTransaction(t);
  }, [addDbTransaction]);

  const deleteTransaction = useCallback(async (id: number) => {
    await deleteDbTransaction(id);
  }, [deleteDbTransaction]);

  const handleTabChange = useCallback((tab: AppTab) => {
    if (tab === activeTab) return;
    
    if (isNativePlatform()) {
      haptics.light();
    }
    
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  }, [activeTab, setActiveTab]);

  const handleClearData = useCallback(async () => {
    await dbHelpers.clearAllData();
    await seedDefaultCategories();
    handleTabChange('overview');
  }, [handleTabChange]);

  const handleOpenModal = useCallback(() => {
    if (isNativePlatform()) {
      haptics.medium();
    }
    setIsAddModalOpen(true);
    window.history.pushState({ modal: 'add-transaction' }, '', window.location.href);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (isNativePlatform()) {
      haptics.light();
    }
    
    setIsClosingAddModal(true);
    setTimeout(() => {
      if (window.history.state?.modal === 'add-transaction') {
        window.history.back();
      }
      setIsAddModalOpen(false);
      setIsClosingAddModal(false);
    }, 350);
  }, [setIsAddModalOpen]);

  if (!isInitialized) {
    return (
      <AlertProvider>
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <Spinner className="w-10 h-10 text-white" />
        </div>
      </AlertProvider>
    );
  }

  if (showOnboarding) {
    return (
      <AlertProvider>
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black flex items-center justify-center">
              <Spinner className="w-10 h-10 text-white" />
            </div>
          }
        >
          <Onboarding
            onComplete={async () => {
              await dbHelpers.setSetting('xpense-onboarding-complete', true);
              setShowOnboarding(false);
            }}
          />
        </Suspense>
      </AlertProvider>
    );
  }

  return (
    <ErrorBoundary>
      <AlertProvider>
        <div className="fixed inset-0 flex overflow-hidden bg-[#000000]">
        <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-[#000000]">
          <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar bg-[#000000] smooth-scroll">
            <div
              className="w-full max-w-[1024px] mx-auto px-4 md:px-6 pt-2"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 90px)' }}
            >
              <PageHeader activeTab={activeTab} />
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[200px]">
                    <Spinner className="w-8 h-8 text-[#8E8E93]" />
                  </div>
                }
              >
                <div key={activeTab} className="min-h-[200px] animate-tab-fade-in">
                  {activeTab === 'overview' && (
                    <>
                      <Dashboard transactions={dbTransactions} />
                      <div className="mt-6">
                        <AiInsights transactions={dbTransactions} />
                      </div>
                    </>
                  )}
                  {activeTab === 'history' && (
                    <TransactionList transactions={dbTransactions} onDelete={deleteTransaction} />
                  )}
                  {activeTab === 'budget' && <Budget />}
                  {activeTab === 'settings' && <SettingsPage onClearData={handleClearData} />}
                </div>
              </Suspense>
            </div>
          </div>
        </main>

        <BottomTabBar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onAddTransaction={handleOpenModal}
        />

        <AddTransactionModal open={isAddModalOpen} isClosing={isClosingAddModal} onClose={handleCloseModal}>
          <TransactionForm onAddTransaction={addTransaction} onClose={handleCloseModal} />
        </AddTransactionModal>
      </div>
    </AlertProvider>
  </ErrorBoundary>
  );
};

export default App;
