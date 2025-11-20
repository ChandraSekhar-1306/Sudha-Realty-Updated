
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="256"
      height="256"
      fill="currentColor"
    >
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
      <path d="M175.46 95.23a8 8 0 0 1-1.7 11.16l-48 36.43a8.08 8.08 0 0 1-4.83 1.58h-.2a8 8 0 0 1-4.63-1.42L80.54 116.7a8 8 0 0 1 10.92-11.64l30.41 21.49 41.89-31.78a8 8 0 0 1 11.7 1.46Z" />
    </svg>
  );
}
