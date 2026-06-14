import { createFileRoute } from "@tanstack/react-router";
import { Panel, SeverityBadge } from "@/components/sentinel-ui";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/forensics")({
  head: () => ({ meta: [{ title: "Forensics Center · SentinelX AI" }] }),
  component: Forensics,
});

const timeline = [
  { t: "14:02:11", e: "Phishing email delivered to bob@corp.io", sev: "medium" as const },
  { t: "14:04:33", e: "User clicked malicious link", sev: "high" as const },
  { t: "14:04:38", e: "Payload downloaded · invoice.pdf.exe", sev: "high" as const },
  { t: "14:05:01", e: "Process spawned: powershell.exe -enc …", sev: "critical" as const },
  { t: "14:05:14", e: "LSASS memory access detected", sev: "critical" as const },
  { t: "14:06:50", e: "Lateral SMB connection → APP-SRV-02", sev: "critical" as const },
  { t: "14:08:22", e: "Encryption activity on DB-PROD-12", sev: "critical" as const },
  { t: "14:08:24", e: "SentinelX auto-quarantine triggered", sev: "low" as const },
];

const evidence = [
  { name: "invoice.pdf.exe", hash: "a3f1c4d2b912…", size: "2.4 MB", type: "PE32" },
  { name: "memory.dmp", hash: "9d2ee0a44…", size: "8.1 GB", type: "Memory Dump" },
  { name: "network.pcap", hash: "ff1b2c3d4…", size: "412 MB", type: "Packet Capture" },
  { name: "syslog.json", hash: "4422aabb…", size: "78 MB", type: "Log Archive" },
];

function Forensics() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Forensics Center</h1>
          <p className="text-sm text-muted-foreground">Incident INC-2026-0814 · Ransomware (suspected APT29)</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-accent"><Download className="size-4" />Export PDF Report</button>
      </header>

      <Panel title="Attack Timeline">
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
          {timeline.map((e, i) => (
            <div key={i} className="relative py-2.5">
              <div className="absolute -left-[14px] top-3 size-3 rounded-full bg-[color:var(--primary)] glow" />
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">{e.t}</span>
                <SeverityBadge severity={e.sev} />
                <span className="text-sm">{e.e}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Evidence Locker">
          <div className="space-y-2">
            {evidence.map((e) => (
              <div key={e.name} className="flex items-center gap-3 p-2 rounded-md border border-border/40">
                <FileText className="size-4 text-[color:var(--cyan)]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{e.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">SHA256: {e.hash}</div>
                </div>
                <div className="text-xs text-muted-foreground">{e.type}</div>
                <div className="text-xs font-mono">{e.size}</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Root Cause Analysis">
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Initial Vector</div>
              <div>Spearphishing email impersonating finance vendor</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Vulnerability Exploited</div>
              <div>User awareness gap · macro execution allowed</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">TTPs Observed</div>
              <div className="font-mono text-xs text-[color:var(--cyan)]">T1566.001 → T1059.001 → T1003 → T1021.002 → T1486</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Attribution Confidence</div>
              <div className="text-[color:var(--warning)] font-semibold">APT29 (Cozy Bear) · 87% confidence</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
