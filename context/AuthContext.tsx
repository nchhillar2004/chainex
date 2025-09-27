"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = { id: number; username: string; role: string } | null;

const AuthContext = createContext<{
    user: User,
    setUser: (user: User) => void,
    isHydrated: boolean,
}>({
    user: null,
    setUser: () => {},
    isHydrated: false,
});

export const AuthProvider = ({ user: initialUser, children }: { user: User, children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setUser(initialUser);
        setIsHydrated(true);
    }, [initialUser]);

    return (
        <AuthContext.Provider value={{ user, setUser, isHydrated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
