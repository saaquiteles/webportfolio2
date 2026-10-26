import { profile } from '@/data/profile';

export function SiteFooter() {
  return (
    <footer>
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
