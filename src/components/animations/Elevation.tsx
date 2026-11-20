'use client';

import { useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

const LIFT_SCALE = 1.03;
export const LIFT_SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

export function useElevation() {
  const target = useMotionValue(1);
  const scale = useSpring(target, LIFT_SPRING);
  const shadowOpacity = useTransform(scale, [1, LIFT_SCALE], [0, 1]);

  const raise = useCallback(() => target.set(LIFT_SCALE), [target]);
  const lower = useCallback(() => target.set(1), [target]);

  return { scale, shadowOpacity, raise, lower };
}

interface ElevationShadowProps {
  opacity: MotionValue<number> | number;
}

export function ElevationShadow({ opacity }: ElevationShadowProps) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 shadow-2xl"
      style={{ opacity }}
    />
  );
}
