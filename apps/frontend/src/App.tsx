import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppLayout, type ThemeMode } from './layout/AppLayout';
import { ModulePage } from './pages/ModulePage';
import { portalRoutes } from './routes';

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

  return (
    <AppLayout
      inverted={inverted}
      mode={mode}
      routes={portalRoutes}
      onModeChange={setMode}
      onToggleInverted={() => setInverted((value) => !value)}
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
