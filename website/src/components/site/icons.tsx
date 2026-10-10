import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function IconPlay(props: Props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M7 4.5v15l12-7.5z" />
    </svg>
  );
}

export function IconPause(props: Props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  );
}

export function IconSun(props: Props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function IconCopy(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function IconCheck(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconChevron(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function IconGitHub(props: Props) {
  return (
    <svg {...base} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.922c.563.104.768-.244.768-.542 0-.267-.01-.975-.015-1.913-3.13.68-3.79-1.508-3.79-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.022-.699.077-.685.077-.685 1.13.08 1.725 1.16 1.725 1.16 1.005 1.723 2.637 1.225 3.28.937.102-.728.393-1.225.715-1.507-2.498-.284-5.124-1.249-5.124-5.56 0-1.228.44-2.233 1.16-3.02-.116-.284-.503-1.429.11-2.978 0 0 .945-.303 3.094 1.154a10.79 10.79 0 0 1 5.633 0c2.148-1.457 3.09-1.154 3.09-1.154.615 1.549.228 2.694.112 2.978.722.787 1.158 1.792 1.158 3.02 0 4.322-2.63 5.273-5.136 5.552.404.35.766 1.042.766 2.1 0 1.516-.014 2.739-.014 3.11 0 .3.203.65.774.54A11.252 11.252 0 0 0 12 .75Z" />
    </svg>
  );
}

/** The selected wheel mark with a single thumb recess. */
export function IconWheel(props: Props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path fillRule="evenodd" d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM18.8 6.6a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" />
    </svg>
  );
}

export function IconNext(props: Props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M5 5v14l9-7zM16 5h3v14h-3z" />
    </svg>
  );
}

export function IconMonitor(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
