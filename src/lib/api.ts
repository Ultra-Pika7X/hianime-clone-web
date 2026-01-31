import { Anime, SearchResult, StreamSource } from "@/types/anime";
import { anilist, AnilistMedia } from "@/lib/anilist";

export const api = {
    /**
     * Get recent movie/show releases
     */
    getRecentEpisodes: async (page: number = 1): Promise<SearchResult[]> => {
        try {
            const data = await anilist.getRecentEpisodes(page);
            const mediaList: AnilistMedia[] = data.Page.media;

            return mediaList.map((media) => ({
                id: media.id.toString(),
                title: media.title.english || media.title.romaji,
                image: media.coverImage.large,
                releaseDate: media.nextAiringEpisode
                    ? `Ep ${media.nextAiringEpisode.episode} in ${Math.round(media.nextAiringEpisode.timeUntilAiring / 3600)}h`
                    : media.status,
                subOrDub: "sub"
            }));
        } catch (err) {
            console.error("Error fetching recent episodes:", err);
            return [];
        }
    },

    /**
     * Search for anime
     */
    search: async (query: string, page: number = 1): Promise<SearchResult[]> => {
        try {
            const data = await anilist.getSearch(query, page);
            const mediaList: AnilistMedia[] = data.Page.media;

            return mediaList.map((media) => ({
                id: media.id.toString(),
                title: media.title.english || media.title.romaji,
                image: media.coverImage.large,
                releaseDate: media.seasonYear ? media.seasonYear.toString() : "",
                subOrDub: "sub"
            }));
        } catch (err) {
            console.error("Error searching anime:", err);
            return [];
        }
    },

    /**
     * Get anime details
     */
    getAnimeDetails: async (id: string): Promise<Anime | null> => {
        try {
            const media = await anilist.getInfo(parseInt(id));
            if (!media || !media.Media) return null;

            const m = media.Media;

            // Map episodes (Anilist doesn't provide individual episode links/titles efficiently in public API, 
            // so we generate a numeric list based on total 'episodes' count)
            const episodeList = [];
            const totalEps = m.episodes || (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : 0) || 12;

            for (let i = 1; i <= totalEps; i++) {
                episodeList.push({
                    id: `${m.idMal}-${i}`, // Composite ID for stream fetching: {malId}-{episode}
                    number: i,
                    url: `/watch/${m.id}?ep=${i}`
                });
            }

            return {
                id: m.id.toString(),
                title: m.title.english || m.title.romaji,
                url: `https://anilist.co/anime/${m.id}`,
                image: m.coverImage.extraLarge || m.coverImage.large,
                description: m.description, // HTML description
                type: m.format,
                releaseDate: m.seasonYear ? m.seasonYear.toString() : "",
                genres: m.genres,
                status: m.status,
                totalEpisodes: totalEps,
                episodes: episodeList
            };
        } catch (err) {
            console.error("Error fetching details:", err);
            return null;
        }
    },

    /**
     * Get stream sources
     * Expected dateId format: "{malId}-{episodeNumber}"
     */
    getStreamSources: async (dateId: string): Promise<StreamSource | null> => {
        try {
            // Parse the composite ID we created in getAnimeDetails
            const [malId, episode] = dateId.split("-");

            if (!malId || !episode) return null;

            // Construct VidSrc Embed URL
            // https://vidsrc.xyz/embed/anime/{mal_id}/{episode}
            const embedUrl = `https://vidsrc.xyz/embed/anime/${malId}/${episode}`;

            return {
                url: embedUrl,
                isM3U8: false,
                quality: "HD",
                type: "iframe" // Custom type handled by VideoPlayer
            } as any;
        } catch (err) {
            console.error("Error fetching stream:", err);
            return null;
        }
    }
};
