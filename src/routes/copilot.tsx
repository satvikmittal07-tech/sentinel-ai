import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/copilot")({
  head: () => ({ meta: [{ title: "Security Copilot · SentinelX AI" }] }),
  component: Copilot,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Why was DB-PROD-12 isolated?",
  "Summarize today's critical threats",
  "Generate ransomware incident report",
  "What MITRE tactics are most active right now?",
];

function replyFor(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("db-prod-12") || l.includes("isolated")) {
    return `**DB-PROD-12 was auto-isolated at 14:05:14 UTC.**

**Reasoning chain:**
1. Anomaly Detection (Isolation Forest) flagged unusual encryption I/O patterns — confidence 96%.
2. LSTM-Sequencer matched a ransomware kill-chain signature: \`Login → PrivEsc → SMB → Encrypt\`.
3. Threat Intel correlated egress traffic with **185.220.101.42** (known APT29 C2).
4. Risk Engine scored the event at **92/100 (CRITICAL)**.
5. Digital Twin simulation predicted 47-minute downtime and 12.4 TB data risk if unmitigated.

**Action taken:** Network segment quarantine + C2 block + pre-encryption snapshot.
**Status:** Contained. Forensic collection in progress.`;
  }
  if (l.includes("today") || l.includes("summar")) {
    return `**Daily Brief — past 24h:**

- **1,284** total events ingested · **27 critical**, **84 high**
- **1,198 attacks auto-mitigated** (93.2%)
- Top attack categories: Malware (312), Phishing (248), DDoS (188)
- Most active origin: **Russia** (RU) followed by **China** (CN)
- 1 critical incident escalated to humans: **INC-2026-0814** (ransomware, contained)

AI accuracy this period: **98.7%** · False positive rate: 0.4%`;
  }
  if (l.includes("ransomware") || l.includes("report")) {
    return `**Incident Report — INC-2026-0814**

**Classification:** Ransomware (APT29 attribution, 87% conf.)
**Kill chain:** Phishing → Macro Exec → LSASS Dump → SMB Lateral → Encrypt
**Affected:** WS-FIN-03 (patient zero), APP-SRV-02, DB-PROD-12
**Containment:** 8.2s from first signal
**Recovery ETA:** 2.1 hours from clean snapshot
**Recommendations:**
- Force MFA on all finance segment accounts
- Block egress to the AS associated with 185.220.101.42
- Roll out updated phishing simulation campaign`;
  }
  if (l.includes("mitre") || l.includes("tactic")) {
    return `**Most-active MITRE tactics (last 1h):**

1. \`TA0001 Initial Access\` — 38 events (mostly T1566 Phishing)
2. \`TA0002 Execution\` — 27 events (T1059.001 PowerShell)
3. \`TA0006 Credential Access\` — 19 events (T1003 LSASS)
4. \`TA0008 Lateral Movement\` — 11 events (T1021 SMB)

Recommend tightening EDR PowerShell logging and rotating service-account credentials.`;
  }
  return `I've analyzed the recent telemetry. Based on the current threat landscape, I recommend reviewing the **Incident Response Center** for active playbooks and the **Digital Twin** for impact prediction. Ask me about specific assets, incidents, or MITRE techniques for deeper analysis.`;
}

function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "I'm your Security Copilot. Ask me about active incidents, threat intel, MITRE tactics, or request a forensic summary." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { role: "assistant", content: replyFor(text) }]), 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--violet)] grid place-items-center glow"><Sparkles className="size-5 text-background" /></div>
        <div>
          <h1 className="font-display text-2xl">Security Copilot</h1>
          <p className="text-sm text-muted-foreground">Conversational SOC analyst · context-aware · explainable</p>
        </div>
      </header>

      <Panel className="!p-0">
        <div className="p-5 space-y-4 min-h-[420px] max-h-[60vh] overflow-y-auto">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`${m.role === "user" ? "bg-[color:var(--primary)]/15 border border-[color:var(--primary)]/40" : "bg-accent/30 border border-border"} rounded-xl px-4 py-3 max-w-[80%] text-sm whitespace-pre-wrap`}>
                {m.content.split("\n").map((line, j) => {
                  if (line.startsWith("**") && line.endsWith("**")) return <div key={j} className="font-bold text-[color:var(--cyan)] my-1">{line.slice(2, -2)}</div>;
                  if (line.startsWith("- ") || line.match(/^\d+\./)) return <div key={j} className="ml-3 text-muted-foreground">{line}</div>;
                  return <div key={j}>{line}</div>;
                })}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-border p-3 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {SUGGESTED.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition">{s}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about an incident, IP, asset, or MITRE technique…" className="flex-1 h-10 rounded-md bg-input/60 border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[color:var(--primary)]" />
            <button type="submit" className="h-10 px-4 rounded-md bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--violet)] text-background font-semibold flex items-center gap-2"><Send className="size-4" />Send</button>
          </form>
        </div>
      </Panel>
    </div>
  );
}
