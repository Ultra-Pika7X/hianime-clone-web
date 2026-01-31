"use client";

import { useAuth } from "@/context/AuthContext";
import { SiAnilist } from "react-icons/si";

// Generic button component placeholder since Button ui might vary. 
// Assuming a className prop is enough for Tailwind.
const Button = ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={`flex items-center justify-center px-4 py-2 rounded ${className}`}>
        {children}
    </button>
);

const CLIENT_ID = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID || "34766";

export function AnilistLogin() {
    const handleLogin = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        console.log("[AnilistLogin] Initiating Implicit Grant Login");

        const cleanClientId = CLIENT_ID.trim().replace(/['"]/g, '');
        const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${cleanClientId}&response_type=token`;

        console.log("[AnilistLogin] Navigating to:", authUrl);
        window.location.href = authUrl;
    };

    return (
        <Button
            onClick={handleLogin}
            className="gap-2 bg-[#02A9FF] hover:bg-[#0297e6] text-white font-bold transition-colors"
        >
            {/* If React Icons not installed, fall back to text. */}
            Login with AniList
        </Button>
    );
}
