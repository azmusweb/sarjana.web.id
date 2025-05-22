import { createContext, useContext, useEffect, useState } from "react";
import { fetchSheet } from "../lib/fetchSheet";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({});
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    fetchSheet("config").then((cfg) => setConfig(cfg[0] || {}));
    const stored = typeof window !== "undefined" && localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  }

  return (
    <ConfigContext.Provider value={{ config, theme, toggleTheme }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);