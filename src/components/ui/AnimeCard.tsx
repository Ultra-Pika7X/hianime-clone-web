"use client";

import { Play, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AnimeCardProps {
    id: string;
    title: string;
    image: string;
    episodes?: number;
    type?: string;
    duration?: string;
}

export function AnimeCard({ id, title, image, episodes, type, duration }: AnimeCardProps) {
    return (
        <Link href={`/anime/${id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative block rounded-lg overflow-hidden bg-surface/50 hover:bg-surface transition-colors"
            >
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-primary text-background rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                            <Play className="w-6 h-6 fill-current" />
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {type && <span className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{type}</span>}
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90">
                        {episodes && <span className="pt-0.5">{episodes} eps</span>}
                        {duration && <span className="flex items-center gap-1 opacity-80"><Clock className="w-3 h-3" /> {duration}</span>}
                    </div>
                </div>

                <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-primary transition-colors" title={title}>
                        {title}
                    </h3>
                </div>
            </motion.div>
        </Link>
    );
}
