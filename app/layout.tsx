import type { Metadata } from 'next';
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Config } from "@/config/config";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/context/AuthContext';
import { Slide, ToastContainer } from 'react-toastify';
import { getCurrentUser } from '@/hooks/getUser';

const ibmPlexMono = IBM_Plex_Mono({
    variable: "--font-ibm-plex-mono",
    subsets: ["latin"],
    weight: ["200", "400", "500", "600", "700"],
    display: "swap"
});

export const metadata: Metadata = {
    title: Config.name
};

export default async function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    const user = await getCurrentUser();
    return (
        <html lang="en">
            <body
                className={`${ibmPlexMono.variable} antialiased`}
                suppressHydrationWarning>
                <AuthProvider user={user}>
                    <ThemeProvider>
                        <ToastContainer
                            position='bottom-right'
                            limit={2}
                            hideProgressBar
                            transition={Slide}
                            autoClose={4000}
                            theme='dark'
                        />
                        <div className={`${Config.name} container m-auto`}>
                            <Header/>
                            <main className="py-2 px-4 max-sm:px-2">
                                {children}
                                <Analytics debug={false} />
                            </main>
                            <Footer/>
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
