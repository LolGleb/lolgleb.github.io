import { useState } from 'react';
import { Copy, Check, Smile } from 'lucide-react';
import { Brand } from '../types';

interface ShareBlockProps {
  brands: Brand[];
}

export function ShareBlock({ brands }: ShareBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const displayedBrands = showAllBrands ? brands : brands.slice(0, 3);
  const hasMoreBrands = brands.length > 3;

  return (
    <div className="flex items-center justify-center">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="bg-transparent border-2 border-[#FF00A8] text-[#FF00A8] px-6 py-2 hover:bg-[#FF00A8] hover:text-white transition-all duration-300"
        style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
      >
        {copied ? (
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Copied
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Share
          </span>
        )}
      </button>
    </div>
  );
}