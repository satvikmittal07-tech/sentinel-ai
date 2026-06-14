import { createFileRoute } from "@tanstack/react-router";
import { Panel, SeverityBadge } from "@/components/sentinel-ui";
import { useStore } from "@/lib/sentinel-data";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/threats")({
  head: () => ({ meta: [{ title: "Threat Monitor · SentinelX AI" }] }),
  component: ThreatMonitor,
});

function ThreatMonitor() {
  const { threats } = useStore();
  const [q, setQ] = useState("");
  const filtered = threats.filter(
    (t) => !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.source.includes(q) || t.target.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Threat Monitor</h1>
          <p className="text-sm text-muted-foreground">Unified stream of all detected threats across the grid.</p>
        </div>
        <div className="relative">
          <Search className="size-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" className="h-9 w-64 pl-8 rounded-md bg-input/60 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--primary)]" />
        </div>
      </header>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Severity</th>
                <th className="py-2 pr-3">Threat</th>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Target</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">MITRE</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 40).map((t) => (
                <tr key={t.id} className="border-b border-border/40 hover:bg-accent/20">
                  <td className="py-2 pr-3"><SeverityBadge severity={t.severity} /></td>
                  <td className="py-2 pr-3">{t.title}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{t.source}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{t.target}</td>
                  <td className="py-2 pr-3 text-xs">{t.category}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-[color:var(--cyan)]">{t.mitre}</td>
                  <td className="py-2 pr-3 font-mono font-bold" style={{ color: t.score > 80 ? "var(--critical)" : t.score > 60 ? "var(--warning)" : "var(--cyan)" }}>{t.score}</td>
                  <td className="py-2 pr-3 text-xs capitalize text-muted-foreground">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
