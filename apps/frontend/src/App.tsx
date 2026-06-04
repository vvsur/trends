import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ModulePage } from './pages/ModulePage';
import { TrendDetailPage } from './pages/TrendDetailPage';
import { TrendListPage } from './pages/TrendListPage';
import { portalRoutes } from './routes';
import { useThemeShell } from './theme/theme-shell';

export function App() {
  const { inverted, mode, setMode, toggleInverted } = useThemeShell();

  return (
    <AppLayout
      inverted={inverted}
      mode={mode}
      routes={portalRoutes}
      onModeChange={setMode}
      onToggleInverted={toggleInverted}
    >
      <Routes>
        <Route element={<Navigate to="/trends" replace />} path="/" />
        <Route element={<TrendListPage />} path="/trends" />
        <Route element={<TrendDetailPage />} path="/trends/:id" />
        {portalRoutes
          .filter((route) => route.path !== '/trends')
          .map((route) => (
            <Route element={<ModulePage route={route} />} key={route.path} path={route.path} />
          ))}
      </Routes>
    </AppLayout>
  );
}
