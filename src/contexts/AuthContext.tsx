import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../db/authDb';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  isVerified?: boolean;
}

interface BrandRating {
  brandId: string;
  ratings: {
    culturalImpact: number;
    collabPower: number;
    creativity: number;
    popularity: number;
    loyalty: number;
    drops: number;
  };
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isOwnProfile: (authorId: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  rateBrand: (brandId: string, category: string, rating: number) => void;
  getUserBrandRating: (brandId: string) => BrandRating | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mock current user - в реальном приложении это будет из API/локального storage  
  // Change to null to test non-authenticated state: useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [userRatings, setUserRatings] = useState<BrandRating[]>([]);

  const isAuthenticated = currentUser !== null;

  const isOwnProfile = (authorId: string) => {
    return currentUser?.id === authorId;
  };

  const login = async (email: string, password: string) => {
    // Real login against client-side DB
    const dbUser = await loginUser(email, password);
    const user: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Sock enthusiast and fashion lover.',
      socialLinks: {},
      isVerified: false
    };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (name: string, email: string, password: string) => {
    // Real registration against client-side DB
    const dbUser = await registerUser(name, email, password);
    const user: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'New sock enthusiast joining the community.',
      socialLinks: {},
      isVerified: false
    };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRatings([]);
    localStorage.removeItem('user');
    localStorage.removeItem('userRatings');
  };

  const rateBrand = (brandId: string, category: string, rating: number) => {
    if (!currentUser) return;

    setUserRatings(prev => {
      const existingRating = prev.find(r => r.brandId === brandId);
      
      if (existingRating) {
        return prev.map(r => 
          r.brandId === brandId 
            ? { ...r, ratings: { ...r.ratings, [category]: rating } }
            : r
        );
      } else {
        const newRating: BrandRating = {
          brandId,
          ratings: {
            culturalImpact: 0,
            collabPower: 0,
            creativity: 0,
            popularity: 0,
            loyalty: 0,
            drops: 0,
            [category]: rating
          }
        };
        return [...prev, newRating];
      }
    });
  };

  const getUserBrandRating = (brandId: string): BrandRating | null => {
    return userRatings.find(r => r.brandId === brandId) || null;
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRatings = localStorage.getItem('userRatings');
    
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    
    if (savedRatings) {
      try {
        setUserRatings(JSON.parse(savedRatings));
      } catch (e) {
        console.error('Failed to parse saved ratings:', e);
      }
    }
  }, []);

  // Save ratings to localStorage when they change
  useEffect(() => {
    if (userRatings.length > 0) {
      localStorage.setItem('userRatings', JSON.stringify(userRatings));
    }
  }, [userRatings]);

  const value = {
    currentUser,
    isAuthenticated,
    isOwnProfile,
    login,
    register,
    logout,
    rateBrand,
    getUserBrandRating
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}