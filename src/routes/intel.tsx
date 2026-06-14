import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";

export const Route = createFileRoute("/intel")({
  head: () => ({ meta: [{ title: "Threat Intelligence · SentinelX AI" }] }),
  component: Intel,
});

const TACTICS = [
  "Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion",
  "Credential Access", "Discovery", "Lateral Movement", "Collection", "Exfiltration", "Impact",
];

const techniques: Record<string, { id: string; name: string; hits: number }[]> = {};
TACTICS.forEach((t) => {
  techniques[t] = Array.from({ length: 4 + Math.floor(Math.random() * 4) }, (_, i) => ({
    id: `T${1000 + Math.floor(Math.random() * 600)}`,
    name: ["Spearphishing", "Valid Accounts", "PowerShell", "WMI", "Scheduled Task", "LSASS Dump", "Pass-the-Hash", "RDP", "Data Staged", "Web Service", "Encryption"][i % 11],
    hits: Math.floor(Math.random() * 60),
  }));
});

const iocs = [
  { type: "IP", value: "185.220.101.42", source: "AbuseIPDB", risk: 96 },
  { type: "Hash", value: "a3f1c…b912", source: "VirusTotal", risk: 99 },
  { type: "Domain", value: "evil-c2-server.cn", source: "OpenCTI", risk: 92 },
  { type: "IP", value: "45.155.205.18", source: "Internal", risk: 88 },
  { type: "Hash", value: "9d2ee…0a44", source: "VirusTotal", risk: 84 },
];

const actors = [
  { name: "APT29 (Cozy Bear)", origin: "RU", campaigns: 14, target: "Government" },
  { name: "Lazarus Group", origin: "KP", campaigns: 23, target: "Finance" },
  { name: "FIN7", origin: "—", campaigns: 11, target: "Retail" },
  { name: "Volt Typhoon", origin: "CN", campaigns: 7, target: "Infrastructure" },
];

function Intel() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">Threat Intelligence</h1>
        <p className="text-sm text-muted-foreground">MITRE ATT&CK enrichment · IOC database · threat actor profiles</p>
      </header>

      <Panel title="MITRE ATT&CK Matrix" subtitle="Heatmap of observed techniques">
        <div className="overflow-x-auto">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${TACTICS.length}, minmax(120px, 1fr))` }}>
            {TACTICS.map((t) => (
              <div key={t} className="text-[10px] uppercase tracking-wider text-muted-foreground p-1 font-mono">{t}</div>
            ))}
            {TACTICS.map((t) => (
              <div key={t + "-col"} className="space-y-1">
                {techniques[t].map((tech) => {
                  const intensity = Math.min(1, tech.hits / 50);
                  return (
                    <div
                      key={tech.id}
                      className="rounded px-2 py-1.5 text-[10px] border border-border/40"
                      style={{ background: `color-mix(in oklab, var(--critical) ${intensity * 60}%, transparent)` }}
                      title={`${tech.id} · ${tech.hits} hits`}
                    >
                      <div className="font-mono text-[9px] text-[color:var(--cyan)]">{tech.id}</div>
                      <div className="truncate">{tech.name}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="IOC Database" subtitle="Indicators of Compromise">
          <table className="w-full text-xs">
            <thead><tr className="text-left text-muted-foreground text-[10px] uppercase border-b border-border"><th className="py-2">Type</th><th>Value</th><th>Source</th><th className="text-right">Risk</th></tr></thead>
            <tbody>
              {iocs.map((i) => (
                <tr key={i.value} className="border-b border-border/40">
                  <td className="py-2"><span className="px-1.5 py-0.5 rounded bg-accent/40 font-mono text-[10px]">{i.type}</span></td>
                  <td className="font-mono text-[color:var(--cyan)]">{i.value}</td>
                  <td className="text-muted-foreground">{i.source}</td>
                  <td className="text-right font-mono font-bold text-[color:var(--critical)]">{i.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Threat Actors" subtitle="Active campaigns">
          {actors.map((a) => (
            <div key={a.name} className="flex items-center justify-between py-2 border-b border-border/40 text-xs">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-[10px] text-muted-foreground">Origin {a.origin} · Targets {a.target}</div>
              </div>
              <div className="font-mono text-[color:var(--warning)]">{a.campaigns} campaigns</div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
