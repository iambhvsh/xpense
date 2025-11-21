import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Trash2, Download, Upload, Database, Info, DollarSign, Calendar, Shield, HelpCircle, Key } from 'lucide-react';
import { useDatabaseStats, useSetting } from '@/lib/hooks/useDatabase';
import { dbHelpers } from '@/lib/db';
import { updateCurrencyCache, updateDateFormatCache } from '@/lib/utils/currency';
import { updateApiKeyCache } from '@/lib/services/gemini';
import { CategoryManager } from '@/components/settings/CategoryManager';
import { useAlert } from '@/components/context/AlertProvider';
import { AlertModal } from '@/components/ui/AlertModal';
import appIcon from '../../../assets/icon.png';

interface SettingsProps {
  onClearData: () => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
];

const DATE_FORMATS = [
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '11/20/2025' },
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '20/11/2025' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-11-20' },
  { id: 'DD.MM.YYYY', label: 'DD.MM.YYYY', example: '20.11.2025' },
  { id: 'MMM DD, YYYY', label: 'MMM DD, YYYY', example: 'Nov 20, 2025' },
];

export const Settings: React.FC<SettingsProps> = ({ onClearData }) => {
  // Use database hooks
  const { transactionCount, storageSize } = useDatabaseStats();
  const { value: selectedCurrency, updateSetting: updateCurrency } = useSetting('xpense-currency', 'USD');
  const { value: selectedDateFormat, updateSetting: updateDateFormat } = useSetting('xpense-date-format', 'MM/DD/YYYY');
  const { value: apiKey, updateSetting: updateApiKey } = useSetting<string>('xpense-api-key', '');
  
  const showAlert = useAlert();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showDateFormatPicker, setShowDateFormatPicker] = useState(false);
  const [isClosingCurrency, setIsClosingCurrency] = useState(false);
  const [isClosingDateFormat, setIsClosingDateFormat] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [isClosingHelpSupport, setIsClosingHelpSupport] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [isClosingPrivacyPolicy, setIsClosingPrivacyPolicy] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const hasApiKey = !!apiKey;
  
  // Animation locks to prevent rapid clicking issues
  const currencyAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const dateFormatAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const helpSupportAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const privacyPolicyAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimatingCurrency, setIsAnimatingCurrency] = useState(false);
  const [isAnimatingDateFormat, setIsAnimatingDateFormat] = useState(false);
  const [isAnimatingHelpSupport, setIsAnimatingHelpSupport] = useState(false);
  const [isAnimatingPrivacyPolicy, setIsAnimatingPrivacyPolicy] = useState(false);

  useEffect(() => {
    // Load API key into input when modal opens
    if (showApiKeyModal && apiKey) {
      setApiKeyInput(apiKey);
    }
  }, [showApiKeyModal, apiKey]);

  useEffect(() => {
    // Cleanup all animation timeouts on unmount
    return () => {
      if (currencyAnimationRef.current) clearTimeout(currencyAnimationRef.current);
      if (dateFormatAnimationRef.current) clearTimeout(dateFormatAnimationRef.current);
      if (helpSupportAnimationRef.current) clearTimeout(helpSupportAnimationRef.current);
      if (privacyPolicyAnimationRef.current) clearTimeout(privacyPolicyAnimationRef.current);
    };
  }, []);

  const handleExportData = async () => {
    try {
      const csvContent = await dbHelpers.exportToCSV();
      const { downloadCSV } = await import('@/lib/utils/csv');
      const filename = `xpense-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      showAlert({
        title: 'Export Failed',
        message: 'Failed to export data. Please try again.'
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const csvContent = event.target?.result as string;
            const result = await dbHelpers.importFromCSV(csvContent);
            
            let message = `Imported ${result.imported} transactions`;
            
            if (result.newCategories.length > 0) {
              message += `\n\nCreated ${result.newCategories.length} new categories: ${result.newCategories.join(', ')}`;
            }
            
            if (result.errors > 0) {
              message += `\n\nSkipped ${result.errors} rows with errors`;
            }
            
            showAlert({
              title: 'Import Complete',
              message
            });
          } catch (error) {
            console.error('Import failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            showAlert({
              title: 'Import Failed',
              message: errorMessage
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearDataClick = () => {
    setShowClearConfirm(true);
  };

  const confirmClearData = () => {
    onClearData();
    setShowClearConfirm(false);
  };

  const handleCloseCurrencyPicker = () => {
    if (isAnimatingCurrency) return;
    
    if (currencyAnimationRef.current) {
      clearTimeout(currencyAnimationRef.current);
    }
    
    setIsAnimatingCurrency(true);
    setIsClosingCurrency(true);
    
    currencyAnimationRef.current = setTimeout(() => {
      setShowCurrencyPicker(false);
      setIsClosingCurrency(false);
      setIsAnimatingCurrency(false);
    }, 250);
  };

  const handleCloseDateFormatPicker = () => {
    if (isAnimatingDateFormat) return;
    
    if (dateFormatAnimationRef.current) {
      clearTimeout(dateFormatAnimationRef.current);
    }
    
    setIsAnimatingDateFormat(true);
    setIsClosingDateFormat(true);
    
    dateFormatAnimationRef.current = setTimeout(() => {
      setShowDateFormatPicker(false);
      setIsClosingDateFormat(false);
      setIsAnimatingDateFormat(false);
    }, 250);
  };

  const handleCurrencySelect = async (code: string) => {
    await updateCurrency(code);
    updateCurrencyCache(code);
    handleCloseCurrencyPicker();
  };

  const handleDateFormatSelect = async (format: string) => {
    await updateDateFormat(format);
    updateDateFormatCache(format);
    handleCloseDateFormatPicker();
  };

  const getCurrencyDisplay = () => {
    const currency = CURRENCIES.find(c => c.code === (selectedCurrency || 'USD'));
    return currency ? `${currency.code}` : 'USD';
  };

  const getDateFormatDisplay = () => {
    const format = DATE_FORMATS.find(f => f.id === (selectedDateFormat || 'MM/DD/YYYY'));
    return format ? format.label : 'MM/DD/YYYY';
  };

  const handleCloseHelpSupport = () => {
    if (isAnimatingHelpSupport) return;
    
    if (helpSupportAnimationRef.current) {
      clearTimeout(helpSupportAnimationRef.current);
    }
    
    setIsAnimatingHelpSupport(true);
    setIsClosingHelpSupport(true);
    
    helpSupportAnimationRef.current = setTimeout(() => {
      setShowHelpSupport(false);
      setIsClosingHelpSupport(false);
      setIsAnimatingHelpSupport(false);
    }, 250);
  };

  const handleClosePrivacyPolicy = () => {
    if (isAnimatingPrivacyPolicy) return;
    
    if (privacyPolicyAnimationRef.current) {
      clearTimeout(privacyPolicyAnimationRef.current);
    }
    
    setIsAnimatingPrivacyPolicy(true);
    setIsClosingPrivacyPolicy(true);
    
    privacyPolicyAnimationRef.current = setTimeout(() => {
      setShowPrivacyPolicy(false);
      setIsClosingPrivacyPolicy(false);
      setIsAnimatingPrivacyPolicy(false);
    }, 250);
  };

  const handleOpenApiKeyModal = () => {
    setApiKeyInput(apiKey || '');
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = async () => {
    if (apiKeyInput.trim()) {
      await updateApiKey(apiKeyInput.trim());
      updateApiKeyCache(apiKeyInput.trim());
      setShowApiKeyModal(false);
      setApiKeyInput('');
    }
  };

  const handleRemoveApiKey = async () => {
    await dbHelpers.deleteSetting('xpense-api-key');
    updateApiKeyCache('');
    setApiKeyInput('');
    setShowApiKeyModal(false);
  };

  return (
    <>
      <div className="space-y-4 pb-6 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
        {/* App Info Card */}
        <div className="pt-0">
          <div className="bg-[#1C1C1E] md:bg-white rounded-[10px] overflow-hidden gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={appIcon} 
                  alt="xpense logo" 
                  className="w-[60px] h-[60px] rounded-[14px] flex-shrink-0 shadow-lg gpu-accelerated" 
                  style={{ transform: 'translateZ(0)' }}
                />
                <div className="flex-1">
                  <div className="text-[22px] font-bold text-white md:text-[#000000] tracking-[-0.41px]">xpense</div>
                  <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Personal expense tracker</div>
                </div>
              </div>
              <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">
                A personal expense tracker designed to help you manage your finances with ease. We do not store or share your data—everything is kept locally on your device. Only AI features you use will share necessary data with Gemini for processing.
              </p>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div>
          <div className="px-4 pb-2">
            <p className="text-[13px] font-semibold text-[#8E8E93] tracking-[-0.08px] uppercase">Storage</p>
          </div>
          <div className="bg-[#1C1C1E] md:bg-white rounded-[10px] overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-3" style={{ minHeight: '44px' }}>
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#34C759] flex items-center justify-center flex-shrink-0">
                <Database size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Data Size</div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">{transactionCount} transactions</div>
              </div>
              <span className="text-[17px] text-[#8E8E93] tracking-[-0.41px]">{storageSize}</span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <div className="px-4 pb-2">
            <p className="text-[13px] font-semibold text-[#8E8E93] tracking-[-0.08px] uppercase">Data Management</p>
          </div>
          <div className="bg-[#1C1C1E] md:bg-white rounded-[10px] overflow-hidden gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
            <button 
              onClick={handleExportData}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors relative gpu-accelerated"
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#007AFF] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Download size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Export to CSV</div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Download transactions as CSV</div>
              </div>
              {exportSuccess ? (
                <span className="text-[15px] text-[#34C759] font-semibold tracking-[-0.41px]">✓ Saved</span>
              ) : (
                <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
              )}
            </button>
            <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-[57px]"></div>

            <button 
              onClick={handleImportData}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated"
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#007AFF] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Upload size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Import from CSV</div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Upload CSV file to import</div>
              </div>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
            <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-[57px]"></div>

            <button 
              onClick={handleClearDataClick}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated"
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#FF3B30] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Trash2 size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[17px] text-[#FF3B30] tracking-[-0.41px]">Clear All Data</div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Delete all transactions</div>
              </div>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <div className="px-4 pb-2">
            <p className="text-[13px] font-semibold text-[#8E8E93] tracking-[-0.08px] uppercase">Preferences</p>
          </div>
          <div className="bg-[#1C1C1E] md:bg-white rounded-[10px] overflow-hidden gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
            <button 
              onClick={() => {
                if (isAnimatingCurrency) return;
                if (currencyAnimationRef.current) clearTimeout(currencyAnimationRef.current);
                setIsAnimatingCurrency(true);
                setShowCurrencyPicker(true);
                currencyAnimationRef.current = setTimeout(() => setIsAnimatingCurrency(false), 250);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" 
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#34C759] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <DollarSign size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="flex-1 text-left text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Currency</span>
              <span className="text-[17px] text-[#8E8E93] tracking-[-0.41px]">{getCurrencyDisplay()}</span>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
            <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-[57px]"></div>

            <button 
              onClick={() => {
                if (isAnimatingDateFormat) return;
                if (dateFormatAnimationRef.current) clearTimeout(dateFormatAnimationRef.current);
                setIsAnimatingDateFormat(true);
                setShowDateFormatPicker(true);
                dateFormatAnimationRef.current = setTimeout(() => setIsAnimatingDateFormat(false), 250);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" 
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#FF9500] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Calendar size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="flex-1 text-left text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Date Format</span>
              <span className="text-[17px] text-[#8E8E93] tracking-[-0.41px]">{getDateFormatDisplay()}</span>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
            <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-[57px]"></div>

            <button 
              onClick={handleOpenApiKeyModal}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" 
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#5856D6] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Key size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="flex-1 text-left text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Gemini API Key</span>
              <span className="text-[17px] text-[#8E8E93] tracking-[-0.41px]">{hasApiKey ? '••••••' : 'Not Set'}</span>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="px-4 pb-2">
            <p className="text-[13px] font-semibold text-[#8E8E93] tracking-[-0.08px] uppercase">Categories</p>
          </div>
          <CategoryManager />
        </div>

        {/* About */}
        <div>
          <div className="px-4 pb-2">
            <p className="text-[13px] font-semibold text-[#8E8E93] tracking-[-0.08px] uppercase">About</p>
          </div>
          <div className="bg-[#1C1C1E] md:bg-white rounded-[10px] overflow-hidden gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
            <button className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}>
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#5856D6] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Info size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="flex-1 text-left text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Version</span>
              <span className="text-[17px] text-[#8E8E93] tracking-[-0.41px]">1.0.0</span>
            </button>
            <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-[57px]"></div>

            <button 
              onClick={() => {
                if (isAnimatingHelpSupport) return;
                if (helpSupportAnimationRef.current) clearTimeout(helpSupportAnimationRef.current);
                setIsAnimatingHelpSupport(true);
                setShowHelpSupport(true);
                helpSupportAnimationRef.current = setTimeout(() => setIsAnimatingHelpSupport(false), 250);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" 
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#FF2D55] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <HelpCircle size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="flex-1 text-left text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Help & Support</span>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
            <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-[57px]"></div>

            <button 
              onClick={() => {
                if (isAnimatingPrivacyPolicy) return;
                if (privacyPolicyAnimationRef.current) clearTimeout(privacyPolicyAnimationRef.current);
                setIsAnimatingPrivacyPolicy(true);
                setShowPrivacyPolicy(true);
                privacyPolicyAnimationRef.current = setTimeout(() => setIsAnimatingPrivacyPolicy(false), 250);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" 
              style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}
            >
              <div className="w-[29px] h-[29px] rounded-[7px] bg-[#8E8E93] flex items-center justify-center flex-shrink-0 gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                <Shield size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="flex-1 text-left text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Privacy Policy</span>
              <ChevronRight size={20} strokeWidth={2} className="text-[#C7C7CC] md:text-[#C7C7CC]" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px] text-center">
            Made with ❤️ by <a href="https://github.com/iambhvsh" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] hover:underline">Bhavesh Patil</a>
          </p>
        </div>
      </div>

      <AlertModal
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Data?"
        message={`This will permanently delete all ${transactionCount} transactions. This action cannot be undone.`}
        actions={[
          {
            label: 'Clear Data',
            variant: 'danger',
            onPress: confirmClearData
          },
          {
            label: 'Cancel',
            onPress: () => setShowClearConfirm(false)
          }
        ]}
      />

      {/* Currency Picker Modal */}
      {showCurrencyPicker && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center gpu-accelerated">
          <div className={`absolute inset-0 bg-black/50 gpu-accelerated ${isClosingCurrency ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseCurrencyPicker} style={{ animationDuration: '0.25s', transform: 'translate3d(0, 0, 0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[400px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[70vh] flex flex-col gpu-accelerated ${isClosingCurrency ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.25s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}>
            <div className="flex-none flex items-center justify-between px-4 h-14 border-b border-white/5 md:border-[#C6C6C8] md:bg-white" style={{ background: 'rgba(28, 28, 30, 0.7)', transform: 'translateZ(0)' }}>
              <h3 className="text-[20px] font-bold text-white md:text-[#000000] tracking-tight">Select Currency</h3>
              <button onClick={handleCloseCurrencyPicker} className="text-[#007AFF] text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]">Done</button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain gpu-accelerated pb-20 md:pb-0 md:bg-white" style={{ background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)', transform: 'translateZ(0)' }}>
              {CURRENCIES.map((currency, index) => (
                <React.Fragment key={currency.code}>
                  <button onClick={() => handleCurrencySelect(currency.code)} className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}>
                    <div className="flex-1 text-left">
                      <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px] font-medium">{currency.code}</div>
                      <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">{currency.symbol} · {currency.name}</div>
                    </div>
                    {selectedCurrency === currency.code && <div className="text-[#007AFF] text-[20px] font-bold">✓</div>}
                  </button>
                  {index < CURRENCIES.length - 1 && <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-4"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Format Picker Modal */}
      {showDateFormatPicker && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center gpu-accelerated">
          <div className={`absolute inset-0 bg-black/50 gpu-accelerated ${isClosingDateFormat ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseDateFormatPicker} style={{ animationDuration: '0.25s', transform: 'translate3d(0, 0, 0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[400px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[70vh] flex flex-col gpu-accelerated ${isClosingDateFormat ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.25s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}>
            <div className="flex-none flex items-center justify-between px-4 h-14 border-b border-white/5 md:border-[#C6C6C8] md:bg-white" style={{ background: 'rgba(28, 28, 30, 0.7)', transform: 'translateZ(0)' }}>
              <h3 className="text-[20px] font-bold text-white md:text-[#000000] tracking-tight">Date Format</h3>
              <button onClick={handleCloseDateFormatPicker} className="text-[#007AFF] text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]">Done</button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain gpu-accelerated pb-20 md:pb-0 md:bg-white" style={{ background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)', transform: 'translateZ(0)' }}>
              {DATE_FORMATS.map((format, index) => (
                <React.Fragment key={format.id}>
                  <button onClick={() => handleDateFormatSelect(format.id)} className="w-full px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors gpu-accelerated" style={{ minHeight: '44px', transform: 'translateZ(0)', willChange: 'background-color' }}>
                    <div className="flex-1 text-left">
                      <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px] font-medium">{format.label}</div>
                      <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Example: {format.example}</div>
                    </div>
                    {selectedDateFormat === format.id && <div className="text-[#007AFF] text-[20px] font-bold">✓</div>}
                  </button>
                  {index < DATE_FORMATS.length - 1 && <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8] ml-4"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpSupport && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center gpu-accelerated">
          <div className={`absolute inset-0 bg-black/50 gpu-accelerated ${isClosingHelpSupport ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseHelpSupport} style={{ animationDuration: '0.25s', transform: 'translate3d(0, 0, 0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[500px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[80vh] flex flex-col gpu-accelerated ${isClosingHelpSupport ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.25s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}>
            <div className="flex-none flex items-center justify-between px-4 h-14 border-b border-white/5 md:border-[#C6C6C8] md:bg-white" style={{ background: 'rgba(28, 28, 30, 0.7)', transform: 'translateZ(0)' }}>
              <h3 className="text-[20px] font-bold text-white md:text-[#000000] tracking-tight">Help & Support</h3>
              <button onClick={handleCloseHelpSupport} className="text-[#007AFF] text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]">Done</button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain gpu-accelerated px-4 py-6 pb-24 md:pb-6 md:bg-white" style={{ background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)', transform: 'translateZ(0)' }}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[17px] font-semibold text-white md:text-[#000000] tracking-[-0.41px] mb-3">Developer</h4>
                  <div className="bg-[#2C2C2E] md:bg-[#F5F5F7] rounded-[10px] p-4">
                    <p className="text-[15px] text-white md:text-[#000000] tracking-[-0.24px] mb-2"><span className="font-semibold">Bhavesh Patil</span></p>
                    <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">@iambhvsh</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[17px] font-semibold text-white md:text-[#000000] tracking-[-0.41px] mb-3">Contact</h4>
                  <a href="mailto:iambhvshh@outlook.com" className="block bg-[#2C2C2E] md:bg-[#F5F5F7] rounded-[10px] p-4 active:bg-[#3C3C3E] md:active:bg-[#E5E5EA] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-[32px] h-[32px] rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0"><span className="text-white text-[14px]">✉️</span></div>
                      <div className="flex-1">
                        <p className="text-[15px] text-white md:text-[#000000] tracking-[-0.24px] font-medium">Email</p>
                        <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">iambhvshh@outlook.com</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center gpu-accelerated">
          <div className={`absolute inset-0 bg-black/50 gpu-accelerated ${isClosingPrivacyPolicy ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClosePrivacyPolicy} style={{ animationDuration: '0.25s', transform: 'translate3d(0, 0, 0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[500px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[80vh] flex flex-col gpu-accelerated ${isClosingPrivacyPolicy ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.25s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}>
            <div className="flex-none flex items-center justify-between px-4 h-14 border-b border-white/5 md:border-[#C6C6C8] md:bg-white" style={{ background: 'rgba(28, 28, 30, 0.7)', transform: 'translateZ(0)' }}>
              <h3 className="text-[20px] font-bold text-white md:text-[#000000] tracking-tight">Privacy Policy</h3>
              <button onClick={handleClosePrivacyPolicy} className="text-[#007AFF] text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]">Done</button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain gpu-accelerated px-4 py-6 pb-24 md:pb-6 md:bg-white" style={{ background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)', transform: 'translateZ(0)' }}>
              <div className="bg-[#2C2C2E] md:bg-[#F5F5F7] rounded-[10px] p-4 space-y-4">
                <div>
                  <h4 className="text-[15px] font-semibold text-white md:text-[#000000] tracking-[-0.24px] mb-2">Information</h4>
                  <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">xpense does not store or share your data. All information you enter is stored locally on your device and never transmitted to our servers.</p>
                </div>
                <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8]"></div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white md:text-[#000000] tracking-[-0.24px] mb-2">Local Storage Only</h4>
                  <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px] mb-2">Your data is stored using your browser's local storage:</p>
                  <ul className="space-y-1.5 text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>Data never leaves your device</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>No servers or cloud storage</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>You have complete control of your data</span></li>
                  </ul>
                </div>
                <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8]"></div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white md:text-[#000000] tracking-[-0.24px] mb-2">AI Features</h4>
                  <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px] mb-2">When you use AI-powered features (receipt scanning, financial insights, auto-categorization), only the data required for that specific feature is shared with Google's Gemini AI:</p>
                  <ul className="space-y-1.5 text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>Receipt images for scanning</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>Transaction data for insights</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>Transaction descriptions for categorization</span></li>
                  </ul>
                  <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px] mt-2">This data is processed by Gemini and subject to Google's privacy policy. We do not store or access this data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 gpu-accelerated">
          <div className="absolute inset-0 bg-black/60 animate-fade-in backdrop-blur-sm gpu-accelerated" onClick={() => setShowApiKeyModal(false)} style={{ animationDuration: '0.3s', transform: 'translateZ(0)', willChange: 'opacity' }} />
          <div className="relative bg-[#1C1C1E] md:bg-white rounded-[14px] w-full max-w-[340px] overflow-hidden animate-scale-in shadow-2xl gpu-accelerated" style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}>
            <div className="px-4 pt-5 pb-4">
              <h3 className="text-[17px] font-semibold text-white md:text-[#000000] tracking-[-0.41px] mb-2 text-center">Gemini API Key</h3>
              <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px] mb-4 text-center">Enter your Gemini API key to enable AI-powered financial insights</p>
              <input type="text" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} placeholder="Enter API key" className="w-full px-4 py-3 bg-[#2C2C2E] md:bg-[#F5F5F7] text-white md:text-[#000000] rounded-[10px] text-[15px] tracking-[-0.24px] border-none outline-none focus:ring-2 focus:ring-[#007AFF] mb-3" autoFocus />
              <p className="text-[11px] text-[#8E8E93] tracking-[-0.08px] leading-[16px] mb-4">Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] underline">Google AI Studio</a></p>
            </div>
            <div className="border-t border-[#38383A] md:border-[#C6C6C8]">
              <div className="grid grid-cols-2">
                {hasApiKey && <button onClick={handleRemoveApiKey} className="py-3 text-[17px] font-semibold text-[#FF3B30] tracking-[-0.41px] active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors border-r border-[#38383A] md:border-[#C6C6C8]">Remove</button>}
                <button onClick={() => setShowApiKeyModal(false)} className={`py-3 text-[17px] font-semibold text-[#8E8E93] tracking-[-0.41px] active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors ${hasApiKey ? 'border-r border-[#38383A] md:border-[#C6C6C8]' : ''}`}>Cancel</button>
                <button onClick={handleSaveApiKey} disabled={!apiKeyInput.trim()} className="py-3 text-[17px] font-semibold text-[#007AFF] tracking-[-0.41px] active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
