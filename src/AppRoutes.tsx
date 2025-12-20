import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Layout } from '@/layout/Layout.tsx';
import { BlogPost } from '@/pages/BlogPost';
import { CreatePost } from '@/pages/CreatePost';
import { Dashboard } from '@/pages/Dashboard';
import { EditPost } from '@/pages/EditPost';
import { Home } from '@/pages/Home';
import { Settings } from '@/pages/Settings';
import { setNavigateFunction } from '@/utils/request/http';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditPost />
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
