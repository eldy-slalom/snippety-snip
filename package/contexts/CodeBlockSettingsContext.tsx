'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from './ThemeContext';

export interface CodeBlockDisplaySettings {
    showLineNumbers: boolean;
    theme: 'dark' | 'light';
}

interface CodeBlockSettingsContextType {
    settings: CodeBlockDisplaySettings;
    setShowLineNumbers: (show: boolean) => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

const CodeBlockSettingsContext = createContext<CodeBlockSettingsContextType | undefined>(undefined);

export function CodeBlockSettingsProvider({ children }: { children: ReactNode }) {
    const { theme: appTheme, isReady } = useTheme();
    const [settings, setSettings] = useState<CodeBlockDisplaySettings>({
        showLineNumbers: true,
        theme: appTheme,
    });

    // Sync code block theme with app theme
    useEffect(() => {
        if (isReady) {
            setSettings(prev => ({ ...prev, theme: appTheme }));
        }
    }, [appTheme, isReady]);

    const setShowLineNumbers = (show: boolean) => {
        setSettings(prev => ({ ...prev, showLineNumbers: show }));
    };

    const setTheme = (theme: 'dark' | 'light') => {
        setSettings(prev => ({ ...prev, theme }));
    };

    return (
        <CodeBlockSettingsContext.Provider value={{ settings, setShowLineNumbers, setTheme }}>
            {children}
        </CodeBlockSettingsContext.Provider>
    );
}

export function useCodeBlockSettings() {
    const context = useContext(CodeBlockSettingsContext);
    if (context === undefined) {
        throw new Error('useCodeBlockSettings must be used within a CodeBlockSettingsProvider');
    }
    return context;
}
