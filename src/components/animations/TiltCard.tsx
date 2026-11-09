'use client';

import { useState } from 'react';
import type { FocusEvent, PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from './useFinePointer';
import { useReducedMotion } from './useReducedMotion';

const MAX_TILT_DEGREES = 10;
const LIFT_SCALE = 1.03;
const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

interface TiltCardProps {
  children: ReactNode;
}

export function TiltCard({ children }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const [lifted, setLifted] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const liftTarget = useMotionValue(1);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-MAX_TILT_DEGREES, MAX_TILT_DEGREES]), SPRING);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [MAX_TILT_DEGREES, -MAX_TILT_DEGREES]), SPRING);
  const scale = useSpring(liftTarget, SPRING);

  if (reducedMotion || !finePointer) return <div>{children}</div>;

  function lift() {
    setLifted(true);
    liftTarget.set(LIFT_SCALE);
  }

  function settle() {
    setLifted(false);
    pointerX.set(0);
    pointerY.set(0);
    liftTarget.set(1);
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
      className={lifted ? 'shadow-2xl' : 'shadow-none'}
      style={{ rotateX, rotateY, scale, transformPerspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={settle}
      onFocus={lift}
      onBlur={handleBlur}
    >
      {children}
    </motion.div>
  );
}
