import type { Metadata } from 'next';
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Config } from "@/config/config";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/next';

const ibmPlexMono = IBM_Plex_Mono({
    variable: "--font-ibm-plex-mono",
    subsets: ["latin"],
    weight: ["200", "400", "500", "600", "700"],
    display: "swap"
});

export const metadata: Metadata = {
    title: Config.name
};

export default function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
            <body
                className={`${ibmPlexMono.variable} antialiased`}
                suppressHydrationWarning>
                <ThemeProvider>
                    <div className={`${Config.name} container m-auto`}>
                        <Header/>
                        <main className="py-2 px-4 max-sm:px-2">
                            {children}
                            <Analytics debug={false} />
                        </main>
                        <Footer/>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
