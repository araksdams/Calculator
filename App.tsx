import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { HistorySidebar } from './components/HistorySidebar';
import { CalculatorHistoryItem } from './types';
import { Calculator as CalcIcon, History as HistoryIcon } from 'lucide-react';

export default function App() {
  const [history, setHistory] = useState<CalculatorHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addToHistory = (item: CalculatorHistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row items-center justify-center relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="z-10 w-full max-w-md px-4 py-6 md:py-0 flex flex-col h-screen md:h-auto justify-center">
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <CalcIcon size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">QuikCalc <span className="text-primary font-normal text-sm align-top">AI</span></h1>
          </div>
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <HistoryIcon size={24} />
          </button>
        </header>

        <Calculator onCalculationComplete={addToHistory} />

        <div className="mt-8 text-center text-slate-500 text-xs">
          Powered by Google Gemini 2.5 Flash
        </div>
      </main>

      {/* Sidebar (Desktop: Fixed right, Mobile: Drawer) */}
      <HistorySidebar 
        history={history} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onClear={clearHistory}
      />
    </div>
  );
}