import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useCountUp } from "@/lib/sentinel-data";

export function Panel({
  title, subtitle, children, className = "", action,
}: { title?: string; subtitle?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-xl p-5 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--primary)]/40 to-transparent" />
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function Stat({
  label, value, suffix = "", icon, accent = "primary", trend,
}: { label: string; value: number; suffix?: string; icon?: ReactNode; accent?: "primary" | "critical" | "success" | "warning" | "violet"; trend?: string }) {
  const v = useCountUp(value);
  const accentVar = `var(--${accent === "primary" ? "primary" : accent})`;
  return (
    <Panel className="!p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold" style={{ color: accentVar }}>
            {Number.isInteger(value) ? Math.round(v).toLocaleString() : v.toFixed(1)}
            <span className="text-base ml-1 opacity-70">{suffix}</span>
          </div>
          {trend && <div className="text-[11px] text-muted-foreground mt-1 font-mono">{trend}</div>}
        </div>
        {icon && (
          <div className="size-10 rounded-lg grid place-items-center" style={{ background: `color-mix(in oklab, ${accentVar} 18%, transparent)`, color: accentVar }}>
            {icon}
          </div>
        )}
      </div>
    </Panel>
  );
}

export function SeverityBadge({ severity }: { severity: "critical" | "high" | "medium" | "low" }) {
  const cls = {
    critical: "bg-[color:var(--critical)]/15 text-[color:var(--critical)] border-[color:var(--critical)]/40",
    high: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/40",
    medium: "bg-[color:var(--cyan)]/15 text-[color:var(--cyan)] border-[color:var(--cyan)]/30",
    low: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
  }[severity];
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono uppercase border ${cls}`}>
    <span className="size-1.5 rounded-full bg-current" />{severity}
  </span>;
}
