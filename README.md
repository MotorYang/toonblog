# 🎨 ToonBlog - 卡通博客

<div align="center">

**一个充满活力、AI 驱动的卡通/极简风格个人博客平台**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

[在线演示](http://43.228.79.121/) | [功能特性](#-核心功能) | [快速开始](#-快速开始) | [技术文档](#-技术架构)

</div>

---

## 📖 项目概述

**ToonBlog** 是一个基于 **React 18** 和 **TypeScript** 构建的现代化单页应用(SPA)个人博客系统。项目摒弃了传统的极简主义设计风格,转而采用高对比度的 **新野兽派 (Neo-Brutalist)** 美学,具有粗边框、硬阴影和鲜艳的色彩,为用户带来独特的视觉体验。

除了独特的视觉风格外,ToonBlog 深度集成了 **Google Gemini AI**,通过 AI 辅助写作、智能摘要生成和对话助手等功能,彻底改变了博客的内容创作与阅读体验。

### ✨ 项目亮点

- 🎨 **两套主题系统** - 卡通、中国风三种视觉风格随心切换
- 🤖 **AI 深度集成** - Google Gemini 驱动的智能写作和对话助手
- 🌍 **国际化支持** - 原生支持中英文双语切换
- 📱 **响应式设计** - 完美适配桌面端、平板和移动设备
- 🎵 **全局工具箱** - Lo-Fi 音乐播放器与 AI 聊天助手常驻
- 📊 **数据可视化** - 管理员看板提供文章统计和趋势分析

---

## ✨ 核心功能

### 1. 🎨 动态视觉引擎

**两套完整主题系统**,支持一键切换:

- **🌈 卡通主题 (默认)**
  - 明亮的色彩搭配
  - 圆角设计元素
  - 活泼的字体风格
  - Q 弹的交互动画


- **🏮 中国风主题 (古风)**
  - 宣纸纹理背景
  - 水墨配色方案
  - 优雅衬线字体
  - 儒雅古典风格

**技术实现**:
- 基于 CSS 变量的主题切换系统
- Tailwind CSS 自定义配置
- 流畅的主题过渡动画
- 响应式设计适配

### 2. 🧠 AI 智能助手 (Google Gemini)

**魔法写作功能**:
- 输入文章标题,AI 自动生成完整的 Markdown 内容
- 幽默风趣的写作风格
- 格式完美的文章结构
- 支持一键覆盖或手动调整

**TL;DR 智能摘要**:
- 自动分析长文章内容
- 生成精准的一句话摘要
- 帮助读者快速了解文章核心

**全局 AI 对话助手**:
- 工具箱内置智能聊天功能
- 跨页面保持对话上下文
- 随时解答用户疑问
- 提供写作建议和灵感

### 3. 🛠️ 交互式工具箱

**右下角悬浮工具栏**,包含两大核心功能:

**音乐播放器**:
- 精选音乐列表
- 旋转黑胶唱片动画
- 播放/暂停/切换控制
- 支持自定义音乐配置

**AI 聊天助手**:
- 实时对话功能
- 智能上下文理解
- 页面跳转不丢失对话
- 美观的聊天界面

### 4. 📝 内容管理系统

**Markdown 编辑器**:
- 完整的 Markdown 语法支持
- 实时预览功能
- AI 辅助写作集成
- 代码高亮显示

**文章功能**:
- 封面图片上传
- 标签系统管理
- 分类筛选功能
- 浏览量统计
- 文章搜索功能

**管理功能**:
- 文章发布/编辑/删除
- 分类管理配置
- 音乐播放器配置
- API 密钥管理

### 5. 📊 数据看板

**可视化统计**:
- 总文章数和总浏览量
- 分类分布条形图
- 月度增长时间轴
- 热门文章排行榜

**数据展示**:
- Top 10 浏览量文章
- 分类文章统计
- 趋势图表分析
- 实时数据更新

---

## 🏗️ 技术架构

ToonBlog 采用 **面向服务(Service-Oriented)** 的前端架构设计,在客户端模拟全栈环境。

### 技术栈

**核心框架**:
- **React 18** - 现代化 UI 框架
- **TypeScript** - 类型安全的开发体验
- **Vite 6.0** - 极速的开发构建工具

**状态管理**:
- **React Context API** - 轻量级全局状态管理
- **自定义 Hooks** - 业务逻辑封装

**样式方案**:
- **Tailwind CSS 3.4** - 原子化 CSS 框架
- **CSS Variables** - 主题系统实现
- **Tailwind Typography** - Markdown 排版优化

**AI 集成**:
- 智能写作、摘要生成、对话助手

**路由与图标**:
- **React Router DOM v6+** - 现代化路由管理
- **Lucide React** - 精美的 SVG 图标库

**其他工具**:
- **Axios** - HTTP 请求库
- **React Markdown** - Markdown 渲染
- **Remark/Rehype** - Markdown 插件生态

### 项目结构

```
toon-blog/
├── public/                    # 静态资源
│   ├── images/               # 图片资源
│   └── music/                # 音乐文件
│
├── src/
│   ├── api/                  # API 接口层
│   │   ├── blog.ts          # 博客相关 API
│   │   ├── auth.ts          # 认证相关 API
│   │   └── settings.ts      # 设置相关 API
│   │
│   ├── components/           # 可复用 UI 组件
│   │   ├── Layout.tsx       # 主布局组件
│   │   ├── ToonCard.tsx     # 卡片容器组件
│   │   ├── GlobalToolbox.tsx # 全局工具箱
│   │   ├── ThemeSelector.tsx # 主题切换器
│   │   ├── LanguageSelector.tsx # 语言切换器
│   │   ├── Skeleton.tsx     # 骨架屏组件
│   │   └── Tableofcontents.tsx # 目录组件
│   │
│   ├── context/              # 全局状态管理
│   │   ├── AuthContext.tsx  # 用户认证状态
│   │   ├── BlogContext.tsx  # 博客数据状态
│   │   ├── ThemeContext.tsx # 主题切换状态
│   │   └── LanguageContext.tsx # 语言切换状态
│   │
│   ├── locales/              # 国际化
│   │   └── translations.ts  # 中英文翻译字典
│   │
│   ├── pages/                # 页面组件
│   │   ├── Home.tsx         # 首页(文章列表)
│   │   ├── BlogPost.tsx     # 文章详情页
│   │   ├── CreatePost.tsx   # 创作页面
│   │   ├── Dashboard.tsx    # 数据看板
│   │   ├── Settings.tsx     # 设置页面
│   │   └── Login.tsx        # 登录页面
│   │
│   ├── services/             # 业务逻辑层
│   │   └── geminiService.ts # Gemini AI 服务
│   │
│   ├── types/                # TypeScript 类型定义
│   │   ├── blog.ts          # 博客相关类型
│   │   ├── auth.ts          # 认证相关类型
│   │   └── settings.ts      # 设置相关类型
│   │
│   ├── utils/                # 工具函数
│   │   ├── request/         # HTTP 请求封装
│   │   └── constants.ts     # 常量定义
│   │
│   ├── App.tsx               # 根组件(路由配置)
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
│
├── .env                       # 环境变量配置
├── .env.example               # 环境变量示例
├── index.html                 # HTML 模板
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
├── tailwind.config.js         # Tailwind 配置
└── README.md                  # 项目文档
```

### 数据流向

```
用户交互
   ↓
UI 组件 (React Components)
   ↓
Context Providers (状态管理)
   ↓
Service 层 (API/业务逻辑)
   ↓
模拟后端 / 真实 API
   ↓
数据返回
   ↓
状态更新
   ↓
UI 重新渲染
```

**关键设计**:
- **分层架构**: UI 层、状态层、服务层、数据层清晰分离
- **模拟后端**: 使用 `setTimeout` 模拟网络延迟,便于后期替换真实 API
- **类型安全**: 全面的 TypeScript 类型定义
- **可扩展性**: 模块化设计,易于功能扩展

---

## 🚀 快速开始

### 环境要求

- **Node.js**: v16.0 或更高版本
- **npm** 或 **yarn** 或 **pnpm**
- **Google Gemini API Key**: 在 [Google AI Studio](https://aistudio.google.com/) 免费获取

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/toon-blog.git
cd toon-blog
```

#### 2. 安装依赖

使用 npm:
```bash
npm install
```

或使用 yarn:
```bash
yarn install
```

或使用 pnpm:
```bash
pnpm install
```

#### 3. 启动开发服务器

```bash
npm run dev
```

或:
```bash
yarn dev
```

或:
```bash
pnpm dev
```

服务器启动后,访问 `http://localhost:5174` 即可查看应用。

#### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录,可直接部署到静态托管服务。

---

## 📚 使用指南

### 基础功能

#### 浏览文章
1. 访问首页查看所有文章
2. 使用搜索框搜索关键词
3. 点击分类标签筛选文章
4. 切换卡片/列表视图模式
5. 点击文章卡片阅读详情

#### 切换主题
1. 点击右上角调色盘图标
2. 选择卡通/赛博朋克/中国风主题
3. 主题设置会自动保存到本地

#### 切换语言
1. 点击右上角语言图标
2. 选择中文/English
3. 整个应用界面会立即切换语言

### 内容创作

#### 发布文章
1. 登录管理员账号
2. 点击导航栏"创作"
3. 填写文章信息:
  - 上传封面图(可选)
  - 输入标题
  - 选择分类
  - 编写内容(支持 Markdown)
  - 添加标签
  - 填写摘要
4. 点击"立即发布"

#### 使用 AI 辅助写作
1. 在创作页面输入文章标题
2. 点击"魔法写作"按钮
3. AI 将自动生成文章内容
4. 可选择覆盖或手动调整
5. 编辑完成后发布

#### 生成文章摘要
1. 在文章详情页
2. 点击"生成摘要"按钮
3. AI 会分析文章并生成 TL;DR
4. 摘要会显示在文章顶部

### 管理功能

#### 查看数据看板
1. 登录管理员账号
2. 点击导航栏"看板"
3. 查看文章统计、分类分布、增长趋势
4. 查看热门文章排行榜

#### 系统设置
1. 登录管理员账号
2. 点击导航栏"设置"
3. 配置 Gemini API Key
4. 管理文章分类
5. 配置音乐播放器
6. 保存设置

#### 删除文章
1. 在文章详情页
2. 滚动到底部"管理员操作区"
3. 点击"删除文章"
4. 确认删除操作

### 工具箱功能

#### 使用音乐播放器
1. 点击右下角工具箱中的"音乐"标签
2. 点击播放按钮开始播放
3. 使用控制按钮切换歌曲
4. 享受音乐陪伴阅读

#### 使用 AI 聊天
1. 点击右下角工具箱中的"对话"标签
2. 在输入框中输入问题
3. AI 会实时回复
4. 对话记录会保留在当前会话中

---

## 🌍 国际化 (i18n)

ToonBlog 原生支持**中文**和**英文**双语:

- 所有界面文本存储在 `src/locales/translations.ts`
- 通过 `LanguageContext` 提供的 `t()` 函数实现动态翻译
- 语言切换会立即生效,无需刷新页面
- 用户选择的语言会保存到本地存储

### 添加新语言

1. 在 `src/locales/translations.ts` 中添加新语言的翻译:

```typescript
export const translations = {
  en: { /* English translations */ },
  zh: { /* Chinese translations */ },
  ja: { /* Japanese translations - 新增 */ }
};
```

2. 在 `src/types/language.ts` 中更新语言类型:

```typescript
export type Language = 'en' | 'zh' | 'ja';
```

3. 在 `LanguageSelector.tsx` 中添加新语言选项

---

## 🎨 主题定制

### 修改现有主题

主题通过 `index.html` 中的 CSS 变量定义。修改步骤:

1. 打开 `index.html`
2. 找到对应主题的 CSS 类(如 `.theme-toon`)
3. 修改 CSS 变量值:

```css
.theme-toon {
  /* 主色调 */
  --color-primary: #ff6b9d;      /* 粉色 */
  --color-secondary: #ffd93d;    /* 黄色 */
  --color-accent: #6bcf7f;       /* 绿色 */

  /* 字体 */
  --font-main: 'Comic Sans MS', cursive;

  /* 其他变量... */
}
```

### 添加新主题

1. 在 `index.html` 中定义新主题类:

```css
.theme-minimal {
  --color-primary: #2c3e50;
  --color-secondary: #95a5a6;
  --bg-primary: #ffffff;
  --font-main: 'Helvetica Neue', sans-serif;
  /* ... 其他变量 */
}
```

2. 在 `src/types/theme.ts` 中更新主题类型:

```typescript
export type Theme = 'toon' | 'cyber' | 'chinese' | 'minimal';
```

3. 在 `ThemeSelector.tsx` 中添加主题切换选项:

```tsx
<button onClick={() => setTheme('minimal')}>
  极简主题
</button>
```

---

## 🔧 配置说明

### Vite 配置

`vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

### Tailwind 配置

`tailwind.config.js`:
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'toon-pink': '#ff6b9d',
        'toon-yellow': '#ffd93d',
        // ... 自定义颜色
      },
      boxShadow: {
        'toon': '4px 4px 0 0 #000',
        'toon-lg': '8px 8px 0 0 #000',
        // ... 自定义阴影
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
```

### TypeScript 配置

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🚀 部署指南

### Vercel 部署

1. 在 Vercel 导入 GitHub 仓库
2. 配置环境变量 `VITE_GEMINI_API_KEY`
3. 点击部署,Vercel 会自动构建和发布

### Netlify 部署

1. 连接 GitHub 仓库到 Netlify
2. 构建命令: `npm run build`
3. 发布目录: `dist`
4. 添加环境变量 `VITE_GEMINI_API_KEY`
5. 部署网站

### 自托管部署

```bash
# 构建生产版本
npm run build

# 将 dist 目录内容上传到服务器
scp -r dist/* user@server:/var/www/html/

# 或使用 Docker
docker build -t toon-blog .
docker run -p 80:80 toon-blog
```

### GitHub Pages 部署

1. 修改 `vite.config.ts` 添加 base 路径:
```typescript
export default defineConfig({
  base: '/toon-blog/',
  // ...
});
```

2. 构建并部署:
```bash
npm run build
npm run deploy  # 需要配置 gh-pages
```

---

## 🔌 API 集成

### 后端 API 替换

当前项目使用模拟数据,要接入真实后端:

1. 修改 `src/utils/request/http.ts`:

```typescript
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com',
  timeout: 10000
});
```

2. 移除 `setTimeout` 模拟延迟

3. 更新 API 接口路径


---

## 📝 开发规范

### 代码风格

- 使用 **TypeScript** 严格模式
- 遵循 **ESLint** 规则
- 使用 **Prettier** 格式化代码
- 组件使用 **函数式组件** + **Hooks**
- 使用 **命名导出** 而非默认导出

### 组件规范

```typescript
// ✅ 推荐
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // 组件逻辑
  return <div>...</div>;
};

// ❌ 避免
export default function Component(props) {
  // ...
}
```

### 样式规范

- 优先使用 **Tailwind** 工具类
- 复杂样式使用 **CSS Modules** 或 **styled-components**
- 主题相关使用 **CSS 变量**
- 避免内联样式

### Git 提交规范

```bash
# 功能开发
git commit -m "feat: 添加文章搜索功能"

# Bug 修复
git commit -m "fix: 修复主题切换闪烁问题"

# 文档更新
git commit -m "docs: 更新 README 安装步骤"

# 样式调整
git commit -m "style: 优化移动端布局"

# 重构代码
git commit -m "refactor: 重构状态管理逻辑"
```

---

## 🤝 贡献指南

欢迎贡献代码、报告 Bug 或提出新功能建议!

### 贡献流程

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/toon-blog.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **提交更改**
   ```bash
   git commit -m "feat: 添加惊艳的新功能"
   ```

4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **提交 Pull Request**

### 报告 Bug

在 [Issues](https://github.com/your-username/toon-blog/issues) 页面提交 Bug 报告,请包含:

- Bug 描述
- 复现步骤
- 预期行为
- 实际行为
- 截图(如果适用)
- 环境信息(浏览器、操作系统等)

### 功能建议

在 [Issues](https://github.com/your-username/toon-blog/issues) 页面提交功能建议,请包含:

- 功能描述
- 使用场景
- 期望效果
- 参考示例(如果有)

---

## 📄 开源协议

本项目采用 **MIT License** 开源协议。

```
MIT License

Copyright (c) 2025 ToonBlog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 致谢

### 技术栈
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Google Gemini](https://ai.google.dev/) - AI 能力

### 设计灵感
- Neo-Brutalism 设计风格
- Y2K 复古美学
- Cyberpunk 视觉元素

### 图标与字体
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体资源

---

## 📞 联系方式

- **项目主页**: [https://github.com/motoryang/toon-blog](https://github.com/motoryang/toon-blog)
- **Issues**: [https://github.com/motoryang/toon-blog/issues](https://github.com/motoryang/toon-blog/issues)
- **Email**: motoyangxy@outlook.com

---

## 🗺️ 路线图

### v1.0 (当前版本)
- ✅ 三套主题系统
- ✅ AI 辅助写作
- ✅ 国际化支持
- ✅ 响应式设计
- ✅ 基础管理功能

### v1.1 (计划中)
- ⏳ 用户评论系统
- ⏳ 文章分享功能
- ⏳ RSS 订阅
- ⏳ 搜索优化

### v2.0 (未来)
- 📋 多用户系统
- 📋 真实后端集成
- 📋 更多 AI 功能
- 📋 移动端 App

---

## ⭐ Star History

如果这个项目对您有帮助,请考虑给它一个 Star ⭐️

[![Star History Chart](https://api.star-history.com/svg?repos=motoryang/toon-blog&type=Date)](https://star-history.com/#motoryang/toon-blog&Date)

---

<div align="center">

**Built with ❤️ using React & Vite**

[返回顶部](#-toonblog---卡通博客)

</div>
