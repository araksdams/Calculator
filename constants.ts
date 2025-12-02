import { ButtonConfig, ButtonType } from './types';

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const CALCULATOR_BUTTONS: ButtonConfig[] = [
  { label: 'C', value: 'clear', type: ButtonType.Action, color: 'text-red-400' },
  { label: '(', value: '(', type: ButtonType.Scientific, color: 'text-primary' },
  { label: ')', value: ')', type: ButtonType.Scientific, color: 'text-primary' },
  { label: '÷', value: '/', type: ButtonType.Operator, color: 'text-primary' },
  
  { label: '7', value: '7', type: ButtonType.Number },
  { label: '8', value: '8', type: ButtonType.Number },
  { label: '9', value: '9', type: ButtonType.Number },
  { label: '×', value: '*', type: ButtonType.Operator, color: 'text-primary' },
  
  { label: '4', value: '4', type: ButtonType.Number },
  { label: '5', value: '5', type: ButtonType.Number },
  { label: '6', value: '6', type: ButtonType.Number },
  { label: '-', value: '-', type: ButtonType.Operator, color: 'text-primary' },
  
  { label: '1', value: '1', type: ButtonType.Number },
  { label: '2', value: '2', type: ButtonType.Number },
  { label: '3', value: '3', type: ButtonType.Number },
  { label: '+', value: '+', type: ButtonType.Operator, color: 'text-primary' },
  
  { label: 'Ask AI', value: 'ai', type: ButtonType.AI, span: 1, bgColor: 'bg-primary/20 text-primary border border-primary/50' },
  { label: '0', value: '0', type: ButtonType.Number },
  { label: '.', value: '.', type: ButtonType.Number },
  { label: '=', value: '=', type: ButtonType.Action, bgColor: 'bg-primary text-white' },
];