import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { generateInsights } from '@/lib/services/gemini';
import { Transaction } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { Spinner } from '@/shared/components/Spinner';

interface AiInsightsProps {
  transactions: Transaction[];
}

export const AiInsights: React.FC<AiInsightsProps> = React.memo(({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasTransactions = transactions.length > 0;

  const handleGenerate = async () => {
    if (!hasTransactions) return;
    
    setLoading(true);
    try {
      const result = await generateInsights(transactions);
      setAdvice(result);
    } finally {
      setLoading(false);
    }
  };

  const formattedContent = useMemo(() => {
    if (!advice) return '';
    
    try {
      // Configure marked with proper options
      const html = marked(advice, {
        breaks: true,
        gfm: true,
      });
      
      return html;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return advice;
    }
  }, [advice]);

  return (
    <div className="space-y-5 animate-scale-in origin-center">
      <div 
        className="relative overflow-hidden rounded-[28px] min-h-[480px] shadow-lg"
        style={{
          background: 'linear-gradient(to bottom left, #2D0F5C 0%, #4A1028 100%)'
        }}
      >
        
        <div className="relative z-10 p-7 flex flex-col h-full justify-between min-h-[480px]">
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[34px] font-bold text-white leading-[41px] tracking-[0.37px]">
                Financial<br />
                Health
              </h2>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-3 rounded-full shadow-sm">
               <Sparkles className="text-white w-6 h-6" fill="currentColor" strokeWidth={0} />
            </div>
          </div>

          <div className="mt-8 flex-1 flex flex-col justify-end">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-5 min-h-[260px]">
                <Spinner className="w-9 h-9 text-white" />
                <p className="text-white/95 font-semibold text-[17px] animate-pulse tracking-[-0.41px]">
                  Analyzing your spending...
                </p>
              </div>
            ) : advice ? (
              <div className="animate-fade-in">
                 <div 
                   className="ai-insights-content"
                   style={{
                     color: 'rgba(255, 255, 255, 0.95)',
                     fontSize: '17px',
                     lineHeight: '1.6',
                   }}
                   dangerouslySetInnerHTML={{ __html: formattedContent }} 
                 />
                 <button 
                   onClick={handleGenerate} 
                   className="mt-6 w-full py-4 text-[17px] font-semibold bg-white text-black rounded-[16px] active:opacity-90 transition-opacity tracking-[-0.41px] shadow-sm"
                 >
                   Update Analysis
                 </button>
              </div>
            ) : hasTransactions ? (
              <div className="flex flex-col justify-end pb-2">
                 <p className="text-white/95 text-[17px] font-medium mb-7 leading-relaxed tracking-[-0.41px]">
                   Get personalized insights and tips to improve your financial health based on your spending patterns.
                 </p>
                <button
                  onClick={handleGenerate}
                  className="bg-white text-black w-full py-4 rounded-[16px] font-bold text-[17px] active:opacity-90 transition-opacity flex items-center justify-center gap-2.5 tracking-[-0.41px] shadow-sm"
                >
                  <Sparkles size={22} className="text-purple-600" fill="currentColor" strokeWidth={0} />
                  <span>Analyze My Spending</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center min-h-[260px]">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-5">
                  <Sparkles className="text-white/60 w-10 h-10" strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-bold text-white tracking-tight mb-2">No Data to Analyze</h3>
                <p className="text-white/70 text-[15px] tracking-[-0.24px] max-w-[280px]">
                  Add some transactions to get personalized financial insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-[12px] text-center text-[#8E8E93] px-6 font-medium tracking-[0px] pb-4">
        Gemini AI suggestions are for informational purposes only.
      </p>
    </div>
  );
});
