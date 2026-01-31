import { AnimeCard } from "@/components/ui/AnimeCard";

// Mock Data
const LATEST = [
    { id: "1", title: "One Piece", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-YCDuyNY6F7bI.jpg", episodes: 1089, type: "TV", duration: "24m" },
    { id: "2", title: "Jujutsu Kaisen", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx145064-7pZ7s1s8n4xM.jpg", episodes: 47, type: "TV", duration: "24m" },
    { id: "3", title: "Solo Leveling", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151807-m1gX3cw88skL.jpg", episodes: 2, type: "TV", duration: "24m" },
    { id: "4", title: "Frieren", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154587-n18610F3yF1W.jpg", episodes: 18, type: "TV", duration: "24m" },
    { id: "5", title: "Classroom of the Elite", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx163205-H6fDk3g37r24.jpg", episodes: 3, type: "TV", duration: "24m" },
    { id: "6", title: "Mashle", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151801-D36h22X8tB9w.jpg", episodes: 14, type: "TV", duration: "24m" },
    { id: "7", title: "Shangri-La Frontier", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151807-m1gX3cw88skL.jpg", episodes: 15, type: "TV", duration: "24m" },
    { id: "8", title: "Undead Unluck", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154587-n18610F3yF1W.jpg", episodes: 13, type: "TV", duration: "24m" },
];

export function LatestEpisodes() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">Latest Episodes</h2>
                <a href="/latest" className="text-xs text-subtext hover:text-white transition-colors">View All &gt;</a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {LATEST.map((anime) => (
                    <AnimeCard key={anime.id} {...anime} />
                ))}
            </div>
        </section>
    );
}
