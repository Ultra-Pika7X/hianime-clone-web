import { api } from "@/lib/api";
import { AnimeCard } from "@/components/ui/AnimeCard";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || "";
    const results = query ? await api.search(query) : [];

    return (
        <div className="space-y-6 pb-10">
            <h1 className="text-2xl font-bold text-white">
                Search Results for <span className="text-primary">"{query}"</span>
            </h1>

            {results.length === 0 ? (
                <div className="text-center py-20 text-subtext">
                    {query ? "No results found." : "Enter a search term to find anime."}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {results.map((anime) => (
                        <AnimeCard key={anime.id} {...anime} />
                    ))}
                </div>
            )}
        </div>
    );
}
