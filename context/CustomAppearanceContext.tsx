"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LinkColor, FontFamily, FontSize, FontWeight } from "@/types/AppearanceSettingTypes";

interface CustomAppearanceContextType {
    linkColor: LinkColor;
    setLinkColor: (color: LinkColor) => void;
    fontFamily: FontFamily;
    setFontFamily: (font: FontFamily) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontWeight: FontWeight;
    setFontWeight: (weight: FontWeight) => void;
}

const CustomAppearanceContext = createContext<CustomAppearanceContextType | undefined>(undefined);

const DEFAULTS = {
    LINK_COLOR: "yellow" as LinkColor,
    FONT_FAMILY: "IBM Plex Mono" as FontFamily,
    FONT_SIZE: "14px" as FontSize,
    FONT_WEIGHT: "400" as FontWeight,
};

export function CustomAppearanceProvider({ children }: { children: React.ReactNode }) {
    const [linkColor, setLinkColor] = useState<LinkColor>(DEFAULTS.LINK_COLOR);
    const [fontFamily, setFontFamily] = useState<FontFamily>(DEFAULTS.FONT_FAMILY);
    const [fontSize, setFontSize] = useState<FontSize>(DEFAULTS.FONT_SIZE);
    const [fontWeight, setFontWeight] = useState<FontWeight>(DEFAULTS.FONT_WEIGHT);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            setLinkColor((localStorage.getItem("linkColor") as LinkColor) || DEFAULTS.LINK_COLOR);
            setFontFamily((localStorage.getItem("fontFamily") as FontFamily) || DEFAULTS.FONT_FAMILY);
            setFontSize((localStorage.getItem("fontSize") as FontSize) || DEFAULTS.FONT_SIZE);
            setFontWeight((localStorage.getItem("fontWeight") as FontWeight) || DEFAULTS.FONT_WEIGHT);
        } catch (e) {
            console.error("Failed to load theme settings:", e);
        } finally {
            setMounted(true);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        try {
            localStorage.setItem("linkColor", linkColor);
            localStorage.setItem("fontFamily", fontFamily);
            localStorage.setItem("fontSize", fontSize);
            localStorage.setItem("fontWeight", fontWeight);

            document.documentElement.style.setProperty("--font-family", fontFamily);
            document.documentElement.style.setProperty("--font-size", fontSize);
            document.documentElement.style.setProperty("--font-weight", fontWeight);
            document.documentElement.setAttribute("data-link-color", linkColor);
        } catch (e) {
            console.error("Failed to save theme settings:", e);
        }
    }, [mounted, linkColor, fontFamily, fontSize, fontWeight]);

    if (!mounted) return <p>loading...</p>;

    return (
        <CustomAppearanceContext.Provider
            value={{
                linkColor,
                setLinkColor,
                fontFamily,
                setFontFamily,
                fontSize,
                setFontSize,
                fontWeight,
                setFontWeight,
            }}
        >
            {children}
        </CustomAppearanceContext.Provider>
    );
}

export function useCustomAppearance() {
    const context = useContext(CustomAppearanceContext);
    if (!context) {
        throw new Error("useCustomAppearance must be used within a CustomAppearanceProvider");
    }
    return context;
}
