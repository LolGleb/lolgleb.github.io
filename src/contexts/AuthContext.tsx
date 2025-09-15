import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, updateUserAvatar as dbUpdateUserAvatar, updateUserBio as dbUpdateUserBio, updateUserName as dbUpdateUserName, getUserById } from '../db/authDb';

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
  hydrated: boolean;
  isOwnProfile: (authorId: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  rateBrand: (brandId: string, category: string, rating: number) => void;
  getUserBrandRating: (brandId: string) => BrandRating | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mock current user - в реальном приложении это будет из API/локального storage  
  // Change to null to test non-authenticated state: useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

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
      avatar: dbUser.avatar || '',
      bio: dbUser.bio || '',
      socialLinks: {},
      isVerified: false
    };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    try { console.debug('[DEBUG_LOG][Auth] login success', { id: user.id, email: user.email }); } catch {}
  };

  const register = async (name: string, email: string, password: string) => {
    // Real registration against client-side DB
    const dbUser = await registerUser(name, email, password);
    const user: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar || '',
      bio: dbUser.bio || '',
      socialLinks: {},
      isVerified: false
    };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    try { console.debug('[DEBUG_LOG][Auth] register success', { id: user.id, email: user.email }); } catch {}
  };

  const logout = () => {
    try { console.debug('[DEBUG_LOG][Auth] logout'); } catch {}
    setCurrentUser(null);
    setUserRatings([]);
    localStorage.removeItem('user');
    localStorage.removeItem('userRatings');
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!currentUser) return;
    const updatedDbUser = await dbUpdateUserAvatar(currentUser.id, avatarUrl);
    const newUser: User = {
      ...currentUser,
      avatar: updatedDbUser.avatar || ''
    };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    try { console.debug('[DEBUG_LOG][Auth] avatar updated', { id: newUser.id, hasAvatar: Boolean(newUser.avatar) }); } catch {}
  };

  const updateBio = async (bio: string) => {
    if (!currentUser) return;
    const trimmed = (bio || '').trim();
    const limited = trimmed.slice(0, 280);
    const updatedDbUser = await dbUpdateUserBio(currentUser.id, limited);
    const newUser: User = {
      ...currentUser,
      bio: updatedDbUser.bio || ''
    };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    try { console.debug('[DEBUG_LOG][Auth] bio updated', { id: newUser.id, length: (newUser.bio || '').length }); } catch {}
  };

  const updateName = async (name: string) => {
    if (!currentUser) return;
    const safe = (name || '').trim();
    if (!safe) return;
    const updatedDbUser = await dbUpdateUserName(currentUser.id, safe);
    const newUser: User = {
      ...currentUser,
      name: updatedDbUser.name
    };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    try { console.debug('[DEBUG_LOG][Auth] name updated', { id: newUser.id, name: newUser.name }); } catch {}
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

    let parsedUser: any = null;
    if (savedUser) {
      try {
        parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        // Refresh user from DB to get the latest fields (e.g., name)
        getUserById(parsedUser.id)
          .then((dbUser) => {
            if (!dbUser) return;
            const freshUser: User = {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              avatar: dbUser.avatar || '',
              bio: dbUser.bio || '',
              socialLinks: {},
              isVerified: false
            };
            setCurrentUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
            try { console.debug('[DEBUG_LOG][Auth] refreshed user from DB', { id: freshUser.id, name: freshUser.name }); } catch {}
          })
          .catch((err) => {
            try { console.warn('[DEBUG_LOG][Auth] failed to refresh user from DB', err); } catch {}
          });
        try { console.debug('[DEBUG_LOG][Auth] hydrated from localStorage', { userId: parsedUser?.id, hasAvatar: Boolean(parsedUser?.avatar), hasBio: Boolean(parsedUser?.bio) }); } catch {}
      } catch (e) {
        console.error('[DEBUG_LOG][Auth] Failed to parse saved user:', e);
      }
    } else {
      try { console.debug('[DEBUG_LOG][Auth] no saved user in localStorage'); } catch {}
    }

    if (savedRatings) {
      try {
        const parsedRatings = JSON.parse(savedRatings);
        setUserRatings(parsedRatings);
        try { console.debug('[DEBUG_LOG][Auth] hydrated ratings', { count: Array.isArray(parsedRatings) ? parsedRatings.length : 0 }); } catch {}
      } catch (e) {
        console.error('[DEBUG_LOG][Auth] Failed to parse saved ratings:', e);
      }
    }
    setHydrated(true);
    try { console.debug('[DEBUG_LOG][Auth] hydrated=true'); } catch {}
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
    hydrated,
    isOwnProfile,
    login,
    register,
    logout,
    updateAvatar,
    updateBio,
    updateName,
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