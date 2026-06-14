// Mock data + real-time simulation for SentinelX AI
import { useEffect, useState } from "react";

export type Severity = "critical" | "high" | "medium" | "low";

export interface ThreatEvent {
  id: string;
  ts: number;
  severity: Severity;
  title: string;
  source: string;
  target: string;
  category: string;
  score: number;
  mitre: string;
  confidence: number;
  status: "active" | "mitigated" | "investigating";
  country: string;
}

const COUNTRIES = ["Russia", "China", "North Korea", "Iran", "Brazil", "USA", "Germany", "India"];
const TITLES = [
  "Ransomware encryption activity",
  "Suspicious PowerShell execution",
  "Brute-force login attempt",
  "Lateral movement via SMB",
  "Data exfiltration to unknown host",
  "Privilege escalation detected",
  "Phishing payload delivered",
  "DDoS volumetric flood",
  "Anomalous OAuth grant",
  "C2 beacon to known malicious IP",
  "Impossible travel login",
  "Credential dumping via LSASS",
];
const CATEGORIES = ["Ransomware", "Phishing", "DDoS", "Insider", "Malware", "Credential"];
const MITRE = ["T1486", "T1059.001", "T1110", "T1021", "T1041", "T1068", "T1566", "T1499", "T1078", "T1071"];
const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];
const ASSETS = ["WEB-01", "DB-PROD-12", "AD-CTRL", "EP-MKT-08", "CLOUD-S3", "API-GW", "FW-EDGE", "SRV-FIN-02"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rid() { return Math.random().toString(36).slice(2, 10); }

export function makeThreat(): ThreatEvent {
  const sev = rand(SEVERITIES);
  const score =
    sev === "critical" ? 82 + Math.floor(Math.random() * 18) :
    sev === "high" ? 61 + Math.floor(Math.random() * 20) :
    sev === "medium" ? 31 + Math.floor(Math.random() * 30) :
    5 + Math.floor(Math.random() * 25);
  return {
    id: rid(),
    ts: Date.now(),
    severity: sev,
    title: rand(TITLES),
    source: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    target: rand(ASSETS),
    category: rand(CATEGORIES),
    score,
    mitre: rand(MITRE),
    confidence: 60 + Math.floor(Math.random() * 40),
    status: Math.random() > 0.7 ? "mitigated" : Math.random() > 0.5 ? "investigating" : "active",
    country: rand(COUNTRIES),
  };
}

const initial: ThreatEvent[] = Array.from({ length: 24 }, makeThreat).sort((a, b) => b.ts - a.ts);

// Simple global store
type Listener = () => void;
const listeners = new Set<Listener>();
let _threats = initial;
let _kpi = {
  total: 1284,
  critical: 27,
  blocked: 1198,
  responseMs: 412,
  accuracy: 98.7,
};

export const store = {
  get threats() { return _threats; },
  get kpi() { return _kpi; },
  push(t: ThreatEvent) {
    _threats = [t, ..._threats].slice(0, 80);
    _kpi = {
      ..._kpi,
      total: _kpi.total + 1,
      critical: _kpi.critical + (t.severity === "critical" ? 1 : 0),
      blocked: _kpi.blocked + (t.status === "mitigated" ? 1 : 0),
      responseMs: Math.max(180, _kpi.responseMs + (Math.random() * 40 - 20)),
      accuracy: Math.min(99.9, _kpi.accuracy + (Math.random() * 0.1 - 0.05)),
    };
    listeners.forEach((l) => l());
  },
  subscribe(l: Listener) { listeners.add(l); return () => listeners.delete(l); },
};

// Heartbeat
if (typeof window !== "undefined") {
  setInterval(() => store.push(makeThreat()), 3500);
}

export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => store.subscribe(() => setTick((t) => t + 1)), []);
  return { threats: store.threats, kpi: store.kpi };
}

export function useCountUp(target: number, duration = 800) {
  const [v, setV] = useState(target);
  useEffect(() => {
    const start = v;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(start + (target - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return v;
}

export const severityColor: Record<Severity, string> = {
  critical: "text-[color:var(--critical)] border-[color:var(--critical)]/40 bg-[color:var(--critical)]/10",
  high: "text-[color:var(--warning)] border-[color:var(--warning)]/40 bg-[color:var(--warning)]/10",
  medium: "text-[color:var(--cyan)] border-[color:var(--cyan)]/30 bg-[color:var(--cyan)]/10",
  low: "text-[color:var(--success)] border-[color:var(--success)]/30 bg-[color:var(--success)]/10",
};

// Geo coords for attack map (approx %)
export const GEO: Record<string, { x: number; y: number }> = {
  Russia: { x: 62, y: 26 },
  China: { x: 75, y: 40 },
  "North Korea": { x: 79, y: 38 },
  Iran: { x: 60, y: 44 },
  Brazil: { x: 33, y: 70 },
  USA: { x: 20, y: 40 },
  Germany: { x: 50, y: 32 },
  India: { x: 68, y: 50 },
};
export const HQ = { x: 22, y: 42 }; // target (USA)

// Charts time-series
export function buildSeries(points = 24) {
  return Array.from({ length: points }, (_, i) => ({
    t: `${String(i).padStart(2, "0")}:00`,
    threats: Math.floor(20 + Math.random() * 80 + Math.sin(i / 3) * 20),
    blocked: Math.floor(15 + Math.random() * 70 + Math.sin(i / 3) * 18),
  }));
}
