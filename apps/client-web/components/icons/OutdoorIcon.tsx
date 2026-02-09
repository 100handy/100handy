import type { SVGProps } from "react";

export function OutdoorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.75 2.25a.75.75 0 0 0-1.5 0v.75a6 6 0 0 0-4.793 8.717L4.72 13.453a.75.75 0 1 0 1.06 1.06l1.498-1.497A5.972 5.972 0 0 0 11.25 14.93V20.25H7.5a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-3.75v-5.32a5.972 5.972 0 0 0 3.972-1.914l1.498 1.497a.75.75 0 1 0 1.06-1.06l-1.737-1.736A6 6 0 0 0 12.75 3v-.75ZM12 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
    </svg>
  );
}
