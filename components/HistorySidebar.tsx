import React from 'react';
import { CalculatorHistoryItem } from '../types';
import { X, Trash2, Sparkles, Clock } from 'lucide-react';

interface HistorySidebarProps {
  history: CalculatorHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, isOpen, onClose, onClear }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 right-0 z-30 w-80 bg-surface border-l border-slate-700 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:static md:h-[600px] md:rounded-3xl md:ml-6 md:w-72 md:block
        ${!isOpen && 'md:hidden'} 
        /* The above logic handles: 
           - Mobile: Slide in/out based on isOpen.
           - Desktop: Always visible if we want, OR handled by parent state. 
           For this specific design, let's make it toggle-able on desktop too, 
           or just responsive. Let's strictly follow the prop isOpen for simplicity across devices 
           or assume desktop has it always next to it? 
           Let's adhere to the 'isOpen' prop for visibility to keep it clean.
        */
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              History
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClear} 
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-700/50"
                title="Clear History"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={onClose} 
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2 opacity-50">
                <Clock size={40} strokeWidth={1.5} />
                <p>No recent calculations</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-700 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-slate-500 font-mono truncate max-w-[180px]" title={item.expression}>
                      {item.expression}
                    </span>
                    {item.isAi && <Sparkles size={10} className="text-primary mt-1" />}
                  </div>
                  <div className="text-right text-lg font-medium text-white break-all font-mono">
                    {item.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
