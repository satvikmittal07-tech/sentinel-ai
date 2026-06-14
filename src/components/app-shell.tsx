import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShieldAlert, Brain, Globe2, Network, GitBranch,
  Activity, Siren, FileSearch, Bot, Sparkles, Settings, Zap, Circle,
} from "lucide-react";

const nav = [
  { to: "/", label: "Executive", icon: LayoutDashboard },
  { to: "/threats", label: "Threat Monitor", icon: ShieldAlert },
  { to: "/ai-detection", label: "AI Detection", icon: Brain },
  { to: "/attack-map", label: "Live Attack Map", icon: Globe2 },
  { to: "/intel", label: "Threat Intelligence", icon: Network },
  { to: "/digital-twin", label: "Digital Twin", icon: GitBranch },
  { to: "/risk", label: "Risk Analysis", icon: Activity },
  { to: "/response", label: "Incident Response", icon: Siren },
  { to: "/agents", label: "AI Agents", icon: Bot },
  { to: "/forensics", label: "Forensics", icon: FileSearch },
  { to: "/copilot", label: "Security Copilot", icon: Sparkles },
  { to: "/predictive", label: "Predictive", icon: Activity },
  { to: "/demo", label: "Demo Mode", icon: Zap },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="dark min-h-screen grid grid-cols-[260px_1fr] text-foreground">
      <aside className="border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl sticky top-0 h-screen flex flex-col">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
          <div className="relative">
            <div className="size-9 rounded-lg bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--violet)] glow grid place-items-center">
              <ShieldAlert className="size-5 text-background" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[color:var(--success)] animate-pulse" />
          </div>
          <div>
            <div className="font-display text-[15px] font-bold tracking-wider">SENTINEL<span className="text-gradient">X</span></div>
            <div className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">AI Defense Grid</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-[color:var(--primary)] glow"
                  />
                )}
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border text-[11px] text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5"><Circle className="size-2 fill-[color:var(--success)] text-[color:var(--success)]" /> All systems online</div>
          <div className="font-mono">v4.2.0 · Q-Ready</div>
        </div>
      </aside>
      <main className="min-w-0">
        <Topbar />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function Topbar() {
  return (
    <header className="h-14 px-6 border-b border-border/60 flex items-center justify-between bg-background/40 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
        <span className="size-2 rounded-full bg-[color:var(--success)] animate-pulse" />
        <span>LIVE · {new Date().toUTCString().slice(17, 25)} UTC</span>
        <span className="text-border">|</span>
        <span>THREAT LEVEL: <span className="text-[color:var(--warning)] font-semibold">ELEVATED</span></span>
      </div>
      <div className="flex items-center gap-3">
        <input
          placeholder="Search threats, IPs, assets…"
          className="h-8 w-72 rounded-md bg-input/60 border border-border px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--primary)]"
        />
        <div className="size-8 rounded-full bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--violet)] grid place-items-center text-xs font-bold text-background">SX</div>
      </div>
    </header>
  );
}
