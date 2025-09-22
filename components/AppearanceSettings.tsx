'use client'
import { useCustomAppearance } from "@/context/CustomAppearanceContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AppearanceSettings() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { linkColor, setLinkColor, fontFamily, setFontFamily, fontSize, setFontSize, fontWeight, setFontWeight } = useCustomAppearance();

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const setBg = () => {};

    return (
        <div>
            {!mounted && <p>loading...</p>}
            <p>Why stay default when you can customize your web experience ;)</p>
            <h1 className="text-2xl font-bold mb-4">Appearance</h1>
            <div className="space-y-2">
                <div>
                    <p className="text-xl">Select Theme</p>
                    <div className="flex space-x-4 items-center">
                        <label htmlFor="system">
                            <input
                                type="radio"
                                value="system"
                                name="system"
                                id="system"
                                checked={theme==="system"}
                                onChange={() => setTheme("system")}
                            />
                            System (default)
                        </label>
                        <label htmlFor="light">
                            <input
                                type="radio"
                                value="light"
                                name="light"
                                id="light"
                                checked={theme==="light"}
                                onChange={() => setTheme("light")}
                            />
                            Light
                        </label>
                        <label htmlFor="dark">
                            <input
                                type="radio"
                                value="dark"
                                name="dark"
                                id="dark"
                                checked={theme==="dark"}
                                onChange={() => setTheme("dark")}
                            />
                            Dark
                        </label>
                    </div>
                </div>
                <div>
                    <p className="text-xl">Select Color</p>
                    <div className="flex space-x-4 items-center">
                        <label htmlFor="gold">
                            <input
                                type="radio"
                                value="yellow"
                                name="gold"
                                id="gold"
                                checked={linkColor==="yellow"}
                                onChange={() => setLinkColor("yellow")}
                            />
                            Gold (default)
                        </label>
                        <label htmlFor="blue">
                            <input
                                type="radio"
                                value="blue"
                                name="blue"
                                id="blue"
                                checked={linkColor==="blue"}
                                onChange={() => setLinkColor("blue")}
                            />
                            Blue
                        </label>
                        <label htmlFor="rose">
                            <input
                                type="radio"
                                value="rose"
                                name="rose"
                                id="rose"
                                checked={linkColor==="rose"}
                                onChange={() => setLinkColor("rose")}
                            />
                            Rose
                        </label>
                        <label htmlFor="green">
                            <input
                                type="radio"
                                value="green"
                                name="green"
                                id="green"
                                checked={linkColor==="green"}
                                onChange={() => setLinkColor("green")}
                            />
                            Green
                        </label>
                    </div>
                </div>
                <div>
                    <p className="text-xl">Font customization</p>
                    <div className="flex flex-col space-y-2">
                        <div>
                            <label htmlFor="font-family">Font family:</label>
                            <select id="font-family" onChange={(e: any) => setFontFamily(e.target.value)} defaultValue={fontFamily}>
                                <option value={"IBM Plex Mono"}>IBM Plex Mono</option>
                                <option value={"cursive"}>Cursive</option>
                                <option value={"Helvetica"}>Helvetica</option>
                                <option value={"monospace"}>Monospace</option>
                                <option value={"serif"}>Serif</option>
                                <option value={"system-ui"}>System UI</option>
                                <option value={"Times New Roman"}>Times New Roman</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="font-size">Font size:</label>
                            <select id="font-size" onChange={(e: any) => setFontSize(e.target.value)} defaultValue={fontSize}>
                                <option value={"12px"}>12px</option>
                                <option value={"13px"}>13px</option>
                                <option value={"14px"}>14px</option>
                                <option value={"15px"}>15px</option>
                                <option value={"16px"}>16px</option>
                                <option value={"17px"}>17px</option>
                                <option value={"18px"}>18px</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="font-weight">Font weight:</label>
                            <select id="font-weight" onChange={(e: any) => setFontWeight(e.target.value)} defaultValue={fontWeight}>
                                <option value={"200"}>200</option>
                                <option value={"300"}>300</option>
                                <option value={"400"}>400</option>
                                <option value={"500"}>500</option>
                                <option value={"600"}>600</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xl">Custom background</p>
                    <label htmlFor="custom-bg">Upload a custom background:</label>
                    <input type="file" accept=".jpg, .jpeg, .png, .gif" />
                    <button onClick={setBg}>Set background</button>
                </div>
                <div>
                    <p className="text-xl">Gradient Color Theme</p>
                    <p>Comming soon...</p>
                </div>
                <div>
                    <p className="text-xl">In-app Icon</p>
                    <p>Comming soon...</p>
                </div>
            </div>
        </div>
    );
}
