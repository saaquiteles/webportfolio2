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
    <Link
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      className="inline-flex min-h-11 items-center px-1 font-medium text-ink no-underline aria-[current=page]:font-bold aria-[current=page]:underline aria-[current=page]:decoration-tomato aria-[current=page]:decoration-4 aria-[current=page]:underline-offset-8"
    >
      {children}
    </Link>
  );
}
