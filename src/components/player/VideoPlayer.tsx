"use client";

import { useEffect } from "react";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import { useLibrary } from "@/context/LibraryContext";
import { Anime } from "@/types/anime";

interface VideoPlayerProps {
    src?: string;
    poster?: string;
    anime?: Anime;
    episode?: number;
}

export function VideoPlayer({ src, poster, anime, episode }: VideoPlayerProps) {
    const { addToHistory, updateStatus } = useLibrary();
    const isIframe = src?.includes("vidsrc") || src?.includes("embed");

    useEffect(() => {
        if (anime && episode) {
            // Add to history on load
            addToHistory({
                id: anime.id,
                title: anime.title,
                image: anime.image,
                totalEpisodes: anime.totalEpisodes,
                watchedEpisode: episode,
                duration: 24 * 60, // Default approx duration
                type: anime.type
            });

            // Mark as CURRENT (Watching) on Anilist
            updateStatus(Number(anime.id), "CURRENT", episode);
        }
    }, [anime, episode]);

    if (isIframe && src) {
        return (
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-white/5 relative">
                <iframe
                    src={src}
                    className="w-full h-full absolute top-0 left-0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="origin"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
                />
            </div>
        );
    }

    return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-white/5">
            <MediaPlayer title={anime?.title || "Anime Stream"} src={src || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}>
                <MediaProvider>
                    {(poster || anime?.image) && <Poster className="vds-poster" src={poster || anime?.image} alt={anime?.title} />}
                </MediaProvider>
                <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
        </div>
    );
}
