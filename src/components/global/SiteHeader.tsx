import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header>
      <nav aria-label="Main">
        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
