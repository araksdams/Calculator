export interface CalculatorHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isAi: boolean;
}

export enum ButtonType {
  Number = 'NUMBER',
  Operator = 'OPERATOR',
  Action = 'ACTION',
  Scientific = 'SCIENTIFIC',
  AI = 'AI'
}

export interface ButtonConfig {
  label: string;
  value: string;
  type: ButtonType;
  span?: number; // Grid column span
  color?: string; // Tailwind text color class
  bgColor?: string; // Tailwind bg color class
}
