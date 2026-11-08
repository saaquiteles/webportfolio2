import type { Profile } from '@/lib/types';

type ContactLinksProps = Pick<Profile, 'email' | 'links'> & { emailOnly?: boolean };

const STICKER =
  'inline-flex min-h-11 items-center rounded-md border-2 border-ink bg-surface px-4 font-semibold text-ink no-underline shadow-md';

export function ContactLinks({ email, links, emailOnly = false }: ContactLinksProps) {
  return (
    <ul className="mt-9 flex flex-wrap gap-4">
      <li className="odd:-rotate-1 even:rotate-1">
        <a className={STICKER} href={`mailto:${email}`}>{email}</a>
      </li>
      {!emailOnly && (
        <>
          <li className="odd:-rotate-1 even:rotate-1">
            <a className={STICKER} href={links.linkedin}>LinkedIn</a>
          </li>
          <li className="odd:-rotate-1 even:rotate-1">
            <a className={STICKER} href={links.github}>GitHub</a>
          </li>
        </>
      )}
    </ul>
  );
}
