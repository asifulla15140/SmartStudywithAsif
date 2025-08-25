import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 12h2" />
      <path d="M9 16h4" />
      <path d="M14.5 2.5c2 2.5 2 6.5 0 8" />
      <path d="M16.5 4.5c1 1.5 1 3.5 0 5" />
    </svg>
  );
}
