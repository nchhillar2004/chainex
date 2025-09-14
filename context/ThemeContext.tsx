"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "yellow" | "blue";

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>({
    theme: "yellow",
    setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const savedTheme = (typeof window!=='undefined') ? (localStorage.getItem("theme") as Theme | null) : null;
    const [theme, setTheme] = useState<Theme>(savedTheme ?? "yellow");

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
            <div className={`${theme}`}>{children}</div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
