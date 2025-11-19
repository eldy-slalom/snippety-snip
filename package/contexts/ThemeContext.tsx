'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'snippety-theme';

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') {
    return;
  }

  const targets: Array<HTMLElement | null> = [document.body, document.documentElement];
  targets.forEach((target) => {
    if (!target) {
      return;
    }
    target.classList.remove('theme-light', 'theme-dark');
    target.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    applyThemeClass(theme);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // Swallow storage errors
      }
    }

    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady, theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isReady,
    }),
    [isReady, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
