import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Transaction } from './lib/types';
import { useDatabaseInit } from './lib/hooks/useDatabase';
import { useTransactions } from './lib/hooks/useDatabase';
import { transactionRecordToTransaction, transactionToTransactionRecord } from './lib/db/adapters';
import { dbHelpers, seedDefaultCategories } from './lib/db';
import { AlertProvider } from './components/context/AlertProvider';
import { Sidebar } from './components/layout/Sidebar';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { PageHeader } from './components/layout/PageHeader';
import { AddTransactionModal } from './components/layout/AddTransactionModal';
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
  // Initialize database
  const { isInitialized } = useDatabaseInit();
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Get transactions from IndexedDB with live updates
  const { 
    transactions: dbTransactions, 
    addTransaction: addDbTransaction,
    deleteTransaction: deleteDbTransaction,
    isLoading: transactionsLoading
  } = useTransactions();

  // Convert database records to Transaction format for compatibility
  const transactions = dbTransactions.map(transactionRecordToTransaction);
  
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  // Check onboarding status and initialize caches from database
  useEffect(() => {
    if (isInitialized) {
      // Initialize currency cache
      import('./lib/utils/currency').then(({ initializeCurrencyCache }) => {
        initializeCurrencyCache();
      });
      
      // Check onboarding status
      dbHelpers.getSetting('xpense-onboarding-complete').then(completed => {
        setShowOnboarding(!completed);
      });
    }
  }, [isInitialized]);

  // Initialize browser history for tab navigation
  useEffect(() => {
    if (!isInitialized || showOnboarding) return;

    // Get initial tab from URL hash or default to overview
    const hash = window.location.hash.slice(1) as AppTab;
    const validTabs: AppTab[] = ['overview', 'history', 'budget', 'settings'];
    const initialTab = validTabs.includes(hash) ? hash : 'overview';
    
    if (initialTab !== activeTab) {
      setActiveTab(initialTab);
    }

    // If no hash, set initial hash
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#overview');
    }

    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      // If modal is open and back is pressed, close the modal
      if (isAddModalOpen && event.state?.modal === 'add-transaction') {
        return; // Let the modal close naturally
      }
      
      if (isAddModalOpen) {
        // Close modal without going back in history
        setIsClosing(true);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setIsClosing(false);
        }, 300);
        return;
      }
      
      if (isNavigatingRef.current) return;
      
      const hash = window.location.hash.slice(1) as AppTab;
      const newTab = validTabs.includes(hash) ? hash : 'overview';
      
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    };

    window.addEventListener('popstate', handlePopState);

    window.addEventListener('popstate', handlePopState);

    // Handle Android hardware back button via Capacitor
    let backButtonListener: any = null;
    
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      // If modal is open, close it
      if (isAddModalOpen) {
        setIsClosing(true);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setIsClosing(false);
        }, 300);
        return;
      }

      // If not on overview tab, go back to overview
      if (activeTab !== 'overview') {
        window.history.back();
        return;
      }

      // If on overview and can't go back, exit app
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    }).then(listener => {
      backButtonListener = listener;
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [isInitialized, showOnboarding, activeTab, isAddModalOpen]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id'>) => {
    const record = transactionToTransactionRecord(t);
    await addDbTransaction(record);
  }, [addDbTransaction]);

  const deleteTransaction = useCallback(async (id: string) => {
    await deleteDbTransaction(parseInt(id));
  }, [deleteDbTransaction]);

  const handleTabChange = useCallback((tab: AppTab) => {
    if (tab === activeTab) return;
    
    isNavigatingRef.current = true;
    setActiveTab(tab);
    
    // Update URL hash for browser history
    window.history.pushState(null, '', `#${tab}`);
    
    // Reset navigation flag after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, [activeTab]);

  const handleClearData = useCallback(async () => {
    await dbHelpers.clearAllData();
    await seedDefaultCategories();
    handleTabChange('overview');
  }, [handleTabChange]);

  const handleOpenModal = useCallback(() => {
    // Prevent opening if already animating
    if (isAnimating) return;
    
    // Clear any pending timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Use RAF for smoother animation start
    requestAnimationFrame(() => {
      setIsAnimating(true);
      setIsClosing(false);
      setIsAddModalOpen(true);
      
      // Add modal state to history
      window.history.pushState({ modal: 'add-transaction' }, '', window.location.href);
      
      // Reset animation lock after animation completes
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    });
  }, [isAnimating]);

  const handleCloseModal = useCallback(() => {
    // Prevent closing if already animating
    if (isAnimating) return;
    
    // Clear any pending timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Use RAF for smoother animation start
    requestAnimationFrame(() => {
      setIsAnimating(true);
      setIsClosing(true);
      
      // Go back in history if modal was opened via history push
      if (window.history.state?.modal === 'add-transaction') {
        window.history.back();
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        setIsAddModalOpen(false);
        setIsClosing(false);
        setIsAnimating(false);
      }, 300);
    });
  }, [isAnimating]);

  // Show loading during initialization
  const renderContent = () => (
    <div
      className="fixed inset-0 flex overflow-hidden"
      data-modal-open={isAddModalOpen && !isClosing}
      style={{
        backgroundColor: isAddModalOpen && !isClosing ? '#1A1A1A' : '#000000',
        transition: 'background-color 0.25s ease-out'
      }}
    >
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onAddTransaction={handleOpenModal}
        dimmed={isAddModalOpen && !isClosing}
      />

      <main
        className="flex-1 relative flex flex-col h-full overflow-hidden bg-[#000000] md:bg-white page-scalable"
        data-scaled={isAddModalOpen && !isClosing}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar bg-[#000000] md:bg-white smooth-scroll">
          <div
            className="max-w-5xl mx-auto px-4 pt-2 md:px-8 md:pt-6 md:pb-8"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 90px)' }}
          >
            <PageHeader activeTab={activeTab} />
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="w-8 h-8 border-3 border-ios-blue border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <div key={activeTab} className="min-h-[200px] animate-fade-in">
                {activeTab === 'overview' && (
                  <>
                    <Dashboard transactions={transactions} />
                    <div className="mt-6">
                      <AiInsights transactions={transactions} />
                    </div>
                  </>
                )}
                {activeTab === 'history' && (
                  <TransactionList transactions={transactions} onDelete={deleteTransaction} />
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

      <AddTransactionModal open={isAddModalOpen} isClosing={isClosing} onClose={handleCloseModal}>
        <TransactionForm onAddTransaction={addTransaction} onClose={handleCloseModal} />
      </AddTransactionModal>
    </div>
  );

  if (!isInitialized) {
    return (
      <AlertProvider>
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin" />
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
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
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

  return <AlertProvider>{renderContent()}</AlertProvider>;
};

export default App;
