"use client";
import React, { createContext, useContext, useState } from "react";

export type User = { id: number; username: string; role: string } | null;

const AuthContext = createContext<{
    user: User,
    setUser: (user: User) => void,
}>({
    user: null,
    setUser: () => {}
});

export const AuthProvider = ({ user: initialUser, children }: { user: User, children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(initialUser);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
