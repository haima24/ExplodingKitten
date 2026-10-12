/** Decorative logo mark. The title text next to it carries the meaning. */
export function Logo({ size = 96 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <rect width="64" height="64" rx="16" fill="#5B3FD9" />
      <path
        d="M14 26 18 10l12 9h4l12-9 4 16c3 4 4 8 4 12 0 10-9 16-22 16S10 48 10 38c0-4 1-8 4-12z"
        fill="#FFC83D"
        stroke="#1F1A3D"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="36" r="3" fill="#1F1A3D" />
      <circle cx="39" cy="36" r="3" fill="#1F1A3D" />
      <path d="M28 44c2 2 6 2 8 0" fill="none" stroke="#1F1A3D" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
