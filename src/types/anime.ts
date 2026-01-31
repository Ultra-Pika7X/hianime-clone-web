export interface Anime {
    id: string;
    title: string;
    url: string;
    image: string;
    releaseDate?: string;
    description?: string;
    genres?: string[];
    subOrDub?: 'sub' | 'dub';
    type?: string;
    status?: string;
    otherName?: string;
    totalEpisodes?: number;
    episodes?: Episode[];
}

export interface Episode {
    id: string;
    number: number;
    url: string;
}

export interface SearchResult {
    id: string;
    title: string;
    image: string;
    releaseDate: string;
    subOrDub: 'sub' | 'dub';
}

export interface StreamSource {
    url: string;
    isM3U8: boolean;
    quality?: string;
}
