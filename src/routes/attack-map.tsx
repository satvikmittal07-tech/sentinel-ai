import { createFileRoute } from "@tanstack/react-router";
import { Panel, SeverityBadge } from "@/components/sentinel-ui";
import { useStore, GEO, HQ } from "@/lib/sentinel-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/attack-map")({
  head: () => ({ meta: [{ title: "Live Attack Map · SentinelX AI" }] }),
  component: AttackMap,
});

function AttackMap() {
  const { threats } = useStore();
  const active = threats.slice(0, 12);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl">Live Global Attack Map</h1>
        <p className="text-sm text-muted-foreground">Real-time geolocated threat telemetry · {active.length} live trajectories.</p>
      </header>
      <Panel className="!p-0 overflow-hidden">
        <div className="relative aspect-[2/1] bg-[color:var(--background)] grid-bg">
          {/* simplified world dots */}
          <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full opacity-30">
            {Array.from({ length: 220 }).map((_, i) => {
              const x = (i * 13) % 100, y = ((i * 7) % 45) + 2;
              return <circle key={i} cx={x} cy={y} r="0.2" fill="oklch(0.75 0.18 220)" />;
            })}
          </svg>
          {/* HQ marker */}
          <div className="absolute" style={{ left: `${HQ.x}%`, top: `${HQ.y}%`, transform: "translate(-50%,-50%)" }}>
            <div className="relative size-3">
              <div className="absolute inset-0 rounded-full bg-[color:var(--primary)] animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-[color:var(--primary)] animate-ping-slow" />
            </div>
            <div className="text-[10px] font-mono mt-1 text-[color:var(--primary)] whitespace-nowrap">SOC-HQ</div>
          </div>
          {/* attack lines */}
          <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {active.map((t, idx) => {
              const src = GEO[t.country] ?? { x: 50, y: 25 };
              const color = t.severity === "critical" ? "oklch(0.65 0.26 20)" : t.severity === "high" ? "oklch(0.82 0.18 75)" : "oklch(0.82 0.16 200)";
              const midX = (src.x + HQ.x) / 2;
              const midY = Math.min(src.y, HQ.y) - 10;
              const d = `M${src.x},${src.y} Q${midX},${midY} ${HQ.x},${HQ.y}`;
              return (
                <g key={t.id}>
                  <path d={d} fill="none" stroke={color} strokeWidth="0.2" opacity="0.5" />
                  <motion.circle
                    r="0.5" fill={color}
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 3 + (idx % 3), repeat: Infinity, ease: "linear", delay: idx * 0.2 }}
                    style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
                  />
                </g>
              );
            })}
          </svg>
          {/* source pins */}
          {Object.entries(GEO).map(([country, p]) => (
            <div key={country} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)" }}>
              <div className="size-1.5 rounded-full bg-[color:var(--critical)]" />
              <div className="text-[9px] font-mono text-muted-foreground mt-0.5 whitespace-nowrap">{country}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Active Trajectories">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {active.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-2 rounded-md border border-border/40 text-xs">
              <SeverityBadge severity={t.severity} />
              <span className="font-mono text-muted-foreground">{t.country}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-mono">{t.target}</span>
              <span className="ml-auto text-[color:var(--primary)] font-mono">{t.category}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
