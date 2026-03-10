import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as loginService, logout as logoutService, isAuthenticated, getStoredUser } from '../services/auth';
import { LoginRequest, User } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => loginService(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      setLoggedIn(true);
    },
  });

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
    setLoggedIn(false);
  }, []);

  return {
    user,
    isAuthenticated: loggedIn,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error?.message || null,
    loginLoading: loginMutation.isPending,
    logout,
  };
}
