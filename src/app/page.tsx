import { Hero } from "@/components/home/Hero";
import { LatestEpisodes } from "@/components/home/LatestEpisodes";
import { Trending } from "@/components/home/Trending";
import { ContinueWatching } from "@/components/home/ContinueWatching";

export default function Home() {
  return (
    <div className="space-y-8 pb-8">
      <Hero />
      <ContinueWatching />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <LatestEpisodes />

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">New On HiAnime</h2>
            <div className="text-subtext">Coming soon...</div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <Trending />
        </div>
      </div>
    </div>
  );
}
