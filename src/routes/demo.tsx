import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";
import { Bug, Mail, Waves, UserX, Play, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { store, makeThreat } from "@/lib/sentinel-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/demo")({
  head: () => ({ meta: [{ title: "Demo Mode · SentinelX AI" }] }),
  component: Demo,
});

const scenarios = [
  { id: "ransomware", name: "Ransomware Attack", icon: Bug, desc: "Phishing → privilege escalation → encryption", color: "var(--critical)" },
  { id: "phishing", name: "Phishing Campaign", icon: Mail, desc: "Mass credential harvesting attempt", color: "var(--warning)" },
  { id: "ddos", name: "DDoS Volumetric", icon: Waves, desc: "300 Gbps flood targeting API gateway", color: "var(--cyan)" },
  { id: "insider", name: "Insider Threat", icon: UserX, desc: "Privileged user exfiltrating sensitive data", color: "var(--violet)" },
];

const phases = [
  "Generating synthetic telemetry",
  "AI ensemble scoring events",
  "Threat intel enrichment",
  "Digital twin simulation",
  "Autonomous mitigation",
  "Recovery & forensics",
];

function Demo() {
  const [running, setRunning] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const launch = (id: string) => {
    setRunning(id);
    setStep(0);
    // burst threats
    for (let i = 0; i < 8; i++) setTimeout(() => store.push(makeThreat()), i * 200);
    phases.forEach((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * 1100));
    setTimeout(() => setRunning(null), phases.length * 1100 + 1500);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">Demo Mode</h1>
        <p className="text-sm text-muted-foreground">Launch a realistic attack simulation. Perfect for live demonstrations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((s) => (
          <Panel key={s.id} className="!p-5">
            <div className="size-12 rounded-xl grid place-items-center mb-3" style={{ background: `color-mix(in oklab, ${s.color} 20%, transparent)`, color: s.color }}>
              <s.icon className="size-6" />
            </div>
            <div className="font-display font-bold">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1 mb-4">{s.desc}</div>
            <button
              disabled={!!running}
              onClick={() => launch(s.id)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--violet)] text-background px-3 py-2 text-xs font-semibold disabled:opacity-50"
            >
              <Play className="size-3.5" />Launch
            </button>
          </Panel>
        ))}
      </div>

      {running && (
        <Panel title={`Simulating: ${scenarios.find(s => s.id === running)?.name}`} subtitle="Watch the autonomous pipeline in action">
          <div className="space-y-3">
            {phases.map((p, i) => {
              const done = step > i;
              const active = step === i + 1 - 0; // current
              const isActive = step === i;
              return (
                <motion.div key={p} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${done ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/5" : isActive ? "border-[color:var(--primary)]/60 bg-[color:var(--primary)]/5 glow" : "border-border bg-card/50"}`}>
                  {done ? <CheckCircle2 className="size-5 text-[color:var(--success)]" /> : isActive ? <Loader2 className="size-5 text-[color:var(--primary)] animate-spin" /> : <span className="size-5 rounded-full border border-border" />}
                  <div className="flex-1 text-sm">{p}</div>
                  <span className="text-xs font-mono text-muted-foreground">Phase {i + 1}/{phases.length}</span>
                </motion.div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel title="What will happen" subtitle="The demo pipeline">
        <ol className="text-sm space-y-2 list-decimal pl-5 text-muted-foreground">
          <li>Synthetic events are injected into the live threat stream (visible on Executive Dashboard).</li>
          <li>AI ensemble (Isolation Forest + LSTM + GNN) scores each event in real time.</li>
          <li>Threat Intel enriches IPs/hashes via MITRE ATT&CK, VirusTotal, AbuseIPDB.</li>
          <li>Digital Twin simulates blast radius and recommends mitigations.</li>
          <li>SOAR Response Agent executes the playbook autonomously.</li>
          <li>Forensics Agent collects evidence and generates a root-cause report.</li>
        </ol>
      </Panel>
    </div>
  );
}
