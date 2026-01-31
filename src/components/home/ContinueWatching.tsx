"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/context/LibraryContext";
import { Play } from "lucide-react";

export function ContinueWatching() {
    const { history } = useLibrary();

    if (!history || history.length === 0) return null;

    // Take top 4 recent items
    const recent = history.slice(0, 4);

    return (
        <section className="mt-8">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Continue Watching
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recent.map((item) => (
                    <Link
                        key={item.id}
                        href={`/watch/${item.id}?ep=${item.watchedEpisode || 1}`}
                        className="group relative rounded-xl overflow-hidden aspect-video border border-white/5 bg-surface/30 hover:border-primary/50 transition-colors"
                    >
                        <img
                            src={item.image || item.coverImage?.large}
                            alt={item.title?.english || item.title?.romaji || "Anime"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                            <h3 className="font-bold text-white line-clamp-1">{item.title?.english || item.title?.romaji}</h3>
                            <p className="text-xs text-primary font-medium mt-1">
                                Episode {item.watchedEpisode || 1}
                            </p>

                            {/* Progress bar placeholder if we had accurate duration */}
                            <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-primary w-1/2" />
                            </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <Play className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
