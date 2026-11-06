import { NavLink } from './NavLink';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/projects/', label: 'Projects' },
  { href: '/contact/', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <nav aria-label="Main" className="mx-auto max-w-page px-4 py-2 sm:px-10">
        <ul className="flex justify-between sm:justify-start sm:gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
