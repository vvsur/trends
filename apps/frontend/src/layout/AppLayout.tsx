import { Moon, ScanLine, Sun, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import type { PortalRoute } from '../routes';
import type { ThemeMode } from '../theme/theme-shell';

type AppLayoutProps = {
  children: ReactNode;
  inverted: boolean;
  mode: ThemeMode;
  routes: PortalRoute[];
  onModeChange: (mode: ThemeMode) => void;
  onToggleInverted: () => void;
};

export function AppLayout({
  children,
  inverted,
  mode,
  routes,
  onModeChange,
  onToggleInverted,
}: AppLayoutProps) {
  const shellClassName = useMemo(() => {
    return inverted ? 'app-shell inverted' : 'app-shell';
  }, [inverted]);

  return (
    <div className={shellClassName}>
      <a className="skip-link" href="#main-content">
        К содержанию
      </a>

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
              <NavLink className="nav-item" key={route.path} to={route.path}>
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

      <main className="content" id="main-content">
        <header className="topbar">
          <div>
            <span className="section-kicker">MVP foundation</span>
            <p>IT trends, scoring, pilots, KPI</p>
          </div>
          <div className="theme-controls" aria-label="Тема интерфейса">
            <IconButton active={mode === 'light'} label="Светлая тема" onClick={() => onModeChange('light')}>
              <Sun size={20} strokeWidth={2} aria-hidden="true" />
            </IconButton>
            <IconButton active={mode === 'dark'} label="Темная тема" onClick={() => onModeChange('dark')}>
              <Moon size={20} strokeWidth={2} aria-hidden="true" />
            </IconButton>
            <IconButton active={inverted} label="Инвертированный контекст" onClick={onToggleInverted}>
              <ScanLine size={20} strokeWidth={2} aria-hidden="true" />
            </IconButton>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
