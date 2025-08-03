import { Module } from '@/types';
import { MouseEvent } from 'react';

/**
 * Props for the main CourseCurriculum component
 */
export interface CourseCurriculumProps {
  /** Array of course modules to display */
  modules: Module[];
  /** Whether to use the enhanced or legacy module list view */
  useEnhanced: boolean;
  /** Optional Telegram link for support contact */
  telegramLink?: string;
}

/**
 * Props shared between EnhancedModulesList and LegacyModulesList components
 */
export interface ModulesListProps {
  /** Array of course modules to display */
  modules: Module[];
  /** ID of the currently open module item or undefined if none is open */
  openItem: string | undefined;
  /** Callback to set the currently open module item */
  setOpenItem: (item: string | undefined) => void;
}

/**
 * Props for the CurriculumFooter component
 */
export interface CurriculumFooterProps {
  /** Telegram link for support contact */
  telegramLink: string;
}

/**
 * Type for module toggle click event handler
 */
export type ModuleToggleHandler = (event: MouseEvent<HTMLDivElement>) => void; 