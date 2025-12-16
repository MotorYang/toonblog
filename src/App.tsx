import React from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from '@/AppRoutes.tsx';
import { BlogProvider } from '@/context/BlogContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BlogProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </BlogProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
