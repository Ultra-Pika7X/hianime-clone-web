import { Play, Calendar, Clock, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default async function AnimeDetailsPage({ params }: { params: { id: string } }) {
    const anime = await api.getAnimeDetails(params.id);

    if (!anime) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <h1 className="text-2xl font-bold text-white mb-2">Anime Not Found</h1>
                <p className="text-subtext">The anime you are looking for ({params.id}) could not be found.</p>
                <Link href="/" className="mt-4 text-primary hover:underline">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-10">
            {/* Banner / Backdrop */}
            <div className="relative h-[200px] md:h-[300px] lg:h-[400px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
                    style={{ backgroundImage: `url(${anime.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="shrink-0 mx-auto md:mx-0">
                        <div className="w-[180px] md:w-[220px] lg:w-[260px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-4 border-surface">
                            <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-4 md:pt-14 text-center md:text-left">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-subtext">
                                {anime.type && <span className="bg-white/10 px-2 py-0.5 rounded text-white">{anime.type}</span>}
                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">HD</span>
                                {anime.releaseDate && <span>{anime.releaseDate}</span>}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white">{anime.title}</h1>
                            <p className="text-lg text-subtext italic">{anime.otherName}</p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-subtext">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span className="text-white font-bold">N/A</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{anime.releaseDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{anime.status}</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                                <Link
                                    href={`/watch/${params.id}`}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-bold px-8 py-3 rounded-full transition-transform active:scale-95 text-lg"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    Watch Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Section */}
                <div className="flex flex-col lg:flex-row gap-8 mt-12">
                    {/* Main Details */}
                    <div className="flex-1 space-y-8">
                        <section className="bg-surface/30 p-6 rounded-xl border border-white/5">
                            <h2 className="text-xl font-bold text-primary mb-4">Synopsis</h2>
                            <p className="text-subtext leading-relaxed">{anime.description || "No description available."}</p>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-surface/30 p-5 rounded-xl border border-white/5 space-y-4 text-sm">
                            <div>
                                <span className="text-subtext block mb-1">Genres</span>
                                <div className="flex flex-wrap gap-2">
                                    {anime.genres?.map(g => (
                                        <span key={g} className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-primary border border-primary/20 transition-colors cursor-pointer">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-white/5 my-2" />
                            <div className="flex justify-between">
                                <span className="text-subtext">Status</span>
                                <span className="text-white font-medium">{anime.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-subtext">Total Episodes</span>
                                <span className="text-white font-medium">{anime.totalEpisodes || "?"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
