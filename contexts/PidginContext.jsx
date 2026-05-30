"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PidginContext = createContext({ pidgin: false, toggle: () => {} });

export function PidginProvider({ children }) {
  const [pidgin, setPidgin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ajolang");
    if (stored === "pid") setPidgin(true);
  }, []);

  function toggle() {
    setPidgin(prev => {
      const next = !prev;
      localStorage.setItem("ajolang", next ? "pid" : "en");
      return next;
    });
  }

  return (
    <PidginContext.Provider value={{ pidgin, toggle }}>
      {children}
    </PidginContext.Provider>
  );
}

export function usePidgin() {
  return useContext(PidginContext);
}

/* t(en, pid) — inline translation helper */
export function t(en, pid, pidgin) {
  return pidgin ? pid : en;
}
