import React from "react";
import type { LucideIcon } from "lucide-react";

export type AccentColor = "blue" | "emerald" | "amber";

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
  blue: "bg-kt-blue",
  emerald: "bg-kt-success",
  amber: "bg-kt-gold",
};

const ICON_TEXT: Record<AccentColor, string> = {
  blue: "text-white",
  emerald: "text-white",
  amber: "text-kt-near-black",
};

const ACTION_BG: Record<AccentColor, string> = {
  blue: "bg-kt-blue",
  emerald: "bg-kt-success",
  amber: "bg-kt-gold",
};

const ACTION_TEXT: Record<AccentColor, string> = {
  blue: "text-white",
  emerald: "text-white",
  amber: "text-kt-near-black",
};

const ACTION_HOVER_BG: Record<AccentColor, string> = {
  blue: "hover:bg-kt-blue-mid",
  emerald: "hover:bg-kt-success-dark",
  amber: "hover:bg-kt-gold-dark",
};

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent,
  action,
}: PageHeaderProps) {
  return (
    <div className="bg-white border border-kt-border rounded-2xl p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON_BG[accent]} ${ICON_TEXT[accent]}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-kt-near-black md:text-xl">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-kt-slate leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all touch-manipulation ${ACTION_BG[accent]} ${ACTION_TEXT[accent]} ${ACTION_HOVER_BG[accent]}`}
          >
            {action.icon && <action.icon className="h-4 w-4" aria-hidden="true" />}
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
