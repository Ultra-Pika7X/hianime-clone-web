import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Episodes
const EPISODES = Array.from({ length: 24 }, (_, i) => ({
    number: i + 1,
    title: `Episode ${i + 1}`,
    id: `ep-${i + 1}`
}));

interface EpisodeListProps {
    currentEpisode: number;
    animeId: string;
}

export function EpisodeList({ currentEpisode, animeId }: EpisodeListProps) {
    return (
        <div className="bg-surface/30 border border-white/5 rounded-xl overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5">
                <h3 className="font-bold text-white">Episodes</h3>
                <p className="text-xs text-subtext mt-1">Total: {EPISODES.length}</p>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {EPISODES.map((ep) => (
                        <Link
                            key={ep.id}
                            href={`/watch/${animeId}?ep=${ep.number}`}
                            className={cn(
                                "flex items-center justify-center py-2 rounded text-sm font-medium transition-colors",
                                ep.number === currentEpisode
                                    ? "bg-primary text-background"
                                    : "bg-white/5 hover:bg-white/10 text-subtext hover:text-white"
                            )}
                        >
                            {ep.number}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
