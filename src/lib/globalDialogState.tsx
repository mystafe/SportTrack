'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

export interface ImportPreviewData {
  exercises: ActivityRecord[];
  activities?: Array<{
    key: string;
    label: string;
    labelEn?: string;
    icon: string;
    multiplier: number;
    unit: string;
    unitEn?: string;
    defaultAmount: number;
    description?: string;
    descriptionEn?: string;
    isCustom?: boolean;
    category?: string;
  }>;
  settings?: UserSettings | null;
  userName?: string | null;
  badges?: Badge[];
  challenges?: Challenge[];
}

export interface ConflictData {
  local: {
    activities: unknown[];
    settings: unknown | null;
    badges: unknown[];
    challenges: unknown[];
  };
  cloud: {
    activities: unknown[];
    settings: unknown | null;
    badges: unknown[];
    challenges: unknown[];
    points?: number;
    metadata?: {
      lastModified: Date;
      version: number;
      userId: string;
    };
  };
}

interface GlobalDialogState {
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;
  showImportPreviewDialog: boolean;
  setShowImportPreviewDialog: (show: boolean) => void;
  importPreviewData: ImportPreviewData | null;
  setImportPreviewData: (data: ImportPreviewData | null) => void;
  showDuplicateDialog: boolean;
  setShowDuplicateDialog: (show: boolean) => void;
  showHealthGuide: boolean;
  setShowHealthGuide: (show: boolean) => void;
  showConflictDialog: boolean;
  setShowConflictDialog: (show: boolean) => void;
  conflictData: ConflictData | null;
  setConflictData: (data: ConflictData | null) => void;
  showSyncHistoryDialog: boolean;
  setShowSyncHistoryDialog: (show: boolean) => void;
  hasAnyDialogOpen: boolean;
}

const GlobalDialogContext = createContext<GlobalDialogState | null>(null);

export function GlobalDialogProvider({ children }: { children: ReactNode }) {
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [showImportPreviewDialog, setShowImportPreviewDialog] = useState<boolean>(false);
  const [importPreviewData, setImportPreviewData] = useState<ImportPreviewData | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState<boolean>(false);
  const [showHealthGuide, setShowHealthGuide] = useState<boolean>(false);
  const [showConflictDialog, setShowConflictDialog] = useState<boolean>(false);
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [showSyncHistoryDialog, setShowSyncHistoryDialog] = useState<boolean>(false);

  const hasAnyDialogOpen =
    showExportDialog ||
    showImportPreviewDialog ||
    showDuplicateDialog ||
    showHealthGuide ||
    showConflictDialog ||
    showSyncHistoryDialog;

  const value: GlobalDialogState = {
    showExportDialog,
    setShowExportDialog,
    showImportPreviewDialog,
    setShowImportPreviewDialog,
    importPreviewData,
    setImportPreviewData,
    showDuplicateDialog,
    setShowDuplicateDialog,
    showHealthGuide,
    setShowHealthGuide,
    showConflictDialog,
    setShowConflictDialog,
    conflictData,
    setConflictData,
    showSyncHistoryDialog,
    setShowSyncHistoryDialog,
    hasAnyDialogOpen,
  };

  return <GlobalDialogContext.Provider value={value}>{children}</GlobalDialogContext.Provider>;
}

export function useGlobalDialogState(): GlobalDialogState {
  const context = useContext(GlobalDialogContext);
  if (!context) {
    throw new Error('useGlobalDialogState must be used within GlobalDialogProvider');
  }
  return context;
}
