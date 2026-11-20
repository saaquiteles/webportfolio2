'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import type { Project } from '@/lib/types';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { ElevationShadow, useElevation } from './Elevation';
import { useReducedMotion } from './useReducedMotion';

const GRAB_SPRING = { type: 'spring', stiffness: 520, damping: 20 } as const;
const FLIGHT_SPRING = { type: 'spring', stiffness: 120, damping: 16, restDelta: 0.01, restSpeed: 0.5 } as const;
const GRAB_MS = 140;
const FADE_SECONDS = 0.2;
const PERSPECTIVE = 1200;
const ARC_PX = 36;
const LIFT_Z_PX = 140;
const TILT_DEGREES = 9;
const TURN_DEGREES = 10;
const SWING_DEGREES = 5;
const DIP_SCALE = 0.02;
const DIP_PX = 2;
const TAPE_REST_DEGREES = 2;
const TAPE_PEEL_DEGREES = 48;
const TAPE_FADE_FROM = 0.6;

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Flight {
  panel: Box;
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  direction: 1 | -1;
}

function hasSize(box: Box) {
  return box.width > 0 && box.height > 0;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function planFlight(card: Box, panel: Box): Flight {
  const dx = card.left + card.width / 2 - (panel.left + panel.width / 2);
  const dy = card.top + card.height / 2 - (panel.top + panel.height / 2);
  return {
    panel: { left: panel.left, top: panel.top, width: panel.width, height: panel.height },
    dx,
    dy,
    sx: card.width / panel.width,
    sy: card.height / panel.height,
    direction: dx <= 0 ? 1 : -1,
  };
}

// progress runs 0 to 1 (a little past 1 on the overshoot); grab is the press before the lift.
function sheetTransform(flight: Flight, progress: number, grab: number) {
  const arc = Math.sin(Math.PI * clamp01(progress));
  const dip = grab * (1 - clamp01(progress));
  const x = flight.dx * (1 - progress);
  const y = flight.dy * (1 - progress) - ARC_PX * arc + DIP_PX * dip;
  const scale = 1 - DIP_SCALE * dip;
  const scaleX = (flight.sx + (1 - flight.sx) * progress) * scale;
  const scaleY = (flight.sy + (1 - flight.sy) * progress) * scale;
  return (
    `perspective(${PERSPECTIVE}px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${(LIFT_Z_PX * arc).toFixed(2)}px) ` +
    `rotateX(${(TILT_DEGREES * arc).toFixed(2)}deg) rotateY(${(-flight.direction * TURN_DEGREES * arc).toFixed(2)}deg) ` +
    `rotateZ(${(-flight.direction * SWING_DEGREES * arc).toFixed(2)}deg) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`
  );
}

interface ProjectOverlayProps {
  project: Project;
  card: HTMLElement | null;
  onClose: () => void;
}

export function ProjectOverlay({ project, card, onClose }: ProjectOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef(card);
  const fadeRef = useRef<{ stop: () => void } | null>(null);
  const titleId = useId();
  const reducedMotion = useReducedMotion();
  const [flight, setFlight] = useState<Flight | null>(null);
  const contentOpacity = useMotionValue(1);
  const { shadowOpacity, raise } = useElevation();

  // Reduced motion ends the flight for good, so turning it off again cannot restart it.
  if (reducedMotion && flight) setFlight(null);
  const flying = flight !== null && !reducedMotion;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const cardBox = cardRef.current?.getBoundingClientRect();
    if (!dialog.hasAttribute('open')) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    closeButtonRef.current?.focus();
    const panelBox = dialog.getBoundingClientRect();
    if (!cardBox || !hasSize(cardBox) || !hasSize(panelBox)) return;
    // Measuring the panel needs the open dialog, and the sheet must be in place before the first paint.
    setFlight(planFlight(cardBox, panelBox));
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) {
      contentOpacity.set(1);
      if (cardRef.current) cardRef.current.style.visibility = '';
      return;
    }
    const sheet = sheetRef.current;
    const tape = tapeRef.current;
    const card = cardRef.current;
    if (!flight || !sheet || !tape || !card) return;

    card.style.visibility = 'hidden';
    contentOpacity.set(0);
    let grab = 0;
    let progress = 0;
    const paint = () => {
      sheet.style.transform = sheetTransform(flight, progress, grab);
      const peel = TAPE_REST_DEGREES + TAPE_PEEL_DEGREES * Math.min(grab, 1);
      tape.style.transform = `rotate(${-peel}deg)`;
      tape.style.opacity = String(1 - clamp01((progress - TAPE_FADE_FROM) / (1 - TAPE_FADE_FROM)));
    };
    paint();

    const running: { stop: () => void }[] = [
      animate(0, 1, {
        ...GRAB_SPRING,
        onUpdate: (value) => {
          grab = value;
          paint();
        },
      }),
    ];
    const lift = setTimeout(() => {
      raise();
      running.push(
        animate(0, 1, {
          ...FLIGHT_SPRING,
          onUpdate: (value) => {
            progress = value;
            paint();
          },
          onComplete: () => {
            fadeRef.current = animate(contentOpacity, 1, { duration: FADE_SECONDS });
            setFlight(null);
          },
        }),
      );
    }, GRAB_MS);
    return () => {
      clearTimeout(lift);
      running.forEach((animation) => animation.stop());
    };
  }, [flight, reducedMotion, contentOpacity, raise]);

  useEffect(() => {
    const card = cardRef.current;
    return () => {
      fadeRef.current?.stop();
      if (card) card.style.visibility = '';
    };
  }, []);

  function handleClosed() {
    if (cardRef.current) cardRef.current.style.visibility = '';
    onClose();
  }

  function requestClose() {
    const dialog = dialogRef.current;
    if (dialog && typeof dialog.close === 'function') dialog.close();
    else handleClosed();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) requestClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClose={handleClosed}
      onClick={handleClick}
      className={`m-auto max-h-11/12 w-11/12 max-w-xl overflow-y-auto border-2 p-0 text-ink backdrop:bg-ink/60 ${
        flying ? 'border-transparent bg-transparent' : 'border-rule bg-surface'
      }`}
    >
      {flying && flight && (
        <div
          ref={sheetRef}
          aria-hidden="true"
          className="pointer-events-none fixed border-2 border-rule bg-surface"
          style={{
            left: flight.panel.left,
            top: flight.panel.top,
            width: flight.panel.width,
            height: flight.panel.height,
          }}
        >
          <ElevationShadow opacity={shadowOpacity} />
          <div
            ref={tapeRef}
            className="pointer-events-none absolute -top-3 left-1/2 -ml-12 h-6 w-24 origin-right bg-blueprint/30"
          />
        </div>
      )}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="flex flex-col gap-6 p-6"
      >
        <ProjectDetail project={project} titleId={titleId} />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          className="self-start border-2 border-ink px-3 py-1 font-mono text-sm"
        >
          Put back
        </button>
      </motion.div>
    </dialog>
  );
}
