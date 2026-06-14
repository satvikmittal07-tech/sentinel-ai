import { createFileRoute } from "@tanstack/react-router";
import { Panel, SeverityBadge } from "@/components/sentinel-ui";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

export const Route = createFileRoute("/response")({
  head: () => ({ meta: [{ title: "Incident Response · SentinelX AI" }] }),
  component: Response,
});

const playbook = [
  { t: "00:00", e: "Threat Detected", note: "Anomalous encryption activity on DB-PROD-12", done: true },
  { t: "00:01", e: "Risk Scored", note: "Score 92 · CRITICAL · MITRE T1486", done: true },
  { t: "00:03", e: "Digital Twin Simulation", note: "Predicted 47min downtime · 4 nodes affected", done: true },
  { t: "00:05", e: "Host Isolated", note: "DB-PROD-12 network segment quarantined", done: true },
  { t: "00:08", e: "C2 Blocked", note: "Egress to 185.220.101.42 blocked at FW-EDGE", done: true },
  { t: "00:12", e: "Snapshot Captured", note: "Pre-encryption snapshot saved to cold storage", done: false, active: true },
  { t: "00:15", e: "Forensic Collection", note: "Memory dump + process tree in progress", done: false },
  { t: "00:30", e: "Recovery", note: "Restore from snapshot · validate integrity", done: false },
];

function Response() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Incident Response Center</h1>
          <p className="text-sm text-muted-foreground">Live SOAR execution · INC-2026-0814</p>
        </div>
        <SeverityBadge severity="critical" />
      </header>
      <Panel title="Active Playbook · Ransomware Response">
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
          {playbook.map((s, i) => (
            <div key={i} className="relative pb-5">
              <div className="absolute -left-[18px] top-1">
                {s.done ? <CheckCircle2 className="size-4 text-[color:var(--success)]" />
                  : s.active ? <Loader2 className="size-4 text-[color:var(--primary)] animate-spin" />
                  : <Circle className="size-4 text-muted-foreground" />}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">{s.t}</span>
                <span className={`text-sm font-semibold ${s.active ? "text-[color:var(--primary)]" : ""}`}>{s.e}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.note}</div>
              {s.active && <div className="mt-2 h-1 rounded bg-muted overflow-hidden"><div className="h-full w-1/2 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--violet)] animate-pulse" /></div>}
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel title="Mean Time to Detect"><div className="font-display text-3xl text-[color:var(--cyan)]">1.4s</div></Panel>
        <Panel title="Mean Time to Respond"><div className="font-display text-3xl text-[color:var(--primary)]">8.2s</div></Panel>
        <Panel title="Auto-Mitigation Rate"><div className="font-display text-3xl text-[color:var(--success)]">93.2%</div></Panel>
      </div>
    </div>
  );
}
