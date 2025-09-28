import React from "react";
import SearchForm from "./forms/SearchForm";
import Sidebar from "./Sidebar";

export default function SidebarLayout({children}: {children: React.ReactNode}) {
    return(
        <>
            <div className="min-md:hidden mb-4">
                <SearchForm/>
            </div>
            <div className="flex min-md:space-x-4">
                <div className="min-md:w-[75%] w-full space-y-4">
                    {children}
                </div>
                <div className="max-md:hidden">
                    <Sidebar/>
                </div>
            </div>
        </>
    );
}
