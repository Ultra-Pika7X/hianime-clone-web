"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { anilist } from "@/lib/anilist";
import { MediaItem } from "@/types/anime"; // Ensure this type exists or is compatible
import { dbService } from "@/lib/db";
import {
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    collection,
    query,
    orderBy,
    writeBatch,
    getDoc
} from "firebase/firestore";

export type MediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

const LibraryContext = createContext<any>(undefined);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, firebaseUser, token, settings } = useAuth();
    const [history, setHistory] = useState<MediaItem[]>([]);
    const [mediaList, setMediaList] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<MediaItem[]>([]);

    const lastSyncRef = React.useRef<{ [key: string]: { time: number, progress: number } }>({});
    const syncedAt25Ref = React.useRef<{ [key: string]: boolean }>({});
    const [pendingSyncs, setPendingSyncs] = useState<{ animeId: number; episode: number; totalEpisodes: number }[]>([]);
    const syncInProgressRef = React.useRef(false);

    const loadAniListCollection = useCallback(async () => {
        if (!user || !token) return;
        try {
            const data = await anilist.getUserMediaList(Number(user.id), token);
            if (data?.MediaListCollection?.lists) {
                const allEntries = data.MediaListCollection.lists.flatMap((list: any) => list.entries);
                setMediaList(allEntries);
            }
        } catch (e) {
            console.error("Failed to load AniList collection", e);
        }
    }, [user, token]);

    useEffect(() => {
        const loadLocal = async () => {
            const h = await dbService.getHistory();
            h.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setHistory(h);
        };
        loadLocal();
        loadAniListCollection();
    }, [loadAniListCollection]);

    useEffect(() => {
        if (!user || !db || !firebaseUser) return;

        const syncRemoteHistory = async () => {
            const userId = user.id.toString();
            const historyRef = collection(db, "users", userId, "history");
            const q = query(historyRef, orderBy("timestamp", "desc"));

            try {
                const snapshot = await getDocs(q);
                const remoteItems = snapshot.docs.map((doc) => ({ ...doc.data() })) as MediaItem[];

                for (const item of remoteItems) {
                    await dbService.addToHistory(item);
                }
                const merged = await dbService.getHistory();
                merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setHistory(merged);
            } catch (e: any) {
                if (e.code !== 'permission-denied') console.error("History sync failed", e);
            }
        };

        syncRemoteHistory();
    }, [user]);

    const updateStatus = async (id: number, status: MediaListStatus, progress?: number) => {
        if (!token) return;

        setMediaList(prev => {
            const existingIdx = prev.findIndex(item => item.media.id === id);
            if (existingIdx >= 0) {
                const updated = [...prev];
                updated[existingIdx] = { ...updated[existingIdx], status, progress: progress ?? updated[existingIdx].progress };
                return updated;
            } else {
                return prev;
            }
        });

        try {
            await anilist.updateMediaListEntry(id, progress || 0, status, token);
            await loadAniListCollection();
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    const addToWatchlist = async (item: MediaItem) => {
        if (!token) return;
        await updateStatus(Number(item.id), "PLANNING");
    };

    const removeFromWatchlist = async (id: number) => {
        console.warn("Remove from watchlist not fully implemented.");
    };

    const isInWatchlist = (id: number) => {
        return mediaList.some((i) => i.media.id === id && (i.status === "PLANNING" || i.status === "CURRENT"));
    };

    const addToHistory = async (item: MediaItem) => {
        await dbService.addToHistory(item);
        const newHistory = await dbService.getHistory();
        newHistory.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setHistory(newHistory);

        if (user && db && firebaseUser) {
            const userId = user.id.toString();
            const docId = item.id.toString();
            try {
                const ref = doc(db, "users", userId, "history", docId);
                await setDoc(ref, { ...item, timestamp: Date.now() });
            } catch (e: any) {
                if (e.code !== 'permission-denied') console.error("Cloud sync failed", e);
            }
        }
    };

    const removeFromHistory = async (id: number) => {
        await dbService.removeFromHistory(id);
        const h = await dbService.getHistory();
        setHistory(h);
        if (user && db && firebaseUser) {
            await deleteDoc(doc(db, "users", user.id.toString(), "history", id.toString()));
        }
    };

    const clearHistory = async () => {
        await dbService.clearHistory();
        setHistory([]);
        if (user && db && firebaseUser) {
            try {
                const userId = user.id.toString();
                const batch = writeBatch(db);
                history.forEach((item) => {
                    batch.delete(doc(db, "users", userId, "history", item.id.toString()));
                });
                await batch.commit();
            } catch (e: any) {
                if (e.code !== 'permission-denied') console.error("Cloud history clear failed", e);
            }
        }
    };

    const markEpisodeComplete = async (item: MediaItem) => {
        await addToHistory({ ...item, progress: item.duration, timestamp: Date.now() });

        if (settings.autoSyncAniList) {
            const episodeNumber = item.watchedEpisode || 1;
            const totalEpisodes = item.totalEpisodes || 0;

            if (token) {
                let status: MediaListStatus = "CURRENT";
                if (totalEpisodes > 0 && episodeNumber >= totalEpisodes) status = "COMPLETED";
                await updateStatus(Number(item.id), status, episodeNumber);
            } else {
                setPendingSyncs(prev => {
                    const existing = prev.findIndex(p => p.animeId === Number(item.id));
                    if (existing >= 0) {
                        if (episodeNumber > prev[existing].episode) {
                            const updated = [...prev];
                            updated[existing] = { animeId: Number(item.id), episode: episodeNumber, totalEpisodes };
                            return updated;
                        }
                        return prev;
                    }
                    return [...prev, { animeId: Number(item.id), episode: episodeNumber, totalEpisodes }];
                });

                const queueKey = "anilist_pending_sync";
                const currentQueue = JSON.parse(localStorage.getItem(queueKey) || "[]");
                const dedupedQueue = currentQueue.filter((q: any) => q.animeId !== Number(item.id));
                dedupedQueue.push({ animeId: Number(item.id), episode: episodeNumber, totalEpisodes });
                localStorage.setItem(queueKey, JSON.stringify(dedupedQueue));
            }
        }
    };

    const syncPendingUpdates = useCallback(async () => {
        if (!token || syncInProgressRef.current) return;

        const queueKey = "anilist_pending_sync";
        const queue = JSON.parse(localStorage.getItem(queueKey) || "[]");

        if (queue.length === 0) return;

        syncInProgressRef.current = true;

        try {
            for (const item of queue) {
                await new Promise(r => setTimeout(r, 500));
                let status: MediaListStatus = "CURRENT";
                if (item.totalEpisodes > 0 && item.episode >= item.totalEpisodes) {
                    status = "COMPLETED";
                }
                await updateStatus(item.animeId, status, item.episode);
            }
            localStorage.removeItem(queueKey);
            setPendingSyncs([]);
        } catch (e) {
            console.error("Failed to sync pending updates", e);
        } finally {
            syncInProgressRef.current = false;
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            syncPendingUpdates();
        }
        const handleFocus = () => {
            if (token) syncPendingUpdates();
        };
        window.addEventListener("focus", handleFocus);
        window.addEventListener("online", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("online", handleFocus);
        };
    }, [token, syncPendingUpdates]);

    const saveEpisodeProgress = async (animeId: number, episode: number, progress: number, duration: number) => {
        await dbService.saveEpisodeProgress(animeId, episode, progress, duration);

        if (user && db && firebaseUser) {
            const now = Date.now();
            const docId = `${animeId}_${episode}`;
            const lastSync = lastSyncRef.current[docId];
            const lastTime = lastSync?.time || 0;
            const lastProgress = lastSync?.progress || 0;

            const timeDiff = now - lastTime;
            const progressDiff = Math.abs(progress - lastProgress);
            const totalDuration = duration || 1;
            const percentChange = progressDiff / totalDuration;

            const shouldSync =
                percentChange > 0.05 ||
                (timeDiff > 60000 && progressDiff > 0) ||
                (progress / totalDuration > 0.95 && percentChange > 0.01);

            if (shouldSync) {
                lastSyncRef.current[docId] = { time: now, progress };
                const userId = user.id.toString();
                setDoc(doc(db, "users", userId, "episode_progress", docId), {
                    animeId, episode, progress, duration, timestamp: now
                }).catch(e => {
                    if (e.code !== 'permission-denied') console.error("Firestore sync failed", e);
                });

                const percentWatched = progress / totalDuration;
                if (percentWatched >= 0.25 && settings.autoSyncAniList && token && !syncedAt25Ref.current[docId]) {
                    syncedAt25Ref.current[docId] = true;
                    updateStatus(animeId, "CURRENT", episode).catch(e => {
                        syncedAt25Ref.current[docId] = false;
                    });
                }
            }
        }
    };

    const getEpisodeProgress = async (animeId: number, episode: number) => {
        const local = await dbService.getEpisodeProgress(animeId, episode);
        if (local) return local;

        if (user && db && firebaseUser) {
            try {
                const userId = user.id.toString();
                const docId = `${animeId}_${episode}`;
                const docRef = doc(db, "users", userId, "episode_progress", docId);
                const snapshot = await getDoc(docRef);

                if (snapshot.exists()) {
                    const data = snapshot.data();
                    await dbService.saveEpisodeProgress(
                        animeId,
                        episode,
                        data.progress,
                        data.duration
                    );
                    return {
                        ...data,
                        animeId,
                        episode
                    };
                }
            } catch (e: any) {
                if (e.code !== 'permission-denied') console.error("Failed to fetch remote progress", e);
            }
        }
        return undefined;
    };

    return (
        <LibraryContext.Provider
            value={{
                history,
                watchlist,
                mediaList,
                addToHistory,
                removeFromHistory,
                addToWatchlist,
                removeFromWatchlist,
                isInWatchlist,
                clearHistory,
                markEpisodeComplete,
                saveEpisodeProgress,
                getEpisodeProgress,
                updateStatus,
                syncPendingUpdates,
                pendingSyncs
            }}
        >
            {children}
        </LibraryContext.Provider>
    );
};
export const useLibrary = () => useContext(LibraryContext);
