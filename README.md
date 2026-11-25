# SentinelX AI

> An autonomous AI-powered cyber defense platform that detects, prioritizes, predicts, and mitigates cyber threats in real time.

SentinelX AI is a hackathon demonstration of a modern security operations center (SOC). It brings threat monitoring, incident workflows, risk views, and interactive attack simulations together in one dashboard.

## Features

- **Executive dashboard** — threat activity, key security metrics, category breakdowns, and an updating event feed.
- **Threat Monitor** — searchable threat events with severity, source, target, MITRE ATT&CK technique, score, and status.
- **AI Detection Center** — model status and example confidence scores alongside detected events.
- **Live Attack Map** — animated, illustrative attack paths and active event trajectories.
- **Threat Intelligence** — an at-a-glance intelligence view.
- **Digital Twin** — an illustrative view of the environment and potential incident impact.
- **Risk Analysis** and **Predictive** — risk and forecast dashboards for exploring the demonstration data.
- **Incident Response** and **Forensics** — sample response activity and investigation views.
- **AI Agents** — example roles, tasks, findings, and a collaboration log.
- **Security Copilot** — an interactive chat with predefined demonstration responses.
- **Demo Mode** — launch ransomware, phishing, DDoS, or insider-threat scenarios and watch generated events appear in the dashboard.
- **Settings** — sample organization details, integrations, compliance labels, and cryptography information.

## Getting started

### Requirements

- [Bun](https://bun.sh/) (recommended; the project includes `bun.lock`)
- A current version of Node.js if your environment requires it for the tooling

### Install and run

```bash
bun install
bun run dev
```

Open the local URL printed by Vite in your terminal.

### Useful commands

```bash
bun run build       # Create a production build
bun run preview     # Preview the production build locally
bun run lint        # Run ESLint
```

## Try the demonstration

1. Open **Demo Mode** from the left navigation.
2. Choose a scenario and select **Launch**.
3. Open **Executive** or **Threat Monitor** to see the generated events in the current session.

## Demo data and limitations

This repository is a front-end prototype. Threats and metrics are synthetic, generated in the browser, and held in memory; refreshing the page resets the session. The attack map uses illustrative coordinates, the Copilot uses predefined local responses, and the integrations and AI model statuses are sample interface data. No real security telemetry is collected, no external threat-intelligence or security products are connected, and the demo does not execute real containment actions. Do not use it to protect production systems or submit sensitive information.

## Technology

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite and Tailwind CSS 4
- Recharts for dashboard charts
- Framer Motion for interface animation
- Lucide icons

## Project structure

```text
src/
  components/    Shared dashboard shell and UI components
  lib/           Synthetic threat data and shared utilities
  routes/        Dashboard pages, one file per route
  styles.css     Global styles and design tokens
```

## Routes

| Page | Path |
| --- | --- |
| Executive Dashboard | `/` |
| Threat Monitor | `/threats` |
| AI Detection | `/ai-detection` |
| Live Attack Map | `/attack-map` |
| Threat Intelligence | `/intel` |
| Digital Twin | `/digital-twin` |
| Risk Analysis | `/risk` |
| Incident Response | `/response` |
| AI Agents | `/agents` |
| Forensics | `/forensics` |
| Security Copilot | `/copilot` |
| Predictive | `/predictive` |
| Demo Mode | `/demo` |
| Settings | `/settings` |

## License

No license is specified yet. Add a `LICENSE` file before redistributing this project under an open-source license.