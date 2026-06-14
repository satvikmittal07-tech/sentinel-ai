import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/sentinel-ui";
import { motion } from "framer-motion";
import { useState } from "react";
import { Play, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/digital-twin")({
  head: () => ({ meta: [{ title: "Digital Twin · SentinelX AI" }] }),
  component: DigitalTwin,
});

type Node = { id: string; label: string; x: number; y: number; kind: "user" | "ws" | "srv" | "db" | "cloud" };
const nodes: Node[] = [
  { id: "u1", label: "User-Alice", x: 8, y: 30, kind: "user" },
  { id: "u2", label: "User-Bob", x: 8, y: 60, kind: "user" },
  { id: "w1", label: "WS-MKT-01", x: 25, y: 20, kind: "ws" },
  { id: "w2", label: "WS-MKT-02", x: 25, y: 50, kind: "ws" },
  { id: "w3", label: "WS-FIN-03", x: 25, y: 80, kind: "ws" },
  { id: "s1", label: "APP-SRV-01", x: 50, y: 25, kind: "srv" },
  { id: "s2", label: "APP-SRV-02", x: 50, y: 55, kind: "srv" },
  { id: "s3", label: "AD-CTRL", x: 50, y: 85, kind: "srv" },
  { id: "d1", label: "DB-PROD-12", x: 78, y: 35, kind: "db" },
  { id: "d2", label: "DB-FIN", x: 78, y: 65, kind: "db" },
  { id: "c1", label: "CLOUD-S3", x: 92, y: 20, kind: "cloud" },
];
const edges: [string, string][] = [
  ["u1", "w1"], ["u1", "w2"], ["u2", "w3"],
  ["w1", "s1"], ["w2", "s1"], ["w2", "s2"], ["w3", "s2"], ["w3", "s3"],
  ["s1", "d1"], ["s2", "d1"], ["s2", "d2"], ["s3", "d2"],
  ["s1", "c1"], ["s2", "c1"],
];
const attackPath = ["u2", "w3", "s2", "d2"];

const kindStyle: Record<Node["kind"], { fill: string; ring: string; icon: string }> = {
  user: { fill: "oklch(0.7 0.22 295)", ring: "oklch(0.7 0.22 295 / 0.3)", icon: "U" },
  ws: { fill: "oklch(0.75 0.18 220)", ring: "oklch(0.75 0.18 220 / 0.3)", icon: "W" },
  srv: { fill: "oklch(0.82 0.16 200)", ring: "oklch(0.82 0.16 200 / 0.3)", icon: "S" },
  db: { fill: "oklch(0.82 0.18 75)", ring: "oklch(0.82 0.18 75 / 0.3)", icon: "D" },
  cloud: { fill: "oklch(0.78 0.18 155)", ring: "oklch(0.78 0.18 155 / 0.3)", icon: "C" },
};

function DigitalTwin() {
  const [simulating, setSimulating] = useState(false);
  const pathSet = new Set(attackPath);
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Digital Twin Simulator</h1>
          <p className="text-sm text-muted-foreground">Virtual replica of the production network. Predict impact before responding.</p>
        </div>
        <button onClick={() => setSimulating((s) => !s)} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--violet)] text-background px-4 py-2 text-sm font-semibold glow hover:opacity-90">
          <Play className="size-4" />{simulating ? "Stop Simulation" : "Simulate Attack Path"}
        </button>
      </header>

      <Panel className="!p-0 overflow-hidden">
        <div className="relative aspect-[2/1] grid-bg">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {edges.map(([a, b], i) => {
              const na = nodeMap[a], nb = nodeMap[b];
              const onPath = simulating && pathSet.has(a) && pathSet.has(b) && Math.abs(attackPath.indexOf(a) - attackPath.indexOf(b)) === 1;
              return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={onPath ? "oklch(0.65 0.26 20)" : "oklch(0.4 0.05 260 / 0.5)"} strokeWidth={onPath ? "0.4" : "0.15"} />;
            })}
            {simulating && attackPath.slice(0, -1).map((id, i) => {
              const na = nodeMap[id], nb = nodeMap[attackPath[i + 1]];
              const d = `M${na.x},${na.y} L${nb.x},${nb.y}`;
              return (
                <motion.circle key={i} r="0.8" fill="oklch(0.65 0.26 20)"
                  initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 1.8, ease: "linear" }}
                  style={{ offsetPath: `path("${d}")` } as React.CSSProperties} />
              );
            })}
          </svg>
          {nodes.map((n) => {
            const s = kindStyle[n.kind];
            const compromised = simulating && pathSet.has(n.id);
            return (
              <div key={n.id} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)" }}>
                <div className={`size-8 rounded-lg grid place-items-center text-[11px] font-bold ${compromised ? "animate-pulse-glow" : ""}`}
                  style={{ background: compromised ? "oklch(0.65 0.26 20)" : s.fill, color: "oklch(0.1 0.02 260)", boxShadow: `0 0 18px ${compromised ? "oklch(0.65 0.26 20 / 0.6)" : s.ring}` }}>
                  {s.icon}
                </div>
                <div className="text-[9px] font-mono mt-1 text-center whitespace-nowrap text-muted-foreground">{n.label}</div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: "Expected Downtime", v: simulating ? "47 min" : "—", c: "var(--warning)" },
          { l: "Systems Affected", v: simulating ? "4 nodes" : "—", c: "var(--critical)" },
          { l: "Data at Risk", v: simulating ? "12.4 TB" : "—", c: "var(--critical)" },
          { l: "Recovery Time", v: simulating ? "2.1 hrs" : "—", c: "var(--cyan)" },
        ].map((x) => (
          <Panel key={x.l} className="!p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{x.l}</div>
            <div className="font-display text-2xl mt-2 font-bold" style={{ color: x.c }}>{x.v}</div>
          </Panel>
        ))}
      </div>

      {simulating && (
        <Panel title="Recommended Mitigations" className="border-[color:var(--critical)]/40">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-[color:var(--warning)]" /> Isolate WS-FIN-03 from network segment</li>
            <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-[color:var(--warning)]" /> Revoke User-Bob session tokens</li>
            <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-[color:var(--warning)]" /> Snapshot DB-FIN before encryption spreads</li>
            <li className="flex items-center gap-2"><AlertTriangle className="size-4 text-[color:var(--warning)]" /> Block egress to 185.220.101.42</li>
          </ul>
        </Panel>
      )}
    </div>
  );
}
