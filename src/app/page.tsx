import { profile } from '@/data/profile';

export default function Home() {
  return (
    <main className="p-8">
      <p>{profile.name}</p>
      <h1>{profile.headline}</h1>
      <p>{profile.tagline}</p>
    </main>
  );
}
