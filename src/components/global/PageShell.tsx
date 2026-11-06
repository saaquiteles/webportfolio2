export const MAIN_CONTENT_ID = 'main-content';

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className="mx-auto w-full max-w-page px-4 pt-10 pb-18 sm:px-10 md:pt-18 md:pb-28"
    >
      {children}
    </main>
  );
}
