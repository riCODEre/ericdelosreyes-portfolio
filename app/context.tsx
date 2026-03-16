'use client'
import { create } from "domain";
import { createContext, useState, useContext } from "react";

type ThemeMode = "light" | "dark"

type ThemeContextType = {
  themeMode: ThemeMode,
  setThemeMode: (mode: ThemeMode) => void,
  toggleTheme: () => void,
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark')

  const toggleTheme = () => {
    setThemeMode(prev => (prev === "light" ? "dark" : "light"))
  }
  console.log("ThemeProvider mounted")
  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}


export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside ThemeProvider")
  return context
}