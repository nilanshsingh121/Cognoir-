import { useState, useCallback, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AUTH_STORAGE_KEY = 'cognoir_auth';
const USERS_STORAGE_KEY = 'cognoir_users';

// Simulated database - in production, use actual backend
function loadUsers(): Record<string, { email: string; username: string; password: string; id: string; createdAt: Date }> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    // Restore Date objects
    return Object.entries(data).reduce((acc, [key, val]: any) => {
      acc[key] = { ...val, createdAt: new Date(val.createdAt) };
      return acc;
    }, {} as any);
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, any>) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

function loadAuthState(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    user.createdAt = new Date(user.createdAt);
    return user;
  } catch {
    return null;
  }
}

function saveAuthState(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
}

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const savedUser = loadAuthState();
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const register = useCallback(
    (email: string, username: string, password: string): boolean => {
      setError(null);

      // Validation
      if (!email || !username || !password) {
        setError('All fields are required');
        return false;
      }

      if (email.length < 5 || !email.includes('@')) {
        setError('Please enter a valid email');
        return false;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        return false;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }

      const users = loadUsers();

      // Check if email already exists
      const emailExists = Object.values(users).some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError('Email already registered');
        return false;
      }

      // Check if username already exists
      const usernameExists = Object.values(users).some((u) => u.username.toLowerCase() === username.toLowerCase());
      if (usernameExists) {
        setError('Username already taken');
        return false;
      }

      // Create new user
      const userId = `user_${Date.now()}`;
      const newUser: User = {
        id: userId,
        email,
        username,
        createdAt: new Date(),
      };

      users[userId] = { ...newUser, password };
      saveUsers(users);
      saveAuthState(newUser);
      setUser(newUser);

      return true;
    },
    []
  );

  const login = useCallback(
    (email: string, password: string): boolean => {
      setError(null);

      if (!email || !password) {
        setError('Email and password are required');
        return false;
      }

      const users = loadUsers();

      // Find user by email
      const userEntry = Object.entries(users).find(([_, u]) => u.email.toLowerCase() === email.toLowerCase());

      if (!userEntry) {
        setError('Invalid email or password');
        return false;
      }

      const [_, userData] = userEntry;

      // Check password (basic validation - in production, use proper hashing)
      if (userData.password !== password) {
        setError('Invalid email or password');
        return false;
      }

      const loggedInUser: User = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        createdAt: userData.createdAt,
      };

      saveAuthState(loggedInUser);
      setUser(loggedInUser);

      return true;
    },
    []
  );

  const logout = useCallback(() => {
    saveAuthState(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    logout,
    clearError,
  };
}
