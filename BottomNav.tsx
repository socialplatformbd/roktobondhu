import { NavLink } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { cn } from "@/utils/cn";

const items = [
  { to: "/", icon: "🏠", key: "nav.home" as const, end: true },
  { to: "/donors", icon: "🩸", key: "nav.donors" as const, end: false },
  { to: "/requests", icon: "📋", key: "nav.requests" as const, end: false },
  { to: "/inbox", icon: "📨", key: "nav.inbox" as const, end: false },
  { to: "/settings", icon: "⚙️", key: "nav.settings" as const, end: false },
];

export function BottomNav() {
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100 bg-white/95 backdrop-blur safe-bottom">
      <div className="mx-auto grid max-w-3xl grid-cols-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                isActive ? "text-brand-700" : "text-stone-400"
              )
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="line-clamp-1">{t(item.key)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
