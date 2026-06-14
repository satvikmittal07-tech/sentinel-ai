import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, ShieldAlert, Zap, Brain, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from "recharts";
import { useMemo } from "react";
import { Panel, Stat, SeverityBadge } from "@/components/sentinel-ui";
import { useStore, buildSeries } from "@/lib/sentinel-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard · SentinelX AI" },
      { name: "description", content: "Real-time threat overview, AI accuracy, and live SOC telemetry." },
    ],
  }),
  component: ExecDashboard,
});

const CATS = [
  { name: "Malware", value: 312, color: "var(--critical)" },
  { name: "Phishing", value: 248, color: "var(--warning)" },
  { name: "DDoS", value: 188, color: "var(--cyan)" },
  { name: "Insider", value: 96, color: "var(--violet)" },
  { name: "Recon", value: 154, color: "var(--primary)" },
];

function ExecDashboard() {
  const { threats, kpi } = useStore();
  const series = useMemo(() => buildSeries(24), []);
  const sourceData = useMemo(() => {
    const map = new Map<string, number>();
    threats.forEach((t) => map.set(t.country, (map.get(t.country) || 0) + 1));
    return [...map.entries()].map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [threats]);

  return (
    <div className="space-y-6">
      <Hero />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat label="Threats Today" value={kpi.total} icon={<Activity className="size-5" />} accent="primary" trend="↑ 12.4% vs yesterday" />
        <Stat label="Critical Alerts" value={kpi.critical} icon={<ShieldAlert className="size-5" />} accent="critical" trend="Auto-isolated 24" />
        <Stat label="Blocked Attacks" value={kpi.blocked} icon={<ShieldCheck className="size-5" />} accent="success" trend="93.2% auto-mitigated" />
        <Stat label="Avg Response" value={Math.round(kpi.responseMs)} suffix="ms" icon={<Zap className="size-5" />} accent="warning" trend="P95 · 980ms" />
        <Stat label="AI Accuracy" value={kpi.accuracy} suffix="%" icon={<Brain className="size-5" />} accent="violet" trend="False-pos 0.4%" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel title="Threats Over Time" subtitle="Last 24 hours · detected vs blocked" className="xl:col-span-2 min-h-[320px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.75 0.18 220)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.75 0.18 220)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.22 295)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.7 0.22 295)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.3 0.05 260 / 0.3)" strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke="oklch(0.6 0.03 250)" fontSize={10} />
              <YAxis stroke="oklch(0.6 0.03 250)" fontSize={10} />
              <Tooltip contentStyle={{ background: "oklch(0.15 0.04 260)", border: "1px solid oklch(0.32 0.05 260 / 0.6)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="threats" stroke="oklch(0.75 0.18 220)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="blocked" stroke="oklch(0.7 0.22 295)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Live Threat Feed" subtitle="Auto-updating · real-time" className="min-h-[320px]">
          <div className="space-y-2 max-h-[280px] overflow-hidden relative">
            <AnimatePresence initial={false}>
              {threats.slice(0, 8).map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/30 border border-transparent hover:border-border"
                >
                  <SeverityBadge severity={t.severity} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs truncate">{t.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">{t.source} → {t.target}</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[color:var(--primary)]">{t.score}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Attack Categories" subtitle="Distribution by type">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={CATS} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {CATS.map((c) => <Cell key={c.name} fill={c.color.startsWith("var") ? `oklch(${c.color})` : c.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.15 0.04 260)", border: "1px solid oklch(0.32 0.05 260 / 0.6)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {CATS.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: `oklch(${c.color.replace("var(--", "").replace(")", "") === "critical" ? "0.65 0.26 20" : ""})` }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-mono">{c.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Attack Sources" subtitle="By origin country" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sourceData} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke="oklch(0.3 0.05 260 / 0.3)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.6 0.03 250)" fontSize={10} />
              <YAxis type="category" dataKey="country" stroke="oklch(0.6 0.03 250)" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: "oklch(0.15 0.04 260)", border: "1px solid oklch(0.32 0.05 260 / 0.6)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "oklch(0.3 0.05 260 / 0.2)" }} />
              <Bar dataKey="count" fill="oklch(0.75 0.18 220)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl glass p-6 grid-bg">
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-[color:var(--primary)]/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 size-72 rounded-full bg-[color:var(--violet)]/15 blur-3xl" />
      <div className="relative flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[color:var(--cyan)] uppercase font-mono mb-2 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[color:var(--cyan)] animate-pulse" /> Autonomous Defense · Active
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Welcome back, <span className="text-gradient">Operator</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            The grid is secure. 4 AI agents are actively hunting threats. Digital twin synchronized 12s ago.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">System Health</div>
            <div className="font-display text-2xl text-[color:var(--success)] font-bold">99.97%</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">MTTD</div>
            <div className="font-display text-2xl text-[color:var(--cyan)] font-bold">1.4s</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 justify-end"><TrendingUp className="size-3" />Posture</div>
            <div className="font-display text-2xl text-[color:var(--primary)] font-bold">A+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
