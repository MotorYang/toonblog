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
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from '@/components/CodeBlock';
import { useLanguage } from '@/context/LanguageContext';
import { aiService } from '@/services/ai';

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

// 定义消息类型
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Markdown 渲染组件 - 参照 BlogPost 的实现
const MarkdownMessage: React.FC<{ content: string; isFullscreen: boolean }> = ({
  content,
  isFullscreen,
}) => {
  // ReactMarkdown 组件类型定义 - 使用与 BlogPost 相同的方式
  const markdownComponents: Partial<Components> = {
    // 代码块 - 复用 CodeBlock 组件
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      const isInline = !match;

      return isInline ? (
        <CodeBlock inline={true}>{codeString}</CodeBlock>
      ) : (
        <CodeBlock language={match[1]} inline={false}>
          {codeString}
        </CodeBlock>
      );
    },
    // 段落
    p: ({ children }) => (
      <p className="mb-2 leading-relaxed text-gray-800 font-medium">{children}</p>
    ),
    // 标题
    h1: ({ children }) => (
      <h1 className={`font-black mt-3 mb-2 text-gray-900 ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`font-black mt-3 mb-2 text-gray-900 ${isFullscreen ? 'text-lg' : 'text-base'}`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`font-bold mt-2 mb-1 text-gray-900 ${isFullscreen ? 'text-base' : 'text-sm'}`}>
        {children}
      </h3>
    ),
    // 列表
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-2 space-y-1 text-gray-800 ml-2 font-medium">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-800 ml-2 font-medium">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    // 引用块 - 使用卡通风格
    blockquote: ({ children }) => (
      <blockquote className="border-l-3 border-toon-purple bg-gradient-to-r from-purple-50 to-transparent pl-3 py-2 my-2 font-bold text-gray-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
    // 链接
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-toon-blue font-bold no-underline hover:underline decoration-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    // 表格
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full border-collapse border-2 border-black">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-2 border-black bg-gray-100 px-2 py-1 text-left font-bold text-xs">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-2 border-black px-2 py-1 text-xs font-medium">{children}</td>
    ),
    // 分割线
    hr: () => <hr className="my-3 border-t-2 border-gray-300" />,
    // 加粗和斜体
    strong: ({ children }) => <strong className="font-black text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  };

  return (
    <div className="prose-chat max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatError, setChatError] = useState('');

  // 聊天会话 ID - 使用 ref 保持会话持久化
  const sessionIdRef = useRef<string>('');

  // 检测是否为移动设备
  const isMobile = () => {
    return window.innerWidth < 640; // sm breakpoint
  };

  useEffect(() => {
    audioRef.current = new Audio(PLAYLIST[0].url);
    audioRef.current.addEventListener('ended', handleNextTrack);

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', handleNextTrack);
    };
  }, []);

  // 打开时检测是否移动端,自动全屏
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

  // Init Chat - 检查后端健康状态
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await aiService.healthCheck();
        setChatError('');
      } catch (error) {
        console.error('AI service health check failed:', error);
        setChatError('AI service is currently unavailable');
      }
    };
    checkHealth();
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * 处理发送消息 - 使用后端 sessionId 管理对话历史
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: userMsg };

    // 添加用户消息到界面
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 调用后端 chat API - 后端通过 sessionId 管理历史
      const response = await aiService.chat({
        message: userMsg,
        sessionId: sessionIdRef.current || undefined, // 首次为空,后端会生成
      });

      // 保存后端返回的 sessionId
      if (response.sessionId) {
        sessionIdRef.current = response.sessionId;
      }

      // 添加 AI 回复到界面
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply || "I'm speechless!",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setChatError('');
    } catch (error) {
      console.error('Chat error:', error);

      // 添加错误消息
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: t('tool.send_error'),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // 设置错误状态
      setChatError('Failed to connect to AI service');
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
              isFullscreen
                ? 'h-[calc(100vh-60px)] sm:h-[calc(100vh-120px)]'
                : 'h-[380px] sm:h-[420px]'
            }`}
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-toon-yellow blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-toon-blue blur-3xl" />
            </div>

            {/* MUSIC TAB */}
            {activeTab === 'music' && (
              <div className="flex flex-col items-center justify-center h-full relative z-10 px-4">
                {/* Vinyl Record Animation */}
                <div className="relative mb-4 sm:mb-6">
                  <div
                    className={`border-8 border-black rounded-full bg-gradient-to-br from-gray-900 to-black shadow-toon-lg relative overflow-hidden ${
                      isFullscreen ? 'w-40 h-40 sm:w-56 sm:h-56' : 'w-28 h-28 sm:w-36 sm:h-36'
                    } ${isPlaying ? 'animate-spin-slow' : ''}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`rounded-full bg-toon-yellow border-2 border-black ${
                          isFullscreen ? 'w-8 h-8 sm:w-12 sm:h-12' : 'w-6 h-6 sm:w-8 sm:h-8'
                        }`}
                      />
                    </div>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border border-white/10 rounded-full"
                        style={{ margin: `${(i + 1) * 8}px` }}
                      />
                    ))}
                  </div>

                  {/* Music Notes Animation */}
                  {isPlaying && (
                    <>
                      <div
                        className={`absolute top-0 right-0 text-toon-yellow animate-[bounce_1s_ease-in-out_infinite] ${
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
                        className={`rounded-2xl border-3 border-black shadow-toon-sm ${
                          isFullscreen
                            ? 'max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 text-sm sm:text-base'
                            : 'max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 text-xs sm:text-sm'
                        } ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-toon-yellow to-yellow-300 text-gray-900 rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <MarkdownMessage content={msg.content} isFullscreen={isFullscreen} />
                        ) : (
                          <span className="font-medium">{msg.content}</span>
                        )}
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
