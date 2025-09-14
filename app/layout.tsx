"use client";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Config } from "@/config/config";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";

const ibmPlexMono = IBM_Plex_Mono({
    variable: "--font-ibm-plex-mono",
    subsets: ["latin"],
    weight: ["200", "400", "500", "600", "700"]
});

export default function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    const {theme} = useTheme();
    return (
        <html lang="en">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <body
                className={`${theme} ${ibmPlexMono.variable} antialiased`}
                suppressHydrationWarning>
                <ThemeProvider>
                    <div className={`${Config.name} container m-auto`}>
                        <Header/>
                        <main className="py-2 px-4 max-sm:px-2">
                            {children}
                        </main>
                        <Footer/>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
