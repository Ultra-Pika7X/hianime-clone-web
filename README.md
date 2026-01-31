# HiAnime Clone - Web Version

A modern, ad-free anime streaming application built with **Next.js 15**, **TailwindCSS**, and **TypeScript**.

## 🚀 Features

-   **High-Quality Streaming**: Powered by **VidSrc** (Embeds) with automatic quality selection.
-   **Ad-Block System**: Custom sandboxed iframe implementation to block intrusive pop-ups and redirects.
-   **Anilist Integration**:
    -   Authentic metadata (Titles, Images, Descriptions) via Anilist API.
    -   **User Authentication**: Log in with your Anilist account.
    -   **Sync**: Automatically tracks your watch progress ("Current" list) and episode count.
-   **Continue Watching**: "Jump back in" row on the home page tracking your local and cloud history.
-   **Modern UI**: Responsive design with `framer-motion` animations and `lucide-react` icons.

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: TailwindCSS
-   **State Management**: React Context + IndexedDB (Local History)
-   **Auth**: Firebase Auth (Structure ported) + Anilist OAuth
-   **Icons**: Lucide React & React Icons

## ⚡ Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Ultra-Pika7X/hianime-clone-web.git
    cd hianime-clone-web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project in [Vercel](https://vercel.com).
3.  Deploy! (No complex environment variables required for basic functionality).


## 📝 License

This project is for educational purposes only. Content is scraped/embedded from third-party sources. Use at your own risk.

> Last Updated: Jan 2026
