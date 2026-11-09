'use client';

import { motion, useScroll } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

function Ruler() {
  const { scrollYProgress } = useScroll();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-1 z-10 w-1 bg-rule">
      <motion.div data-ruler-fill className="h-full origin-top bg-tomato" style={{ scaleY: scrollYProgress }} />
    </div>
  );
}

export function ScrollRuler() {
  if (useReducedMotion()) return null;
  return <Ruler />;
}
