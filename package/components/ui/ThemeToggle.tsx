'use client';

import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();

  const label = useMemo(() => (theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'), [theme]);
  const status = useMemo(() => (theme === 'light' ? 'Light mode' : 'Dark mode'), [theme]);

  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label={label}
      disabled={!isReady}
      suppressHydrationWarning
    >
      {status}
    </button>
  );
}
