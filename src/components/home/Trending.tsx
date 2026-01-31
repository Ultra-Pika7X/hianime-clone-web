import { Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data
const TRENDING = [
    { id: "1", title: "One Piece", rank: 1, image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-YCDuyNY6F7bI.jpg", views: "1.2M" },
    { id: "2", title: "Jujutsu Kaisen 2nd Season", rank: 2, image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx145064-7pZ7s1s8n4xM.jpg", views: "980K" },
    { id: "3", title: "Solo Leveling", rank: 3, image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151807-m1gX3cw88skL.jpg", views: "850K" },
    { id: "4", title: "Classroom of the Elite 3rd Season", rank: 4, image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx163205-H6fDk3g37r24.jpg", views: "720K" },
    { id: "5", title: "Mashle: Magic and Muscles", rank: 5, image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151801-D36h22X8tB9w.jpg", views: "650K" },
];

export function Trending() {
    return (
        <section>
            <h2 className="text-xl font-bold text-primary mb-4">Trending</h2>
            <div className="bg-surface/30 rounded-xl overflow-hidden border border-white/5">
                {TRENDING.map((anime, index) => (
                    <Link
                        key={anime.id}
                        href={`/anime/${anime.id}`}
                        className={cn(
                            "flex items-center gap-4 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group",
                            index < 3 ? "bg-gradient-to-r from-primary/5 to-transparent" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 text-center font-bold text-lg",
                            index === 0 ? "text-primary" : index === 1 ? "text-blue-400" : index === 2 ? "text-green-400" : "text-subtext"
                        )}>
                            {anime.rank}
                        </div>

                        <div className="w-12 h-16 shrink-0 rounded overflow-hidden">
                            <img src={anime.image} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="font-medium text-sm text-white line-clamp-1 group-hover:text-primary transition-colors">{anime.title}</h3>
                            <p className="text-xs text-subtext mt-1">{anime.views} views</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
