import { Edit3, Eye, Loader2, Lock, Save, Sparkles, Tag, Upload, Wand2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { ToonModal } from '@/components/ToonModal';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { aiService } from '@/services/ai';
import { userAuthStore } from '@/stores/userAuthStore.ts';
import { GenerateContentResponse } from '@/types/ai';

export const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, updatePost } = useBlogStore();
  const { isAdmin } = userAuthStore();
  const { t, language } = useLanguage();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('tech');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isOverwriteModalOpen, setIsOverwriteModalOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load post data
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const post = getPost(id);
    if (!post) {
      navigate('/');
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setCategory(post.category);
    setCoverImage(post.imageUrl || '');
    setTags(post.tags || []);
    setIsLoading(false);
  }, [id, getPost, navigate]);

  // Protect the route
  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => navigate('/'), 100);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in scale-in duration-500">
        <div className="bg-toon-red/20 p-6 md:p-8 border-3 border-black rounded-2xl shadow-toon-lg">
          <Lock size={48} className="text-toon-red mb-3 mx-auto animate-pulse" />
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-gray-900">
            {t('auth.permission.denied')}
          </h2>
          <p className="font-bold text-gray-600 text-sm">{t('auth.permission.adminOnly')}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-toon-purple" />
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAIWrite = async () => {
    if (!title.trim()) {
      alert(t('create.error_no_title'));
      return;
    }

    if (content.trim().length > 0) {
      setIsOverwriteModalOpen(true);
      return;
    }

    await generateContent();
  };

  const generateContent = async () => {
    setIsOverwriteModalOpen(false);
    setIsGenerating(true);

    try {
      const result: GenerateContentResponse = await aiService.generateBlogContent({
        title,
        content:
          'Make it funny and cartoonish. Use Markdown formatting like **bold**, ## Headings, and bullet points.',
        lang: language,
      });

      setContent(result.content);
      setActiveTab('preview');
    } catch {
      alert('生成失败，请检查 API 配置。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(t('create.error_no_title'));
      return;
    }

    if (!id) return;

    const post = getPost(id);
    if (!post) return;

    const updatedPost = {
      ...post,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      category,
      imageUrl: coverImage,
      tags,
      date: post.date, // Keep original date
    };

    await updatePost(updatedPost);
    navigate(`/post/${id}`);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const quickTags = [
    t('create.tag_new'),
    t('create.tag_original'),
    t('create.tag_tutorial'),
    t('create.tag_share'),
    t('create.tag_useful'),
    t('create.tag_fun'),
  ];

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-5 md:mb-6 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-5xl font-black mb-2 text-gray-900">{t('post.edit')}</h1>
        <p className="font-bold text-sm md:text-base text-gray-600">{t('post.edit_subtitle')}</p>
      </div>

      <ToonCard
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        // style={{ animationDelay: '100ms' }}
      >
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Cover Image Upload */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black text-base md:text-lg text-gray-900">
              <div className="w-1 h-5 bg-toon-pink rounded-full"></div>
              {t('create.cover_image')}
            </label>

            {coverImage ? (
              <div className="relative w-full h-40 md:h-56 border-3 border-black rounded-xl overflow-hidden group shadow-toon hover:shadow-toon-lg transition-all">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-3 right-3 bg-toon-red text-white p-2 rounded-full border-2 border-black shadow-toon-sm hover:shadow-toon hover:scale-110 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 md:h-56 border-3 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-toon-blue hover:bg-blue-50/30 transition-all group"
              >
                <Upload size={40} className="mb-2 text-gray-400 group-hover:text-toon-blue" />
                <p className="font-black text-sm md:text-base text-gray-700">
                  {t('create.upload')}
                </p>
                <p className="text-xs font-bold text-gray-500 mt-1">{t('create.upload_sub')}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black text-base md:text-lg text-gray-900">
              <div className="w-1 h-5 bg-toon-blue rounded-full"></div>
              {t('create.post_title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 md:p-4 border-3 border-black rounded-xl font-bold text-sm md:text-base focus:outline-none focus:shadow-toon-lg transition-all bg-white text-gray-900"
              placeholder="起个响亮的标题..."
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black text-base md:text-lg text-gray-900">
              <div className="w-1 h-5 bg-toon-green rounded-full"></div>
              {t('create.category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 md:p-4 border-3 border-black rounded-xl font-bold text-sm md:text-base focus:outline-none focus:shadow-toon-lg transition-all bg-white cursor-pointer text-gray-900"
            >
              <option value="tech">{t('category.tech')}</option>
              <option value="life">{t('category.life')}</option>
              <option value="trip">{t('category.trip')}</option>
              <option value="food">{t('category.food')}</option>
              <option value="random">{t('category.random')}</option>
            </select>
          </div>

          {/* Tags Input */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black text-base md:text-lg text-gray-900">
              <div className="w-1 h-5 bg-toon-yellow rounded-full"></div>
              {t('create.tags')}
            </label>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 p-3 border-3 border-black rounded-xl font-bold text-sm focus:outline-none focus:shadow-toon-lg transition-all bg-white text-gray-900"
                placeholder={t('create.tags_placeholder')}
              />
              <ToonButton
                type="button"
                variant="secondary"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="text-sm px-4"
              >
                <Tag size={16} className="mr-1" />
                {t('create.tags_add')}
              </ToonButton>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-toon-yellow to-yellow-300 px-3 py-1.5 border-2 border-black rounded-lg font-bold text-xs shadow-toon-sm hover:shadow-toon transition-all group"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:scale-110 transition-transform"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {tags.length === 0 && (
              <p className="text-xs font-bold text-gray-500 mb-2">{t('create.tags_empty')}</p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600">{t('create.tags_quick')}</p>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((quickTag) => (
                  <button
                    key={quickTag}
                    type="button"
                    onClick={() => {
                      if (!tags.includes(quickTag)) {
                        setTags([...tags, quickTag]);
                      }
                    }}
                    className={`
                      text-xs px-3 py-1.5 border-2 border-black rounded-lg font-bold shadow-toon-sm transition-all
                      ${
                        tags.includes(quickTag)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white hover:bg-toon-blue hover:shadow-toon'
                      }
                    `}
                  >
                    + {quickTag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <label className="flex items-center gap-2 font-black text-base md:text-lg text-gray-900">
                <div className="w-1 h-5 bg-toon-purple rounded-full"></div>
                {t('create.content')}
              </label>
              <ToonButton
                type="button"
                variant="secondary"
                onClick={startAIWrite}
                isLoading={isGenerating}
                className="text-xs py-1.5 px-3 shadow-toon hover:shadow-toon-lg"
              >
                <Wand2 size={14} className="mr-1.5" /> {t('create.magic_write')}
              </ToonButton>
            </div>

            <div className="flex gap-2 mb-0">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`
                  flex items-center gap-1.5 px-3 md:px-4 py-2 font-black border-3 border-black rounded-t-xl transition-all text-xs md:text-sm
                  ${
                    activeTab === 'write'
                      ? 'bg-toon-yellow text-gray-900 -mb-[3px] z-10 shadow-toon'
                      : 'bg-gray-100 hover:bg-gray-200 mt-1 border-b-0'
                  }
                `}
              >
                <Edit3 size={16} /> {t('create.write')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`
                  flex items-center gap-1.5 px-3 md:px-4 py-2 font-black border-3 border-black rounded-t-xl transition-all text-xs md:text-sm
                  ${
                    activeTab === 'preview'
                      ? 'bg-toon-blue text-gray-900 -mb-[3px] z-10 shadow-toon'
                      : 'bg-gray-100 hover:bg-gray-200 mt-1 border-b-0'
                  }
                `}
              >
                <Eye size={16} /> {t('create.preview')}
              </button>
            </div>

            <div
              className={`
                w-full border-3 border-black rounded-xl rounded-tl-none p-3 md:p-4 min-h-[250px] md:min-h-[350px]
                bg-white focus-within:shadow-toon-lg transition-all relative overflow-hidden
              `}
            >
              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center p-6 bg-white border-3 border-black rounded-xl shadow-toon-lg animate-in zoom-in duration-300">
                    <div className="relative">
                      <Loader2 className="w-12 h-12 animate-spin text-toon-purple" />
                      <Sparkles className="w-5 h-5 text-toon-yellow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <span className="font-black text-lg mt-3 animate-pulse text-gray-900">
                      {t('create.generating')}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'write' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full h-full font-mono text-xs md:text-sm focus:outline-none resize-none bg-transparent text-gray-900 leading-relaxed"
                  placeholder="使用 Markdown 编写精彩内容..."
                  disabled={isGenerating}
                />
              ) : (
                <div className="prose prose-sm md:prose-base prose-headings:font-black prose-p:font-medium prose-a:text-toon-blue prose-a:font-bold prose-strong:text-gray-900 prose-img:border-3 prose-img:border-black prose-img:rounded-lg prose-ul:font-medium max-w-none font-sans overflow-y-auto max-h-[300px] md:max-h-[400px]">
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">预览区空空如也...</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Excerpt Input */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-black text-base md:text-lg text-gray-900">
              <div className="w-1 h-5 bg-toon-red rounded-full"></div>
              {t('create.excerpt')}
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full p-3 md:p-4 border-3 border-black rounded-xl font-medium text-xs md:text-sm focus:outline-none focus:shadow-toon-lg transition-all resize-none bg-white text-gray-900"
              placeholder="用一两句话概括文章..."
            />
          </div>

          {/* Submit Button */}
          <ToonButton type="submit" className="w-full shadow-toon-lg hover:scale-[1.02]">
            <Save className="mr-2" size={20} />
            {t('post.save')}
          </ToonButton>
        </form>
      </ToonCard>

      {/* Overwrite Modal */}
      <ToonModal
        isOpen={isOverwriteModalOpen}
        onClose={() => setIsOverwriteModalOpen(false)}
        title={t('modal.overwrite_title')}
      >
        <p className="mb-6 font-medium text-sm md:text-base text-gray-700">
          {t('modal.overwrite_desc')}
        </p>
        <div className="flex gap-3 justify-end">
          <ToonButton variant="ghost" onClick={() => setIsOverwriteModalOpen(false)}>
            {t('modal.cancel')}
          </ToonButton>
          <ToonButton onClick={generateContent}>{t('modal.confirm')}</ToonButton>
        </div>
      </ToonModal>
    </div>
  );
};
