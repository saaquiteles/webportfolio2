'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion, motionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useFinePointer } from './useFinePointer';
import { useReducedMotion } from './useReducedMotion';

const MAX_DRIFT_PX = 12;
const SPRING = { stiffness: 90, damping: 20, mass: 0.8 };

interface PointerDepthValues {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const PointerDepthContext = createContext<PointerDepthValues>({ x: motionValue(0), y: motionValue(0) });

interface PointerDepthFieldProps {
  children: ReactNode;
}

interface PointerDepthLayerProps {
  strength: number;
  children: ReactNode;
  className?: string;
}

function clamp(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export function PointerDepthField({ children }: PointerDepthFieldProps) {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const active = finePointer && !reducedMotion;
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, SPRING);
  const y = useSpring(targetY, SPRING);
  const values = useMemo(() => ({ x, y }), [x, y]);

  useEffect(() => {
    if (!active) return;
    function handleMove(event: PointerEvent) {
      if (window.innerWidth === 0 || window.innerHeight === 0) return;
      targetX.set(clamp((event.clientX / window.innerWidth) * 2 - 1));
      targetY.set(clamp((event.clientY / window.innerHeight) * 2 - 1));
    }
    function handleLeave() {
      targetX.set(0);
      targetY.set(0);
    }
    window.addEventListener('pointermove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      targetX.set(0);
      targetY.set(0);
    };
  }, [active, targetX, targetY]);

  return <PointerDepthContext.Provider value={values}>{children}</PointerDepthContext.Provider>;
}

export function PointerDepthLayer({ strength, children, className }: PointerDepthLayerProps) {
  const values = useContext(PointerDepthContext);
  const reach = Math.min(Math.abs(strength), MAX_DRIFT_PX);
  const x = useTransform(values.x, (v) => v * reach);
  const y = useTransform(values.y, (v) => v * reach);

  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}
