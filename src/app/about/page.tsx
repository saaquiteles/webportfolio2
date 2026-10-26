import { ExperienceList } from '@/components/sections/ExperienceList';
import { experience } from '@/data/experience';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <main className="p-8">
      <h1>About</h1>
      <p>{profile.intro}</p>
      <h2>Experience</h2>
      <ExperienceList entries={experience} />
    </main>
  );
}
