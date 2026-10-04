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
      router.push('/');
    }
  }, [isAuthenticated, router]);

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
