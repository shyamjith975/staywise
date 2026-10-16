'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppStateProvider, useAppState } from '../../context/AppStateContext';
import LoginView from '../../components/auth/LoginView';

function LoginContent() {
  const { isAuthenticated } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('staywise_is_authenticated', 'true');
          localStorage.setItem('staywise_active_view', 'dashboard');
        } catch (e) {}
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.location.href = '/?view=dashboard';
            window.close();
            return;
          } catch (e) {}
        }
        window.location.href = '/?view=dashboard';
      }
    }
  }, [isAuthenticated]);

  return (
    <LoginView
      onBackToLanding={() => {
        if (window.opener) {
          window.close();
        } else {
          window.location.href = '/';
        }
      }}
    />
  );
}

export default function LoginPage() {
  return (
    <AppStateProvider>
      <LoginContent />
    </AppStateProvider>
  );
}
