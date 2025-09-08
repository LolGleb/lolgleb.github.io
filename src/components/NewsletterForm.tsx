import { useState } from 'react';
import { useNewsletter } from '../contexts/NewsletterContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'inline' | 'footer';
}

export function NewsletterForm({ 
  placeholder = "Email Address", 
  buttonText = "Sock it to me",
  className = "",
  variant = "default"
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe, isSubscribed } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await subscribe(email);
      setEmail('');
    } catch (error) {
      // Error is already shown via toast in context
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadySubscribed = email && isSubscribed(email);

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-3 max-w-md lg:flex-row ${className}`}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-border bg-background rounded focus:outline-none focus:ring-2 focus:ring-[#FF00A8] text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !email.trim() || isAlreadySubscribed}
          className="lg:flex-1 px-6 py-2.5 rounded hover:opacity-90 transition-opacity text-sm"
          style={{ backgroundColor: '#FF00A8', color: 'white', fontFamily: 'var(--font-body)', fontWeight: '600' }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAlreadySubscribed ? (
            'Already subscribed'
          ) : (
            buttonText
          )}
        </Button>
      </form>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !email.trim() || isAlreadySubscribed}
          style={{ backgroundColor: '#FF00A8' }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAlreadySubscribed ? (
            'Subscribed'
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || !email.trim() || isAlreadySubscribed}
        className="w-full"
        style={{ backgroundColor: '#FF00A8' }}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        {isAlreadySubscribed ? 'Already subscribed' : buttonText}
      </Button>
    </form>
  );
}