import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Sparkles, ArrowRight, Plus, PieChart, Lock, Zap, Shield } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const TOTAL_CARDS = 4;

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth;
    const newCard = Math.round(scrollLeft / cardWidth);
    
    setCurrentCard(newCard);
    
    // Show buttons when reaching last card
    if (newCard === TOTAL_CARDS - 1 && !showButtons) {
      requestAnimationFrame(() => {
        setShowButtons(true);
      });
    } else if (newCard < TOTAL_CARDS - 1 && showButtons) {
      setShowButtons(false);
    }
  };

  const handleGetStarted = () => {
    if (isClosing) return;

    requestAnimationFrame(() => {
      if (apiKey.trim()) {
        localStorage.setItem('xpense-api-key', apiKey.trim());
      }
      
      localStorage.setItem('xpense-onboarding-complete', 'true');
      
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, 300);
    });
  };

  const handleSkip = () => {
    if (isClosing) return;

    requestAnimationFrame(() => {
      localStorage.setItem('xpense-onboarding-complete', 'true');
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, 300);
    });
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col bg-black gpu-accelerated transition-opacity duration-500 ${
        isClosing ? 'animate-fade-out' : mounted ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      {/* Carousel Container */}
      <div 
        className={`flex-1 relative transition-all duration-700 ${
          isClosing ? 'opacity-0 scale-95' : mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          transitionDelay: mounted && !isClosing ? '0.1s' : '0s'
        }}
      >
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-x-auto overflow-y-hidden no-scrollbar smooth-scroll"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="h-full flex" style={{ width: `${TOTAL_CARDS * 100}%` }}>
            
            {/* Card 1: Welcome */}
            <div 
              className="h-full flex items-center justify-center px-6"
              style={{ 
                width: `${100 / TOTAL_CARDS}%`,
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always'
              }}
            >
              <div className="max-w-md text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-ios-blue to-ios-indigo rounded-[32px] blur-2xl opacity-40 animate-pulse" />
                  <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-ios-blue to-ios-indigo rounded-[32px] shadow-2xl flex items-center justify-center gpu-accelerated">
                    <Wallet size={56} strokeWidth={2.5} className="text-white" />
                  </div>
                </div>
                <h1 className="text-[48px] font-bold text-white tracking-tight mb-3 leading-tight">
                  xpense
                </h1>
                <h2 className="text-[24px] font-semibold text-white/90 tracking-tight mb-4">
                  Welcome
                </h2>
                <p className="text-[17px] text-[#8E8E93] tracking-[-0.41px] leading-relaxed max-w-sm mx-auto">
                  Your personal expense tracker that keeps all your financial data private and secure on your device.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-8">
                  <div className="flex items-center gap-2 bg-[#0A0A0A] px-4 py-2 rounded-full border border-[#1C1C1E]">
                    <Shield size={16} className="text-ios-blue" strokeWidth={2.5} />
                    <span className="text-[13px] font-semibold text-white tracking-tight">Private</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0A0A0A] px-4 py-2 rounded-full border border-[#1C1C1E]">
                    <Zap size={16} className="text-ios-orange" strokeWidth={2.5} />
                    <span className="text-[13px] font-semibold text-white tracking-tight">Fast</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0A0A0A] px-4 py-2 rounded-full border border-[#1C1C1E]">
                    <Lock size={16} className="text-ios-green" strokeWidth={2.5} />
                    <span className="text-[13px] font-semibold text-white tracking-tight">Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Track Expenses */}
            <div 
              className="h-full flex items-center justify-center px-6"
              style={{ 
                width: `${100 / TOTAL_CARDS}%`,
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always'
              }}
            >
              <div className="max-w-md text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-ios-green to-[#30D158] rounded-[28px] blur-2xl opacity-40" />
                  <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-ios-green to-[#30D158] rounded-[28px] shadow-2xl flex items-center justify-center gpu-accelerated">
                    <Plus size={48} strokeWidth={2.5} className="text-white" />
                  </div>
                </div>
                <h2 className="text-[36px] font-bold text-white tracking-tight mb-4 leading-tight">
                  Track Every<br />Transaction
                </h2>
                <p className="text-[17px] text-[#8E8E93] tracking-[-0.41px] leading-relaxed max-w-sm mx-auto mb-6">
                  Quickly add expenses and income with smart categorization and receipt scanning.
                </p>
                
                {/* Feature List */}
                <div className="space-y-3 max-w-xs mx-auto">
                  <div className="flex items-center gap-3 bg-[#0A0A0A] px-4 py-3 rounded-[16px] border border-[#1C1C1E]">
                    <div className="w-8 h-8 rounded-full bg-ios-green/20 flex items-center justify-center shrink-0">
                      <span className="text-ios-green text-[16px] font-bold">✓</span>
                    </div>
                    <span className="text-[15px] text-white/90 text-left">Quick transaction entry</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0A0A0A] px-4 py-3 rounded-[16px] border border-[#1C1C1E]">
                    <div className="w-8 h-8 rounded-full bg-ios-green/20 flex items-center justify-center shrink-0">
                      <span className="text-ios-green text-[16px] font-bold">✓</span>
                    </div>
                    <span className="text-[15px] text-white/90 text-left">AI receipt scanning</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0A0A0A] px-4 py-3 rounded-[16px] border border-[#1C1C1E]">
                    <div className="w-8 h-8 rounded-full bg-ios-green/20 flex items-center justify-center shrink-0">
                      <span className="text-ios-green text-[16px] font-bold">✓</span>
                    </div>
                    <span className="text-[15px] text-white/90 text-left">Smart categorization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Visualize Data */}
            <div 
              className="h-full flex items-center justify-center px-6"
              style={{ 
                width: `${100 / TOTAL_CARDS}%`,
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always'
              }}
            >
              <div className="max-w-md text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-ios-orange to-[#FF9F0A] rounded-[28px] blur-2xl opacity-40" />
                  <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-ios-orange to-[#FF9F0A] rounded-[28px] shadow-2xl flex items-center justify-center gpu-accelerated">
                    <PieChart size={48} strokeWidth={2.5} className="text-white" />
                  </div>
                </div>
                <h2 className="text-[36px] font-bold text-white tracking-tight mb-4 leading-tight">
                  Beautiful<br />Insights
                </h2>
                <p className="text-[17px] text-[#8E8E93] tracking-[-0.41px] leading-relaxed max-w-sm mx-auto mb-6">
                  Understand your spending patterns with interactive charts and detailed breakdowns.
                </p>
                
                {/* Mock Chart Preview */}
                <div className="bg-[#0A0A0A] rounded-[20px] p-6 max-w-xs mx-auto border border-[#1C1C1E]">
                  <div className="flex items-end justify-center gap-2 h-32 mb-3">
                    <div className="w-8 bg-gradient-to-t from-ios-blue to-ios-blue/60 rounded-t-lg" style={{ height: '60%' }} />
                    <div className="w-8 bg-gradient-to-t from-ios-green to-ios-green/60 rounded-t-lg" style={{ height: '85%' }} />
                    <div className="w-8 bg-gradient-to-t from-ios-orange to-ios-orange/60 rounded-t-lg" style={{ height: '45%' }} />
                    <div className="w-8 bg-gradient-to-t from-ios-red to-ios-red/60 rounded-t-lg" style={{ height: '70%' }} />
                    <div className="w-8 bg-gradient-to-t from-[#5856D6] to-[#5856D6]/60 rounded-t-lg" style={{ height: '55%' }} />
                  </div>
                  <p className="text-[13px] text-[#8E8E93] font-medium">Weekly spending overview</p>
                </div>
              </div>
            </div>

            {/* Card 4: AI Insights */}
            <div 
              className="h-full flex items-center justify-center px-6"
              style={{ 
                width: `${100 / TOTAL_CARDS}%`,
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always'
              }}
            >
              <div className="max-w-md">
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6] to-[#AF52DE] rounded-[28px] blur-2xl opacity-40 animate-pulse" />
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-[#5856D6] to-[#AF52DE] rounded-[28px] shadow-2xl flex items-center justify-center gpu-accelerated">
                      <Sparkles size={48} strokeWidth={2.5} className="text-white" fill="currentColor" />
                    </div>
                  </div>
                  <h2 className="text-[36px] font-bold text-white tracking-tight mb-4 leading-tight">
                    AI-Powered<br />Insights
                  </h2>
                  <p className="text-[17px] text-[#8E8E93] tracking-[-0.41px] leading-relaxed max-w-sm mx-auto mb-2">
                    Get personalized financial advice by Gemini AI.
                  </p>
                </div>

                <div 
                  className="bg-gradient-to-br from-[#0A0A0A] to-[#141414] rounded-[24px] p-6 border border-[#1C1C1E] gpu-accelerated"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5856D6] to-[#AF52DE] flex items-center justify-center shrink-0">
                      <Sparkles size={20} strokeWidth={2.5} className="text-white" fill="currentColor" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-white tracking-tight">Gemini API Key</h3>
                      <p className="text-[12px] text-[#8E8E93] tracking-[-0.08px]">Enable AI features</p>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your API key here"
                    className="w-full bg-[#141414] text-white text-[15px] px-4 py-4 rounded-[16px] placeholder-[#48484A] tracking-[-0.24px] outline-none border border-[#1C1C1E] transition-all focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#5856D6]/30 gpu-accelerated mb-3"
                    style={{ 
                      WebkitAppearance: 'none',
                      transform: 'translateZ(0)'
                    }}
                  />
                  
                  <div className="flex items-start gap-2 bg-[#0A0A0A] rounded-[12px] p-3 border border-[#1C1C1E]">
                    <Lock size={14} className="text-[#8E8E93] mt-0.5 shrink-0" strokeWidth={2.5} />
                    <p className="text-[12px] text-[#8E8E93] tracking-[-0.08px] leading-relaxed">
                      Your API key is stored locally on your device and never shared. You can change it anytime in Settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div 
        className={`flex-none flex justify-center gap-2 py-4 transition-all duration-500 ${
          isClosing ? 'opacity-0 translate-y-4' : mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          transitionDelay: mounted && !isClosing ? '0.3s' : '0s'
        }}
      >
        {Array.from({ length: TOTAL_CARDS }).map((_, index) => (
          <div
            key={index}
            className="transition-all duration-300"
            style={{
              width: currentCard === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: currentCard === index ? '#007AFF' : '#3A3A3C',
              transform: 'translateZ(0)'
            }}
          />
        ))}
      </div>

      {/* Action Buttons - Only show on last card */}
      <div 
        className={`flex-none px-6 pb-safe transition-all duration-500 ease-out ${
          showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        style={{ 
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
          transitionDelay: showButtons ? '0.15s' : '0s'
        }}
      >
        <div className="space-y-3 max-w-sm mx-auto">
          <button
            onClick={handleGetStarted}
            disabled={isClosing}
            className="w-full bg-ios-blue active:bg-[#0051D5] text-white py-3.5 rounded-[14px] font-semibold text-[17px] tracking-[-0.41px] transition-colors shadow-lg flex items-center justify-center gap-2 gpu-accelerated disabled:opacity-50"
            style={{ transform: 'translateZ(0)' }}
          >
            <span>Get Started</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
          
          <button
            onClick={handleSkip}
            disabled={isClosing}
            className="w-full bg-transparent text-[#8E8E93] py-3.5 rounded-[14px] font-semibold text-[17px] tracking-[-0.41px] active:opacity-60 transition-opacity disabled:opacity-50"
            style={{ transform: 'translateZ(0)' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};
