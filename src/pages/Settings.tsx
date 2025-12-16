import {
  BookOpen,
  CheckCircle2,
  Info,
  Key,
  Link,
  Loader2,
  Music,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Type,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Tip } from '@/components/GlobalTip';
import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { useLanguage } from '@/context/LanguageContext';
import { settingService } from '@/services/settingService';
import { ArticleCategory, MusicTrack, SettingsPayload } from '@/types/settings';

export const Settings: React.FC = () => {
  const { t } = useLanguage();
  const apiInputRef = useRef<HTMLInputElement | null>(null);

  // --- 状态管理 ---
  const [apiKey, setApiKey] = useState<string>('');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);

  // UI 交互状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // --- API 交互逻辑 ---

  // 1. 初始化：获取所有设置 (GET)
  useEffect(() => {
    const loadSetting = async () => {
      try {
        setIsLoading(true);
        const data = await settingService.getSettings();
        setApiKey(data.apiKey || '');
        setTracks(data.musicTracks || []);
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadSetting();
  }, []);

  // 2. 提交：保存所有设置 (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: SettingsPayload = {
      apiKey: apiKey,
      musicTracks: tracks.filter((t) => t.url.trim() !== ''),
    };

    try {
      await settingService.saveSettings(payload);
      Tip.success(t('settings.saved') || 'Settings saved successfully!');
    } catch (error) {
      console.error('Settings save failed', error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- 校验API ---
  const handleVerifyApi = async () => {
    if (!apiKey) {
      Tip.warning(t('settings.api.emptyTip'));
      return;
    }
    setIsVerifying(true);
    try {
      const result = await settingService.verifyApiKey(apiKey.trim().toLowerCase());
      if (!result.status) {
        Tip.warning(t('settings.api.verifyApiKeyFailed'));
        apiInputRef.current?.focus();
      } else {
        Tip.success(t('settings.api.verifyApiKeyOk'));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // --- 列表操作逻辑 ---
  const updateTrack = (index: number, field: keyof MusicTrack, value: string) => {
    const newTracks = [...tracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    setTracks(newTracks);
  };

  const updateCategory = (index: number, field: keyof ArticleCategory, value: string) => {
    const newCategory = [...categories];
    newCategory[index] = { ...newCategory[index], [field]: value };
    setCategories(newCategory);
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      { id: null, code: '', name_zh: '', name_en: '', remark: '', count: 0 },
    ]);
  };

  const removeCategory = async (index: number) => {
    const category = categories[index];
    if (category.id) {
      const result = await settingService.deleteCategoryBefore(category.id);
      if (!result.status) {
        Tip.warning(t('settings.category.banDel'));
        return;
      }
    }
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addTrack = () => {
    setTracks([...tracks, { name: '', author: '', url: '' }]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  // --- 样式定义 ---
  const inputBaseClass =
    'w-full p-3 md:p-4 border-3 border-black rounded-xl focus:border-toon-blue focus:outline-none focus:shadow-toon-lg transition-all bg-white text-gray-900 placeholder-gray-400 font-medium text-sm md:text-base';

  // --- 渲染 Loading 状态 ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-500">
        <div className="relative">
          <Loader2 className="animate-spin text-toon-purple w-16 h-16" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-toon-yellow w-6 h-6 animate-pulse" />
        </div>
        <p className="text-gray-600 font-bold text-lg">加载设置中...</p>
      </div>
    );
  }

  // --- 渲染主界面 ---
  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      {/* Header - 优化标题 */}
      <div className="text-center mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-sm md:text-base font-bold text-gray-600">配置系统参数和偏好设置</p>
      </div>

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '100ms' }}
      >
        <ToonCard color="white" className="shadow-toon-lg">
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-8">
            {/* 区域 1: Gemini API Key */}
            <div
              className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-3 pb-3 border-b-4 border-toon-yellow">
                <div className="bg-gradient-to-br from-toon-yellow to-yellow-400 p-2.5 border-3 border-black rounded-xl shadow-toon-sm">
                  <Key className="w-5 h-5 text-gray-900" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">
                  {t('settings.api.title')}
                </h2>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black uppercase text-gray-600 tracking-wider">
                  <div className="w-1 h-4 bg-toon-yellow rounded-full"></div>
                  API Key
                </label>
                <div className="relative">
                  <input
                    ref={apiInputRef}
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className={`${inputBaseClass} pr-24`}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 md:px-4 py-2 md:py-2.5 bg-toon-blue text-white hover:bg-cyan-400 rounded-xl transition-all font-bold text-xs md:text-sm border-2 border-black shadow-toon-sm hover:shadow-toon active:translate-y-0.5 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleVerifyApi}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span className="hidden sm:inline">{t('settings.api.verify')}</span>
                  </button>
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium ml-1 flex items-start gap-1">
                  <Info size={14} className="flex-shrink-0 mt-0.5" />
                  {t('settings.api.tips')}
                </p>
              </div>
            </div>

            {/* 区域 2: 文章分类 */}
            <div
              className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center justify-between pb-3 border-b-4 border-toon-blue">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-toon-blue to-cyan-400 p-2.5 border-3 border-black rounded-xl shadow-toon-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900">
                    {t('settings.category.title')}
                  </h2>
                </div>
                <span className="bg-toon-blue text-white font-black px-3 py-1.5 rounded-xl border-2 border-black text-sm">
                  {categories.length}
                </span>
              </div>

              {/* 空列表提示 */}
              {categories.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white border-4 border-dashed border-gray-300 rounded-2xl animate-in fade-in scale-in duration-300">
                  <div className="bg-gray-100 p-6 border-3 border-black rounded-full inline-block mb-3">
                    <BookOpen size={32} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-500">{t('settings.category.noAdded')}</p>
                </div>
              )}

              {/* 列表渲染 */}
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-toon-blue/10 to-white p-4 md:p-5 rounded-2xl border-3 border-black relative transition-all hover:shadow-toon-sm animate-in fade-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gradient-to-br from-toon-blue to-cyan-400 text-white text-xs md:text-sm font-black px-3 py-1.5 rounded-xl border-2 border-black shadow-toon-sm">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="bg-toon-red/10 text-toon-red hover:bg-toon-red hover:text-white p-2 rounded-xl transition-all border-2 border-black shadow-toon-sm hover:shadow-toon active:translate-y-0.5"
                        title="删除分类"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 mb-2">
                          <Type size={14} /> {t('settings.category.chinese')}
                        </label>
                        <input
                          type="text"
                          value={category.name_zh}
                          onChange={(e) => updateCategory(index, 'name_zh', e.target.value)}
                          placeholder="文章分类（中文）"
                          className={inputBaseClass}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 mb-2">
                          <Type size={14} /> {t('settings.category.english')}
                        </label>
                        <input
                          type="text"
                          value={category.name_en}
                          onChange={(e) => updateCategory(index, 'name_en', e.target.value)}
                          placeholder="Article Category"
                          className={inputBaseClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 mb-2">
                        <Info size={14} /> {t('settings.category.remark')}
                      </label>
                      <textarea
                        value={category.remark}
                        onChange={(e) => updateCategory(index, 'remark', e.target.value)}
                        placeholder="备注说明..."
                        rows={2}
                        className={inputBaseClass}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 添加按钮 */}
              <button
                type="button"
                onClick={addCategory}
                className="w-full py-4 border-4 border-dashed border-gray-300 text-gray-500 rounded-2xl hover:border-toon-blue hover:text-toon-blue hover:bg-toon-blue/5 transition-all flex items-center justify-center gap-2 font-black text-sm md:text-base group"
              >
                <div className="bg-white border-2 border-gray-300 group-hover:border-toon-blue group-hover:bg-toon-blue group-hover:text-white rounded-full p-1.5 transition-all">
                  <Plus size={18} />
                </div>
                {t('settings.category.add')}
              </button>
            </div>

            {/* 区域 3: 音乐列表 */}
            <div
              className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: '400ms' }}
            >
              <div className="flex items-center justify-between pb-3 border-b-4 border-toon-purple">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-toon-purple to-purple-500 p-2.5 border-3 border-black rounded-xl shadow-toon-sm">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900">
                    {t('settings.music.title')}
                  </h2>
                </div>
                <span className="bg-toon-purple text-white font-black px-3 py-1.5 rounded-xl border-2 border-black text-sm">
                  {tracks.length}
                </span>
              </div>

              {/* 空列表提示 */}
              {tracks.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white border-4 border-dashed border-gray-300 rounded-2xl animate-in fade-in scale-in duration-300">
                  <div className="bg-gray-100 p-6 border-3 border-black rounded-full inline-block mb-3">
                    <Music size={32} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-500">{t('settings.music.noAdded')}</p>
                </div>
              )}

              {/* 列表渲染 */}
              <div className="space-y-3">
                {tracks.map((track, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-toon-purple/10 to-white p-4 md:p-5 rounded-2xl border-3 border-black relative transition-all hover:shadow-toon-sm animate-in fade-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gradient-to-br from-toon-purple to-purple-500 text-white text-xs md:text-sm font-black px-3 py-1.5 rounded-xl border-2 border-black shadow-toon-sm">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTrack(index)}
                        className="bg-toon-red/10 text-toon-red hover:bg-toon-red hover:text-white p-2 rounded-xl transition-all border-2 border-black shadow-toon-sm hover:shadow-toon active:translate-y-0.5"
                        title="删除音乐"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 mb-2">
                          <Type size={14} /> {t('settings.music.name')}
                        </label>
                        <input
                          type="text"
                          value={track.name}
                          onChange={(e) => updateTrack(index, 'name', e.target.value)}
                          placeholder="歌曲名称"
                          className={inputBaseClass}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 mb-2">
                          <User size={14} /> {t('settings.music.author')}
                        </label>
                        <input
                          type="text"
                          value={track.author}
                          onChange={(e) => updateTrack(index, 'author', e.target.value)}
                          placeholder="艺术家"
                          className={inputBaseClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 mb-2">
                        <Link size={14} /> {t('settings.music.url')}
                      </label>
                      <input
                        type="url"
                        value={track.url}
                        onChange={(e) => updateTrack(index, 'url', e.target.value)}
                        placeholder="https://example.com/song.mp3"
                        className={inputBaseClass}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 添加按钮 */}
              <button
                type="button"
                onClick={addTrack}
                className="w-full py-4 border-4 border-dashed border-gray-300 text-gray-500 rounded-2xl hover:border-toon-purple hover:text-toon-purple hover:bg-toon-purple/5 transition-all flex items-center justify-center gap-2 font-black text-sm md:text-base group"
              >
                <div className="bg-white border-2 border-gray-300 group-hover:border-toon-purple group-hover:bg-toon-purple group-hover:text-white rounded-full p-1.5 transition-all">
                  <Plus size={18} />
                </div>
                {t('settings.music.addTrack')}
              </button>
            </div>

            {/* 底部保存按钮 */}
            <div
              className="pt-6 sticky bottom-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: '500ms' }}
            >
              <ToonButton
                type="submit"
                disabled={isSaving}
                className="w-full py-4 md:py-5 text-lg md:text-xl shadow-toon-lg hover:shadow-toon-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={24} />
                    {t('global.saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={24} />
                    {t('global.save')}
                  </>
                )}
              </ToonButton>
            </div>
          </form>
        </ToonCard>
      </div>
    </div>
  );
};
