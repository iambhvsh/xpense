import React, { useState, useEffect } from 'react';
import { ChevronRight, Trash2, Download, Upload, Wallet, Database, Info, DollarSign, Calendar, Shield, HelpCircle, Key } from 'lucide-react';

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
  const [storageSize, setStorageSize] = useState<string>('0 KB');
  const [transactionCount, setTransactionCount] = useState<number>(0);
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
  const [hasApiKey, setHasApiKey] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('xpense-currency') || 'USD';
  });
  const [selectedDateFormat, setSelectedDateFormat] = useState(() => {
    return localStorage.getItem('xpense-date-format') || 'MM/DD/YYYY';
  });

  useEffect(() => {
    const data = localStorage.getItem('xpense-expenses');
    if (data) {
      const bytes = new Blob([data]).size;
      const kb = (bytes / 1024).toFixed(2);
      setStorageSize(`${kb} KB`);
      
      try {
        const transactions = JSON.parse(data);
        setTransactionCount(transactions.length);
      } catch {
        setTransactionCount(0);
      }
    }

    const apiKey = localStorage.getItem('xpense-api-key');
    setHasApiKey(!!apiKey);
  }, []);

  const handleExportData = () => {
    const data = localStorage.getItem('xpense-expenses');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `xpense-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            JSON.parse(data);
            localStorage.setItem('xpense-expenses', data);
            window.location.reload();
          } catch (error) {
            alert('Invalid backup file. Please select a valid xpense backup.');
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
    setIsClosingCurrency(true);
    setTimeout(() => {
      setShowCurrencyPicker(false);
      setIsClosingCurrency(false);
    }, 300);
  };

  const handleCloseDateFormatPicker = () => {
    setIsClosingDateFormat(true);
    setTimeout(() => {
      setShowDateFormatPicker(false);
      setIsClosingDateFormat(false);
    }, 300);
  };

  const handleCurrencySelect = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem('xpense-currency', code);
    handleCloseCurrencyPicker();
  };

  const handleDateFormatSelect = (format: string) => {
    setSelectedDateFormat(format);
    localStorage.setItem('xpense-date-format', format);
    handleCloseDateFormatPicker();
  };

  const getCurrencyDisplay = () => {
    const currency = CURRENCIES.find(c => c.code === selectedCurrency);
    return currency ? `${currency.code}` : 'USD';
  };

  const getDateFormatDisplay = () => {
    const format = DATE_FORMATS.find(f => f.id === selectedDateFormat);
    return format ? format.label : 'MM/DD/YYYY';
  };

  const handleCloseHelpSupport = () => {
    setIsClosingHelpSupport(true);
    setTimeout(() => {
      setShowHelpSupport(false);
      setIsClosingHelpSupport(false);
    }, 300);
  };

  const handleClosePrivacyPolicy = () => {
    setIsClosingPrivacyPolicy(true);
    setTimeout(() => {
      setShowPrivacyPolicy(false);
      setIsClosingPrivacyPolicy(false);
    }, 300);
  };

  const handleOpenApiKeyModal = () => {
    const existingKey = localStorage.getItem('xpense-api-key');
    setApiKeyInput(existingKey || '');
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('xpense-api-key', apiKeyInput.trim());
      setHasApiKey(true);
      setShowApiKeyModal(false);
      setApiKeyInput('');
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('xpense-api-key');
    setHasApiKey(false);
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
                <div className="w-[60px] h-[60px] rounded-[14px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center flex-shrink-0 shadow-lg gpu-accelerated" style={{ transform: 'translateZ(0)' }}>
                  <Wallet className="text-white" size={32} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[22px] font-bold text-white md:text-[#000000] tracking-[-0.41px]">xpense</div>
                  <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Personal expense tracker</div>
                </div>
              </div>
              <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">
                A personal expense tracker designed to help you manage your finances with ease. All your data is stored locally on your device for maximum privacy and security.
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
                <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Export Backup</div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Save your data as JSON</div>
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
                <div className="text-[17px] text-white md:text-[#000000] tracking-[-0.41px]">Import Backup</div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">Restore from JSON file</div>
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
              onClick={() => setShowCurrencyPicker(true)}
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
              onClick={() => setShowDateFormatPicker(true)}
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
              onClick={() => setShowHelpSupport(true)}
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
              onClick={() => setShowPrivacyPolicy(true)}
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
            Made with ❤️ for expense tracking
          </p>
          <p className="text-[11px] text-[#8E8E93]/60 tracking-[-0.08px] leading-[18px] text-center mt-1">
            All data is stored locally on your device
          </p>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 gpu-accelerated">
          <div 
            className="absolute inset-0 bg-black/60 animate-fade-in backdrop-blur-sm gpu-accelerated"
            onClick={() => setShowClearConfirm(false)}
            style={{ animationDuration: '0.3s', transform: 'translateZ(0)', willChange: 'opacity' }}
          />
          <div className="relative bg-[#1C1C1E] md:bg-white rounded-[14px] w-full max-w-[270px] overflow-hidden animate-scale-in shadow-2xl gpu-accelerated" style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}>
            <div className="px-4 pt-5 pb-4 text-center">
              <h3 className="text-[17px] font-semibold text-white md:text-[#000000] tracking-[-0.41px] mb-2">Clear All Data?</h3>
              <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">
                This will permanently delete all {transactionCount} transactions. This action cannot be undone.
              </p>
            </div>
            <div className="border-t border-[#38383A] md:border-[#C6C6C8]">
              <button onClick={confirmClearData} className="w-full py-3 text-[17px] font-semibold text-[#FF3B30] tracking-[-0.41px] active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors">
                Clear Data
              </button>
            </div>
            <div className="border-t border-[#38383A] md:border-[#C6C6C8]">
              <button onClick={() => setShowClearConfirm(false)} className="w-full py-3 text-[17px] font-semibold text-[#007AFF] tracking-[-0.41px] active:bg-[#2C2C2E] md:active:bg-[#E5E5EA] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Picker Modal */}
      {showCurrencyPicker && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center gpu-accelerated">
          <div className={`absolute inset-0 bg-black/40 gpu-accelerated ${isClosingCurrency ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseCurrencyPicker} style={{ animationDuration: '0.3s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', transform: 'translateZ(0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[400px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[70vh] flex flex-col gpu-accelerated ${isClosingCurrency ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.3s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translateZ(0)', willChange: 'transform, opacity' }}>
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
          <div className={`absolute inset-0 bg-black/40 gpu-accelerated ${isClosingDateFormat ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseDateFormatPicker} style={{ animationDuration: '0.3s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', transform: 'translateZ(0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[400px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[70vh] flex flex-col gpu-accelerated ${isClosingDateFormat ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.3s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translateZ(0)', willChange: 'transform, opacity' }}>
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
          <div className={`absolute inset-0 bg-black/40 gpu-accelerated ${isClosingHelpSupport ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseHelpSupport} style={{ animationDuration: '0.3s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', transform: 'translateZ(0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[500px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[80vh] flex flex-col gpu-accelerated ${isClosingHelpSupport ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.3s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translateZ(0)', willChange: 'transform, opacity' }}>
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
          <div className={`absolute inset-0 bg-black/40 gpu-accelerated ${isClosingPrivacyPolicy ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClosePrivacyPolicy} style={{ animationDuration: '0.3s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', transform: 'translateZ(0)', willChange: 'opacity' }} />
          <div className={`relative w-full md:w-full md:max-w-[500px] rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl max-h-[80vh] flex flex-col gpu-accelerated ${isClosingPrivacyPolicy ? 'animate-slide-down md:animate-scale-out' : 'animate-slide-up md:animate-scale-in'}`} style={{ backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', animationDuration: '0.3s', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)', transform: 'translateZ(0)', willChange: 'transform, opacity' }}>
            <div className="flex-none flex items-center justify-between px-4 h-14 border-b border-white/5 md:border-[#C6C6C8] md:bg-white" style={{ background: 'rgba(28, 28, 30, 0.7)', transform: 'translateZ(0)' }}>
              <h3 className="text-[20px] font-bold text-white md:text-[#000000] tracking-tight">Privacy Policy</h3>
              <button onClick={handleClosePrivacyPolicy} className="text-[#007AFF] text-[17px] font-semibold active:opacity-60 transition-opacity tracking-[-0.41px]">Done</button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain gpu-accelerated px-4 py-6 pb-24 md:pb-6 md:bg-white" style={{ background: 'linear-gradient(to bottom, rgba(28, 28, 30, 0.7) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 1) 80%)', transform: 'translateZ(0)' }}>
              <div className="bg-[#2C2C2E] md:bg-[#F5F5F7] rounded-[10px] p-4 space-y-4">
                <div>
                  <h4 className="text-[15px] font-semibold text-white md:text-[#000000] tracking-[-0.24px] mb-2">Your Privacy Matters</h4>
                  <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">xpense does not collect, transmit, or share any of your personal data. All information you enter is stored locally on your device.</p>
                </div>
                <div className="h-[0.5px] bg-[#38383A] md:bg-[#C6C6C8]"></div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white md:text-[#000000] tracking-[-0.24px] mb-2">Local Storage Only</h4>
                  <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px] mb-2">Your data is stored using your browser's local storage:</p>
                  <ul className="space-y-1.5 text-[13px] text-[#8E8E93] tracking-[-0.08px] leading-[18px]">
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>Data never leaves your device</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>No servers or cloud storage</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">•</span><span>You have complete control</span></li>
                  </ul>
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
