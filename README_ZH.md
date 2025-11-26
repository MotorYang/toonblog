# 🎨 ToonBlog (卡通博客)

<div align="center">

**一个充满活力、由 AI 驱动的新野兽派风格个人博客。**

[English Documentation](./README.md)

</div>

---

## 📖 项目概述

**ToonBlog** 是一个基于 **React 18** 和 **TypeScript** 构建的现代单页应用 (SPA)。它摒弃了传统的极简主义设计，转而采用高对比度的 **新野兽派 (Neo-Brutalist)** 美学，具有粗边框、硬阴影和鲜艳的色彩。

除了独特的视觉风格，ToonBlog 还深度集成了 **Google Gemini AI**，通过 AI 辅助写作、自动摘要生成和对话助手，彻底改变了博客的内容创作与阅读体验。

## ✨ 核心功能

### 1. 🎨 动态视觉引擎
*   **三套主题系统**：支持一键切换三种截然不同的视觉风格：
    *   **卡通 (默认)**：明亮的色彩，圆角设计，活泼的字体。
    *   **赛博朋克**：深色模式，霓虹光效，故障风，科技感字体。
    *   **中国风 (古风)**：宣纸纹理，水墨配色，衬线字体，儒雅风格。
*   **CSS 变量架构**：基于语义化的 CSS 变量系统，配合 Tailwind 配置实现平滑切换。
*   **微交互**：Q弹的页面进入动画 (Pop-in)、按压式按钮反馈和悬停效果。

### 2. 🧠 AI 驱动 (Google Gemini)
*   **魔法写作 (Magic Write)**：在编辑器中输入标题，AI 将自动生成幽默风趣、格式完美的 Markdown 草稿。
*   **TL;DR 智能摘要**：自动读取长文章，生成一句话精华总结。
*   **全局 AI 对话**：集成在工具箱中的智能助手，随时解答问题。

### 3. 🛠️ 交互式工具
*   **全局工具箱**：右下角常驻的悬浮胶囊，包含：
    *   **Lo-Fi 音乐播放器**：带有旋转黑胶动画和播放控制。
    *   **AI 聊天室**：在页面跳转时保持对话状态不丢失。
*   **Markdown 支持**：全功能 Markdown 渲染，并针对不同主题优化了排版样式。

### 4. 📊 管理员看板
*   **数据可视化**：展示分类分布条形图和月度增长时间轴。
*   **排行榜**：浏览量最高的 Top 10 文章。
*   **CRUD 操作**：发布、查看、删除文章（包含模拟鉴权）。

---

## 🏗️ 技术架构

ToonBlog 在客户端采用了 **面向服务 (Service-Oriented)** 的架构来模拟全栈环境。

### 技术栈
*   **核心框架**: React 18, TypeScript, Vite
*   **状态管理**: React Context API (替代 Redux/Pinia)
*   **样式方案**: Tailwind CSS (自定义配置 + Typography 插件)
*   **AI SDK**: `@google/genai` (Google Gemini API)
*   **路由**: React Router DOM v6+
*   **图标库**: Lucide React

### 数据流向
1.  **UI 组件** 触发用户操作。
2.  **Context Providers** (BlogContext, AuthContext) 处理状态逻辑。
3.  **Service 层** (`api.ts`, `geminiService.ts`) 处理数据请求。
    *   *注意*: `api.ts` 目前使用 `setTimeout` 模拟数据库和网络延迟，未来可以轻松替换为真实的后端 API 调用。

### 目录结构

```text
src/
├── components/          # 可复用 UI 组件
│   ├── Layout.tsx       # 主布局 (导航栏, 页脚)
│   ├── ToonCard.tsx     # 核心卡片组件 (风格化的容器)
│   ├── GlobalToolbox.tsx# 悬浮音乐/聊天挂件
│   └── ...
├── context/             # 全局状态管理
│   ├── AuthContext.tsx  # 用户会话与权限
│   ├── BlogContext.tsx  # 文章增删改查与统计
│   ├── ThemeContext.tsx # 主题切换逻辑
│   └── LanguageContext.tsx # 国际化逻辑
├── locales/             # 翻译字典 (en/zh)
├── pages/               # 页面视图
│   ├── Home.tsx         # 首页 (搜索, 筛选, 分页)
│   ├── Dashboard.tsx    # 管理员数据看板
│   ├── CreatePost.tsx   # Markdown 编辑器 + AI
│   └── BlogPost.tsx     # 文章详情页
├── services/            # 业务逻辑层
│   ├── api.ts           # 模拟后端服务
│   └── geminiService.ts # Google AI 集成
├── types.ts             # TypeScript 类型定义
├── constants.ts         # 模拟数据
├── App.tsx              # 路由配置
└── main.tsx             # 入口文件
```

---

## 🚀 快速开始

### 前置要求
*   Node.js (v16 或更高版本)
*   Google Gemini API Key (可以在 [Google AI Studio](https://aistudiocdn.com/google-ai-studio) 免费获取)

### 安装步骤

1.  **克隆仓库**
    ```bash
    git clone <repository-url>
    cd toon-blog
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **环境配置**
    在根目录创建一个 `.env` 文件，并填入你的 API Key：
    ```env
    API_KEY=your_actual_api_key_here
    ```

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

### 🔑 默认账号

要访问管理员功能（如发布文章、查看看板），请使用以下账号登录：
*   **用户名**: `admin`
*   **密码**: `123456`

---

## 🌍 国际化 (i18n)

应用原生支持 **English** 和 **简体中文**。
*   所有翻译文本存储在 `src/locales/translations.ts` 中。
*   通过 `LanguageContext` 提供的 `t()` 函数实现动态文本替换。

## 🎨 自定义主题

主题通过 `index.html` 中的 CSS 变量定义。如需添加新主题：
1.  在 `index.html` 中定义一个新的 `.theme-name` 类，并设置相应的颜色/字体变量。
2.  在 `types.ts` 中更新 `Theme` 类型。
3.  在 `components/ThemeSelector.tsx` 中添加新主题的切换逻辑。

---

<div align="center">
  Built with ❤️ using React & Vite
</div>
