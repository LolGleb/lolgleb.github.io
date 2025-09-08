import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ArticleEngagement {
  likes: number;
  dislikes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
  views: number;
  readingTime?: number; // in minutes
}

interface UserBookmark {
  articleId: string;
  bookmarkedAt: string;
  title: string;
  category: string;
}

interface EngagementContextType {
  // Likes/Dislikes
  getEngagement: (articleId: string) => ArticleEngagement;
  likeArticle: (articleId: string) => void;
  dislikeArticle: (articleId: string) => void;
  
  // Bookmarks
  bookmarks: UserBookmark[];
  isBookmarked: (articleId: string) => boolean;
  toggleBookmark: (articleId: string, title: string, category: string) => void;
  
  // Views
  incrementViews: (articleId: string) => void;
  
  // Reading time
  setReadingTime: (articleId: string, minutes: number) => void;
}

const EngagementContext = createContext<EngagementContextType | undefined>(undefined);

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [engagementData, setEngagementData] = useState<Record<string, ArticleEngagement>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('article_engagement');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const [bookmarks, setBookmarks] = useState<UserBookmark[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_bookmarks');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const saveEngagement = (data: Record<string, ArticleEngagement>) => {
    setEngagementData(data);
    localStorage.setItem('article_engagement', JSON.stringify(data));
  };

  const saveBookmarks = (newBookmarks: UserBookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('user_bookmarks', JSON.stringify(newBookmarks));
  };

  const getEngagement = (articleId: string): ArticleEngagement => {
    return engagementData[articleId] || {
      likes: 0,
      dislikes: 0,
      views: 0
    };
  };

  const likeArticle = (articleId: string) => {
    const current = getEngagement(articleId);
    const newEngagement = {
      ...current,
      likes: current.userLiked ? current.likes - 1 : current.likes + 1,
      dislikes: current.userDisliked ? current.dislikes - 1 : current.dislikes,
      userLiked: !current.userLiked,
      userDisliked: false
    };

    const updatedData = {
      ...engagementData,
      [articleId]: newEngagement
    };
    
    saveEngagement(updatedData);
    
    if (newEngagement.userLiked) {
      toast.success('Thanks for the love! 💕');
    }
  };

  const dislikeArticle = (articleId: string) => {
    const current = getEngagement(articleId);
    const newEngagement = {
      ...current,
      dislikes: current.userDisliked ? current.dislikes - 1 : current.dislikes + 1,
      likes: current.userLiked ? current.likes - 1 : current.likes,
      userDisliked: !current.userDisliked,
      userLiked: false
    };

    const updatedData = {
      ...engagementData,
      [articleId]: newEngagement
    };
    
    saveEngagement(updatedData);
    
    if (newEngagement.userDisliked) {
      toast.info('Thanks for the feedback!');
    }
  };

  const isBookmarked = (articleId: string) => {
    return bookmarks.some(bookmark => bookmark.articleId === articleId);
  };

  const toggleBookmark = (articleId: string, title: string, category: string) => {
    if (isBookmarked(articleId)) {
      const newBookmarks = bookmarks.filter(b => b.articleId !== articleId);
      saveBookmarks(newBookmarks);
      toast.info('Removed from bookmarks');
    } else {
      const newBookmark: UserBookmark = {
        articleId,
        title,
        category,
        bookmarkedAt: new Date().toISOString()
      };
      const newBookmarks = [...bookmarks, newBookmark];
      saveBookmarks(newBookmarks);
      toast.success('Added to bookmarks! 📚');
    }
  };

  const incrementViews = (articleId: string) => {
    const current = getEngagement(articleId);
    const newEngagement = {
      ...current,
      views: current.views + 1
    };

    const updatedData = {
      ...engagementData,
      [articleId]: newEngagement
    };
    
    saveEngagement(updatedData);
  };

  const setReadingTime = (articleId: string, minutes: number) => {
    const current = getEngagement(articleId);
    const newEngagement = {
      ...current,
      readingTime: minutes
    };

    const updatedData = {
      ...engagementData,
      [articleId]: newEngagement
    };
    
    saveEngagement(updatedData);
  };

  return (
    <EngagementContext.Provider value={{
      getEngagement,
      likeArticle,
      dislikeArticle,
      bookmarks,
      isBookmarked,
      toggleBookmark,
      incrementViews,
      setReadingTime
    }}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (context === undefined) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return context;
}