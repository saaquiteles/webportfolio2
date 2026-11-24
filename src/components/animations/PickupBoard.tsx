'use client';

import { createContext, useContext, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '@/lib/types';
import { ProjectOverlay } from './ProjectOverlay';

interface Board {
  open: (project: Project, trigger: HTMLElement) => void;
  isOpen: boolean;
}

const BoardContext = createContext<Board | null>(null);

export function useBoardOpen(): boolean {
  return useContext(BoardContext)?.isOpen ?? false;
}

const subscribeNever = () => () => {};

// The button is in the static HTML as hidden, so a visitor without JavaScript never sees a dead control.
function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

interface PickupBoardProps {
  children: ReactNode;
}

export function PickupBoard({ children }: PickupBoardProps) {
  const [picked, setPicked] = useState<{ project: Project; card: HTMLElement | null } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const board: Board = {
    isOpen: picked !== null,
    open(project, trigger) {
      triggerRef.current = trigger;
      setPicked({ project, card: trigger.closest('li') });
    },
  };

  function handleClose() {
    setPicked(null);
    triggerRef.current?.focus();
  }

  return (
    <BoardContext.Provider value={board}>
      {children}
      {picked && <ProjectOverlay project={picked.project} card={picked.card} onClose={handleClose} />}
    </BoardContext.Provider>
  );
}

interface PickupButtonProps {
  project: Project;
}

export function PickupButton({ project }: PickupButtonProps) {
  const board = useContext(BoardContext);
  const hydrated = useHydrated();

  return (
    <button
      type="button"
      hidden={!hydrated}
      aria-haspopup="dialog"
      aria-label={`Pick up ${project.title}`}
      onClick={(event) => board?.open(project, event.currentTarget)}
      className="self-start border-2 border-ink px-3 py-1 font-mono text-sm"
    >
      Pick up
    </button>
  );
}
