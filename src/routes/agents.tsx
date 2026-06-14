import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";
import { Bot, ShieldAlert, Search, Wrench, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/agents")({
  head: () => ({ meta: [{ title: "AI Agents · SentinelX AI" }] }),
  component: Agents,
});

const agents = [
  { name: "Security Analyst", icon: ShieldAlert, status: "Analyzing", task: "Triaging 47 inbound alerts", conf: 94, finding: "Cluster of 12 brute-force events from /16 in RU" },
  { name: "Threat Hunter", icon: Search, status: "Hunting", task: "Sweeping for lateral movement signals", conf: 88, finding: "Suspicious SMB sessions on WS-FIN segment" },
  { name: "Response Agent", icon: Wrench, status: "Executing", task: "Running ransomware playbook on DB-PROD-12", conf: 97, finding: "Host isolated · C2 blocked · snapshot in progress" },
  { name: "Forensics Agent", icon: FileSearch, status: "Collecting", task: "Memory dump + process tree on EP-MKT-08", conf: 91, finding: "Found LSASS injection · linked to APT29 TTPs" },
];

function Agents() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">Multi-Agent AI Security Team</h1>
        <p className="text-sm text-muted-foreground">4 specialized agents collaborating in real time</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((a, i) => (
          <Panel key={a.name} className="!p-5">
            <div className="flex items-start gap-4">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                className="size-12 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--violet)] grid place-items-center glow">
                <a.icon className="size-6 text-background" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold">{a.name}</div>
                    <div className="text-[11px] text-[color:var(--cyan)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[color:var(--cyan)] animate-pulse" />{a.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase">Confidence</div>
                    <div className="font-display text-xl font-bold text-[color:var(--primary)]">{a.conf}%</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">CURRENT TASK</div>
                <div className="text-sm">{a.task}</div>
                <div className="mt-3 text-xs text-muted-foreground">RECENT FINDING</div>
                <div className="text-sm">{a.finding}</div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Panel title="Agent Communication Log">
        {[
          ["Analyst → Hunter", "Anomalous downloads on WS-FIN-03, please investigate"],
          ["Hunter → Analyst", "Confirmed lateral movement signature, escalating"],
          ["Analyst → Response", "Critical incident. Authorize playbook PLB-RW-01"],
          ["Response → Forensics", "Capture pre-quarantine memory state"],
          ["Forensics → Analyst", "IOCs extracted. Cross-referencing with MITRE..."],
        ].map(([a, m], i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-border/40 text-xs">
            <span className="font-mono text-[10px] text-[color:var(--cyan)] w-44 shrink-0">{a}</span>
            <span className="text-muted-foreground">{m}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
