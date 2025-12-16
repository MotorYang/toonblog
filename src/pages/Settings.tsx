import {
  BookOpen,
  Info,
  Key,
  Link,
  Loader2,
  Music,
  Plus,
  Save,
  Trash2,
  Type,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Tip } from '@/components/GlobalTip';
import { ToonButton } from '@/components/ToonButton';
import { ToonCard } from '@/components/ToonCard';
import { useLanguage } from '@/context/LanguageContext';

import {
  ArticleCategory,
  MusicTrack,
  settingsApi,
  SettingsPayload,
} from '../services/modules/settings';

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

  // --- API 交互逻辑 ---

  // 1. 初始化：获取所有设置 (GET)
  useEffect(() => {
    const loadSetting = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getSettings();
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
      await settingsApi.saveSettings(payload);
      // 只有成功才会走到这里，失败会被拦截器捕获并 throw 出去跳到 catch
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
    const result = await settingsApi.verifyApiKey(apiKey.trim().toLowerCase());
    if (!result.status) {
      Tip.warning(t('settings.api.verifyApiKeyFailed'));
      apiInputRef.current?.focus();
    }
    Tip.success(t('settings.api.verifyApiKeyOk'));
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
      const result = await settingsApi.deleteCategoryBefore(category.id);
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
    'w-full p-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none transition-colors bg-gray-50 text-gray-800 placeholder-gray-400';

  // --- 渲染 Loading 状态 ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-yellow-600" size={48} />
        <p className="text-gray-500 font-bold">Loading settings...</p>
      </div>
    );
  }

  // --- 渲染主界面 ---
  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800">{t('settings.title')}</h1>
      </div>

      <ToonCard color="white">
        <form onSubmit={handleSubmit} className="p-2 space-y-8">
          {/* 区域 1: Gemini API Key */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700 border-b-4 border-yellow-100 pb-2">
              <Key className="text-yellow-600" />
              {t('settings.api.title')}
            </h2>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">
                API Key
              </label>
              <div className="relative w-full">
                <input
                  ref={apiInputRef}
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ex: AIzaSy..."
                  className={`${inputBaseClass} pr-12`} // 右侧留空间
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 md:py-2 bg-toon-yellow text-toon-ink hover:bg-yellow-400 rounded-xl transition-colors font-bold text-xs md:text-sm"
                  onClick={handleVerifyApi}
                >
                  {t('settings.api.verify')}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-1">{t('settings.api.tips')}</p>
            </div>
          </div>

          {/* 区域 2: 文章分类 (动态增删) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b-4 border-yellow-100 pb-2">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                <BookOpen className="text-yellow-600" />
                {t('settings.category.title')} ({categories.length})
              </h2>
            </div>

            {/* 空列表提示 */}
            {categories.length === 0 && (
              <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <BookOpen size={40} className="mx-auto mb-2 opacity-20" />
                {t('settings.category.noAdded')}
              </div>
            )}

            {/* 列表渲染 */}
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-yellow-50/30 p-4 rounded-2xl border-2 border-yellow-100 relative transition-all hover:border-yellow-300 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-black px-2 py-1 rounded-md">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="text-red-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-1">
                        <Type size={12} /> {t('settings.category.chinese')}
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
                      <label className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-1">
                        <Type size={12} /> {t('settings.category.english')}
                      </label>
                      <input
                        type="text"
                        value={category.name_en}
                        onChange={(e) => updateCategory(index, 'name_en', e.target.value)}
                        placeholder="Article Classification"
                        className={inputBaseClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-1">
                      <Info size={12} /> {t('settings.category.remark')}
                    </label>
                    <textarea
                      value={category.remark}
                      onChange={(e) => updateCategory(index, 'remark', e.target.value)}
                      placeholder="Remark..."
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
              className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-400 rounded-xl hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <Plus size={20} />
              {t('settings.category.add')}
            </button>
          </div>

          {/* 区域 2: 音乐列表 (动态增删) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b-4 border-yellow-100 pb-2">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                <Music className="text-yellow-600" />
                {t('settings.music.title')} ({tracks.length})
              </h2>
            </div>

            {/* 空列表提示 */}
            {tracks.length === 0 && (
              <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <Music size={40} className="mx-auto mb-2 opacity-20" />
                {t('settings.music.noAdded')}
              </div>
            )}

            {/* 列表渲染 */}
            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className="bg-yellow-50/30 p-4 rounded-2xl border-2 border-yellow-100 relative transition-all hover:border-yellow-300 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-black px-2 py-1 rounded-md">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      className="text-red-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Delete Track"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-1">
                        <Type size={12} /> {t('settings.music.name')}
                      </label>
                      <input
                        type="text"
                        value={track.name}
                        onChange={(e) => updateTrack(index, 'name', e.target.value)}
                        placeholder="Song Title"
                        className={inputBaseClass}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-1">
                        <User size={12} /> {t('settings.music.author')}
                      </label>
                      <input
                        type="text"
                        value={track.author}
                        onChange={(e) => updateTrack(index, 'author', e.target.value)}
                        placeholder="Artist Name"
                        className={inputBaseClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-1">
                      <Link size={12} /> {t('settings.music.url')}
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
              className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-400 rounded-xl hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <Plus size={20} />
              {t('settings.music.addTrack')}
            </button>
          </div>

          {/* 底部保存按钮 */}
          <div className="pt-6 sticky bottom-4 z-10">
            <ToonButton type="submit" disabled={isSaving} className="w-full py-4 text-xl">
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" />
                  {t('global.saving')}
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  {t('global.save')}
                </>
              )}
            </ToonButton>
          </div>
        </form>
      </ToonCard>
    </div>
  );
};
