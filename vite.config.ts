import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    server: {
      port: 5174,
      proxy: {
        '/system': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8888',
          changeOrigin: true,
        },
        '/cartoon': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8888',
          changeOrigin: true,
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    define: {
      // 如果需要兼容旧的 process.env 写法
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },

    // 构建优化
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  };
});
