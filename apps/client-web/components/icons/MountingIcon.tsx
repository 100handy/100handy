import type { SVGProps } from "react";

export function MountingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M0 3.75A2.25 2.25 0 0 1 2.25 1.5h19.5A2.25 2.25 0 0 1 24 3.75v12A2.25 2.25 0 0 1 21.75 18H14.5v1.5h2.25a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1 0-1.5H9.5V18H2.25A2.25 2.25 0 0 1 0 15.75v-12ZM2.25 3a.75.75 0 0 0-.75.75v12c0 .414.336.75.75.75h19.5a.75.75 0 0 0 .75-.75v-12a.75.75 0 0 0-.75-.75H2.25Zm9.5 15v1.5h.5V18h-.5Z" />
    </svg>
  );
}
