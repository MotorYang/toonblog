# 🎨 ToonBlog

<div align="center">

**A vibrant, AI-powered personal blog with a Neo-Brutalist soul.**

[中文文档 (Chinese Documentation)](./README_ZH.md)

</div>

---

## 📖 Overview

**ToonBlog** is a modern Single Page Application (SPA) built with **React 18** and **TypeScript**. It rejects standard minimalist design in favor of a high-contrast **Neo-Brutalist** aesthetic, featuring bold borders, hard shadows, and vibrant colors.

Beyond its looks, ToonBlog is deeply integrated with **Google Gemini AI**, transforming the blogging experience with AI-assisted writing, automatic summarization, and a conversational assistant.

## ✨ Key Features

### 1. 🎨 Dynamic Visual Engine
*   **Triple Theme System**: Switch instantly between three distinct visual identities:
    *   **Cartoon (Default)**: Bright colors, rounded corners, Fredoka font.
    *   **Cyberpunk**: Dark mode, neon glows, glitch effects, Orbitron font.
    *   **Chinese Style (Gufeng)**: Rice paper textures, ink colors, serif typography.
*   **CSS Variable Architecture**: Built on a robust semantic CSS variable system mapped to Tailwind configuration.
*   **Micro-Interactions**: "Pop-in" page transitions, tactile button states, and hover effects.

### 2. 🧠 AI-Powered (Google Gemini)
*   **Magic Write**: In the Admin editor, input a title and let AI generate a funny, formatted Markdown draft.
*   **TL;DR Summarizer**: Automatically generates concise summaries for long blog posts.
*   **Global AI Chat**: A persistent chat assistant living in the global toolbox.

### 3. 🛠️ Interactive Tools
*   **Global Toolbox**: A floating widget containing:
    *   **Lo-Fi Music Player**: Vinyl animation with play/pause/skip controls.
    *   **Chat Assistant**: Persists across page navigation.
*   **Markdown Support**: Full Markdown rendering with custom typography styles for each theme.

### 4. 📊 Admin Dashboard
*   **Analytics**: Visual charts showing category distribution and monthly growth.
*   **Leaderboard**: Top 10 most viewed articles.
*   **CRUD Operations**: Create, Read, Delete posts with mock authentication.

---

## 🏗️ Technical Architecture

ToonBlog follows a **Service-Oriented Architecture** on the client side to simulate a full-stack environment.

### Tech Stack
*   **Core**: React 18, TypeScript, Vite
*   **State Management**: React Context API (replaces Redux/Pinia)
*   **Styling**: Tailwind CSS (Custom Config + Typography Plugin)
*   **AI SDK**: `@google/genai` (Google Gemini API)
*   **Routing**: React Router DOM v6+
*   **Icons**: Lucide React

### Data Flow
1.  **UI Components** trigger actions.
2.  **Context Providers** (BlogContext, AuthContext) handle state logic.
3.  **Service Layer** (`api.ts`, `geminiService.ts`) handles data fetching.
    *   *Note*: The `api.ts` currently mocks a database with `setTimeout` to simulate network latency, making it easy to swap for a real backend later.

### Directory Structure

```text
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # Main app shell (Navbar, Footer)
│   ├── ToonCard.tsx     # The core aesthetic card component
│   ├── GlobalToolbox.tsx# Floating music/chat widget
│   └── ...
├── context/             # Global State Managers
│   ├── AuthContext.tsx  # User session & permissions
│   ├── BlogContext.tsx  # CRUD & Stats logic
│   ├── ThemeContext.tsx # CSS Variable switching
│   └── LanguageContext.tsx # i18n logic
├── locales/             # Translation dictionaries (en/zh)
├── pages/               # Route Views
│   ├── Home.tsx         # Search, Filter, Pagination
│   ├── Dashboard.tsx    # Admin Analytics
│   ├── CreatePost.tsx   # Markdown Editor + AI
│   └── BlogPost.tsx     # Single Post View
├── services/            # Business Logic
│   ├── api.ts           # Mock Backend Service
│   └── geminiService.ts # Google AI Integration
├── types.ts             # TypeScript Interfaces
├── constants.ts         # Mock Data
├── App.tsx              # Route Setup
└── main.tsx             # Entry Point
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   A Google Gemini API Key (Get it from [Google AI Studio](https://aistudiocdn.com/google-ai-studio))

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd toon-blog
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_actual_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

### 🔑 Default Credentials

To access Admin features (Dashboard, Create Post):
*   **Username**: `admin`
*   **Password**: `123456`

---

## 🌍 Internationalization (i18n)

The app supports **English** and **Simplified Chinese**.
*   Translations are stored in `src/locales/translations.ts`.
*   The `LanguageContext` provides a `t()` function for dynamic text replacement.

## 🎨 Customizing Themes

Themes are defined in `index.html` using CSS Variables. To add a new theme:
1.  Define a `.theme-name` class in `index.html` with color/font variables.
2.  Add the theme key to `types.ts`.
3.  Update `components/ThemeSelector.tsx` to include the new option.

---

<div align="center">
  Built with ❤️ using React & Vite
</div>
