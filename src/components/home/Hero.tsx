"use client";

import { useState, useEffect } from "react";
import { Play, Info, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Placeholder data for the carousel
const HERO_SLIDES = [
    {
        id: 1,
        title: "One Piece",
        description: "Gol D. Roger was known as the 'Pirate King', the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world.",
        image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
        rating: "9.5",
        quality: "HD",
        type: "TV",
        duration: "24m",
        date: "Oct 20, 1999"
    },
    {
        id: 2,
        title: "Jujutsu Kaisen Season 2",
        description: "The second season of Jujutsu Kaisen. High school student Yuji Itadori, who is idly indulging in baseless paranormal activities with the Occult Club, spends his days at either the clubroom or the hospital.",
        image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/145064-7pZ7s1s8n4xM.jpg",
        rating: "8.9",
        quality: "HD",
        type: "TV",
        duration: "24m",
        date: "Jul 6, 2023"
    },
    {
        id: 3,
        title: "Frieren: Beyond Journey's End",
        description: "The play begins where the story ends. The hero's party has defeated the Demon King and brought peace to the land. But for the elf Frieren, time passes differently.",
        image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23sm1nt.jpg",
        rating: "9.1",
        quality: "HD",
        type: "TV",
        duration: "24m",
        date: "Sep 29, 2023"
    }
];

export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = HERO_SLIDES[currentSlide];

    return (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                style={{ backgroundImage: `url(${slide.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:w-2/3">
                <div className="flex items-center gap-3 text-primary text-sm font-bold mb-3">
                    <span className="text-primary">#{currentSlide + 1} Spotlight</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white uppercase">{slide.type}</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 line-clamp-1">
                    {slide.title}
                </h2>

                <div className="flex items-center gap-4 text-sm text-subtext mb-4 hidden md:flex">
                    <div className="flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" />
                        {slide.quality}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {slide.duration}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {slide.date}
                    </div>
                </div>

                <p className="text-subtext line-clamp-3 mb-6 max-w-xl text-sm md:text-base hidden md:block">
                    {slide.description}
                </p>

                <div className="flex items-center gap-4">
                    <Link href={`/watch/${slide.id}`} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-bold px-6 py-3 rounded-full transition-transform active:scale-95">
                        <Play className="w-5 h-5 fill-current" />
                        Watch Now
                    </Link>
                    <Link href={`/anime/${slide.id}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full backdrop-blur-sm transition-colors">
                        Details
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button _onClick={prevSlide} className="p-3 bg-black/50 hover:bg-primary hover:text-background text-white rounded-full transition-colors backdrop-blur-sm">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button _onClick={nextSlide} className="p-3 bg-black/50 hover:bg-primary hover:text-background text-white rounded-full transition-colors backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
