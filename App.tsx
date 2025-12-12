import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { BlogPost } from './pages/BlogPost';
import { CreatePost } from './pages/CreatePost';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BlogProvider>
            <HashRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:id" element={<BlogPost />} />
                  <Route path="/create" element={<CreatePost />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </HashRouter>
          </BlogProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
