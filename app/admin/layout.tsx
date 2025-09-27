import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({children}: {children: React.ReactNode}) {
    const session = await verifySession();

    if (!session) redirect("/auth/login");

    return (
        <>
            {children}
        </>
    );

}
