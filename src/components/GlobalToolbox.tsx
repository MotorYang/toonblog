import { Chat, GenerateContentResponse } from '@google/genai';
import {
  AlertTriangle,
  MessageSquare,
  Minimize2,
  Music,
  Pause,
  Play,
  Send,
  Settings,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

import { getChatSession } from '../services/modules/geminiService';

// Mock Playlist
const PLAYLIST = [
  {
    title: '红色高跟鞋',
    artist: '蔡健雅',
    url: 'https://m801.music.126.net/20251212113049/f545fd340fdb02f0416f965322118765/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28558895606/8835/a4cc/1782/f00d82e063edf24a844599abe6e0f65c.flac?vuutv=ux2GJY2oZkpjZ+zC5GnmUpzsNkbcIWO1aiCBEHjx+p109nShwJ7tlQaNhss9uMdab/st3aOJvGn7N1BixK/HYuV8krt06XDwtsmyUM87TQ8=',
  },
  {
    title: '起风了',
    artist: '买辣椒也用券',
    url: 'https://m701.music.126.net/20251212113315/be741489ad7391d4f66fee5c712f7d09/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28481714396/6c87/85e4/ab54/32f5945c4e22ee3bc275544dd3bcc66c.flac?vuutv=DiM23pTxYAEsndGw2S+y+P5TR4LYRZ45dZZPDdxLcOVJmBx+HOHhZCNQicFDZOrXn/e3PPrNyTkCXYdSAtJwzyj/RAKhvrZhjRmXCbFu2FE=',
  },
  {
    title: '孤岛',
    artist: '赵二',
    url: 'https://m7.music.126.net/20251212113402/4fd1aaeaaa919297aa07b7ffe5b5ba1c/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/14050766620/914d/cbac/c7af/6be58fd37a4343ab31be1cd93e6ffe5e.flac?vuutv=Nxjuht/v8Ib06AobS7l6R65Q0aqqirTB/NdnIEPzbiXR15yMocLxH0o/pDodGnjkJCqp0rHQ5zMHHRUjejtvXuS3XhgF1fKAdOAk3BYV+u0=',
  },
];

export const GlobalToolbox: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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

  // Init Audio
  useEffect(() => {
    audioRef.current = new Audio(PLAYLIST[0].url);
    audioRef.current.addEventListener('ended', handleNextTrack);
    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', handleNextTrack);
    };
  }, []);

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

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end font-sans">
      {/* Expanded Box */}
      {isOpen && (
        <div className="mb-4 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-80 md:w-96 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header / Tabs */}
          <div className="flex border-b-4 border-black bg-gray-100">
            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 p-3 font-black flex items-center justify-center gap-2 ${activeTab === 'music' ? 'bg-toon-yellow text-toon-ink' : 'hover:bg-gray-200 text-gray-500'}`}
            >
              <Music size={18} /> {t('tool.beats')}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 p-3 font-black flex items-center justify-center gap-2 border-l-4 border-black ${activeTab === 'chat' ? 'bg-toon-blue text-toon-ink' : 'hover:bg-gray-200 text-gray-500'}`}
            >
              <MessageSquare size={18} /> {t('tool.chat')}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 bg-toon-red text-white border-l-4 border-black hover:bg-red-600"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="h-80 bg-white relative">
            {/* MUSIC TAB */}
            {activeTab === 'music' && (
              <div className="h-full flex flex-col p-6 items-center justify-center bg-gray-50 text-gray-900">
                <div
                  className={`w-32 h-32 bg-gray-900 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-toon ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                >
                  <Music size={48} className="text-toon-yellow" />
                </div>

                <div className="text-center mb-6">
                  <h3 className="font-black text-xl truncate w-64">
                    {PLAYLIST[currentTrackIndex].title}
                  </h3>
                  <p className="font-bold text-gray-500">{PLAYLIST[currentTrackIndex].artist}</p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevTrack}
                    className="p-2 border-2 border-black rounded-lg hover:bg-gray-200 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    <SkipBack size={24} className="text-gray-900" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-4 border-2 border-black rounded-full bg-toon-yellow hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    {isPlaying ? (
                      <Pause size={32} className="text-toon-ink" />
                    ) : (
                      <Play size={32} className="pl-1 text-toon-ink" />
                    )}
                  </button>
                  <button
                    onClick={handleNextTrack}
                    className="p-2 border-2 border-black rounded-lg hover:bg-gray-200 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    <SkipForward size={24} className="text-gray-900" />
                  </button>
                </div>
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col bg-white">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && !chatError && (
                    <div className="text-center text-gray-400 mt-10 font-bold italic">
                      {t('tool.chat_welcome')}
                    </div>
                  )}
                  {chatError && (
                    <div className="flex justify-center mt-10 text-toon-red font-bold flex-col items-center gap-2">
                      <AlertTriangle size={32} />
                      <span>{chatError}</span>
                    </div>
                  )}
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-xl border-2 border-black font-medium text-sm ${msg.role === 'user' ? 'bg-toon-yellow text-toon-ink rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-xl rounded-bl-none border-2 border-black">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t-2 border-black bg-gray-50 flex gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('tool.placeholder')}
                    className="flex-1 border-2 border-black rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:shadow-toon transition-shadow text-gray-900 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || !!chatError}
                    className="bg-toon-blue p-2 border-2 border-black rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px]"
                  >
                    <Send size={18} className="text-toon-ink" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-toon-purple text-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Settings size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};
