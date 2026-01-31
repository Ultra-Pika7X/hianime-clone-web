"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { anilist } from "@/lib/anilist";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export interface AniListUser {
    id: number;
    name: string;
    avatar: {
        large: string;
    };
    options?: {
        displayAdultContent: boolean;
    };
}

export interface AppSettings {
    autoNext: boolean;
    autoNextTimeout: number; // seconds
    autoSyncAniList: boolean;
    preferredSource: string;
    enableSkipIntro?: boolean;
    enableAutoSkip?: boolean;
}

interface AuthContextType {
    user: AniListUser | null;
    firebaseUser: User | null;
    token: string | null;
    loading: boolean;
    settings: AppSettings;
    updateSettings: (settings: Partial<AppSettings>) => void;
    login: (accessToken: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    token: null,
    loading: true,
    settings: {
        autoNext: true,
        autoNextTimeout: 5,
        autoSyncAniList: true,
        preferredSource: "default",
        enableSkipIntro: true,
        enableAutoSkip: false
    },
    updateSettings: () => { },
    login: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AniListUser | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<AppSettings>({
        autoNext: true,
        autoNextTimeout: 5,
        autoSyncAniList: true,
        preferredSource: "default",
        enableSkipIntro: true,
        enableAutoSkip: false
    });
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setFirebaseUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("anilist_token");
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
        const storedSettings = localStorage.getItem("app_settings");
        if (storedSettings) {
            try {
                setSettings({ ...settings, ...JSON.parse(storedSettings) });
            } catch (e) {
                console.error("Invalid settings", e);
            }
        }
    }, []);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem("app_settings", JSON.stringify(updated));
    };

    const fetchUser = async (accessToken: string) => {
        try {
            const data = await anilist.getViewer(accessToken);
            if (data.data && data.data.Viewer) {
                setUser(data.data.Viewer);
            } else {
                localStorage.removeItem("anilist_token");
                setToken(null);
            }
        } catch (error) {
            console.error("Failed to fetch AniList user:", error);
        }
    };

    const login = async (accessToken: string) => {
        localStorage.setItem("anilist_token", accessToken);
        setToken(accessToken);
        await fetchUser(accessToken);
    };

    const logout = async () => {
        localStorage.removeItem("anilist_token");
        setToken(null);
        setUser(null);
        try {
            await signOut(auth);
        } catch (e) {
            console.error("Firebase signout error", e);
        }
        setFirebaseUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, token, loading, login, logout, settings, updateSettings }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
