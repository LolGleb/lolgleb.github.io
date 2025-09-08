import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface CommentsSectionProps {
  comments: Comment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  const { isAuthenticated, currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    // Here you would typically submit the comment to your backend
    setTimeout(() => {
      setCommentText('');
      setIsSubmitting(false);
      // Show success toast or update comments
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
          Comments
        </h3>
        <span className="text-foreground/60 text-sm">
          ({comments.length})
        </span>
      </div>

      {/* Comment Form for Authenticated Users */}
      {isAuthenticated ? (
        <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0 overflow-hidden rounded-full">
              <ImageWithFallback
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                alt={currentUser?.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              {currentUser?.name}
            </span>
          </div>
          
          <Textarea
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || isSubmitting}
              className="bg-[#FF00A8] text-white hover:bg-[#FF00A8]/90"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      ) : (
        /* Auth Prompt for Non-Authenticated Users */
        <div className="text-center py-8 space-y-4 bg-accent/10 rounded-lg">
          <MessageCircle className="w-10 h-10 text-foreground/30 mx-auto" />
          <div className="space-y-2">
            <p className="text-foreground/60">
              {comments.length === 0 ? 'Be the first to comment.' : 'Join the conversation.'}
            </p>
            <p className="text-sm text-foreground/50">
              <Link 
                to="/auth" 
                className="text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors underline"
              >
                Sign in
              </Link>
              {' '}or{' '}
              <Link 
                to="/auth?tab=register" 
                className="text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors underline"
              >
                create an account
              </Link>
              {' '}to share your thoughts!
            </p>
          </div>
        </div>
      )}

      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-6 mt-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-full">
                <ImageWithFallback
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {comment.author}
                  </span>
                  <span className="text-xs text-foreground/50">
                    {comment.date}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed text-foreground/80">
                  {comment.content}
                </p>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-accent space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 flex-shrink-0 overflow-hidden rounded-full">
                          <ImageWithFallback
                            src={reply.avatar}
                            alt={reply.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                              {reply.author}
                            </span>
                            <span className="text-xs text-foreground/50">
                              {reply.date}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-foreground/80">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}