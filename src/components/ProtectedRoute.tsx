import React, { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';

import { Tip } from '@/components/GlobalTip';
import { useLanguage } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { t } = useLanguage();
  const { isLoggedIn, isAdmin } = userAuthStore();
  const hasShownTip = useRef(false);

  const loggedIn = isLoggedIn();
  const hasAdminAccess = isAdmin;

  useEffect(() => {
    if (!loggedIn && !hasShownTip.current) {
      Tip.error(t('auth.permission.adminOnly'));
      hasShownTip.current = true;
    }
  }, [loggedIn, t]);

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !hasAdminAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
