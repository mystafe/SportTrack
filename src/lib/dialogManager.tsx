'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface DialogConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  zIndex?: number;
  onClose?: () => void;
}

interface DialogState extends DialogConfig {
  zIndex: number;
}

interface DialogManagerContextValue {
  openDialog: (config: DialogConfig) => void;
  closeDialog: (id: string) => void;
  closeAll: () => void;
  getTopDialog: () => DialogState | null;
  dialogs: DialogState[];
}

const DialogManagerContext = createContext<DialogManagerContextValue | null>(null);

const BASE_Z_INDEX = 10000;
const Z_INDEX_INCREMENT = 10;

export function DialogManagerProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogState[]>([]);
  const zIndexCounterRef = useRef(BASE_Z_INDEX);

  const openDialog = useCallback((config: DialogConfig) => {
    setDialogs((prev) => {
      // Check if dialog already exists
      if (prev.some((d) => d.id === config.id)) {
        return prev;
      }

      // Calculate z-index
      const maxZIndex = prev.length > 0 ? Math.max(...prev.map((d) => d.zIndex)) : BASE_Z_INDEX;
      const newZIndex = maxZIndex + Z_INDEX_INCREMENT;

      const newDialog: DialogState = {
        ...config,
        zIndex: config.zIndex ?? newZIndex,
        backdrop: config.backdrop !== false, // Default to true
        closeOnBackdropClick: config.closeOnBackdropClick !== false, // Default to true
        closeOnEscape: config.closeOnEscape !== false, // Default to true
      };

      return [...prev, newDialog];
    });
  }, []);

  const closeDialog = useCallback((id: string) => {
    setDialogs((prev) => {
      const dialog = prev.find((d) => d.id === id);
      if (dialog?.onClose) {
        dialog.onClose();
      }
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    setDialogs((prev) => {
      prev.forEach((dialog) => {
        if (dialog.onClose) {
          dialog.onClose();
        }
      });
      return [];
    });
  }, []);

  const getTopDialog = useCallback(() => {
    if (dialogs.length === 0) return null;
    return dialogs.reduce((top, current) => (current.zIndex > top.zIndex ? current : top));
  }, [dialogs]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const topDialog =
          dialogs.length > 0
            ? dialogs.reduce((top, current) => (current.zIndex > top.zIndex ? current : top))
            : null;

        if (topDialog && topDialog.closeOnEscape) {
          closeDialog(topDialog.id);
        }
      }
    };

    if (dialogs.length > 0) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [dialogs, closeDialog]);

  // Prevent body scroll when dialogs are open
  useEffect(() => {
    if (dialogs.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [dialogs.length]);

  const value: DialogManagerContextValue = {
    openDialog,
    closeDialog,
    closeAll,
    getTopDialog,
    dialogs,
  };

  const topDialog = getTopDialog();

  return (
    <DialogManagerContext.Provider value={value}>
      {children}
      {/* Render dialogs */}
      {typeof window !== 'undefined' &&
        dialogs.map((dialog) => {
          const DialogComponent = dialog.component;
          const isTopDialog = topDialog?.id === dialog.id;
          const shouldShowBackdrop = isTopDialog && dialog.backdrop;

          return createPortal(
            <div key={dialog.id} style={{ zIndex: dialog.zIndex }}>
              <DialogComponent
                {...dialog.props}
                open={true}
                onClose={() => closeDialog(dialog.id)}
                zIndex={dialog.zIndex}
                isTopDialog={isTopDialog}
                closeOnBackdropClick={dialog.closeOnBackdropClick}
              />
            </div>,
            document.body
          );
        })}
    </DialogManagerContext.Provider>
  );
}

export function useDialogManager() {
  const context = useContext(DialogManagerContext);
  if (!context) {
    throw new Error('useDialogManager must be used within DialogManagerProvider');
  }
  return context;
}
