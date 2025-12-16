import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BlogPost } from '@/pages/BlogPost';
import { CreatePost } from '@/pages/CreatePost';
import { Dashboard } from '@/pages/Dashboard';
import { Home } from '@/pages/Home';
import { Settings } from '@/pages/Settings';
import { setNavigateFunction } from '@/utils/request/http';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔧 在 Router 内部设置导航函数
    setNavigateFunction(() => {
      navigate('/', { replace: true });
    });
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<BlogPost />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
