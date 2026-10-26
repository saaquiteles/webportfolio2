import type { Profile } from '@/lib/types';

interface ProfilePhotoProps {
  photo?: Profile['photo'];
}

export function ProfilePhoto({ photo }: ProfilePhotoProps) {
  if (!photo) return <p>TODO(human): photo</p>;
  // eslint-disable-next-line @next/next/no-img-element -- images.unoptimized is set for the static export
  return <img src={photo.src} alt={photo.alt} />;
}
