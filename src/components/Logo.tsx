export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rb-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#c01313" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C24 4 10 20.5 10 30.5C10 38.5 16.3 44 24 44C31.7 44 38 38.5 38 30.5C38 20.5 24 4 24 4Z"
        fill="url(#rb-drop)"
      />
      <path
        d="M24 15.5C25.8 17.8 27.4 20 28.5 22"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19.5 31.5c0-2.6 2-4.6 4.4-6.6-1 2-1.3 3.1-1.3 4.3 0 1.8 1.4 3.3 3.1 3.3 1.3 0 2.3-.8 2.7-1.9.6 1 .9 2 .9 2.9 0 2.7-2.3 4.9-5.2 4.9-2.9 0-5.6-2.1-5.6-6.9Z"
        fill="white"
      />
    </svg>
  );
}

export function LogoWithText({ bnName, enName }: { bnName: string; enName: string }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark />
      <div className="leading-tight">
        <div className="text-lg font-bold text-brand-700">{bnName}</div>
        <div className="-mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">{enName}</div>
      </div>
    </div>
  );
}
