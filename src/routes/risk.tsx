import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { buildSeries } from "@/lib/sentinel-data";
import { useMemo } from "react";

export const Route = createFileRoute("/risk")({
  head: () => ({ meta: [{ title: "Risk Analysis · SentinelX AI" }] }),
  component: Risk,
});

function Risk() {
  const score = 76;
  const data = [{ name: "risk", value: score, fill: score > 80 ? "oklch(0.65 0.26 20)" : score > 60 ? "oklch(0.82 0.18 75)" : "oklch(0.78 0.18 155)" }];
  const series = useMemo(() => buildSeries(20), []);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">Dynamic Risk Scoring</h1>
        <p className="text-sm text-muted-foreground">Composite enterprise risk · severity + asset value + intel + business impact + AI confidence</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Composite Risk Score" className="lg:col-span-1 relative">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "oklch(0.25 0.04 265)" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center mt-6">
              <div className="font-display text-5xl font-bold text-gradient">{score}</div>
              <div className="text-xs text-[color:var(--warning)] uppercase tracking-widest mt-1">High Risk</div>
            </div>
          </div>
        </Panel>
        <Panel title="Risk Breakdown" className="lg:col-span-2">
          {[
            { l: "Threat Severity", v: 84, c: "var(--critical)" },
            { l: "Asset Value", v: 92, c: "var(--warning)" },
            { l: "Intel Confidence", v: 78, c: "var(--cyan)" },
            { l: "Business Impact", v: 71, c: "var(--violet)" },
            { l: "AI Confidence", v: 96, c: "var(--primary)" },
          ].map((r) => (
            <div key={r.l} className="py-2.5">
              <div className="flex justify-between text-xs mb-1.5"><span>{r.l}</span><span className="font-mono" style={{ color: r.c }}>{r.v}</span></div>
              <div className="h-2 rounded bg-muted overflow-hidden"><div className="h-full" style={{ width: `${r.v}%`, background: r.c }} /></div>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Risk Trend" subtitle="Composite score over time">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={series.map((s, i) => ({ ...s, risk: 50 + Math.sin(i / 2) * 25 + Math.random() * 8 }))}>
            <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.82 0.18 75)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.82 0.18 75)" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="t" stroke="oklch(0.6 0.03 250)" fontSize={10} />
            <YAxis stroke="oklch(0.6 0.03 250)" fontSize={10} />
            <Tooltip contentStyle={{ background: "oklch(0.15 0.04 260)", border: "1px solid oklch(0.32 0.05 260 / 0.6)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="risk" stroke="oklch(0.82 0.18 75)" fill="url(#rg)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
