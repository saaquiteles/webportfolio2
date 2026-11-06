import { profile } from '@/data/profile';

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <p className="mx-auto max-w-page px-4 py-5 text-sm text-muted sm:px-10">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
