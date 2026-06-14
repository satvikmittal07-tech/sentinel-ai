import { createFileRoute } from "@tanstack/react-router";
import { Panel, SeverityBadge } from "@/components/sentinel-ui";
import { useStore } from "@/lib/sentinel-data";
import { Brain, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/ai-detection")({
  head: () => ({ meta: [{ title: "AI Detection · SentinelX AI" }] }),
  component: AIDetection,
});

const models = [
  { name: "Isolation Forest", type: "Anomaly", acc: 97.2, status: "active" },
  { name: "Autoencoder v3", type: "Anomaly", acc: 96.8, status: "active" },
  { name: "LSTM-Sequencer", type: "Attack Chain", acc: 94.4, status: "active" },
  { name: "Transformer-XL", type: "Attack Chain", acc: 98.1, status: "active" },
  { name: "GraphSAGE", type: "Lateral Movement", acc: 92.7, status: "training" },
  { name: "One-Class SVM", type: "Zero-Day", acc: 89.3, status: "active" },
];

function spark() { return Array.from({ length: 20 }, () => ({ v: 40 + Math.random() * 60 })); }

function AIDetection() {
  const { threats } = useStore();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">AI Threat Detection Center</h1>
        <p className="text-sm text-muted-foreground">6 models actively scoring events · ensemble confidence shown.</p>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {models.map((m) => (
          <Panel key={m.name} className="!p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[color:var(--primary)]/15 grid place-items-center text-[color:var(--primary)]">
                <Brain className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{m.name}</div>
                <div className="text-[11px] text-muted-foreground">{m.type}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono ${m.status === "active" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"}`}>{m.status}</span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Accuracy</div>
                <div className="font-display text-xl font-bold text-[color:var(--cyan)]">{m.acc}%</div>
              </div>
              <div className="w-24 h-10">
                <ResponsiveContainer><LineChart data={spark()}><Line type="monotone" dataKey="v" stroke="oklch(0.82 0.16 200)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Live AI Detections" subtitle="Each row is an explainable threat decision">
        <div className="space-y-2">
          {threats.slice(0, 10).map((t) => (
            <div key={t.id} className="grid grid-cols-12 gap-3 items-center py-2 border-b border-border/40 text-xs">
              <div className="col-span-1"><SeverityBadge severity={t.severity} /></div>
              <div className="col-span-4 truncate">{t.title}</div>
              <div className="col-span-2 font-mono text-[color:var(--cyan)]">{t.mitre}</div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--violet)]" style={{ width: `${t.confidence}%` }} /></div>
                  <span className="font-mono text-[10px]">{t.confidence}%</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-[color:var(--warning)]"><TrendingUp className="size-3" /><span className="font-mono">Score {t.score}</span></div>
              <div className="col-span-1 text-right text-muted-foreground capitalize">{t.status}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
