/**
 * Drag and Drop Hook
 * Provides drag and drop functionality for reordering items
 */

import { useRef, useState, useCallback } from 'react';

interface UseDragAndDropOptions<T> {
  items: T[];
  onReorder: (newOrder: T[]) => void;
  disabled?: boolean;
  dragThreshold?: number; // Minimum distance in pixels before drag starts
}

interface DragState {
  isDragging: boolean;
  draggedIndex: number | null;
  targetIndex: number | null;
}

export function useDragAndDrop<T extends { id: string }>({
  items,
  onReorder,
  disabled = false,
  dragThreshold = 5,
}: UseDragAndDropOptions<T>) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedIndex: null,
    targetIndex: null,
  });

  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const currentIndexRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);

  const handleDragStart = useCallback(
    (index: number, e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      startPosRef.current = { x: clientX, y: clientY };
      currentIndexRef.current = index;
      hasMovedRef.current = false;

      setDragState({
        isDragging: false,
        draggedIndex: index,
        targetIndex: null,
      });
    },
    [disabled]
  );

  const handleDragMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled || currentIndexRef.current === null || !startPosRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = Math.abs(clientX - startPosRef.current.x);
      const deltaY = Math.abs(clientY - startPosRef.current.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > dragThreshold) {
        hasMovedRef.current = true;
        setDragState((prev) => ({
          ...prev,
          isDragging: true,
        }));

        // Calculate target index based on Y position
        const itemHeight = 80; // Approximate item height, can be made dynamic
        const deltaYFromStart = clientY - startPosRef.current.y;
        const indexOffset = Math.round(deltaYFromStart / itemHeight);
        const newTargetIndex = Math.max(
          0,
          Math.min(items.length - 1, (currentIndexRef.current ?? 0) + indexOffset)
        );

        setDragState((prev) => ({
          ...prev,
          targetIndex: newTargetIndex !== prev.draggedIndex ? newTargetIndex : null,
        }));
      }
    },
    [disabled, dragThreshold, items.length]
  );

  const handleDragEnd = useCallback(() => {
    if (disabled || currentIndexRef.current === null) return;

    setDragState((currentState) => {
      if (
        hasMovedRef.current &&
        currentState.targetIndex !== null &&
        currentState.targetIndex !== currentState.draggedIndex
      ) {
        // Reorder items
        const newItems = [...items];
        const [draggedItem] = newItems.splice(currentState.draggedIndex!, 1);
        newItems.splice(currentState.targetIndex, 0, draggedItem);
        onReorder(newItems);
      }

      // Reset state
      startPosRef.current = null;
      currentIndexRef.current = null;
      hasMovedRef.current = false;

      return {
        isDragging: false,
        draggedIndex: null,
        targetIndex: null,
      };
    });
  }, [disabled, items, onReorder]);

  const getDragHandlers = useCallback(
    (index: number) => ({
      onTouchStart: (e: React.TouchEvent) => handleDragStart(index, e),
      onTouchMove: handleDragMove,
      onTouchEnd: handleDragEnd,
      onMouseDown: (e: React.MouseEvent) => {
        if (e.button === 0) {
          // Left mouse button only
          handleDragStart(index, e);
        }
      },
      onMouseMove: handleDragMove,
      onMouseUp: handleDragEnd,
      onMouseLeave: handleDragEnd,
    }),
    [handleDragStart, handleDragMove, handleDragEnd]
  );

  return {
    dragState,
    getDragHandlers,
    isDragging: dragState.isDragging,
    draggedIndex: dragState.draggedIndex,
    targetIndex: dragState.targetIndex,
  };
}
