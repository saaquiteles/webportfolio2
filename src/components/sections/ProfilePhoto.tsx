import type { Profile } from '@/lib/types';
import { Tape } from './Tape';

interface ProfilePhotoProps {
  photo?: Profile['photo'];
}

export function ProfilePhoto({ photo }: ProfilePhotoProps) {
  if (!photo) return <p>TODO(human): photo</p>;
  return (
    <div className="relative max-w-sm border-2 border-rule bg-surface p-3">
      <Tape />
      {/* eslint-disable-next-line @next/next/no-img-element -- images.unoptimized is set for the static export */}
      <img src={photo.src} alt={photo.alt} className="h-auto w-full rotate-1" />
    </div>
  );
}
