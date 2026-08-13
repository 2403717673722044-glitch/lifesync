import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'normal';
  });

  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('mode');
    return savedMode || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('mode', mode);
    document.body.className = `${mode} ${theme}`;
    document.documentElement.setAttribute('data-theme', mode);
  }, [theme, mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    mode,
    setMode,
    toggleMode,
    isLight: mode === 'light',
    isDark: mode === 'dark',
    isPinky: theme === 'pinky',
    isSpidey: theme === 'spidey',
    isNormal: theme === 'normal'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};