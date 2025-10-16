export const CircleIcon = ({ className = "", size = 96 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="48"
      cy="48"
      r="48"
      fill="#6B7A6B"
      opacity="0.7"
    />
  </svg>
);