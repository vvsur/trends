import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

type ThemeShellState = {
  inverted: boolean;
  mode: ThemeMode;
};

const defaultThemeShell: ThemeShellState = {
  inverted: false,
  mode: 'light',
};

const storageKey = 'trends.theme-shell';

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function readStoredThemeShell(): ThemeShellState {
  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return defaultThemeShell;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<ThemeShellState>;

    return {
      inverted: typeof parsedValue.inverted === 'boolean' ? parsedValue.inverted : defaultThemeShell.inverted,
      mode: isThemeMode(parsedValue.mode) ? parsedValue.mode : defaultThemeShell.mode,
    };
  } catch {
    return defaultThemeShell;
  }
}

function syncDocumentTheme({ inverted, mode }: ThemeShellState) {
  if (mode === 'dark') {
    document.documentElement.dataset.mode = 'dark';
  } else {
    delete document.documentElement.dataset.mode;
  }

  document.documentElement.style.colorScheme = mode;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ inverted, mode }));
  } catch {
    return;
  }
}

export function useThemeShell() {
  const [themeShell, setThemeShell] = useState<ThemeShellState>(readStoredThemeShell);

  useEffect(() => {
    syncDocumentTheme(themeShell);
  }, [themeShell]);

  return {
    inverted: themeShell.inverted,
    mode: themeShell.mode,
    setMode: (mode: ThemeMode) => {
      setThemeShell((currentThemeShell) => ({ ...currentThemeShell, mode }));
    },
    toggleInverted: () => {
      setThemeShell((currentThemeShell) => ({
        ...currentThemeShell,
        inverted: !currentThemeShell.inverted,
      }));
    },
  };
}
