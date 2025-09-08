import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface NewsletterContextType {
  isSubscribed: (email: string) => boolean;
  subscribe: (email: string) => Promise<void>;
  unsubscribe: (email: string) => Promise<void>;
  subscribers: string[];
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const [subscribers, setSubscribers] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('newsletter_subscribers');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const saveSubscribers = (newSubscribers: string[]) => {
    setSubscribers(newSubscribers);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(newSubscribers));
  };

  const isSubscribed = (email: string) => {
    return subscribers.includes(email.toLowerCase());
  };

  const subscribe = async (email: string): Promise<void> => {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!normalizedEmail) {
      throw new Error('Email address is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    if (isSubscribed(normalizedEmail)) {
      throw new Error('This email is already subscribed to our newsletter');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newSubscribers = [...subscribers, normalizedEmail];
    saveSubscribers(newSubscribers);
    
    toast.success('🧦 Welcome to the sock revolution! Check your email for confirmation.');
  };

  const unsubscribe = async (email: string): Promise<void> => {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!isSubscribed(normalizedEmail)) {
      throw new Error('Email not found in our newsletter list');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newSubscribers = subscribers.filter(sub => sub !== normalizedEmail);
    saveSubscribers(newSubscribers);
    
    toast.success('Successfully unsubscribed. We\'ll miss you! 👋');
  };

  return (
    <NewsletterContext.Provider value={{ 
      isSubscribed, 
      subscribe, 
      unsubscribe, 
      subscribers 
    }}>
      {children}
    </NewsletterContext.Provider>
  );
}

export function useNewsletter() {
  const context = useContext(NewsletterContext);
  if (context === undefined) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
}