import { Link2, Twitter, Facebook, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ShareBlockInlineProps {
  url?: string;
  title?: string;
}

export function ShareBlockInline({ url, title }: ShareBlockInlineProps) {
  const currentUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Ссылка скопирована в буфер обмена');
    } catch (err) {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const shareByEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(currentUrl)}`;
    window.location.href = emailUrl;
  };

  return (
    <div className="flex items-center gap-4 py-6 border-y border-border">
      <span 
        className="text-sm uppercase tracking-wide text-foreground/60"
        style={{ fontFamily: 'var(--font-body)', fontWeight: '500' }}
      >
        SHARE
      </span>
      
      <div className="flex items-center gap-3">
        <button
          onClick={copyToClipboard}
          className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
          title="Копировать ссылку"
        >
          <Link2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={shareOnTwitter}
          className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
          title="Поделиться в Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        
        <button
          onClick={shareOnFacebook}
          className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
          title="Поделиться в Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        
        <button
          onClick={shareByEmail}
          className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
          title="Отправить по email"
        >
          <Mail className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}