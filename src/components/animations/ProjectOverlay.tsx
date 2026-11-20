'use client';

import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';
import type { Project } from '@/lib/types';
import { ProjectDetail } from '@/components/sections/ProjectDetail';

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.hasAttribute('open')) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    closeButtonRef.current?.focus();
  }, []);

  function requestClose() {
    const dialog = dialogRef.current;
    if (dialog && typeof dialog.close === 'function') dialog.close();
    else onClose();
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
      onClose={onClose}
      onClick={handleClick}
      className="m-auto max-h-11/12 w-11/12 max-w-xl overflow-y-auto border-2 border-rule bg-surface p-0 text-ink backdrop:bg-ink/60"
    >
      <div className="flex flex-col gap-6 p-6">
        <ProjectDetail project={project} titleId={titleId} />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          className="self-start border-2 border-ink px-3 py-1 font-mono text-sm"
        >
          Put back
        </button>
      </div>
    </dialog>
  );
}
