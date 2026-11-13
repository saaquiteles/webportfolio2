'use client';

import type { FocusEvent, PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ElevationShadow, LIFT_SPRING, useElevation } from './Elevation';
import { useFinePointer } from './useFinePointer';
import { useReducedMotion } from './useReducedMotion';

const MAX_TILT_DEGREES = 10;

interface TiltCardProps {
  children: ReactNode;
}

export function TiltCard({ children }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-MAX_TILT_DEGREES, MAX_TILT_DEGREES]), LIFT_SPRING);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [MAX_TILT_DEGREES, -MAX_TILT_DEGREES]), LIFT_SPRING);
  const { scale, shadowOpacity, raise, lower } = useElevation();

  const active = !reducedMotion && finePointer;

  function lift() {
    raise();
  }

  function settle() {
    pointerX.set(0);
    pointerY.set(0);
    lower();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const x = ((event.clientX - box.left) / box.width) * 2 - 1;
    const y = ((event.clientY - box.top) / box.height) * 2 - 1;
    pointerX.set(Math.max(-1, Math.min(1, x)));
    pointerY.set(Math.max(-1, Math.min(1, y)));
    lift();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    settle();
  }

  return (
    <motion.div
      className="relative"
      style={active ? { rotateX, rotateY, scale, transformPerspective: 1000 } : undefined}
      onPointerMove={active ? handlePointerMove : undefined}
      onPointerLeave={active ? settle : undefined}
      onFocus={active ? lift : undefined}
      onBlur={active ? handleBlur : undefined}
    >
      {/* A new layer drops the shadow in the same render; a motion value would keep painting its last value. */}
      <ElevationShadow key={active ? 'on' : 'off'} opacity={active ? shadowOpacity : 0} />
      {children}
    </motion.div>
  );
}
