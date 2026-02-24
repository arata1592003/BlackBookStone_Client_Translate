"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  appName: string;
  logoSrc: string;
  iconSrc: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("bsb-theme") as Theme | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.classList.toggle(
      "light",
      initialTheme === "light",
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("bsb-theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  // Quản lý thương hiệu tập trung (Bạch Thạch Thôn / Hắc Thạch Thôn)
  const branding = useMemo(() => {
    if (theme === "dark") {
      return {
        appName: "Hắc Thạch Thôn",
        logoSrc: "/logo.png",
        iconSrc: "/icon-logo-540x540.png",
      };
    }
    return {
      appName: "Bạch Thạch Thôn",
      logoSrc: "/logo-light.png",
      iconSrc: "/icon-logo-540x540.png",
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ...branding }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
