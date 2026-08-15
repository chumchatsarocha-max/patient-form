'use client';

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { DatePickerStateContext } from 'react-aria-components';

/**
 * Calendar dropdown for DateField, rendered as our own portaled <div>
 * instead of react-aria's <Popover> (which renders with a transparent
 * background and drifts out of position on mobile). Reads open/closed
 * state from DatePickerStateContext, closes on outside click or Escape.
 *
 * Positioned in document coordinates (rect + scrollY), never
 * position: fixed — a fixed sheet goes unreachable on mobile once the
 * keyboard opens or the browser chrome collapses, since the visual and
 * layout viewports diverge.
 *
 * Rendered at document.body via portal, not inline in the form: iOS
 * Safari otherwise paints later sibling fields (gender/nationality) over
 * the calendar despite a higher z-index, because they sit in the same
 * stacking context.
 */
export function CalendarSheet({
  anchorRef,
  children,
}: {
  anchorRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const state = useContext(DatePickerStateContext);
  const boxRef = useRef<HTMLDivElement>(null);
  const isOpen = state?.isOpen ?? false;
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setBox({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    // queueMicrotask, not requestAnimationFrame: rAF is suspended on a
    // backgrounded tab, so the sheet would never appear after an app switch.
    queueMicrotask(measure);
    const scrollId = setTimeout(() => {
      boxRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);

    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      clearTimeout(scrollId);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [isOpen, anchorRef]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof el.showPopover !== 'function') return;
    try {
      el.showPopover();
    } catch {
      // Some browsers throw if the element isn't ready yet; falls back to z-index stacking.
    }
  }, [box]);

  useEffect(() => {
    if (!isOpen || !state) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      // Let the trigger button handle its own click, or close+reopen would toggle.
      if (boxRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.('[data-datepicker-trigger]')) return;
      state.setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') state.setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, state]);

  if (!isOpen || !box) return null;

  return createPortal(
    <div
      ref={boxRef}
      role="dialog"
      /**
       * popover="manual" promotes the sheet to the browser's top layer,
       * which renders above everything per spec regardless of z-index or
       * stacking context. Needed because Safari (not Chrome) still painted
       * the gender/nationality labels (z-index: 1) over the calendar
       * (z-index: 50) even from a body portal. Unsupported browsers fall
       * back to the z-50 stacking, which already works for them.
       */
      popover="manual"
      style={{
        position: 'absolute',
        top: box.top,
        left: box.left,
        right: 'auto',
        bottom: 'auto',
        margin: 0,
      }}
      className={[
        'z-50',
        'w-max max-w-[calc(100vw-1.5rem)] overflow-x-auto',
        'rounded-xl border border-line bg-card p-3 shadow-[0_18px_40px_-16px_rgba(12,74,110,0.45)]',
      ].join(' ')}
    >
      {children}
    </div>,
    document.body,
  );
}
