import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · SentinelX AI" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Tenant configuration · integrations · compliance</p>
      </header>
      <Panel title="Organization">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field l="Tenant" v="acme-corp" />
          <Field l="Region" v="us-east-1" />
          <Field l="License Tier" v="Enterprise" />
          <Field l="Operators" v="24" />
        </div>
      </Panel>
      <Panel title="Integrations">
        {["Splunk", "Wazuh", "Suricata", "AWS CloudTrail", "Azure Sentinel", "Okta", "CrowdStrike", "VirusTotal", "MITRE ATT&CK"].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 text-sm">
            <span>{i}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[color:var(--success)]/15 text-[color:var(--success)]">Connected</span>
          </div>
        ))}
      </Panel>
      <Panel title="Compliance">
        <div className="flex flex-wrap gap-2">
          {["SOC 2", "ISO 27001", "HIPAA", "PCI-DSS", "GDPR", "FedRAMP"].map((c) => (
            <span key={c} className="px-3 py-1 rounded-full border border-[color:var(--primary)]/40 text-[color:var(--primary)] text-xs font-mono">{c}</span>
          ))}
        </div>
      </Panel>
      <Panel title="Quantum-Ready Cryptography">
        <div className="text-sm text-muted-foreground">Post-quantum algorithms enabled: <span className="text-[color:var(--cyan)] font-mono">CRYSTALS-Kyber</span> · <span className="text-[color:var(--cyan)] font-mono">CRYSTALS-Dilithium</span></div>
      </Panel>
    </div>
  );
}

function Field({ l, v }: { l: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
      <div className="font-mono">{v}</div>
    </div>
  );
}
