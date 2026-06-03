import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ModulePage } from './pages/ModulePage';
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
        {portalRoutes.map((route) => (
          <Route element={<ModulePage route={route} />} key={route.path} path={route.path} />
        ))}
      </Routes>
    </AppLayout>
  );
}
