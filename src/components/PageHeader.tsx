import React from "react";
import type { LucideIcon } from "lucide-react";

export type AccentColor = "blue" | "indigo" | "emerald" | "amber" | "purple" | "slate";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: AccentColor;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

const ICON_BG: Record<AccentColor, string> = {
  blue: "bg-[#0F3D91]",
  indigo: "bg-[#0F3D91]",
  emerald: "bg-[#16a34a]",
  amber: "bg-[#FCD116]",
  purple: "bg-[#0F3D91]",
  slate: "bg-[#0F3D91]",
};

const ICON_TEXT: Record<AccentColor, string> = {
  blue: "text-white",
  indigo: "text-white",
  emerald: "text-white",
  amber: "text-[#1A1A2E]",
  purple: "text-white",
  slate: "text-white",
};

const ACTION_BG: Record<AccentColor, string> = {
  blue: "bg-[#0F3D91]",
  indigo: "bg-[#0F3D91]",
  emerald: "bg-[#16a34a]",
  amber: "bg-[#FCD116]",
  purple: "bg-[#0F3D91]",
  slate: "bg-[#0F3D91]",
};

const ACTION_TEXT: Record<AccentColor, string> = {
  blue: "text-white",
  indigo: "text-white",
  emerald: "text-white",
  amber: "text-[#1A1A2E]",
  purple: "text-white",
  slate: "text-white",
};

const ACTION_HOVER_BG: Record<AccentColor, string> = {
  blue: "hover:bg-[#1a52c4]",
  indigo: "hover:bg-[#1a52c4]",
  emerald: "hover:bg-[#15803d]",
  amber: "hover:bg-[#c9a700]",
  purple: "hover:bg-[#1a52c4]",
  slate: "hover:bg-[#1a52c4]",
};

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent,
  action,
}: PageHeaderProps) {
  return (
    <div className="bg-white border border-[#e5e8ef] rounded-2xl shadow-[0_4px_32px_rgba(15,61,145,0.07)] p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON_BG[accent]} ${ICON_TEXT[accent]}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#1A1A2E] md:text-xl">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-[#6B7280] leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`hidden md:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all touch-manipulation ${ACTION_BG[accent]} ${ACTION_TEXT[accent]} ${ACTION_HOVER_BG[accent]}`}
          >
            {action.icon && <action.icon className="h-4 w-4" aria-hidden="true" />}
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
