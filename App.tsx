import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BlogPost } from './pages/BlogPost';
import { CreatePost } from './pages/CreatePost';
import { Dashboard } from './pages/Dashboard';

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