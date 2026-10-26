import { EducationList } from '@/components/sections/EducationList';
import { ExperienceList } from '@/components/sections/ExperienceList';
import { ProfilePhoto } from '@/components/sections/ProfilePhoto';
import { HighlightList } from '@/components/sections/HighlightList';
import { education, experience, highlights } from '@/data/experience';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <main className="p-8">
      <h1>About</h1>
      <ProfilePhoto photo={profile.photo} />
      <p>{profile.intro}</p>
      <h2>Experience</h2>
      <ExperienceList entries={experience} />
      <h2>Education</h2>
      <EducationList entries={education} />
      <h2>Also</h2>
      <HighlightList highlights={highlights} />
    </main>
  );
}
