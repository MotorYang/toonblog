import {
  Edit3,
  Eye,
  Loader2,
  Lock,
  Plus,
  Save,
  Sparkles,
  Tag,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

import { AiApi } from '@/api/ai';
import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { ToonModal } from '@/components/ToonModal';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore.ts';
import { GenerateContentResponse } from '@/types/ai.ts';

import { Article } from '../../types.ts';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useBlogStore();
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-gray-900">访问受限！</h2>
          <p className="font-bold text-gray-600 text-sm">仅管理员可创建文章</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const startAIWrite = () => {
    if (!title) return alert(t('create.error_no_title'));

    if (content.trim().length > 0) {
      setIsOverwriteModalOpen(true);
    } else {
      performAIWrite();
    }
  };

  const performAIWrite = async () => {
    setIsOverwriteModalOpen(false);
    setIsGenerating(true);
    setActiveTab('write');
    try {
      const generatedContent: GenerateContentResponse = await AiApi.generateBlogContent({
        title: title,
        content:
          'Make it funny and cartoonish. Use Markdown formatting like **bold**, ## Headings, and bullet points.',
        lang: language,
      });
      setContent(generatedContent.content);
      setExcerpt(generatedContent.content.substring(0, 100) + '...');
    } catch {
      alert('AI Writing failed. Ensure API KEY is set.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: Article = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: excerpt || content.substring(0, 100) + '...',
      author: 'Admin',
      date: new Date().toISOString(),
      category,
      imageUrl: coverImage || `https://picsum.photos/800/400?random=${Date.now()}`,
      tags:
        tags.length > 0
          ? [...tags, t('create.tag_new')]
          : [t('create.tag_new'), t(`category.${category}`)],
      views: 0,
    };

    addPost(newPost);
    navigate('/');
  };

  const categories = [
    { value: 'tech', emoji: '💻', color: 'bg-toon-blue' },
    { value: 'life', emoji: '🌱', color: 'bg-toon-yellow' },
    { value: 'trip', emoji: '🏍️', color: 'bg-toon-purple' },
    { value: 'food', emoji: '🍕', color: 'bg-toon-red' },
    { value: 'random', emoji: '🎲', color: 'bg-gray-400' },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Header - 紧凑标题 */}
      <div className="mb-4 md:mb-5 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl md:text-4xl font-black mb-1 text-gray-900">{t('create.title')}</h1>
        <p className="text-xs md:text-sm font-bold text-gray-600">{t('create.subtitle')}</p>
      </div>

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '100ms' }}
      >
        <ToonCard color="white" className="shadow-toon-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload - 紧凑图片上传 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-black text-base md:text-lg text-gray-900">
                <div className="w-1 h-5 bg-toon-purple rounded-full"></div>
                {t('create.cover_image')}
              </label>

              {!coverImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-3 border-dashed border-black rounded-xl p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-toon-yellow/10 hover:to-toon-yellow/5 transition-all group"
                >
                  <div className="bg-gradient-to-br from-toon-yellow to-yellow-300 p-3 border-2 border-black rounded-xl mb-3 shadow-toon group-hover:shadow-toon-lg group-hover:scale-110 transition-all">
                    <Upload size={24} className="text-gray-900" />
                  </div>
                  <p className="font-black text-base md:text-lg mb-1">{t('create.upload')}</p>
                  <p className="text-xs font-bold text-gray-500">{t('create.upload_sub')}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="relative border-3 border-black rounded-xl overflow-hidden group shadow-toon hover:shadow-toon-lg transition-shadow">
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-full h-48 md:h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-toon-red text-white px-3 py-2 border-2 border-black rounded-lg shadow-toon-lg hover:shadow-toon hover:scale-105 active:scale-95 transition-all font-black flex items-center gap-2 text-sm"
                    >
                      <X size={18} /> {t('create.remove')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title Input - 紧凑标题输入 */}
            <div>
              <label className="flex items-center gap-2 font-black text-base md:text-lg mb-2 text-gray-900">
                <div className="w-1 h-5 bg-toon-blue rounded-full"></div>
                {t('create.post_title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-3 border-black rounded-lg p-2.5 md:p-3 text-sm md:text-base font-bold focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all bg-white"
                placeholder="如：如何教我的猫写代码..."
              />
            </div>

            {/* Category - 紧凑分类 */}
            <div>
              <label className="flex items-center gap-2 font-black text-base md:text-lg mb-2 text-gray-900">
                <div className="w-1 h-5 bg-toon-red rounded-full"></div>
                {t('create.category')}
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`
                      px-4 md:px-5 py-2 md:py-2.5 border-3 border-black rounded-full font-black text-xs md:text-sm
                      transition-all hover:scale-105 active:scale-95
                      ${
                        category === cat.value
                          ? `${cat.color} shadow-toon-lg scale-105`
                          : 'bg-white hover:bg-gray-50 shadow-toon'
                      }
                    `}
                  >
                    <span className="mr-1 text-base">{cat.emoji}</span>
                    {t(`category.${cat.value}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Input - 紧凑标签 */}
            <div>
              <label className="flex items-center gap-2 font-black text-base md:text-lg mb-2 text-gray-900">
                <div className="w-1 h-5 bg-toon-yellow rounded-full"></div>
                <Tag size={18} /> {t('create.tags')}
              </label>

              {/* Tag Input */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 border-3 border-black rounded-lg p-2.5 font-bold text-sm focus:outline-none focus:border-toon-yellow focus:shadow-toon-lg transition-all bg-white"
                  placeholder={t('create.tags_placeholder')}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-toon-yellow border-3 border-black rounded-lg px-3 py-2.5 font-black hover:bg-yellow-300 hover:shadow-toon-lg active:scale-95 transition-all flex items-center gap-1.5 text-sm"
                >
                  <Plus size={18} /> {t('create.tags_add')}
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] p-3 border-3 border-dashed border-gray-300 rounded-lg bg-gray-50">
                {tags.length === 0 ? (
                  <div className="w-full text-center text-gray-400 font-bold italic py-1 text-xs">
                    {t('create.tags_empty')}
                  </div>
                ) : (
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-r from-toon-yellow to-yellow-300 border-2 border-black rounded-full px-3 py-1 font-black text-xs shadow-toon hover:shadow-toon-lg transition-all flex items-center gap-1.5 animate-in zoom-in duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Tag size={12} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 hover:bg-toon-red hover:text-white rounded-full p-0.5 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Tags */}
              <div className="mt-2">
                <p className="text-xs font-bold text-gray-500 mb-1.5">{t('create.tags_quick')}：</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    t('create.tag_original'),
                    t('create.tag_tutorial'),
                    t('create.tag_share'),
                    t('create.tag_useful'),
                    t('create.tag_fun'),
                  ].map((quickTag) => (
                    <button
                      key={quickTag}
                      type="button"
                      onClick={() => {
                        if (!tags.includes(quickTag)) {
                          setTags([...tags, quickTag]);
                        }
                      }}
                      disabled={tags.includes(quickTag)}
                      className={`
                        px-2.5 py-1 border-2 border-black rounded-md font-bold text-xs
                        transition-all hover:scale-105 active:scale-95
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

            {/* Content Editor - 紧凑编辑器 */}
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

              {/* Editor Tabs */}
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

              {/* Editor Container */}
              <div
                className={`
                  w-full border-3 border-black rounded-xl rounded-tl-none p-3 md:p-4 min-h-[250px] md:min-h-[350px]
                  bg-white focus-within:shadow-toon-lg transition-all relative overflow-hidden
                `}
              >
                {/* Generating Overlay */}
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
                      <span className="text-xs font-bold text-gray-600 mt-1">AI 正在创作中...</span>
                    </div>
                  </div>
                )}

                {activeTab === 'write' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full h-full font-mono text-xs md:text-sm focus:outline-none resize-none bg-transparent text-gray-900 leading-relaxed"
                    placeholder="使用 Markdown 编写精彩内容...

# 标题
## 副标题
**粗体** *斜体*
- 列表项
"
                    disabled={isGenerating}
                  />
                ) : (
                  <div className="prose prose-sm md:prose-base prose-headings:font-black prose-p:font-medium prose-a:text-toon-blue prose-a:font-bold prose-strong:text-gray-900 prose-img:border-3 prose-img:border-black prose-img:rounded-lg prose-ul:font-medium max-w-none font-sans overflow-y-auto max-h-[300px] md:max-h-[400px]">
                    {content ? (
                      <ReactMarkdown>{content}</ReactMarkdown>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Eye size={40} className="mb-2 opacity-50" />
                        <p className="italic font-bold text-sm">暂无内容预览...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt - 紧凑摘要 */}
            <div>
              <label className="flex items-center gap-2 font-black text-base md:text-lg mb-2 text-gray-900">
                <div className="w-1 h-5 bg-toon-yellow rounded-full"></div>
                {t('create.excerpt')}
                <span className="text-xs font-bold text-gray-500">(可选)</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full border-3 border-black rounded-lg p-2.5 md:p-3 font-medium text-xs md:text-sm focus:outline-none focus:border-toon-yellow focus:shadow-toon-lg transition-all bg-white text-gray-900"
                placeholder="为首页写一段吸引人的摘要..."
              />
            </div>

            {/* Submit Button - 紧凑提交按钮 */}
            <ToonButton
              type="submit"
              className="w-full py-3 md:py-4 text-base md:text-lg shadow-toon-lg hover:shadow-toon-xl active:shadow-toon transition-all"
            >
              <Save className="mr-2" size={20} /> {t('create.publish')}
            </ToonButton>
          </form>
        </ToonCard>
      </div>

      {/* Overwrite Modal */}
      <ToonModal
        isOpen={isOverwriteModalOpen}
        onClose={() => setIsOverwriteModalOpen(false)}
        title={t('modal.overwrite_title')}
        variant="danger"
        footer={
          <>
            <ToonButton variant="ghost" onClick={() => setIsOverwriteModalOpen(false)}>
              {t('modal.cancel')}
            </ToonButton>
            <ToonButton onClick={performAIWrite}>{t('modal.confirm')}</ToonButton>
          </>
        }
      >
        <p>{t('modal.overwrite_desc')}</p>
      </ToonModal>
    </div>
  );
};
