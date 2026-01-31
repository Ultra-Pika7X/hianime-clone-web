"use client";

import Link from "next/link";
import { Home, Compass, Calendar, Tv, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Trending", href: "/trending" },
    { icon: Calendar, label: "Schedule", href: "/schedule" },
    { icon: Tv, label: "TV Series", href: "/tv" },
    { icon: MessageSquare, label: "Community", href: "/community" },
];

export function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-surface/30 border-r border-white/5 py-6 pl-4 pr-2 overflow-y-auto custom-scrollbar">
            <div className="mb-6 px-4">
                <h3 className="text-xs text-subtext uppercase font-semibold tracking-wider mb-4">Menu</h3>
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-subtext hover:text-primary hover:bg-primary/10 transition-colors">
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto px-4 pt-6 border-t border-white/5">
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                    <p className="text-sm text-subtext mb-3">Join our community!</p>
                    <button className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-2 rounded-lg text-sm transition-colors">
                        Discord
                    </button>
                </div>
            </div>
        </aside>
    );
}
