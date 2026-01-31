
import axios from 'axios';
import * as cheerio from 'cheerio';

export class Gogoanime {
    protected baseUrl = 'https://anitaku.to';
    protected ajaxUrl = 'https://ajax.gogocdn.net/ajax';

    private headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': this.baseUrl
    };

    /**
     * Search for an anime
     */
    async search(query: string) {
        try {
            const searchUrl = `${this.baseUrl}/search.html?keyword=${encodeURIComponent(query)}`;
            const { data } = await axios.get(searchUrl, { headers: this.headers, timeout: 10000 });
            const $ = cheerio.load(data);
            const results: any[] = [];

            $('.last_episodes ul.items li').each((i, el) => {
                const id = $(el).find('.name a').attr('href')?.replace('/category/', '');
                const title = $(el).find('.name a').text().trim();
                const image = $(el).find('.img a img').attr('src');
                const releaseDate = $(el).find('.released').text().trim().replace('Released:', '').trim();

                if (id && title) {
                    results.push({
                        id: id,
                        title: title,
                        image: image,
                        releaseDate: releaseDate
                    });
                }
            });

            return { results };
        } catch (err: any) {
            console.error(`Gogoanime Search Error (${query}):`, err.message);
            return { results: [] };
        }
    }

    /**
     * Get detailed info (episodes etc)
     */
    async fetchAnimeInfo(id: string) {
        try {
            const { data } = await axios.get(`${this.baseUrl}/category/${id}`, { headers: this.headers, timeout: 10000 });
            const $ = cheerio.load(data);

            const title = $('.anime_info_body_bg h1').text().trim();
            const image = $('.anime_info_body_bg img').attr('src');
            const description = $('.description').text().replace('Plot Summary: ', '').trim();
            const movieId = $('#movie_id').attr('value');
            const alias = $('#alias_anime').attr('value');
            const episodes: any[] = [];

            // 1. Try SSR episodes
            if ($('#episode_related li').length > 0) {
                $('#episode_related li a').each((i, el) => {
                    const href = $(el).attr('href')?.trim();
                    const name = $(el).find('.name').text().trim();
                    const numStr = $(el).attr('data-num') || name.replace('EP ', '');
                    if (href) {
                        episodes.push({
                            id: href.replace('/', ''),
                            number: parseFloat(numStr),
                            title: name,
                        });
                    }
                });
            }

            // 2. Try AJAX (longer lists)
            if (episodes.length === 0 && movieId) {
                const epStart = $('#episode_page a.active').attr('ep_start') || '0';
                const epEnd = $('#episode_page a.active').attr('ep_end') || '2000';
                try {
                    const episodesRes = await axios.get(`${this.ajaxUrl}/load-list-episode?ep_start=${epStart}&ep_end=${epEnd}&id=${movieId}&default_ep=${0}&alias=${alias}`);
                    const $ep = cheerio.load(episodesRes.data);
                    $('#episode_related li a').each((i, el) => {
                        const href = $(el).attr('href')?.trim(); // /category/name-episode-1
                        const name = $(el).text().trim(); // EP 1
                        if (href) {
                            // Correct the ID format: remove leading slash
                            episodes.push({
                                id: href.replace('/', '').trim(),
                                number: parseFloat(name.replace('EP ', '')),
                                title: name,
                            });
                        }
                    });
                    episodes.reverse();
                } catch (e) { }
            }

            if (episodes.length > 0) {
                return { id, title, image, description, episodes };
            }
            return null;
        } catch (err: any) {
            console.error("Gogoanime Info Error:", err.message);
            return null;
        }
    }

    /**
     * Get video sources
     */
    async fetchEpisodeSources(episodeId: string) {
        try {
            const { data } = await axios.get(`${this.baseUrl}/${episodeId}`, { headers: this.headers, timeout: 10000 });
            const $ = cheerio.load(data);
            const sources: any[] = [];
            const serverPromises: Promise<any>[] = [];

            $('.anime_muti_link ul li a').each((i, el) => {
                const serverName = $(el).text().replace('Choose this server', '').trim();
                let videoUrl = $(el).attr('data-video');

                if (videoUrl) {
                    if (!videoUrl.startsWith('http')) videoUrl = `https:${videoUrl}`;
                    if (serverName.includes('Vidstreaming') || serverName.includes('Gogo server') || serverName.includes('StreamWish') || serverName.includes('HD-1') || serverName.includes('HD-2') || serverName.includes('Vidcloud')) {
                        serverPromises.push(this.extractDirectStream(videoUrl, serverName));
                    }
                }
            });

            const results = await Promise.all(serverPromises);
            results.forEach(res => { if (res) sources.push(res); });
            return { sources };
        } catch (err: any) {
            console.error("Gogoanime Source Error:", err.message);
            return { sources: [] };
        }
    }

    private async extractDirectStream(url: string, name: string) {
        try {
            const { data } = await axios.get(url, { headers: this.headers, timeout: 10000 });

            // 1. JSON block
            const sourcesMatch = data.match(/sources:\s*(\[[^\]]+\])/);
            if (sourcesMatch && sourcesMatch[1]) {
                const fileMatches = [...sourcesMatch[1].matchAll(/file:\s*['"]([^'"]+)['"]/g)];
                const m3u8 = fileMatches.find(m => m[1].includes('.m3u8'));
                if (m3u8) return { url: m3u8[1], quality: `${name} (HLS)`, isM3U8: true };
            }

            // 2. Packed JS
            if (data.includes('eval(function(p,a,c,k,e,d)')) {
                const unpacked = this.unpacker(data);
                if (unpacked) {
                    const m3u8Match = unpacked.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/);
                    if (m3u8Match) return { url: m3u8Match[0], quality: `${name} (HLS Unpacked)`, isM3U8: true };
                }
            }

            // 3. Raw Fallback
            const m3u8Match = data.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/);
            if (m3u8Match && !data.includes('eval(function')) {
                if (!m3u8Match[0].includes('google') && !m3u8Match[0].includes('analytics')) {
                    return { url: m3u8Match[0], quality: `${name} (HLS Fallback)`, isM3U8: true };
                }
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    private unpacker(str: string): string | null {
        const re = /}\('(.*)', *(\d+), *(\d+), *'(.*?)'\.split\('\|'\)/;
        const m = re.exec(str);
        if (!m) return null;
        let p = m[1];
        const a = parseInt(m[2]);
        const c = parseInt(m[3]);
        const k = m[4].split('|');
        let count = c;
        while (count--) {
            const val = k[count];
            if (val) {
                const key = this.getSym(count, a);
                p = p.replace(new RegExp('\\b' + key + '\\b', 'g'), val);
            }
        }
        return p;
    }

    private getSym(num: number, a: number): string {
        if (a <= 36) return num.toString(36);
        let sym = "";
        do {
            const t = num % 62;
            if (t <= 9) sym = String.fromCharCode(48 + t) + sym;
            else if (t <= 35) sym = String.fromCharCode(97 + t - 10) + sym;
            else sym = String.fromCharCode(65 + t - 36) + sym;
            num = Math.floor(num / 62);
        } while (num > 0);
        return sym;
    }
}
