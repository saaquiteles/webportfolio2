import type { Profile } from '@/lib/types';

type ContactLinksProps = Pick<Profile, 'email' | 'links'>;

export function ContactLinks({ email, links }: ContactLinksProps) {
  return (
    <ul>
      <li>
        <a href={`mailto:${email}`}>{email}</a>
      </li>
      <li>
        <a href={links.linkedin}>LinkedIn</a>
      </li>
      <li>
        <a href={links.github}>GitHub</a>
      </li>
    </ul>
  );
}
