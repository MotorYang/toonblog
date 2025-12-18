import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, List, Minus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedLevels, setCollapsedLevels] = useState<Set<number>>(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // 从 localStorage 读取侧边栏是否隐藏的状态
  const [isSidebarHidden, setIsSidebarHidden] = useState(() => {
    try {
      const saved = localStorage.getItem('toc-sidebar-hidden');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // 保存侧边栏状态到 localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarHidden;
    setIsSidebarHidden(newState);
    try {
      localStorage.setItem('toc-sidebar-hidden', String(newState));
    } catch {
      // localStorage 不可用时忽略错误
    }
  };

  useEffect(() => {
    // 从 Markdown 内容中提取标题
    const extractHeadings = (markdown: string): Heading[] => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const results: Heading[] = [];
      let match;

      while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-|-$/g, '');

        results.push({ id, text, level });
      }

      return results;
    };

    const extracted = extractHeadings(content);
    setHeadings(extracted);

    // 为实际渲染的标题添加 ID
    setTimeout(() => {
      const article = document.querySelector('article') || document.querySelector('.prose');
      if (article) {
        const actualHeadings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
        actualHeadings.forEach((heading, index) => {
          if (extracted[index]) {
            heading.id = extracted[index].id;
          }
        });
      }
    }, 100);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      // 如果是用户点击触发的滚动，等待滚动完成后再更新
      if (isScrolling) {
        return;
      }

      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);

      // 查找 sticky header
      const header = document.querySelector('header.sticky') as HTMLElement | null;
      let headerHeight = 0;

      if (header) {
        // 获取 header 的实际高度（包括 padding 和 border）
        headerHeight = header.offsetHeight;
      } else {
        // 如果找不到 header，使用估算值
        // 移动端约 60px，桌面端约 80px
        headerHeight = window.innerWidth >= 768 ? 80 : 60;
      }

      // 滚动偏移量 = 头部高度 + 额外间距（让标题不要紧贴头部）
      const scrollOffset = headerHeight + 16;
      const tolerance = 30; // 容差范围

      // 找到最接近目标位置的标题
      let closestHeading = null;
      let closestDistance = Infinity;

      for (const element of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - scrollOffset);

          // 标题必须在头部下方，且在合理范围内
          if (rect.top >= headerHeight - tolerance && distance < closestDistance) {
            closestDistance = distance;
            closestHeading = element;
          }
        }
      }

      // 如果没有找到合适的，使用传统方法：找到最后一个在偏移位置之上的标题
      if (!closestHeading) {
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const element = headingElements[i];
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= scrollOffset) {
              closestHeading = element;
              break;
            }
          }
        }
      }

      if (closestHeading && closestHeading.id !== activeId) {
        setActiveId(closestHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, isScrolling, activeId]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 清除之前的定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 立即设置激活状态和滚动标志
      setActiveId(id);
      setIsScrolling(true);

      // 查找 sticky header
      const header = document.querySelector('header.sticky') as HTMLElement | null;
      let headerHeight = 0;

      if (header) {
        // 获取 header 的实际高度（包括 padding 和 border）
        headerHeight = header.offsetHeight;
      } else {
        // 如果找不到 header，使用估算值
        headerHeight = window.innerWidth >= 768 ? 80 : 60;
      }

      // 使用与激活检测相同的偏移量
      const scrollOffset = headerHeight + 16;
      const top = element.offsetTop - scrollOffset;
      window.scrollTo({ top, behavior: 'smooth' });

      // 滚动完成后重置标志（smooth滚动通常在1秒内完成）
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
    setIsOpen(false);
  };

  const toggleLevel = (level: number) => {
    setCollapsedLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  const getMinLevel = () => Math.min(...headings.map((h) => h.level));

  const shouldShowHeading = (heading: Heading, index: number): boolean => {
    if (collapsedLevels.size === 0) return true;

    // 检查当前标题的父级是否被折叠
    for (let i = index - 1; i >= 0; i--) {
      const prevHeading = headings[i];
      if (prevHeading.level < heading.level) {
        if (collapsedLevels.has(prevHeading.level)) {
          return false;
        }
        break;
      }
    }
    return true;
  };

  const hasChildren = (heading: Heading, index: number): boolean => {
    return index < headings.length - 1 && headings[index + 1].level > heading.level;
  };

  if (headings.length === 0) return null;

  const minLevel = getMinLevel();

  return (
    <>
      {/* 移动端按钮 - 与GlobalToolbox对齐 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-[88px] right-2 sm:bottom-24 sm:right-4 z-40 w-14 h-14 sm:w-16 sm:h-16 p-0 bg-toon-purple text-white border-4 border-black rounded-full shadow-toon hover:shadow-toon-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        aria-label="打开目录"
      >
        <List size={28} className="sm:w-8 sm:h-8" />
      </button>

      {/* 移动端弹窗目录 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black rounded-t-2xl shadow-toon-xl max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b-2 border-black sticky top-0 bg-white z-10 flex items-center justify-between">
              <h3 className="font-black text-lg flex items-center gap-2">
                <List size={20} />
                目录 ({headings.length})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <nav className="p-4 overflow-y-auto flex-1">
              {headings.map((heading, index) => {
                if (!shouldShowHeading(heading, index)) return null;

                return (
                  <div key={index} className="mb-1">
                    <button
                      onClick={() => handleClick(heading.id)}
                      className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg transition-all text-sm font-bold ${
                        activeId === heading.id
                          ? 'bg-toon-yellow text-gray-900 shadow-toon'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      style={{ paddingLeft: `${(heading.level - minLevel) * 1 + 0.75}rem` }}
                    >
                      <span className="flex-1 line-clamp-2">{heading.text}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* 桌面端左侧边栏 */}
      <aside
        className={`hidden lg:block fixed rounded-xl top-32 bottom-8 transition-all duration-300 ease-in-out ${
          isSidebarHidden ? '-left-64' : 'left-0'
        }`}
        style={{ width: '256px' }}
      >
        <nav className="bg-white border-3 border-black rounded-xl shadow-toon flex flex-col h-full">
          {/* 标题栏 */}
          <div className="p-4 border-b-2 border-black flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 flex-1">
              {/* 折叠/展开按钮 - 替代 List 图标位置 */}
              <button
                onClick={toggleSidebar}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="收起目录"
              >
                <ChevronLeft size={18} />
              </button>

              <h4 className="font-black text-base flex items-center gap-2">
                目录
                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border-2 border-black">
                  {headings.length}
                </span>
              </h4>
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
              title={isCollapsed ? '展开全部' : '收起'}
            >
              {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>

          {/* 目录内容 */}
          {!isCollapsed && (
            <div className="overflow-y-auto overflow-x-hidden flex-1 p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              <div className="space-y-0.5 pb-2">
                {headings.map((heading, index) => {
                  if (!shouldShowHeading(heading, index)) return null;

                  const isActive = activeId === heading.id;
                  const canHaveChildren = hasChildren(heading, index);
                  const isLevelCollapsed = collapsedLevels.has(heading.level);

                  return (
                    <div key={index} className="group">
                      <div className="flex items-center gap-1">
                        {/* 折叠按钮 */}
                        {canHaveChildren && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLevel(heading.level);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                            style={{ marginLeft: `${(heading.level - minLevel) * 0.75}rem` }}
                          >
                            {isLevelCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                          </button>
                        )}

                        {/* 标题按钮 */}
                        <button
                          onClick={() => handleClick(heading.id)}
                          className={`flex-1 text-left py-1.5 px-2 rounded-md transition-all text-xs font-bold leading-tight min-w-0 ${
                            isActive
                              ? 'bg-toon-yellow text-gray-900 shadow-toon-sm scale-105'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                          style={{
                            paddingLeft: canHaveChildren
                              ? '0.5rem'
                              : `${(heading.level - minLevel) * 0.75 + 0.5}rem`,
                          }}
                          title={heading.text}
                        >
                          <span className="line-clamp-2 break-words">{heading.text}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 底部工具栏 */}
          {!isCollapsed && headings.length > 5 && (
            <div className="p-2 border-t-2 border-black rounded-b-xl bg-gray-50 flex-shrink-0">
              <button
                onClick={() => {
                  if (collapsedLevels.size > 0) {
                    setCollapsedLevels(new Set());
                  } else {
                    const levels = new Set(headings.map((h) => h.level));
                    setCollapsedLevels(levels);
                  }
                }}
                className="w-full px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded transition-colors flex items-center justify-center gap-1"
              >
                <Minus size={12} />
                {collapsedLevels.size > 0 ? '展开全部' : '折叠全部'}
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* 展开按钮 - 当侧边栏隐藏时显示在屏幕左侧边缘 */}
      {isSidebarHidden && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex fixed left-0 top-32 z-50 items-center justify-center w-10 h-16 bg-white border-2 border-l-0 border-black rounded-r-xl shadow-toon hover:shadow-toon-lg hover:w-12 transition-all duration-300"
          title="展开目录"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* 添加自定义滚动条样式 */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
};
