import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
