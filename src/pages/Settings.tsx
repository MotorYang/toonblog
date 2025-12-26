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
import { ApiVerifyResult, ArticleCategory, MusicTrack, SettingsPayload } from '@/types/settings';

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
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to load settings', error);
        Tip.error(t('settings.loadFailed') || '加载设置失败');
      } finally {
        setIsLoading(false);
      }
    };
    void loadSetting();
  }, [t]);

  // 2. 提交：保存所有设置 (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateData()) {
      return;
    }

    setIsSaving(true);

    const payload: SettingsPayload = {
      apiKey: apiKey.trim(),
      musicTracks: tracks.filter((t) => t.url.trim() !== ''),
      categories: categories.filter((c) => c.nameZh.trim() !== '' || c.nameEn.trim() !== ''),
    };

    try {
      await settingService.saveSettings(payload);
      Tip.success(t('settings.saved') || '设置保存成功！');
    } catch {
      console.error('Settings save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const validateData = (): boolean => {
    // 验证分类：中英文名称至少填一个
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      if (!cat.nameZh.trim() && !cat.nameEn.trim()) {
        Tip.warning(`分类 #${i + 1}: 请至少填写中文或英文名称`);
        return false;
      }
      // 验证code不能为空
      if (!cat.code.trim()) {
        Tip.warning(`分类 #${i + 1}: 分类代码不能为空`);
        return false;
      }
    }

    // 验证音乐：如果填写了名称,则URL必填
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.name.trim() && !track.url.trim()) {
        Tip.warning(`音乐 #${i + 1}: 填写了歌曲名称,必须填写URL`);
        return false;
      }
    }

    return true;
  };

  // --- 校验API ---
  const handleVerifyApi = async () => {
    if (!apiKey.trim()) {
      Tip.warning(t('settings.api.emptyTip') || 'API Key 不能为空');
      return;
    }

    setIsVerifying(true);
    try {
      const result: ApiVerifyResult = await settingService.verifyApiKey(apiKey.trim());

      if (!result.status) {
        Tip.warning(result.message || t('settings.api.verifyApiKeyFailed') || 'API Key 验证失败');
        apiInputRef.current?.focus();
      } else {
        Tip.success(result.message || t('settings.api.verifyApiKeyOk') || 'API Key 验证成功');
      }
    } catch {
      console.error('API verification failed');
      apiInputRef.current?.focus();
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

  const updateCategory = (index: number, field: keyof ArticleCategory, value: string | number) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: null,
        code: '',
        nameZh: '',
        nameEn: '',
        remark: '',
        count: 0,
        sortOrder: categories.length + 1,
      },
    ]);
  };

  const removeCategory = async (index: number) => {
    const category = categories[index];

    // 如果是已保存的分类（有code），需要先检查是否可以删除
    if (category.code) {
      const result = await settingService.deleteCategoryBefore(category.code);

      if (!result.status) {
        Tip.warning(
          result.message ||
            t('settings.category.banDel') ||
            `该分类下还有 ${result.articleCount} 篇文章，无法删除`,
        );
        return;
      }
    }

    setCategories(categories.filter((_, i) => i !== index));
  };

  const addTrack = () => {
    setTracks([
      ...tracks,
      {
        id: null,
        name: '',
        author: '',
        url: '',
        duration: 0,
        sortOrder: tracks.length + 1,
      },
    ]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  // --- 样式定义 ---
  const inputBaseClass =
    'w-full px-3 py-2 border-2 border-black rounded-lg focus:border-toon-blue focus:outline-none focus:shadow-toon transition-all bg-white text-gray-900 placeholder-gray-400 font-medium text-sm';

  // --- 渲染 Loading 状态 ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 animate-in fade-in duration-500">
        <div className="relative">
          <Loader2 className="animate-spin text-toon-purple w-12 h-12" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-toon-yellow w-5 h-5 animate-pulse" />
        </div>
        <p className="text-gray-600 font-bold">加载设置中...</p>
      </div>
    );
  }

  // --- 渲染主界面 ---
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
      {/* Header - 紧凑标题 */}
      <div className="text-center mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-gray-600">配置系统参数和偏好设置</p>
      </div>

      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '100ms' }}
      >
        <ToonCard color="white" className="shadow-toon-lg">
          <form onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-6">
            {/* 区域 1: Gemini API Key */}
            <div
              className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-2 pb-2 border-b-3 border-toon-yellow">
                <div className="bg-gradient-to-br from-toon-yellow to-yellow-400 p-2 border-2 border-black rounded-lg shadow-toon-sm">
                  <Key className="w-4 h-4 text-gray-900" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">
                  {t('settings.api.title')}
                </h2>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-black uppercase text-gray-600 tracking-wide">
                  <div className="w-0.5 h-3 bg-toon-yellow rounded-full"></div>
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    ref={apiInputRef}
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className={`${inputBaseClass} flex-1`}
                  />
                  <button
                    type="button"
                    className="px-3 sm:px-4 py-2 bg-toon-blue text-white hover:bg-cyan-400 rounded-lg transition-all font-bold text-xs sm:text-sm border-2 border-black shadow-toon-sm hover:shadow-toon active:translate-y-0.5 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    onClick={handleVerifyApi}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span className="hidden sm:inline">{t('settings.api.verify')}</span>
                    <span className="sm:hidden">验证</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-medium ml-1 flex items-start gap-1">
                  <Info size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{t('settings.api.tips')}</span>
                </p>
              </div>
            </div>

            {/* 区域 2: 文章分类 */}
            <div
              className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center justify-between pb-2 border-b-3 border-toon-blue">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-toon-blue to-cyan-400 p-2 border-2 border-black rounded-lg shadow-toon-sm">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900">
                    {t('settings.category.title')}
                  </h2>
                </div>
                <span className="bg-toon-blue text-white font-black px-2.5 py-1 rounded-lg border-2 border-black text-xs">
                  {categories.length}
                </span>
              </div>

              {/* 空列表提示 */}
              {categories.length === 0 && (
                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-white border-3 border-dashed border-gray-300 rounded-xl animate-in fade-in scale-in duration-300">
                  <div className="bg-gray-100 p-4 border-2 border-black rounded-full inline-block mb-2">
                    <BookOpen size={24} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-500 text-sm">
                    {t('settings.category.noAdded')}
                  </p>
                </div>
              )}

              {/* 列表渲染 */}
              <div className="space-y-2.5">
                {categories.map((category, index) => (
                  <div
                    key={category.id || `new-${index}`}
                    className="bg-gradient-to-br from-toon-blue/10 to-white p-3 sm:p-4 rounded-xl border-2 border-black relative transition-all hover:shadow-toon-sm animate-in fade-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-gradient-to-br from-toon-blue to-cyan-400 text-white text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-toon-sm">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="bg-toon-red/10 text-toon-red hover:bg-toon-red hover:text-white p-1.5 rounded-lg transition-all border-2 border-black shadow-toon-sm hover:shadow-toon active:translate-y-0.5"
                        title="删除分类"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* 分类代码 */}
                    <div className="mb-2.5">
                      <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
                        <Type size={12} /> {t('settings.category.code') || '分类代码'}
                      </label>
                      <input
                        type="text"
                        value={category.code}
                        onChange={(e) => updateCategory(index, 'code', e.target.value)}
                        placeholder="tech / life / travel"
                        className={inputBaseClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                      <div>
                        <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
                          <Type size={12} /> {t('settings.category.chinese')}
                        </label>
                        <input
                          type="text"
                          value={category.nameZh}
                          onChange={(e) => updateCategory(index, 'nameZh', e.target.value)}
                          placeholder="文章分类（中文）"
                          className={inputBaseClass}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
                          <Type size={12} /> {t('settings.category.english')}
                        </label>
                        <input
                          type="text"
                          value={category.nameEn}
                          onChange={(e) => updateCategory(index, 'nameEn', e.target.value)}
                          placeholder="Article Category"
                          className={inputBaseClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
                        <Info size={12} /> {t('settings.category.remark')}
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
                className="w-full py-3 border-3 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-toon-blue hover:text-toon-blue hover:bg-toon-blue/5 transition-all flex items-center justify-center gap-2 font-black text-sm group"
              >
                <div className="bg-white border-2 border-gray-300 group-hover:border-toon-blue group-hover:bg-toon-blue group-hover:text-white rounded-full p-1 transition-all">
                  <Plus size={16} />
                </div>
                {t('settings.category.add')}
              </button>
            </div>

            {/* 区域 3: 音乐列表 */}
            <div
              className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: '400ms' }}
            >
              <div className="flex items-center justify-between pb-2 border-b-3 border-toon-purple">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-toon-purple to-purple-500 p-2 border-2 border-black rounded-lg shadow-toon-sm">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900">
                    {t('settings.music.title')}
                  </h2>
                </div>
                <span className="bg-toon-purple text-white font-black px-2.5 py-1 rounded-lg border-2 border-black text-xs">
                  {tracks.length}
                </span>
              </div>

              {/* 空列表提示 */}
              {tracks.length === 0 && (
                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-white border-3 border-dashed border-gray-300 rounded-xl animate-in fade-in scale-in duration-300">
                  <div className="bg-gray-100 p-4 border-2 border-black rounded-full inline-block mb-2">
                    <Music size={24} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-500 text-sm">{t('settings.music.noAdded')}</p>
                </div>
              )}

              {/* 列表渲染 */}
              <div className="space-y-2.5">
                {tracks.map((track, index) => (
                  <div
                    key={track.id || `new-${index}`}
                    className="bg-gradient-to-br from-toon-purple/10 to-white p-3 sm:p-4 rounded-xl border-2 border-black relative transition-all hover:shadow-toon-sm animate-in fade-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-gradient-to-br from-toon-purple to-purple-500 text-white text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-toon-sm">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTrack(index)}
                        className="bg-toon-red/10 text-toon-red hover:bg-toon-red hover:text-white p-1.5 rounded-lg transition-all border-2 border-black shadow-toon-sm hover:shadow-toon active:translate-y-0.5"
                        title="删除音乐"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                      <div>
                        <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
                          <Type size={12} /> {t('settings.music.name')}
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
                        <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
                          <User size={12} /> {t('settings.music.author')}
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
                      <label className="flex items-center gap-1 text-xs font-black text-gray-600 mb-1.5">
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
                className="w-full py-3 border-3 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-toon-purple hover:text-toon-purple hover:bg-toon-purple/5 transition-all flex items-center justify-center gap-2 font-black text-sm group"
              >
                <div className="bg-white border-2 border-gray-300 group-hover:border-toon-purple group-hover:bg-toon-purple group-hover:text-white rounded-full p-1 transition-all">
                  <Plus size={16} />
                </div>
                {t('settings.music.addTrack')}
              </button>
            </div>

            {/* 底部保存按钮 */}
            <div
              className="pt-4 sticky bottom-3 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: '500ms' }}
            >
              <ToonButton
                type="submit"
                disabled={isSaving}
                className="w-full py-3 sm:py-4 text-base sm:text-lg shadow-toon-lg hover:shadow-toon-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    {t('global.saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={20} />
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
