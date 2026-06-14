import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

export const Route = createFileRoute("/predictive")({
  head: () => ({ meta: [{ title: "Predictive Threats · SentinelX AI" }] }),
  component: Predictive,
});

const risks = [
  { name: "Account Compromise", value: 87, color: "oklch(0.65 0.26 20)" },
  { name: "Insider Threat", value: 42, color: "oklch(0.82 0.18 75)" },
  { name: "Ransomware Probability", value: 68, color: "oklch(0.7 0.22 295)" },
  { name: "Data Exfiltration", value: 54, color: "oklch(0.82 0.16 200)" },
];

function Predictive() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">Predictive Threat Intelligence</h1>
        <p className="text-sm text-muted-foreground">Forward-looking probabilities · behavioral baselines · graph-based attack path forecasting</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {risks.map((r) => (
          <Panel key={r.name} className="!p-4 relative">
            <div className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-1">{r.name}</div>
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "v", value: r.value, fill: r.color }]} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "oklch(0.25 0.04 265)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-x-0 top-[60%] text-center">
              <div className="font-display text-3xl font-bold" style={{ color: r.color }}>{r.value}<span className="text-base">%</span></div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Next 24h</div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Predicted Attack Path" subtitle="GNN-forecasted attacker progression">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          {["Phish bob@corp.io", "WS-MKT-08", "APP-SRV-02", "AD-CTRL", "DB-FIN", "CLOUD-S3"].map((n, i, arr) => (
            <div key={n} className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg border border-border bg-card font-mono text-xs">{n}</div>
              {i < arr.length - 1 && <span className="text-[color:var(--critical)]">→</span>}
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">Predicted dwell time before encryption: <span className="text-[color:var(--warning)] font-mono">~38 minutes</span> · Recommended pre-emptive block at AD-CTRL</div>
      </Panel>

      <Panel title="Zero-Day Anomalies" subtitle="Behavioral deviations with no known signature">
        {[
          { name: "Outbound DNS volume from EP-DEV-22", dev: "+6.2σ", note: "Possible DNS tunneling" },
          { name: "OAuth token churn on user.alice", dev: "+4.1σ", note: "Token grants spiking" },
          { name: "Unusual binary on FW-EDGE", dev: "novel", note: "No signature match · sandboxing" },
        ].map((a) => (
          <div key={a.name} className="flex items-center justify-between py-2 border-b border-border/40 text-sm">
            <div>
              <div>{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.note}</div>
            </div>
            <div className="font-mono text-[color:var(--warning)]">{a.dev}</div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
