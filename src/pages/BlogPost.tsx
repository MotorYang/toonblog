import { ArrowLeft, Calendar, Eye, Sparkles, Tag, Trash2, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

import { AiApi } from '@/api/ai';
import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { ToonModal } from '@/components/ToonModal';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore.ts';
import { SummaryResponse } from '@/types/ai.ts';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, deletePost, incrementViews } = useBlogStore();
  const { isAdmin } = userAuthStore();
  const { t, language } = useLanguage();

  const post = getPost(id || '');

  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Use a ref to ensure we only increment view once per mount
  const hasViewed = useRef(false);

  useEffect(() => {
    if (post && !hasViewed.current) {
      incrementViews(post.id);
      hasViewed.current = true;
    }
  }, [post, incrementViews]);

  if (!post) {
    return (
      <div className="text-center py-20 animate-in fade-in scale-in duration-500">
        <div className="bg-gradient-to-br from-gray-100 to-white p-12 border-4 border-black rounded-2xl shadow-toon-lg inline-block">
          <h2 className="text-4xl font-black mb-3 text-gray-900">{t('post.unknown')}</h2>
          <p className="mb-6 font-bold text-gray-600">{t('post.unknown.tip')}</p>
          <ToonButton onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" size={20} /> {t('post.unknown.back')}
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
      const result: SummaryResponse = await AiApi.generateSummary({
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Button - 优化返回按钮 */}
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <ToonButton
          variant="ghost"
          onClick={() => navigate('/')}
          className="shadow-toon-sm hover:shadow-toon"
        >
          <ArrowLeft className="mr-2" size={20} /> {t('post.back')}
        </ToonButton>
      </div>

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '100ms' }}
      >
        <ToonCard className="relative overflow-hidden shadow-toon-lg">
          {/* Header Image - 优化封面图 */}
          {post.imageUrl && (
            <div className="w-full h-56 md:h-96 border-4 border-black rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-toon group">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Title - 优化标题 */}
          <h1
            className="text-2xl md:text-4xl font-black mb-6 leading-tight break-words text-gray-900 animate-in fade-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: '200ms' }}
          >
            {post.title}
          </h1>

          {/* Meta Info - 重新设计元信息 */}
          <div
            className="flex flex-wrap gap-3 mb-5 animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: '300ms' }}
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-toon-yellow to-yellow-300 px-4 py-2 md:px-4 md:py-2 border-2 border-black rounded-xl font-black text-sm md:text-base shadow-toon-sm hover:shadow-toon transition-shadow">
              <div className="bg-white border-2 border-black rounded-full p-1">
                <User size={16} />
              </div>
              {post.author}
            </span>
            <span className="flex items-center gap-2 bg-gradient-to-r from-toon-blue to-cyan-300 px-4 py-2 md:px-5 md:py-2.5 border-2 border-black rounded-xl font-black text-sm md:text-base shadow-toon-sm hover:shadow-toon transition-shadow text-white">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="flex items-center gap-2 bg-gradient-to-r from-white to-gray-100 px-4 py-2 md:px-5 md:py-2.5 border-2 border-black rounded-xl font-black text-sm md:text-base shadow-toon-sm hover:shadow-toon transition-shadow">
              <Eye size={16} className="text-toon-purple" />
              {post.views?.toLocaleString()}
            </span>
          </div>

          {/* Tags - 优化标签显示 */}
          {post.tags && post.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-8 animate-in fade-in slide-in-from-right-4 duration-500"
              style={{ animationDelay: '400ms' }}
            >
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1.5 bg-white px-3 py-1.5 border-2 border-black rounded-lg font-bold text-xs md:text-sm shadow-toon-sm hover:shadow-toon hover:scale-105 transition-all"
                  style={{ animationDelay: `${400 + index * 50}ms` }}
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
              <span className="flex items-center gap-1.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs md:text-sm shadow-toon-sm">
                {post.category}
              </span>
            </div>
          )}

          {/* AI Summary Section - 重新设计摘要区 */}
          <div
            className="mb-8 md:mb-10 animate-in fade-in scale-in duration-500"
            style={{ animationDelay: '500ms' }}
          >
            <ToonCard color="yellow" className="border-4 border-black shadow-toon-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-toon-purple to-purple-500 p-2.5 border-3 border-black rounded-xl shadow-toon-sm">
                    <Sparkles className="text-white w-5 h-5" />
                  </div>
                  <h3 className="font-black text-lg md:text-xl text-gray-900">{t('post.tldr')}</h3>
                </div>
                {!summary && (
                  <ToonButton
                    variant="secondary"
                    onClick={handleGenerateSummary}
                    isLoading={loadingSummary}
                    className="shadow-toon-sm hover:shadow-toon text-sm md:text-base"
                  >
                    {loadingSummary ? (
                      <>生成中...</>
                    ) : (
                      <>
                        <Sparkles size={16} className="mr-2" />
                        {t('post.summarize.button')}
                      </>
                    )}
                  </ToonButton>
                )}
              </div>
              {summary ? (
                <div className="bg-white border-3 border-black rounded-xl p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="font-bold text-sm md:text-base text-gray-800 leading-relaxed">
                    <span className="text-toon-purple text-2xl mr-1">&#34;</span>
                    {summary}
                    <span className="text-toon-purple text-2xl ml-1">&#34;</span>
                  </p>
                </div>
              ) : (
                <div className="bg-white/50 border-2 border-dashed border-black rounded-xl p-6 text-center">
                  <Sparkles size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-bold text-gray-500">{t('post.summarize.tip')}</p>
                </div>
              )}
            </ToonCard>
          </div>

          {/* Content - 优化内容区域 */}
          <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: '600ms' }}
          >
            <div className="prose prose-base md:prose-xl prose-headings:font-black prose-headings:text-gray-900 prose-headings:mb-4 prose-p:font-medium prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-toon-blue prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-blockquote:border-l-4 prose-blockquote:border-toon-purple prose-blockquote:bg-gradient-to-r prose-blockquote:from-purple-50 prose-blockquote:to-transparent prose-blockquote:p-4 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-blockquote:font-bold prose-img:border-4 prose-img:border-black prose-img:rounded-2xl prose-img:shadow-toon prose-strong:text-gray-900 prose-strong:font-black prose-ul:font-medium prose-ol:font-medium prose-li:text-gray-800 max-w-none font-sans overflow-x-hidden">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>

          {/* Admin Actions - 优化管理操作 */}
          {isAdmin && (
            <div
              className="mt-12 pt-8 border-t-4 border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <div className="w-2 h-2 bg-toon-red rounded-full animate-pulse"></div>
                {t('post.admin.area')}
              </div>
              <ToonButton
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="shadow-toon hover:shadow-toon-lg"
              >
                <Trash2 size={20} className="mr-2" /> {t('post.delete')}
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
