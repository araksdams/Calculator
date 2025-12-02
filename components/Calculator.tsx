import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Delete, Sparkles, Loader2 } from 'lucide-react';
import { CALCULATOR_BUTTONS } from '../constants';
import { ButtonType, CalculatorHistoryItem } from '../types';
import { solveMathWithGemini } from '../services/geminiService';

interface CalculatorProps {
  onCalculationComplete: (item: CalculatorHistoryItem) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onCalculationComplete }) => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  
  // Ref to scroll input to end
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [input]);

  // Handle key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    if (loading) return;

    if (/[0-9]/.test(key)) appendToInput(key);
    if (['+', '-', '*', '/', '(', ')', '.'].includes(key)) appendToInput(key);
    if (key === 'Enter') handleCalculate();
    if (key === 'Backspace') handleBackspace();
    if (key === 'Escape') handleClear();
  }, [input, loading]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const appendToInput = (value: string) => {
    // If we just calculated, clear input if it's a number, or append if it's an operator
    if (result && !['+', '-', '*', '/', '%'].includes(value)) {
      // Starting fresh
      setInput(value);
      setResult('');
    } else if (result) {
        // Continuing with result
        setInput(result + value);
        setResult('');
    } else {
      setInput(prev => prev + value);
    }
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
    setResult('');
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setIsAiMode(false);
  };

  const safeEvaluate = (expression: string): string => {
    try {
      // Sanitize input: allow only numbers and math operators
      // We use a restricted character set for safety, though standard eval on a calculator is low risk if inputs are controlled.
      // However, for a "Senior Engineer" approach, we'd typically use a parser. 
      // For brevity in this constraint, we will replace '×' with '*' and '÷' with '/' then eval
      // BUT we also want to support natural language eventually.
      
      const sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      // Simple check to prevent code injection even if locally run
      if (/[^0-9+\-*/().\s]/.test(sanitized)) {
        throw new Error("Invalid characters");
      }

      // eslint-disable-next-line no-new-func
      const func = new Function(`return ${sanitized}`);
      const val = func();
      
      if (!isFinite(val) || isNaN(val)) return "Error";
      
      // Format number to avoid floating point ugliness
      return String(Math.round(val * 100000000) / 100000000);
    } catch (e) {
      return "Error";
    }
  };

  const handleCalculate = async (forceAi = false) => {
    if (!input) return;

    const isComplex = /[^0-9+\-*/().\s]/.test(input);
    
    if (forceAi || isComplex) {
      await performAiCalculation();
    } else {
      // Local Calc
      const res = safeEvaluate(input);
      if (res === "Error") {
         // Fallback to AI if local fails (maybe it was 5^2 which isn't in our simple sanitizer)
         await performAiCalculation();
      } else {
        setResult(res);
        onCalculationComplete({
            id: Date.now().toString(),
            expression: input,
            result: res,
            timestamp: Date.now(),
            isAi: false
        });
      }
    }
  };

  const performAiCalculation = async () => {
    setLoading(true);
    setIsAiMode(true);
    try {
      const aiResult = await solveMathWithGemini(input);
      setResult(aiResult);
      onCalculationComplete({
        id: Date.now().toString(),
        expression: input,
        result: aiResult,
        timestamp: Date.now(),
        isAi: true
      });
    } catch (e) {
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full h-[600px] md:h-auto backdrop-blur-xl bg-opacity-90">
      
      {/* Display Area */}
      <div className="flex-1 p-6 flex flex-col justify-end items-end gap-2 bg-gradient-to-b from-slate-800 to-slate-900/50">
        <div className="text-slate-400 text-sm h-6 flex items-center gap-2">
            {isAiMode && <span className="flex items-center gap-1 text-primary text-xs uppercase tracking-wider font-semibold"><Sparkles size={12} /> AI Mode</span>}
        </div>
        
        {/* Input */}
        <div className="w-full relative">
            <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-right text-3xl text-slate-300 font-light placeholder-slate-600 focus:outline-none font-mono"
            />
        </div>

        {/* Result */}
        <div className="text-5xl md:text-6xl font-medium text-white tracking-tight h-16 flex items-center justify-end font-mono">
            {loading ? (
                <Loader2 className="animate-spin text-primary" size={40} />
            ) : (
                <span className={result === 'Error' ? 'text-red-400' : 'text-white'}>
                    {result || (input ? '' : '0')}
                </span>
            )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="px-6 py-2 flex justify-between items-center bg-slate-800/80 border-t border-slate-700/50">
        <button 
            onClick={() => handleCalculate(true)}
            className="flex items-center gap-2 text-xs font-medium text-primary hover:text-white transition-colors px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20"
        >
            <Sparkles size={14} />
            Ask AI
        </button>
        <button 
            onClick={handleBackspace} 
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Backspace"
        >
            <Delete size={20} />
        </button>
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-4 gap-3 bg-slate-900">
        {CALCULATOR_BUTTONS.map((btn) => (
          <button
            key={btn.value}
            onClick={() => {
              if (btn.value === 'clear') handleClear();
              else if (btn.value === '=') handleCalculate();
              else if (btn.value === 'ai') handleCalculate(true);
              else appendToInput(btn.value);
            }}
            className={`
              ${btn.span ? `col-span-${btn.span}` : ''}
              ${btn.bgColor || 'bg-slate-800 hover:bg-slate-700'} 
              ${btn.color || 'text-white'}
              h-16 rounded-2xl text-xl font-medium transition-all duration-150 active:scale-95 flex items-center justify-center
              shadow-lg shadow-black/20
            `}
          >
            {btn.type === ButtonType.AI ? (
                <div className="flex items-center gap-2 text-base">
                    <Sparkles size={18} />
                    {btn.label}
                </div>
            ) : btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
