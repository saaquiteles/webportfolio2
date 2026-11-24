'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { LIFT_SPRING } from './Elevation';
import { useBoardOpen } from './PickupBoard';

const MAX_SHIFT_PX = 6;

type Listener = (lifted: HTMLElement | null) => void;

interface Field {
  lift: (card: HTMLElement) => void;
  settle: (card: HTMLElement) => void;
  listen: (listener: Listener) => () => void;
}

const FieldContext = createContext<Field | null>(null);

interface NeighbourFieldProps {
  children: ReactNode;
}

export function NeighbourField({ children }: NeighbourFieldProps) {
  const paused = useBoardOpen();
  const pausedRef = useRef(paused);
  const liftedRef = useRef<HTMLElement | null>(null);
  const listenersRef = useRef(new Set<Listener>());

  const [field] = useState<Field>(() => ({
    lift(card) {
      if (pausedRef.current || liftedRef.current === card) return;
      liftedRef.current = card;
      listenersRef.current.forEach((listener) => listener(card));
    },
    settle(card) {
      if (liftedRef.current !== card) return;
      liftedRef.current = null;
      listenersRef.current.forEach((listener) => listener(null));
    },
    listen(listener) {
      listenersRef.current.add(listener);
      return () => listenersRef.current.delete(listener);
    },
  }));

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused || liftedRef.current === null) return;
    liftedRef.current = null;
    listenersRef.current.forEach((listener) => listener(null));
  }, [paused]);

  return <FieldContext.Provider value={field}>{children}</FieldContext.Provider>;
}

function centre(box: DOMRect) {
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

export function useMakeRoom(cardRef: RefObject<HTMLElement | null>, active: boolean) {
  const field = useContext(FieldContext);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, LIFT_SPRING);
  const y = useSpring(targetY, LIFT_SPRING);

  useEffect(() => {
    const element = cardRef.current;
    if (!field || !active) return;

    const unlisten = field.listen((lifted) => {
      const card = cardRef.current;
      let dx = 0;
      let dy = 0;
      if (card && lifted && lifted !== card) {
        const own = card.getBoundingClientRect();
        const other = lifted.getBoundingClientRect();
        if (own.width > 0 && own.height > 0 && other.width > 0 && other.height > 0) {
          const from = centre(other);
          const to = centre(own);
          const distance = Math.hypot(to.x - from.x, to.y - from.y);
          if (distance > 0) {
            dx = ((to.x - from.x) / distance) * MAX_SHIFT_PX;
            dy = ((to.y - from.y) / distance) * MAX_SHIFT_PX;
          }
        }
      }
      targetX.set(dx);
      targetY.set(dy);
    });

    return () => {
      unlisten();
      if (element) field.settle(element);
      targetX.set(0);
      targetY.set(0);
      x.jump(0);
      y.jump(0);
      // Framer leaves the last transform on the element once its style values are dropped.
      element?.style.removeProperty('transform');
    };
  }, [field, active, cardRef, targetX, targetY, x, y]);

  return {
    x,
    y,
    lift(card: HTMLElement) {
      field?.lift(card);
    },
    settle(card: HTMLElement) {
      field?.settle(card);
    },
  };
}
