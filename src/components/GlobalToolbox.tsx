import { Chat, GenerateContentResponse } from '@google/genai';
import {
  AlertTriangle,
  Maximize2,
  MessageSquare,
  Minimize2,
  Music,
  Pause,
  Play,
  Send,
  Settings,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

import { getChatSession } from '../services/geminiService.ts';

// Mock Playlist
const PLAYLIST = [
  {
    title: '红色高跟鞋',
    artist: '蔡健雅',
    url: 'http://music.163.com/song/media/outer/url?id=2046829393.mp3',
  },
  {
    title: '起风了',
    artist: '买辣椒也用券',
    url: 'http://music.163.com/song/media/outer/url?id=1330348068.mp3',
  },
  {
    title: '城南花已开',
    artist: '三亩地',
    url: 'http://music.163.com/song/media/outer/url?id=468176711.mp3',
  },
];

export const GlobalToolbox: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'music' | 'chat'>('music');

  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatError, setChatError] = useState('');

  // 检测是否为移动设备
  const isMobile = () => {
    return window.innerWidth < 640; // sm breakpoint
  };

  // Init Audio - 自动播放第一首歌
  useEffect(() => {
    audioRef.current = new Audio(PLAYLIST[0].url);
    audioRef.current.addEventListener('ended', handleNextTrack);

    // 尝试自动播放
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          console.log('Auto-play started successfully');
        })
        .catch((error) => {
          console.log('Auto-play was prevented by browser:', error);
          setIsPlaying(false);
        });
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', handleNextTrack);
    };
  }, []);

  // 打开时检测是否移动端，自动全屏
  useEffect(() => {
    if (isOpen && isMobile()) {
      setIsFullscreen(true);
    }
  }, [isOpen]);

  // Update Audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      if (audioRef.current.src !== PLAYLIST[currentTrackIndex].url) {
        audioRef.current.src = PLAYLIST[currentTrackIndex].url;
        if (isPlaying) audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  // Init Chat
  useEffect(() => {
    try {
      chatSessionRef.current = getChatSession();
    } catch (e) {
      console.error('Chat init failed', e);
      setChatError('API Key missing');
    }
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!chatSessionRef.current) {
      setMessages((prev) => [...prev, { role: 'user', text: input }]);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: "Sorry, I can't think right now (API Key issue)." },
      ]);
      setInput('');
      return;
    }

    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({
        message: userMsg,
      });
      setMessages((prev) => [...prev, { role: 'model', text: result.text || "I'm speechless!" }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model', text: t('tool.send_error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-[100] flex flex-col items-end font-sans">
      {/* Expanded Box */}
      {isOpen && (
        <div
          className={`mb-3 sm:mb-4 bg-white border-4 border-black shadow-toon-lg transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in overflow-hidden ${
            isFullscreen
              ? 'fixed inset-0 sm:inset-4 rounded-none sm:rounded-3xl w-full h-full sm:w-auto sm:h-auto z-[200] m-0'
              : 'rounded-2xl sm:rounded-3xl w-[calc(100vw-1rem)] max-w-[380px] sm:max-w-md'
          }`}
        >
          {/* Header / Tabs */}
          <div
            className={`flex border-b-4 border-black bg-gradient-to-r from-gray-50 to-gray-100 ${
              isFullscreen ? 'rounded-t-none sm:rounded-t-3xl' : 'rounded-t-2xl sm:rounded-t-3xl'
            }`}
          >
            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 p-2.5 sm:p-3 font-black flex items-center justify-center gap-1.5 sm:gap-2 transition-colors text-sm sm:text-base ${
                activeTab === 'music'
                  ? 'bg-toon-yellow text-gray-900 shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.1)]'
                  : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              <Music size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('tool.beats')}</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 p-2.5 sm:p-3 font-black flex items-center justify-center gap-1.5 sm:gap-2 border-l-4 border-black transition-colors text-sm sm:text-base ${
                activeTab === 'chat'
                  ? 'bg-toon-blue text-gray-900 shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.1)]'
                  : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              <MessageSquare size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('tool.chat')}</span>
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 sm:p-3 bg-toon-purple text-white border-l-4 border-black hover:bg-purple-700 transition-all active:scale-95"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 size={18} className="sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2.5 sm:p-3 bg-toon-red text-white border-l-4 border-black hover:bg-red-600 transition-all active:scale-95"
              aria-label="Close"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div
            className={`bg-gradient-to-br from-white to-gray-50 relative overflow-hidden ${
              isFullscreen ? 'h-[calc(100%-60px)] sm:h-[calc(100%-68px)]' : 'h-[380px] sm:h-96'
            }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-toon-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-toon-purple/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* MUSIC TAB */}
            {activeTab === 'music' && (
              <div className="h-full flex flex-col p-4 pb-6 sm:p-6 sm:pb-8 items-center justify-between relative z-10">
                {/* Vinyl Record Animation */}
                <div className="relative mt-2 sm:mt-4">
                  <div
                    className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] relative ${
                      isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''
                    } ${isFullscreen ? 'w-48 h-48 sm:w-64 sm:h-64' : 'w-28 h-28 sm:w-36 sm:h-36'}`}
                  >
                    {/* Vinyl grooves */}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-700 m-3"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-gray-700 m-6"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-gray-700 m-9"></div>

                    {/* Center label */}
                    <div
                      className={`bg-toon-yellow rounded-full border-3 border-black flex items-center justify-center relative z-10 ${
                        isFullscreen ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-14 h-14 sm:w-18 sm:h-18'
                      }`}
                    >
                      <Music
                        size={isFullscreen ? 48 : 24}
                        className={`text-gray-900 ${isFullscreen ? 'sm:w-16 sm:h-16' : 'sm:w-7 sm:h-7'}`}
                      />
                    </div>
                  </div>

                  {/* Floating music notes */}
                  {isPlaying && (
                    <>
                      <div
                        className={`absolute -top-2 -right-2 text-toon-red animate-[bounce_1s_ease-in-out_infinite] ${
                          isFullscreen ? 'text-4xl sm:text-5xl' : 'text-2xl'
                        }`}
                      >
                        ♪
                      </div>
                      <div
                        className={`absolute -top-4 -left-2 text-toon-blue animate-[bounce_1.2s_ease-in-out_infinite_0.2s] ${
                          isFullscreen ? 'text-3xl sm:text-4xl' : 'text-xl'
                        }`}
                      >
                        ♫
                      </div>
                    </>
                  )}
                </div>

                {/* Track Info */}
                <div className="text-center px-2">
                  <h3
                    className={`font-black text-gray-900 truncate mb-0.5 ${
                      isFullscreen
                        ? 'text-2xl sm:text-3xl max-w-md sm:max-w-2xl mb-2'
                        : 'text-base sm:text-lg max-w-[280px] sm:max-w-xs'
                    }`}
                  >
                    {PLAYLIST[currentTrackIndex].title}
                  </h3>
                  <p
                    className={`font-bold text-gray-500 ${
                      isFullscreen ? 'text-lg sm:text-xl mb-3' : 'text-xs sm:text-sm'
                    }`}
                  >
                    {PLAYLIST[currentTrackIndex].artist}
                  </p>
                  <div
                    className={`inline-block bg-toon-yellow/20 border-2 border-black rounded-full ${
                      isFullscreen ? 'mt-2 px-4 py-1.5' : 'mt-1.5 px-2.5 py-0.5'
                    }`}
                  >
                    <span
                      className={`font-black text-gray-900 ${
                        isFullscreen ? 'text-base sm:text-lg' : 'text-xs'
                      }`}
                    >
                      {currentTrackIndex + 1} / {PLAYLIST.length}
                    </span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div
                  className={`flex items-center pb-1 ${
                    isFullscreen ? 'gap-6 sm:gap-8' : 'gap-2.5 sm:gap-3'
                  }`}
                >
                  <button
                    onClick={handlePrevTrack}
                    className={`group border-3 border-black rounded-xl hover:bg-gray-100 bg-white shadow-toon-sm hover:shadow-toon active:translate-y-[2px] active:shadow-toon-sm transition-all ${
                      isFullscreen ? 'p-4 sm:p-5' : 'p-2 sm:p-2.5'
                    }`}
                    aria-label="Previous track"
                  >
                    <SkipBack
                      size={isFullscreen ? 28 : 18}
                      className={`text-gray-900 group-hover:scale-110 transition-transform ${
                        isFullscreen ? 'sm:w-8 sm:h-8' : 'sm:w-5 sm:h-5'
                      }`}
                    />
                  </button>

                  <button
                    onClick={togglePlay}
                    className={`group border-4 border-black rounded-full bg-gradient-to-br from-toon-yellow to-yellow-400 hover:from-yellow-400 hover:to-toon-yellow shadow-toon hover:shadow-toon-lg active:translate-y-[3px] active:shadow-toon-sm transition-all ${
                      isFullscreen ? 'p-6 sm:p-8' : 'p-3.5 sm:p-4'
                    }`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause
                        size={isFullscreen ? 40 : 24}
                        className={`text-gray-900 group-hover:scale-110 transition-transform ${
                          isFullscreen ? 'sm:w-12 sm:h-12' : 'sm:w-7 sm:h-7'
                        }`}
                      />
                    ) : (
                      <Play
                        size={isFullscreen ? 40 : 24}
                        className={`pl-0.5 text-gray-900 group-hover:scale-110 transition-transform ${
                          isFullscreen ? 'sm:w-12 sm:h-12' : 'sm:w-7 sm:h-7'
                        }`}
                      />
                    )}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className={`group border-3 border-black rounded-xl hover:bg-gray-100 bg-white shadow-toon-sm hover:shadow-toon active:translate-y-[2px] active:shadow-toon-sm transition-all ${
                      isFullscreen ? 'p-4 sm:p-5' : 'p-2 sm:p-2.5'
                    }`}
                    aria-label="Next track"
                  >
                    <SkipForward
                      size={isFullscreen ? 28 : 18}
                      className={`text-gray-900 group-hover:scale-110 transition-transform ${
                        isFullscreen ? 'sm:w-8 sm:h-8' : 'sm:w-5 sm:h-5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col bg-transparent relative z-10">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {messages.length === 0 && !chatError && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <div
                        className={`bg-toon-blue border-3 border-black rounded-full flex items-center justify-center mb-3 shadow-toon animate-bounce ${
                          isFullscreen ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16 sm:w-20 sm:h-20'
                        }`}
                      >
                        <MessageSquare
                          size={isFullscreen ? 48 : 28}
                          className={`text-gray-900 ${
                            isFullscreen ? 'sm:w-16 sm:h-16' : 'sm:w-8 sm:h-8'
                          }`}
                        />
                      </div>
                      <p
                        className={`text-gray-400 font-bold italic ${
                          isFullscreen ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                        }`}
                      >
                        {t('tool.chat_welcome')}
                      </p>
                    </div>
                  )}

                  {chatError && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <div
                        className={`bg-toon-red border-3 border-black rounded-full flex items-center justify-center mb-3 shadow-toon ${
                          isFullscreen ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16 sm:w-20 sm:h-20'
                        }`}
                      >
                        <AlertTriangle
                          size={isFullscreen ? 48 : 28}
                          className={`text-white ${
                            isFullscreen ? 'sm:w-16 sm:h-16' : 'sm:w-8 sm:h-8'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-toon-red font-black ${
                          isFullscreen ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                        }`}
                      >
                        {chatError}
                      </span>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        className={`rounded-2xl border-3 border-black font-medium shadow-toon-sm ${
                          isFullscreen
                            ? 'max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 text-sm sm:text-base'
                            : 'max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 text-xs sm:text-sm'
                        } ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-toon-yellow to-yellow-300 text-gray-900 rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in">
                      <div
                        className={`bg-white rounded-2xl rounded-bl-md border-3 border-black shadow-toon-sm ${
                          isFullscreen ? 'p-4' : 'p-3'
                        }`}
                      >
                        <div className="flex gap-1.5">
                          <div
                            className={`bg-gray-400 rounded-full animate-bounce ${
                              isFullscreen ? 'w-3 h-3' : 'w-2 h-2'
                            }`}
                            style={{ animationDelay: '0ms' }}
                          ></div>
                          <div
                            className={`bg-gray-400 rounded-full animate-bounce ${
                              isFullscreen ? 'w-3 h-3' : 'w-2 h-2'
                            }`}
                            style={{ animationDelay: '150ms' }}
                          ></div>
                          <div
                            className={`bg-gray-400 rounded-full animate-bounce ${
                              isFullscreen ? 'w-3 h-3' : 'w-2 h-2'
                            }`}
                            style={{ animationDelay: '300ms' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className={`border-t-3 border-black bg-white/80 backdrop-blur-sm flex gap-2 ${
                    isFullscreen ? 'p-4 sm:p-5' : 'p-3 sm:p-3.5'
                  }`}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('tool.placeholder')}
                    className={`flex-1 border-3 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-toon-blue/30 transition-all text-gray-900 bg-white placeholder:text-gray-400 ${
                      isFullscreen
                        ? 'px-4 py-3 text-sm sm:text-base'
                        : 'px-3 py-2 text-xs sm:text-sm'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || !!chatError}
                    className={`bg-gradient-to-br from-toon-blue to-cyan-400 border-3 border-black rounded-xl hover:from-cyan-400 hover:to-toon-blue disabled:opacity-40 disabled:cursor-not-allowed shadow-toon-sm hover:shadow-toon active:shadow-none active:translate-y-[2px] transition-all disabled:transform-none disabled:shadow-toon-sm ${
                      isFullscreen ? 'p-3.5 sm:p-4' : 'p-2.5 sm:p-3'
                    }`}
                    aria-label="Send message"
                  >
                    <Send
                      size={isFullscreen ? 20 : 16}
                      className={`text-gray-900 ${isFullscreen ? 'sm:w-6 sm:h-6' : 'sm:w-5 sm:h-5'}`}
                    />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-toon-purple to-purple-600 text-white border-4 border-black rounded-full shadow-toon hover:shadow-toon-lg hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Open toolbox"
        >
          <Settings
            size={28}
            className="group-hover:rotate-180 transition-transform duration-500 sm:w-8 sm:h-8"
          />

          {/* Pulsing indicator when music is playing */}
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-toon-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-toon-yellow border-2 border-black"></span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};
