"use client";

import Link from "next/link";
import { Search, Menu, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnilistLogin } from "@/components/auth/AnilistLogin";

export function Navbar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const { user, logout } = useAuth();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-white/5 h-16">
            <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
                {/* Left: Logo & Menu */}
                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 hover:bg-white/10 rounded-full">
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                            HiAnime
                        </div>
                    </Link>
                </div>

                {/* Center: Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-xl mx-4">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search anime..."
                            className="w-full h-10 pl-4 pr-10 rounded-full bg-background border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm transition-all text-white"
                        />
                        <button type="submit" className="absolute right-0 top-0 h-full px-4 text-subtext hover:text-primary">
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-subtext hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={user.avatar.large}
                                alt={user.name}
                                className="w-8 h-8 rounded-full border border-white/10"
                            />
                            <button
                                onClick={logout}
                                className="p-2 text-subtext hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <AnilistLogin />
                    )}
                </div>
            </div>
        </nav>
    );
}
