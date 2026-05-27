import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { User, AuthContextType } from './auth.types';

const AUTH_STORAGE_KEY = 'cognoir_auth_user';
const USERS_STORAGE_KEY = 'cognoir_users';

interface StoredUser {
  id: string;
  email: string;
  password: string; // In production, use bcrypt or similar
  name: string;
  createdAt: string;
  lastLogin: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          lastLogin: new Date(parsed.lastLogin),
        });
      } catch {}
    }
    setLoading(false);
  }, []);

  // Get all users from storage
  const getAllUsers = useCallback((): StoredUser[] => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  // Save users to storage
  const saveUsers = useCallback((users: StoredUser[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}
  }, []);

  // Save current user to auth storage
  const saveCurrentUser = useCallback((userData: User) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch {}
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const users = getAllUsers();
        const foundUser = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!foundUser) {
          throw new Error('Invalid email or password');
        }

        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: new Date(foundUser.createdAt),
          lastLogin: new Date(),
        };

        // Update last login
        const updatedUsers = users.map((u) =>
          u.id === foundUser.id ? { ...u, lastLogin: new Date().toISOString() } : u
        );
        saveUsers(updatedUsers);
        saveCurrentUser(userData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAllUsers, saveUsers, saveCurrentUser]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setError(null);
      setLoading(true);

      try {
        // Validate inputs
        if (!email || !password || !name) {
          throw new Error('All fields are required');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please enter a valid email');
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const users = getAllUsers();
        if (users.some((u) => u.email === email)) {
          throw new Error('Email already registered');
        }

        const newUser: StoredUser = {
          id: uuidv4(),
          email,
          password, // In production: hash with bcrypt
          name,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        const userData: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: new Date(newUser.createdAt),
          lastLogin: new Date(newUser.lastLogin),
        };

        saveCurrentUser(userData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAllUsers, saveUsers, saveCurrentUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
