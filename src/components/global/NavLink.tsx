'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function withoutTrailingSlash(path: string) {
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname !== null && withoutTrailingSlash(pathname) === withoutTrailingSlash(href);

  return (
    <Link href={href} aria-current={isCurrent ? 'page' : undefined}>
      {children}
    </Link>
  );
}
