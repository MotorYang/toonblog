import { Edit3, Eye, Loader2, Lock, Save, Sparkles, Upload, Wand2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { ToonModal } from '@/components/ToonModal';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore.ts';

import { Article } from '../../types.ts';
import { generateBlogContent } from '../services/geminiService.ts';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useBlogStore();
  const { isAdmin } = userAuthStore();
  const { t, language } = useLanguage();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Tech');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isOverwriteModalOpen, setIsOverwriteModalOpen] = useState(false);

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
        <div className="bg-toon-red/20 p-8 border-4 border-black rounded-2xl shadow-toon-lg">
          <Lock size={64} className="text-toon-red mb-4 mx-auto animate-pulse" />
          <h2 className="text-3xl font-black mb-2 text-gray-900">访问受限！</h2>
          <p className="font-bold text-gray-600">仅管理员可创建文章</p>
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
      const generatedContent = await generateBlogContent(
        title,
        'Make it funny and cartoonish. Use Markdown formatting like **bold**, ## Headings, and bullet points.',
        language,
      );
      setContent(generatedContent);
      setExcerpt(generatedContent.substring(0, 100) + '...');
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
      date: new Date().toISOString().split('T')[0],
      category,
      imageUrl: coverImage || `https://picsum.photos/800/400?random=${Date.now()}`,
      tags: ['New', category],
      views: 0,
    };

    addPost(newPost);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header - 优化标题区域 */}
      <div className="mb-6 md:mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-5xl font-black mb-2 text-gray-900">{t('create.title')}</h1>
        <p className="text-sm md:text-base font-bold text-gray-600">{t('create.subtitle')}</p>
      </div>

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '100ms' }}
      >
        <ToonCard color="white" className="shadow-toon-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload - 优化样式 */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-black text-lg md:text-xl text-gray-900">
                <div className="w-1 h-6 bg-toon-purple rounded-full"></div>
                {t('create.cover_image')}
              </label>

              {!coverImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-black rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-toon-yellow/10 hover:to-toon-yellow/5 transition-all group"
                >
                  <div className="bg-gradient-to-br from-toon-yellow to-yellow-300 p-4 border-3 border-black rounded-2xl mb-4 shadow-toon group-hover:shadow-toon-lg group-hover:scale-110 transition-all">
                    <Upload size={32} className="text-gray-900" />
                  </div>
                  <p className="font-black text-lg md:text-xl mb-1">{t('create.upload')}</p>
                  <p className="text-sm font-bold text-gray-500">{t('create.upload_sub')}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="relative border-4 border-black rounded-2xl overflow-hidden group shadow-toon hover:shadow-toon-lg transition-shadow">
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-full h-56 md:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-toon-red text-white px-4 py-3 border-3 border-black rounded-xl shadow-toon-lg hover:shadow-toon hover:scale-105 active:scale-95 transition-all font-black flex items-center gap-2"
                    >
                      <X size={20} /> {t('create.remove')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title Input - 优化样式 */}
            <div>
              <label className="flex items-center gap-2 font-black text-lg md:text-xl mb-3 text-gray-900">
                <div className="w-1 h-6 bg-toon-blue rounded-full"></div>
                {t('create.post_title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-4 border-black rounded-xl p-3 md:p-4 text-base md:text-lg font-bold focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all bg-white"
                placeholder="如：如何教我的猫写代码..."
              />
            </div>

            {/* Category - 优化样式 */}
            <div>
              <label className="flex items-center gap-2 font-black text-lg md:text-xl mb-3 text-gray-900">
                <div className="w-1 h-6 bg-toon-red rounded-full"></div>
                {t('create.category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-4 border-black rounded-xl p-3 md:p-4 font-bold focus:outline-none focus:border-toon-red focus:shadow-toon-lg transition-all bg-white text-base md:text-lg"
              >
                <option>Tech</option>
                <option>Life</option>
                <option>Art</option>
                <option>Food</option>
                <option>Random</option>
              </select>
            </div>

            {/* Content Editor - 重新设计 */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                <label className="flex items-center gap-2 font-black text-lg md:text-xl text-gray-900">
                  <div className="w-1 h-6 bg-toon-purple rounded-full"></div>
                  {t('create.content')}
                </label>
                <ToonButton
                  type="button"
                  variant="secondary"
                  onClick={startAIWrite}
                  isLoading={isGenerating}
                  className="text-sm py-2 px-4 shadow-toon hover:shadow-toon-lg"
                >
                  <Wand2 size={16} className="mr-2" /> {t('create.magic_write')}
                </ToonButton>
              </div>

              {/* Editor Tabs - 优化标签设计 */}
              <div className="flex gap-2 mb-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`
                    flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 font-black border-4 border-black rounded-t-2xl transition-all text-sm md:text-base
                    ${
                      activeTab === 'write'
                        ? 'bg-toon-yellow text-gray-900 -mb-[4px] z-10 shadow-toon'
                        : 'bg-gray-100 hover:bg-gray-200 mt-1 border-b-0'
                    }
                  `}
                >
                  <Edit3 size={18} /> {t('create.write')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`
                    flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 font-black border-4 border-black rounded-t-2xl transition-all text-sm md:text-base
                    ${
                      activeTab === 'preview'
                        ? 'bg-toon-blue text-gray-900 -mb-[4px] z-10 shadow-toon'
                        : 'bg-gray-100 hover:bg-gray-200 mt-1 border-b-0'
                    }
                  `}
                >
                  <Eye size={18} /> {t('create.preview')}
                </button>
              </div>

              {/* Editor Container - 优化容器 */}
              <div
                className={`
                  w-full border-4 border-black rounded-2xl rounded-tl-none p-4 md:p-6 min-h-[300px] md:min-h-[400px]
                  bg-white focus-within:shadow-toon-lg transition-all relative overflow-hidden
                `}
              >
                {/* Generating Overlay - 优化加载状态 */}
                {isGenerating && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="flex flex-col items-center p-8 bg-white border-4 border-black rounded-2xl shadow-toon-lg animate-in zoom-in duration-300">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-toon-purple" />
                        <Sparkles className="w-6 h-6 text-toon-yellow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <span className="font-black text-xl mt-4 animate-pulse text-gray-900">
                        {t('create.generating')}
                      </span>
                      <span className="text-sm font-bold text-gray-600 mt-2">AI 正在创作中...</span>
                    </div>
                  </div>
                )}

                {activeTab === 'write' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={14}
                    className="w-full h-full font-mono text-sm md:text-base focus:outline-none resize-none bg-transparent text-gray-900 leading-relaxed"
                    placeholder="使用 Markdown 编写精彩内容...

# 标题
## 副标题
**粗体** *斜体*
- 列表项
"
                    disabled={isGenerating}
                  />
                ) : (
                  <div className="prose prose-sm md:prose-lg prose-headings:font-black prose-p:font-medium prose-a:text-toon-blue prose-a:font-bold prose-strong:text-gray-900 prose-img:border-4 prose-img:border-black prose-img:rounded-xl prose-ul:font-medium max-w-none font-sans overflow-y-auto max-h-[400px] md:max-h-[500px]">
                    {content ? (
                      <ReactMarkdown>{content}</ReactMarkdown>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Eye size={48} className="mb-3 opacity-50" />
                        <p className="italic font-bold">暂无内容预览...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt - 优化样式 */}
            <div>
              <label className="flex items-center gap-2 font-black text-lg md:text-xl mb-3 text-gray-900">
                <div className="w-1 h-6 bg-toon-yellow rounded-full"></div>
                {t('create.excerpt')}
                <span className="text-sm font-bold text-gray-500">(可选)</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full border-4 border-black rounded-xl p-3 md:p-4 font-medium text-sm md:text-base focus:outline-none focus:border-toon-yellow focus:shadow-toon-lg transition-all bg-white text-gray-900"
                placeholder="为首页写一段吸引人的摘要..."
              />
            </div>

            {/* Submit Button - 优化按钮 */}
            <ToonButton
              type="submit"
              className="w-full py-4 md:py-5 text-lg md:text-xl shadow-toon-lg hover:shadow-toon-xl active:shadow-toon transition-all"
            >
              <Save className="mr-2" size={24} /> {t('create.publish')}
            </ToonButton>
          </form>
        </ToonCard>
      </div>

      {/* Overwrite Modal - 保持原样 */}
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
