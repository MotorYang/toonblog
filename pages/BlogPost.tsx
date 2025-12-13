import { ArrowLeft, Calendar, Eye, Sparkles, Trash2, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

import { ToonButton } from '../components/ToonButton';
import { ToonCard } from '../components/ToonCard';
import { ToonModal } from '../components/ToonModal';
import { useAuth } from '../context/AuthContext';
import { useBlogStore } from '../context/BlogContext';
import { useLanguage } from '../context/LanguageContext';
import { generateSummary } from '../services/modules/geminiService';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, deletePost, incrementViews } = useBlogStore();
  const { isAdmin } = useAuth();
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
      <div className="text-center py-20">
        <h2 className="text-4xl font-black mb-4">Oops!</h2>
        <p className="mb-8 font-bold">Post not found.</p>
        <ToonButton onClick={() => navigate('/')}>Go Home</ToonButton>
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
      const result = await generateSummary(post.content, language);
      setSummary(result);
    } catch {
      alert('Could not generate summary. Check API Key.');
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ToonButton variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2" size={20} /> {t('post.back')}
      </ToonButton>

      <ToonCard className="relative overflow-hidden">
        {/* Header Image */}
        {post.imageUrl && (
          <div className="w-full h-48 md:h-80 border-2 border-black rounded-lg overflow-hidden mb-4 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title & Meta */}
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight break-words">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 font-bold text-xs md:text-sm">
          <span className="flex items-center gap-1 md:gap-2 bg-toon-yellow px-2 py-1 md:px-3 border-2 border-black rounded-full">
            <User size={14} /> {post.author}
          </span>
          <span className="flex items-center gap-1 md:gap-2 bg-toon-blue px-2 py-1 md:px-3 border-2 border-black rounded-full">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="flex items-center gap-1 md:gap-2 bg-white px-2 py-1 md:px-3 border-2 border-black rounded-full">
            <Eye size={14} /> {post.views?.toLocaleString()} {t('post.views')}
          </span>
          <span className="bg-black text-white px-2 py-1 md:px-3 rounded-full border-2 border-black">
            {post.category}
          </span>
        </div>

        {/* AI Summary Section */}
        <div className="mb-8 p-4 bg-toon-bg border-2 border-dashed border-black rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            <h3 className="font-black text-lg flex items-center gap-2">
              <Sparkles className="text-toon-purple" /> {t('post.tldr')}
            </h3>
            {!summary && (
              <ToonButton
                variant="secondary"
                onClick={handleGenerateSummary}
                isLoading={loadingSummary}
                className="scale-90 origin-left sm:origin-right"
              >
                {t('post.summarize')}
              </ToonButton>
            )}
          </div>
          {summary && (
            <p className="font-medium text-gray-800 italic animate-pulse">&#34;{summary}&#34;</p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-base md:prose-lg prose-headings:font-black prose-p:font-medium prose-a:text-toon-blue prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-toon-purple prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-img:border-4 prose-img:border-black prose-img:rounded-xl max-w-none font-sans overflow-x-hidden">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="mt-8 md:mt-12 pt-8 border-t-4 border-black flex justify-end">
            <ToonButton variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={20} className="mr-2" /> {t('post.delete')}
            </ToonButton>
          </div>
        )}
      </ToonCard>

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
        <p>{t('modal.delete_desc')}</p>
      </ToonModal>
    </div>
  );
};
