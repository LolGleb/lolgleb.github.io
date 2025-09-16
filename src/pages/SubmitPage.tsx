import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, Send, Image as ImageIcon, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ContentEditor, ContentEditorHandle } from '../components/ContentEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { mockTags } from '../data/mockData';
import { toast } from 'sonner@2.0.3';
import { addSubmission, ArticleSubmission, generateSubmissionId } from '../db/submissionsDb';

export function SubmitPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef<ContentEditorHandle | null>(null);
  
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
    if (!currentUser) return;

    if (!articleForm.title.trim() || !articleForm.excerpt.trim() || !articleForm.category || !articleForm.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const submission: ArticleSubmission = {
        id: generateSubmissionId(),
        title: articleForm.title.trim(),
        excerpt: articleForm.excerpt.trim(),
        category: articleForm.category as any,
        image: articleForm.image.trim() || undefined,
        content: articleForm.content.trim(),
        tags: articleForm.tags,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorEmail: currentUser.email,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      await addSubmission(submission);
      toast.success('Your article has been submitted for moderation');
      setArticleForm({ title: '', excerpt: '', category: '', tags: [], content: '', image: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit article');
    } finally {
      setIsSubmitting(false);
    }
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
                      <Label htmlFor="articleImageFile" className="mb-1 block">Featured image</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-14 rounded-md overflow-hidden bg-muted border border-border">
                          {articleForm.image ? (
                            <img src={articleForm.image} alt="Image preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No image</div>
                          )}
                        </div>
                        <div>
                          <input id="articleImageFile" type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (!file.type.startsWith('image/')) {
                              toast.error('Please select an image file');
                              return;
                            }
                            const MAX_SIZE = 5 * 1024 * 1024;
                            if (file.size > MAX_SIZE) {
                              toast.error('Image is too large. Please choose up to 5MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              setArticleForm(prev => ({ ...prev, image: String(reader.result || '') }));
                            };
                            reader.onerror = () => toast.error('Failed to read file');
                            reader.readAsDataURL(file);
                          }} />
                          <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('articleImageFile')?.click()}>
                            Choose file
                          </Button>
                          <div className="text-xs text-foreground/60 mt-1">Upload an image (JPG, PNG, GIF). Up to 5MB.</div>
                        </div>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Write your story</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="contentImageFiles"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;
                          const MAX_SIZE = 5 * 1024 * 1024;
                          const valid = files.filter(f => f.type.startsWith('image/') && f.size <= MAX_SIZE);
                          const tooBig = files.filter(f => f.size > MAX_SIZE);
                          const invalid = files.filter(f => !f.type.startsWith('image/'));
                          if (invalid.length) toast.error('Only image files are allowed');
                          if (tooBig.length) toast.error('Some images exceeded 5MB and were skipped');
                          try {
                            const dataUrls = await Promise.all(valid.map(f => new Promise<string>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = () => resolve(String(reader.result || ''));
                              reader.onerror = () => reject(new Error('Failed to read file'));
                              reader.readAsDataURL(f);
                            })));
                            contentRef.current?.insertImageBlocks(dataUrls.map((src, i) => ({ src, alt: valid[i].name })));
                            if (!contentRef.current) {
                              // Fallback: append markdown blocks if editor ref is unavailable
                              const blocks = dataUrls.map((src, i) => `![${valid[i].name}](${src})`).join('\n\n');
                              setArticleForm(prev => ({ ...prev, content: `${prev.content}\n\n${blocks}\n\n` }));
                            }
                          } catch (err) {
                            console.error(err);
                            toast.error('Failed to insert image');
                          } finally {
                            // Reset input so the same file can be selected again later
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('contentImageFiles')?.click()}>
                        <ImageIcon className="w-4 h-4 mr-2" /> Add image
                      </Button>
                    </div>
                  </div>
                  <ContentEditor
                    id="content"
                    ref={contentRef}
                    placeholder="Share your insights, experiences, or news about sock culture. Write in a conversational tone that matches our editorial style..."
                    value={articleForm.content}
                    onChange={(val) => setArticleForm(prev => ({ ...prev, content: val }))}
                    style={{ minHeight: '16rem' }}
                  />
                  <p className="text-xs text-foreground/60">
                    Tip: Include personal experiences, specific details, and your unique perspective.
                  </p>
                  <p className="text-xs text-foreground/60">
                    You can now insert images with the button above. They will be embedded into your content and displayed in the article.
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