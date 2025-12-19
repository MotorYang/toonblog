import { ArrowLeft, Calendar, Clock, Eye, Sparkles, Tag, Trash2, User } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { ImageLightbox } from '@/components/Imagelightbox';
import { PostNavigation } from '@/components/Postnavigation';
import { ShareButton } from '@/components/Sharebutton';
import { TableOfContents } from '@/components/Tableofcontents';
import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { ToonModal } from '@/components/ToonModal';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReadPosts } from '@/hooks/UseReadPosts';
import { aiService } from '@/services/ai';
import { userAuthStore } from '@/stores/userAuthStore';
import { SummaryResponse } from '@/types/ai';
import { calculateReadingTime, formatReadingTime, getAdjacentPosts } from '@/utils/Postutils';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, deletePost, incrementViews, posts } = useBlogStore();
  const { isAdmin } = userAuthStore();
  const { t, language } = useLanguage();
  const { markAsRead } = useReadPosts();

  const post = getPost(id || '');

  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // 计算阅读时间
  const readingTime = useMemo(() => {
    if (!post) return 0;
    return calculateReadingTime(post.content);
  }, [post]);

  // 获取上下篇
  const { previous, next } = useMemo(() => {
    if (!post) return { previous: null, next: null };
    return getAdjacentPosts(post, posts);
  }, [post, posts]);

  // Use a ref to ensure we only increment view once per mount
  const hasViewed = useRef(false);

  useEffect(() => {
    if (post && !hasViewed.current) {
      incrementViews(post.id);
      markAsRead(post.id); // 标记为已读
      hasViewed.current = true;
    }
  }, [post, incrementViews, markAsRead]);

  // 键盘快捷键 - ESC 返回
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // 阅读进度追踪
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.min((scrollTop / trackLength) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="text-center py-12 md:py-16 animate-in fade-in scale-in duration-500">
        <div className="bg-gradient-to-br from-gray-100 to-white p-8 md:p-10 border-3 border-black rounded-2xl shadow-toon-lg inline-block">
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-gray-900">
            {t('post.unknown')}
          </h2>
          <p className="mb-4 font-bold text-gray-600 text-sm md:text-base">
            {t('post.unknown.tip')}
          </p>
          <ToonButton onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" size={18} /> {t('post.unknown.back')}
          </ToonButton>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deletePost(post.id);
    setIsDeleteModalOpen(false);
    navigate('/');
  };

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const result: SummaryResponse = await aiService.generateSummary({
        content: post.content,
        lang: language,
      });
      setSummary(result.summary);
    } catch {
      alert('Could not generate summary. Check API Key.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // ReactMarkdown 组件类型定义
  const markdownComponents: Partial<Components> = {
    // 代码块
    code: (props) => {
      // eslint-disable-next-line react/prop-types
      const { className, children } = props;
      // 检查是否为内联代码（没有语言类名通常是内联代码）
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
    // 图片灯箱
    img: ({ src, alt }) => <ImageLightbox src={src || ''} alt={alt || ''} className="my-4" />,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-5 pb-8">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-toon-blue via-toon-purple to-toon-yellow transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back Button - 紧凑返回按钮 */}
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <ToonButton
          variant="ghost"
          onClick={() => navigate('/')}
          className="shadow-toon-sm hover:shadow-toon text-sm"
        >
          <ArrowLeft className="mr-2" size={18} /> {t('post.back')}
        </ToonButton>
      </div>

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '100ms' }}
      >
        <ToonCard className="relative overflow-hidden shadow-toon-lg">
          {/* Header Image - 缩小封面图高度 */}
          {post.imageUrl && (
            <div className="w-full h-48 md:h-72 border-3 border-black rounded-xl overflow-hidden mb-4 md:mb-5 shadow-toon group">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Title - 缩小标题 */}
          <h1
            className="text-xl md:text-3xl font-black mb-4 leading-tight break-words text-gray-900 animate-in fade-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: '200ms' }}
          >
            {post.title}
          </h1>

          {/* 分享和操作按钮栏 */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-dashed border-gray-200 animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: '250ms' }}
          >
            {/* 左侧：返回提示 */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <ArrowLeft size={14} />
              <span>按 ESC 返回列表</span>
            </div>

            {/* 右侧：分享按钮 */}
            <ShareButton
              url={`/post/${post.id}`}
              title={post.title}
              description={post.excerpt}
              className="shadow-toon hover:shadow-toon-lg"
            />
          </div>

          {/* Meta Info - 紧凑元信息 */}
          <div
            className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: '300ms' }}
          >
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-toon-yellow to-yellow-300 px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs md:text-sm shadow-toon-sm hover:shadow-toon transition-all hover:scale-105">
              <div className="bg-white border-2 border-black rounded-full p-0.5">
                <User size={14} />
              </div>
              {post.author}
            </span>
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-toon-blue to-cyan-300 px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs md:text-sm shadow-toon-sm hover:shadow-toon transition-all hover:scale-105 text-white">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-white to-gray-100 px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs md:text-sm shadow-toon-sm hover:shadow-toon transition-all hover:scale-105">
              <Eye size={14} className="text-toon-purple" />
              <span className="text-toon-purple">{post.views?.toLocaleString()}</span>
              <span className="text-gray-600">次浏览</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-toon-purple to-purple-400 px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs md:text-sm shadow-toon-sm hover:shadow-toon transition-all hover:scale-105 text-white">
              <Clock size={14} />
              {formatReadingTime(readingTime)}
            </span>
          </div>

          {/* Tags - 紧凑标签 */}
          {post.tags && post.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 mb-5 animate-in fade-in slide-in-from-right-4 duration-500"
              style={{ animationDelay: '400ms' }}
            >
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-white px-2.5 py-1 border-2 border-black rounded-md font-bold text-xs shadow-toon-sm hover:shadow-toon hover:scale-105 transition-all"
                  style={{ animationDelay: `${400 + index * 50}ms` }}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              <span className="flex items-center gap-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-2.5 py-1 border-2 border-black rounded-md font-black text-xs shadow-toon-sm">
                {post.category}
              </span>
            </div>
          )}

          {/* AI Summary Section - 紧凑摘要区 */}
          <div
            className="mb-5 md:mb-6 animate-in fade-in scale-in duration-500"
            style={{ animationDelay: '500ms' }}
          >
            <ToonCard color="yellow" className="border-3 border-black shadow-toon-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-toon-purple to-purple-500 p-2 border-2 border-black rounded-lg shadow-toon-sm">
                    <Sparkles className="text-white w-4 h-4" />
                  </div>
                  <h3 className="font-black text-base md:text-lg text-gray-900">
                    {t('post.tldr')}
                  </h3>
                </div>
                {!summary && (
                  <ToonButton
                    variant="secondary"
                    onClick={handleGenerateSummary}
                    isLoading={loadingSummary}
                    className="shadow-toon-sm hover:shadow-toon text-xs md:text-sm py-1.5"
                  >
                    {loadingSummary ? (
                      <>生成中...</>
                    ) : (
                      <>
                        <Sparkles size={14} className="mr-1.5" />
                        {t('post.summarize.button')}
                      </>
                    )}
                  </ToonButton>
                )}
              </div>
              {summary ? (
                <div className="bg-white border-3 border-black rounded-lg p-3 md:p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="font-bold text-xs md:text-sm text-gray-800 leading-relaxed">
                    <span className="text-toon-purple text-xl mr-1">&#34;</span>
                    {summary}
                    <span className="text-toon-purple text-xl ml-1">&#34;</span>
                  </p>
                </div>
              ) : (
                <div className="bg-white/50 border-2 border-dashed border-black rounded-lg p-4 text-center">
                  <Sparkles size={24} className="mx-auto mb-1.5 text-gray-400" />
                  <p className="text-xs font-bold text-gray-500">{t('post.summarize.tip')}</p>
                </div>
              )}
            </ToonCard>
          </div>

          {/* Content - 紧凑内容区域 */}
          <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: '600ms' }}
          >
            <article className="prose prose-sm md:prose-base prose-headings:font-black prose-headings:text-gray-900 prose-headings:mb-3 prose-headings:scroll-mt-24 prose-p:font-medium prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-toon-blue prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-blockquote:border-l-4 prose-blockquote:border-toon-purple prose-blockquote:bg-gradient-to-r prose-blockquote:from-purple-50 prose-blockquote:to-transparent prose-blockquote:p-3 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:font-bold prose-img:border-3 prose-img:border-black prose-img:rounded-xl prose-img:shadow-toon prose-strong:text-gray-900 prose-strong:font-black prose-ul:font-medium prose-ol:font-medium prose-li:text-gray-800 max-w-none font-sans overflow-x-hidden">
              <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
            </article>
          </div>

          {/* 目录导航 */}
          <TableOfContents content={post.content} />

          {/* 上下篇导航 */}
          <PostNavigation previous={previous} next={next} />

          {/* Admin Actions - 紧凑管理操作 */}
          {isAdmin && (
            <div
              className="mt-8 pt-5 border-t-3 border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <div className="w-1.5 h-1.5 bg-toon-red rounded-full animate-pulse"></div>
                {t('post.admin.area')}
              </div>
              <ToonButton
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="shadow-toon hover:shadow-toon-lg text-sm"
              >
                <Trash2 size={18} className="mr-2" /> {t('post.delete')}
              </ToonButton>
            </div>
          )}
        </ToonCard>
      </div>

      {/* Delete Confirmation Modal */}
      <ToonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('modal.delete_title')}
        variant="danger"
        footer={
          <>
            <ToonButton variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              {t('modal.cancel')}
            </ToonButton>
            <ToonButton variant="danger" onClick={handleDelete}>
              {t('modal.confirm')}
            </ToonButton>
          </>
        }
      >
        <p className="font-medium text-gray-700">{t('modal.delete_desc')}</p>
      </ToonModal>
    </div>
  );
};
