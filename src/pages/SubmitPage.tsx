import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, Send, Image, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { mockTags } from '../data/mockData';

export function SubmitPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for creating article
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    content: '',
    image: ''
  });

  // Handle article submission
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Your story has been submitted for review! We\'ll get back to you soon.');
      // Reset form
      setArticleForm({
        title: '',
        excerpt: '',
        category: '',
        tags: [],
        content: '',
        image: ''
      });
    }, 1500);
  };

  const handleTagToggle = (tagId: string) => {
    setArticleForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  // If user is authenticated, show the article creation form
  if (isAuthenticated) {
    return (
      <>
        <SEO 
          title="Submit Your Story — Ticket to Socks"
          description="Share your sock story with the community. Submit articles, reviews, and insights about sock culture."
          keywords="submit story, article submission, sock culture, write for us"
        />
        
        <main className="min-h-screen bg-background">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-[#FF00A8]/5 via-background to-purple-500/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 bg-[#FF00A8]/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF00A8]/10 rounded-full text-[#FF00A8] text-sm font-medium">
                  <Send className="w-4 h-4" />
                  Welcome back, {currentUser?.name}
                </div>

                <h1 className="text-3xl lg:text-4xl xl:text-5xl leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Share Your{' '}
                  <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>Sock</span>{' '}
                  <span className="text-[#FF00A8]">Story</span>
                </h1>

                <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                  Submit your article, review, or insight to be featured on Ticket to Socks. Help grow our community of sock enthusiasts.
                </p>
              </div>
            </div>
          </div>

          {/* Article Submission Form */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <form onSubmit={handleArticleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Article Details
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Your compelling headline..."
                      value={articleForm.title}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Brief description *</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="A short summary of your article (2-3 lines)..."
                      value={articleForm.excerpt}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={articleForm.category} onValueChange={(value) => setArticleForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="News">News</SelectItem>
                          <SelectItem value="Stories">Stories</SelectItem>
                          <SelectItem value="Drops">Drops</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Featured Image URL</Label>
                      <div className="relative">
                        <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/50" />
                        <Input
                          id="image"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={articleForm.image}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, image: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Tags
                </h2>
                <p className="text-sm text-foreground/70 mb-4">Select relevant tags for your article</p>
                
                <div className="flex flex-wrap gap-2">
                  {mockTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        articleForm.tags.includes(tag.id)
                          ? 'text-white'
                          : 'text-foreground/70 hover:bg-accent'
                      } border`}
                      style={{ 
                        backgroundColor: articleForm.tags.includes(tag.id) ? tag.color : 'transparent',
                        borderColor: tag.color
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Article Content *
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Write your story</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your insights, experiences, or news about sock culture. Write in a conversational tone that matches our editorial style..."
                    value={articleForm.content}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    required
                  />
                  <p className="text-xs text-foreground/60">
                    Tip: Include personal experiences, specific details, and your unique perspective.
                  </p>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Submission Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Articles should be original and not published elsewhere</li>
                  <li>• Keep your tone conversational and authentic to our brand voice</li>
                  <li>• Include specific details, brands, and personal experiences</li>
                  <li>• All submissions are reviewed by our editorial team</li>
                  <li>• We'll notify you within 3-5 business days about publication</li>
                </ul>
              </div>

              {/* Submit */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white px-8 py-3"
                  disabled={isSubmitting || !articleForm.title || !articleForm.excerpt || !articleForm.category || !articleForm.content}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Article'}
                </Button>
                <p className="text-sm text-foreground/60 mt-2">
                  Your story will be reviewed and published if approved
                </p>
              </div>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Submit Your Story — Ticket to Socks"
        description="Share your sock story with the community. Submit articles, reviews, and insights about sock culture."
        keywords="submit story, article submission, sock culture, write for us"
      />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#FF00A8]/5 via-background to-purple-500/5 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-[#FF00A8]/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF00A8]/10 rounded-full text-[#FF00A8] text-sm font-medium">
                <Send className="w-4 h-4" />
                Join the Community
              </div>

              <h1 className="text-3xl lg:text-5xl xl:text-6xl leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                Share Your{' '}
                <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>Sock</span>{' '}
                <span className="text-[#FF00A8]">Story</span>
              </h1>

              <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Join thousands of sock enthusiasts sharing stories, discovering brands, and celebrating the details that matter.
              </p>
            </div>
          </div>
        </div>

        {/* Auth Required Section */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#FF00A8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-[#FF00A8]" />
            </div>
            
            <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
              Ready to Share Your Story?
            </h2>
            
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Join our community of sock enthusiasts to submit articles, reviews, and insights. 
              Create an account or sign in to start sharing your unique perspective.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white px-8">
                  Sign Up & Submit
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="px-8">
                  Already have account? Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-foreground/60 mb-4">What you can do as a member:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#FF00A8]" />
                  Submit Articles
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FF00A8]" />
                  Build Your Profile
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF00A8]" />
                  Get Featured
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}