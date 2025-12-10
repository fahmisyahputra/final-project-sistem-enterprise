# Organizational Mining Frontend

Modern Next.js dashboard for visualizing organizational process mining data. Built with **Clean Architecture**, **shadcn/ui**, **Recharts**, and **React Flow**.

## Overview

This application serves as the frontend for the Organizational Mining System, providing interactive visualizations for:
- **Dashboard:** High-level metrics and quick insights.
- **Organization Evolution:** Trends in active users, roles, and interactions.
- **Role Interactions:** Matrix of connectivity between roles.
- **User Analysis:** Detailed collaboration patterns.
- **BPMN Preview:** Interactive process graph using React Flow.
- **Performance Analytics:** Burnout risk and project duration tracking.
- **Advanced Analytics:** Bottleneck analysis and resource utilization heatmaps.

## Tech Stack

- **Next.js 14** - App Router Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Recharts** - Data Visualization (Line, Area, Bar Charts)
- **React Flow** - Graph Visualization (BPMN)
- **Dagre** - Graph Auto-Layout
- **Lucide React** - Icons
- **Axios** - API Client

## Features

- **Interactive Dashboards:** Real-time data visualization.
- **Graph Visualization:** Auto-layout node-link diagrams for process flows.
- **Multi-language Support:** English and Indonesian (i18n).
- **Theme Support:** Dark, Light, and System modes.
- **Responsive Design:** Optimized for all screen sizes.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard Routes
│   │   ├── organization/   # Evolution Page
│   │   ├── roles/          # Role Interactions Page
│   │   ├── users/          # User Analysis Page
│   │   ├── bpmn/           # BPMN Preview Page
│   │   ├── performance/    # Performance Analytics Page
│   │   ├── advanced/       # Advanced Analytics Page
│   │   └── page.tsx        # Main Dashboard
│   └── layout.tsx          # Root Layout
│
├── core/                   # Core Infrastructure
│   ├── api/                # API Client & Endpoints
│   ├── i18n/               # Localization (en/id)
│   └── types/              # TypeScript Interfaces
│
├── shared/                 # Shared Components
│   └── components/
│       ├── ui/             # Reusable UI (Cards, Buttons, etc.)
│       └── layout/         # Sidebar, Header
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd frontend-nextjs-cleanarchitecture-main

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file if needed (default API URL is configured in `src/core/api/index.ts` or via proxy).

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Internationalization (i18n)

Support for **English** and **Indonesian**.
- Language files located in `src/core/i18n/locales/`.
- Switch language via the Header dropdown or Settings.

## Theme

Support for **Light** and **Dark** modes.
- Toggled via the Header theme button.
- Persisted in local storage/cookies.

## License

MIT License
