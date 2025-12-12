import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ToonCard } from '../components/ToonCard';
import { ToonButton } from '../components/ToonButton';
import { ToonModal } from '../components/ToonModal';
import { generateBlogContent } from '../services/geminiService';
import {Wand2, Save, Lock, Upload, X, Eye, Edit3, Loader2, PenTool} from 'lucide-react';
import { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';

export const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const { addPost } = useBlogStore();
    const { isAdmin } = useAuth();
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
            // Small delay to prevent flicker if checking auth status
            const timer = setTimeout(() => navigate('/'), 100);
            return () => clearTimeout(timer);
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <Lock size={64} className="text-toon-red mb-4" />
                <h2 className="text-3xl font-black mb-2">Access Denied!</h2>
                <p className="font-bold text-gray-500">Only the "admin" admin can write cool stuff.</p>
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

        // If there is already content, ask for confirmation
        if (content.trim().length > 0) {
            setIsOverwriteModalOpen(true);
        } else {
            performAIWrite();
        }
    };

    const performAIWrite = async () => {
        setIsOverwriteModalOpen(false);
        setIsGenerating(true);
        setActiveTab('write'); // Switch back to write mode to see result
        try {
            const generatedContent = await generateBlogContent(
                title,
                "Make it funny and cartoonish. Use Markdown formatting like **bold**, ## Headings, and bullet points.",
                language
            );
            setContent(generatedContent);
            setExcerpt(generatedContent.substring(0, 100) + '...');
        } catch (e) {
            alert('AI Writing failed. Ensure API KEY is set.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        const newPost: BlogPost = {
            id: Date.now().toString(),
            title,
            content,
            excerpt: excerpt || content.substring(0, 100) + '...',
            author: 'Admin', // Always admin if here
            date: new Date().toISOString().split('T')[0],
            category,
            // Use uploaded image or fallback to random
            imageUrl: coverImage || `https://picsum.photos/800/400?random=${Date.now()}`,
            tags: ['New', category],
            views: 0
        };

        addPost(newPost);
        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-4 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-black flex items-center justify-center gap-3">
                    <PenTool size={32} className="text-toon-blue md:w-10 md:h-10" />
                    {t('create.title')}
                </h1>
                <p className="font-bold text-gray-600">{t('create.subtitle')}</p>
            </div>

            <ToonCard color="white">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <label className="block font-black text-xl">{t('create.cover_image')}</label>

                        {!coverImage ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-4 border-dashed border-black rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-toon-bg transition-colors group"
                            >
                                <div className="bg-white p-3 border-2 border-black rounded-full mb-3 shadow-toon group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                                    <Upload size={24} />
                                </div>
                                <p className="font-bold text-lg">{t('create.upload')}</p>
                                <p className="text-sm font-medium text-gray-500">{t('create.upload_sub')}</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        ) : (
                            <div className="relative border-4 border-black rounded-xl overflow-hidden group">
                                <img src={coverImage} alt="Preview" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-toon-red text-white p-2 border-2 border-black rounded-lg shadow-toon hover:scale-105 transition-transform"
                                    >
                                        <div className="flex items-center gap-2 font-bold px-2">
                                            <X size={20} /> {t('create.remove')}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-black text-xl mb-2">{t('create.post_title')}</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-4 border-black rounded-xl p-3 text-lg font-bold focus:outline-none focus:shadow-toon transition-shadow"
                            placeholder="e.g., How I Taught My Cat HTML"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block font-black text-lg mb-2">{t('create.category')}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:shadow-toon bg-white"
                            >
                                <option>Tech</option>
                                <option>Life</option>
                                <option>Art</option>
                                <option>Food</option>
                                <option>Random</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block font-black text-xl">{t('create.content')}</label>
                            <ToonButton
                                type="button"
                                variant="secondary"
                                onClick={startAIWrite}
                                isLoading={isGenerating}
                                className="text-sm py-1 px-3"
                            >
                                <Wand2 size={16} className="mr-2" /> {t('create.magic_write')}
                            </ToonButton>
                        </div>

                        {/* Editor / Preview Tabs */}
                        <div className="flex gap-2 mb-0 pl-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('write')}
                                className={`
                  flex items-center gap-2 px-4 py-2 font-bold border-t-4 border-l-4 border-r-4 border-black rounded-t-xl transition-all
                  ${activeTab === 'write' ? 'bg-toon-yellow -mb-[4px] z-10' : 'bg-gray-100 hover:bg-gray-200 mt-2'}
                `}
                            >
                                <Edit3 size={16} /> {t('create.write')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('preview')}
                                className={`
                  flex items-center gap-2 px-4 py-2 font-bold border-t-4 border-l-4 border-r-4 border-black rounded-t-xl transition-all
                  ${activeTab === 'preview' ? 'bg-toon-blue -mb-[4px] z-10' : 'bg-gray-100 hover:bg-gray-200 mt-2'}
                `}
                            >
                                <Eye size={16} /> {t('create.preview')}
                            </button>
                        </div>

                        <div className={`
              w-full border-4 border-black rounded-xl rounded-tl-none p-4 min-h-[300px] 
              ${activeTab === 'write' ? 'bg-white' : 'bg-white'}
              focus-within:shadow-toon transition-shadow relative
            `}>
                            {/* Generating Overlay */}
                            {isGenerating && (
                                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                                    <div className="flex flex-col items-center p-6 bg-white border-4 border-black rounded-xl shadow-toon animate-in zoom-in">
                                        <Loader2 className="w-12 h-12 animate-spin text-toon-purple mb-3"/>
                                        <span className="font-black text-lg animate-pulse">{t('create.generating')}</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'write' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={12}
                                    className="w-full h-full font-mono text-base focus:outline-none resize-none bg-transparent"
                                    placeholder="Write something amazing using Markdown..."
                                    disabled={isGenerating}
                                />
                            ) : (
                                <div className="prose prose-lg prose-headings:font-black prose-p:font-medium prose-a:text-toon-blue prose-img:border-4 prose-img:border-black prose-img:rounded-xl max-w-none font-sans overflow-y-auto max-h-[500px]">
                                    {content ? (
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    ) : (
                                        <p className="text-gray-400 italic">Nothing to preview yet...</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block font-black text-xl mb-2">{t('create.excerpt')}</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            className="w-full border-4 border-black rounded-xl p-3 font-medium focus:outline-none focus:shadow-toon"
                            placeholder="A teaser for the homepage..."
                        />
                    </div>

                    <ToonButton type="submit" className="w-full py-4 text-xl">
                        <Save className="mr-2" /> {t('create.publish')}
                    </ToonButton>

                </form>
            </ToonCard>

            {/* Overwrite Confirmation Modal */}
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
                        <ToonButton onClick={performAIWrite}>
                            {t('modal.confirm')}
                        </ToonButton>
                    </>
                }
            >
                <p>{t('modal.overwrite_desc')}</p>
            </ToonModal>
        </div>
    );
};