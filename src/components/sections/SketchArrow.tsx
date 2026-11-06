interface SketchArrowProps {
  className?: string;
}

export function SketchArrow({ className = '' }: SketchArrowProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 230 110"
      className={`fill-none ${className}`}
    >
      <path
        d="M8 22 C 70 0, 150 8, 162 52 C 167 72, 152 80, 142 87"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M142 87 L158 86.5 M142 87 L149 72"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
