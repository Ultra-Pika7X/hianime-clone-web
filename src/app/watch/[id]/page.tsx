import { VideoPlayer } from "@/components/player/VideoPlayer";
import { EpisodeList } from "@/components/watch/EpisodeList";
import { MessageSquare, Share2, Flag, ThumbsUp, ThumbsDown } from "lucide-react";
import { api } from "@/lib/api";

export default async function WatchPage({ params, searchParams }: { params: { id: string }, searchParams: { ep?: string } }) {
    const episodeNumber = searchParams.ep ? parseInt(searchParams.ep) : 1;
    // Construct episode ID: anime-id-episode-N
    const episodeId = `${params.id}-episode-${episodeNumber}`;

    // Fetch stream source
    const stream = await api.getStreamSources(episodeId);

    // Fetch anime details for history tracking
    const anime = await api.getAnimeDetails(params.id);

    // Fallback stream if none found (e.g. invalid ID or scraper error)
    // Using a reliable HLS test stream for demonstration if extraction fails
    const streamUrl = stream?.url || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

    return (
        <div className="pb-10 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Player Section */}
                <div className="flex-1 space-y-4">
                    <VideoPlayer
                        src={streamUrl}
                        poster={anime?.image || "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDuyNY6F7bI.jpg"}
                        anime={anime || undefined}
                        episode={episodeNumber}
                    />

                    {/* Controls & Title */}
                    <div className="bg-surface/30 p-4 rounded-xl border border-white/5">
                        <h1 className="text-xl font-bold text-white mb-2">{params.id.replace(/-/g, " ")} - Episode {episodeNumber}</h1>
                        <p className="text-sm text-subtext">If video is not working, try switching servers.</p>

                        <div className="flex items-center gap-4 mt-4 border-t border-white/5 pt-4">
                            <div className="flex items-center gap-2 text-sm text-subtext hover:text-white cursor-pointer transition-colors">
                                <ThumbsUp className="w-4 h-4" /> 8.5K
                            </div>
                            <div className="flex items-center gap-2 text-sm text-subtext hover:text-white cursor-pointer transition-colors">
                                <ThumbsDown className="w-4 h-4" /> Dislike
                            </div>
                            <div className="ml-auto flex items-center gap-4">
                                <button className="flex items-center gap-2 text-sm text-subtext hover:text-primary transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="flex items-center gap-2 text-sm text-subtext hover:text-primary transition-colors">
                                    <Flag className="w-4 h-4" /> Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section Placeholder */}
                    <div className="bg-surface/30 p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-6">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h2 className="font-bold text-white">Comments</h2>
                        </div>
                        <div className="text-center py-10 text-subtext bg-white/5 rounded-lg border border-white/5 border-dashed">
                            Comments functionality coming soon!
                        </div>
                    </div>
                </div>

                {/* Sidebar (Episode List) */}
                <div className="w-full lg:w-[350px] shrink-0">
                    <div className="sticky top-20 h-[calc(100vh-6rem)]">
                        <EpisodeList currentEpisode={episodeNumber} animeId={params.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
