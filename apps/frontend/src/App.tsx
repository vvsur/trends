import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Gauge,
  Lightbulb,
  Moon,
  Radar,
  Rocket,
  ScanLine,
  Sun,
  Trophy,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

type PortalRoute = {
  path: string;
  label: string;
  metric: string;
  status: string;
  icon: LucideIcon;
};

const routes: PortalRoute[] = [
  { path: '/trends', label: 'Техрадар', metric: '10 трендов', status: 'technology', icon: Radar },
  { path: '/innovations', label: 'Реестр', metric: '17 инициатив', status: 'manual input', icon: Lightbulb },
  { path: '/scoring', label: 'Скоринг', metric: 'ICE draft', status: 'review', icon: Gauge },
  { path: '/pilots', label: 'Пилоты', metric: 'KPI 1.3', status: 'planned', icon: Rocket },
  { path: '/kpi', label: 'KPI', metric: '2026', status: 'value', icon: BarChart3 },
  { path: '/cases', label: 'Кейсы', metric: 'library', status: 'reuse', icon: BookOpen },
  { path: '/my-trends', label: 'Мои тренды', metric: 'employee', status: 'SLA', icon: UserRound },
];

function ThemeButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className="theme-button"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Page({ route }: { route: PortalRoute }) {
  const Icon = route.icon;

  return (
    <section className="workspace" aria-labelledby="page-title">
      <div className="workspace-header">
        <div className="module-mark" aria-hidden="true">
          <Icon size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="section-kicker">{route.status}</p>
          <h1 id="page-title">{route.label}</h1>
        </div>
      </div>

      <div className="summary-grid" aria-label="Сводка раздела">
        <article className="summary-card">
          <span>Контур</span>
          <strong>{route.metric}</strong>
        </article>
        <article className="summary-card">
          <span>Данные</span>
          <strong>Audit ready</strong>
        </article>
        <article className="summary-card">
          <span>Режим</span>
          <strong>Manual first</strong>
        </article>
      </div>

      <div className="work-surface">
        <div className="surface-row">
          <span>Owner</span>
          <strong>Назначается через RBAC</strong>
        </div>
        <div className="surface-row">
          <span>Traceability</span>
          <strong>Source fields required</strong>
        </div>
        <div className="surface-row">
          <span>Next step</span>
          <strong>Skeleton API contract</strong>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.dataset.mode = 'dark';
    } else {
      delete document.documentElement.dataset.mode;
    }
  }, [mode]);

  const shellClassName = useMemo(() => {
    return inverted ? 'app-shell inverted' : 'app-shell';
  }, [inverted]);

  return (
    <div className={shellClassName}>
      <aside className="sidebar" aria-label="Разделы портала">
        <div className="brand-block">
          <ScanLine size={28} strokeWidth={2} aria-hidden="true" />
          <div>
            <span>Trends</span>
            <strong>PDCA portal</strong>
          </div>
        </div>

        <nav className="nav-list">
          {routes.map((route) => {
            const Icon = route.icon;

            return (
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                key={route.path}
                to={route.path}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                <span>{route.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="value-strip">
          <Trophy size={20} strokeWidth={2} aria-hidden="true" />
          <span>KPI 1.3</span>
          <strong>2026</strong>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <span className="section-kicker">MVP foundation</span>
            <p>IT trends, scoring, pilots, KPI</p>
          </div>
          <div className="theme-controls" aria-label="Тема интерфейса">
            <ThemeButton active={mode === 'light'} label="Светлая тема" onClick={() => setMode('light')}>
              <Sun size={20} strokeWidth={2} aria-hidden="true" />
            </ThemeButton>
            <ThemeButton active={mode === 'dark'} label="Темная тема" onClick={() => setMode('dark')}>
              <Moon size={20} strokeWidth={2} aria-hidden="true" />
            </ThemeButton>
            <ThemeButton active={inverted} label="Инвертированный контекст" onClick={() => setInverted((value) => !value)}>
              <ScanLine size={20} strokeWidth={2} aria-hidden="true" />
            </ThemeButton>
          </div>
        </header>

        <Routes>
          <Route element={<Navigate to="/trends" replace />} path="/" />
          {routes.map((route) => (
            <Route element={<Page route={route} />} key={route.path} path={route.path} />
          ))}
        </Routes>
      </main>
    </div>
  );
}
