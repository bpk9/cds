import { memo, useEffect, useState } from 'react';
import type React from 'react';
import { createPortal } from 'react-dom';

export type ChartSlotProps = {
  children: React.ReactNode;
  /**
   * The slot ref to portal into.
   */
  slotRef?: React.RefObject<HTMLElement | null>;
};

export const ChartSlot = memo(function ChartSlot({ children, slotRef }: ChartSlotProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // We only want to mount after the slotRef is available
  if (!mounted || !slotRef?.current) {
    return null;
  }

  // Portal directly into the slot element
  return createPortal(children, slotRef.current);
});
