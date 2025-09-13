import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ExternalLink, Twitter, Instagram, FileText, MessageCircle, Heart, Settings, User as UserIcon, Bell, Mail, Palette } from 'lucide-react';
import { SEO } from '../components/SEO';
import { toast } from 'sonner@2.0.3';
import { ArticleGrid } from '../components/ArticleGrid';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { mockArticles, mockComments } from '../data/mockData';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { NotFoundPage } from './NotFoundPage';
import { ArticleSubmission, getAllSubmissions } from '../db/submissionsDb';
import type { Article as SiteArticle, Author as SiteAuthor } from '../types';
import { getAllArticles, AdminArticle, getArticleByIdAdmin } from '../db/articlesDb';

type TabType = 'articles' | 'favorites' | 'settings' | 'submissions';

type AvatarUploaderProps = { onUpload: (url: string) => Promise<void> };
function AvatarUploader({ onUpload }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    // Limit ~5MB to avoid huge localStorage payloads
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('Image is too large. Please choose up to 5MB.');
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = String(reader.result || '');
          await onUpload(dataUrl);
        } catch (err) {
          console.error(err);
          setError('Failed to save avatar');
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setError('Failed to upload');
      setUploading(false);
    }
  };

  return (
    <div className="absolute bottom-1 right-1 z-10">
      <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-background/90 border border-border shadow-sm hover:bg-background transition-colors">
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
        {uploading ? 'Saving…' : 'Change'}
      </label>
      {error && (
        <div className="mt-1 text-[10px] text-red-500 bg-background/80 px-1 rounded">{error}</div>
      )}
    </div>
  );
}

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isOwnProfile, updateAvatar, updateBio, updateName, hydrated } = useAuth();
  const { favorites, favoritesCount } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  
  // Mock user settings for demonstration
  const [userSettings, setUserSettings] = useState({
    name: currentUser?.name || 'Alex Rivera',
    email: currentUser?.email || 'alex@example.com',
    bio: currentUser?.bio || '',
    notifications: {
      emailAlerts: true,
      weeklyDigest: false,
      newDrops: true,
      comments: true
    },
    theme: 'light' as 'light' | 'dark'
  });

  // Check if this is the current user's own profile
  const isOwn = isOwnProfile(id);
  
  // Keep settings form in sync with the hydrated current user when opening Settings
  useEffect(() => {
    if (!isOwn || !currentUser) return;
    setUserSettings((prev) => ({
      ...prev,
      name: currentUser.name || prev.name,
      email: currentUser.email || prev.email,
      bio: currentUser.bio || '',
    }));
  }, [isOwn, currentUser?.id, currentUser?.name, currentUser?.email, currentUser?.bio, activeTab]);
  
  // Find author from articles or use current user for own profile
  const authorArticles = mockArticles.filter(article => article.author?.id === id);
  const author = authorArticles.length > 0 ? authorArticles[0].author : (isOwn ? currentUser : null);
  // Merge current user data for own profile so edits (bio/avatar/name) are shown
  const displayAuthor = (isOwn && currentUser)
    ? { ...author, name: currentUser.name || (author as any).name, avatar: currentUser.avatar || (author as any).avatar, bio: currentUser.bio || (author as any).bio }
    : author;
  
  // My submissions state
  const [mySubmissions, setMySubmissions] = useState<ArticleSubmission[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState<string | null>(null);

  // Admin articles for favorites (so favorites include published admin articles)
  const [adminArticles, setAdminArticles] = useState<AdminArticle[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getAllArticles();
        if (!cancelled) setAdminArticles(all);
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const fetchMySubmissions = async () => {
    if (!isOwn || !currentUser) return;
    try {
      setSubsLoading(true);
      setSubsError(null);
      const all = await getAllSubmissions();
      const mine = all
        .filter((s) => s.authorId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMySubmissions(mine);
      try {
        const byStatus = mine.reduce((acc: any, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
        console.debug('[DEBUG_LOG][AuthorPage] fetched my submissions', { total: mine.length, byStatus });
      } catch {}
    } catch (e) {
      console.error(e);
      setSubsError('Failed to load submissions');
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (isOwn && currentUser) {
      fetchMySubmissions();
    }
  }, [isOwn, currentUser?.id]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchMySubmissions();
    }
  }, [activeTab]);
  
  // Derive submissions subsets and articles to show
  const visibleSubmissions = mySubmissions.filter((s) => s.status !== 'approved');
  const approvedSubs = mySubmissions.filter((s) => s.status === 'approved');
  
  const approvedAsArticles: SiteArticle[] = approvedSubs.map((s) => ({
    id: s.publishedArticleId || `sub-${s.id}`,
    title: s.title,
    excerpt: s.excerpt,
    category: s.category as any,
    date: s.createdAt,
    image: s.image || '',
    readTime: s.readTime,
    featured: s.featured,
    content: s.content,
    author: {
      id: id || '',
      name: (displayAuthor as any).name,
      avatar: (displayAuthor as any).avatar || '',
      bio: (displayAuthor as any).bio,
    } as SiteAuthor,
    tags: s.tags,
  }));
  
  const combinedArticles = isOwn ? [...authorArticles, ...approvedAsArticles] : authorArticles;
  const combinedSorted: SiteArticle[] = [...combinedArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const articlesToShow = isOwn ? combinedSorted : authorArticles;

  // Debug snapshot whenever core inputs change
  useEffect(() => {
    try {
      console.group('[DEBUG_LOG][AuthorPage] snapshot');
      console.debug('url', typeof window !== 'undefined' ? window.location.href : 'n/a');
      console.debug('params.id', id);
      console.debug('auth.hydrated', hydrated);
      console.debug('currentUser', currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email } : null);
      console.debug('isOwn', isOwn);
      console.debug('authorFound', Boolean(author));
      console.debug('authorArticlesCount', authorArticles.length);
      console.debug('articlesToShowCount', articlesToShow.length);
      console.debug('favoritesCount', favorites.length);
      console.debug('mySubmissionsCount', mySubmissions.length);
      const statusCounts = mySubmissions.reduce((acc: any, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
      console.debug('submissionsByStatus', statusCounts);
      console.groupEnd();
    } catch {}
  }, [id, hydrated, currentUser?.id, isOwn, author ? (author as any).id : 'none', authorArticles.length, articlesToShow.length, favorites.length, mySubmissions.length]);

  // Log tab switches
  useEffect(() => {
    try { console.debug('[DEBUG_LOG][AuthorPage] activeTab', activeTab); } catch {}
  }, [activeTab]);
  
  // Get favorite articles (only for own profile) — resolve by IDs across mock and admin DB
  const [favoriteArticles, setFavoriteArticles] = useState<SiteArticle[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isOwn) { setFavoriteArticles([]); return; }
      try {
        setFavLoading(true);
        const ids = Array.from(new Set(favorites));
        const results: SiteArticle[] = [];
        for (const id of ids) {
          const mock = mockArticles.find((a) => a.id === id);
          if (mock) {
            results.push(mock);
            continue;
          }
          try {
            const admin = await getArticleByIdAdmin(id);
            if (admin) {
              const dateStr = (() => { try { const d = new Date(admin.publishedAt); return isNaN(d.getTime()) ? admin.publishedAt : d.toLocaleDateString(); } catch { return admin.publishedAt; } })();
              results.push({
                id: admin.id,
                title: admin.title,
                excerpt: admin.excerpt || '',
                category: admin.category as any,
                date: dateStr,
                image: admin.image,
                readTime: admin.readTime,
                featured: admin.featured,
                content: admin.content,
                author: displayAuthor as any,
              });
            }
          } catch {
            // ignore fetch errors for individual items
          }
        }
        const sorted = results.sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
        if (!cancelled) setFavoriteArticles(sorted);
      } finally {
        if (!cancelled) setFavLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isOwn, favorites, (displayAuthor as any)?.name, (displayAuthor as any)?.avatar]);
  
  if (!id) {
    try { console.warn('[DEBUG_LOG][AuthorPage] NotFound due to missing id param'); } catch {}
    return <NotFoundPage />;
  }
  if (!author) {
    // Wait for auth hydration to avoid false 404 on own profile refresh
    if (!hydrated) return null;
    try { console.warn('[DEBUG_LOG][AuthorPage] NotFound due to unresolved author', { id, hydrated, isOwn }); } catch {}
    return <NotFoundPage />;
  }

  // Group articles by category for stats
  const articlesByCategory = authorArticles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total comments for this author's articles
  const authorArticleIds = authorArticles.map(article => article.id);
  const totalComments = mockComments.filter(comment => 
    authorArticleIds.includes(comment.id.split('-')[0])
  ).length;

  const updateUserSetting = (key: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  // Utilities: Build a sanitized debug report and copy to clipboard
  async function buildDebugReport() {
    const statusCounts = mySubmissions.reduce((acc: any, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
    const report = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'n/a',
      routeParamId: id,
      env: {
        indexedDB: typeof indexedDB !== 'undefined',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
      },
      auth: {
        hydrated,
        currentUser: currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email } : null,
        isOwnProfile: isOwn,
      },
      authorResolved: Boolean(author),
      counts: {
        authorArticles: authorArticles.length,
        articlesToShow: articlesToShow.length,
        favorites: favorites.length,
        mySubmissions: mySubmissions.length,
        submissionsByStatus: statusCounts,
      },
      storage: (() => {
        try {
          const keys: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k) continue;
            if (k === 'user' || k.startsWith('tts_')) keys.push(k);
          }
          const user = localStorage.getItem('user');
          return {
            keys,
            user: user ? (() => { try { const u = JSON.parse(user); return { id: u?.id, name: u?.name, email: u?.email, hasAvatar: Boolean(u?.avatar), hasBio: Boolean(u?.bio) }; } catch { return 'parse_error'; } })() : null,
          };
        } catch {
          return { error: 'ls_unavailable' };
        }
      })(),
    };
    return report;
  }

  async function copyDebugInfo() {
    try {
      const report = await buildDebugReport();
      const text = JSON.stringify(report, null, 2);
      await navigator.clipboard.writeText(text);
      toast.success('Debug info copied to clipboard');
    } catch (e) {
      console.error('[DEBUG_LOG][AuthorPage] Failed to copy debug info', e);
      toast.error('Failed to copy debug info');
    }
  }

  // Define tabs based on ownership
  const tabs = isOwn ? [
    { id: 'articles' as TabType, label: 'Articles', icon: FileText, count: articlesToShow.length },
    { id: 'favorites' as TabType, label: 'Favorites', icon: Heart, count: favoritesCount },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    { id: 'submissions' as TabType, label: 'My Submissions', icon: FileText, count: visibleSubmissions.length }
  ] : [
    { id: 'articles' as TabType, label: 'Articles', icon: FileText, count: authorArticles.length }
  ];

  return (
    <>
      <SEO 
        title={`${(displayAuthor as any).name} — ${isOwn ? 'Profile' : 'Author Profile'}`}
        description={(displayAuthor as any).bio || `Read articles by ${(displayAuthor as any).name} on Ticket to Socks`}
        keywords={`${(displayAuthor as any).name}, author, sock culture, streetwear, fashion writer`}
      />
      
      <main className="min-h-screen bg-background">
        {/* Author Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-full overflow-hidden">
                  {(displayAuthor as any).avatar && (displayAuthor as any).avatar.trim() ? (
                    <ImageWithFallback
                      src={(displayAuthor as any).avatar}
                      alt={(displayAuthor as any).name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-2xl md:text-3xl font-semibold">
                      {(displayAuthor as any).name
                        .split(' ')
                        .map((part: string) => part[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                  {isOwn && (
                    <AvatarUploader onUpload={updateAvatar} />
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                        {(displayAuthor as any).name}
                      </h1>
                      {isOwn && (
                        <div className="flex items-center gap-2">
                          <Button
                            className="h-8 px-3 border rounded-md hover:bg-muted/50"
                            onClick={() => setActiveTab('settings')}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            className="h-8 px-3 border rounded-md hover:bg-muted/50"
                            variant="secondary"
                            onClick={copyDebugInfo}
                          >
                            Copy Debug Info
                          </Button>
                        </div>
                      )}
                    </div>
                    {(displayAuthor as any).bio && (
                      <p className="text-foreground/80 text-lg leading-relaxed max-w-2xl">
                        {(displayAuthor as any).bio}
                      </p>
                    )}
                  </div>
                  
                  {/* Social Links */}
                  {author.social && Object.keys(author.social).length > 0 && (
                    <div className="flex items-center gap-4">
                      {author.social.twitter && (
                        <a 
                          href={author.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/60 hover:text-[#FF00A8] transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          <span className="text-sm">Twitter</span>
                        </a>
                      )}
                      {author.social.instagram && (
                        <a 
                          href={author.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/60 hover:text-[#FF00A8] transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm">Instagram</span>
                        </a>
                      )}
                      {author.social.website && (
                        <a 
                          href={author.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/60 hover:text-[#FF00A8] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Website</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2 text-foreground/70">
              <FileText className="w-4 h-4" />
              <span className="text-sm">
                {authorArticles.length} article{authorArticles.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">
                {totalComments} comment{totalComments !== 1 ? 's' : ''}
              </span>
            </div>
            {Object.entries(articlesByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center gap-2 text-foreground/70">
                <div className="w-2 h-2 bg-[#FF00A8] rounded-full"></div>
                <span className="text-sm">
                  {count} {category}
                </span>
              </div>
            ))}
          </div>

          {/* Tabs (only show if own profile or just articles) */}
          {tabs.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#FF00A8] border-b-2 border-[#FF00A8]'
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {typeof tab.count === 'number' && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-[#FF00A8]/10 text-[#FF00A8]' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Content */}
          {activeTab === 'articles' && (
            <div>
              <h2 className="text-xl lg:text-2xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                Articles by {(displayAuthor as any).name}
              </h2>

              {articlesToShow.length > 0 ? (
                <ArticleGrid articles={articlesToShow} />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/60">
                    No articles found for this author.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && isOwn && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Your Favorites ({favoritesCount})
                </h2>
                <p className="text-foreground/60 mb-6">
                  Articles you've saved{' '}
                  <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
                  read later.
                </p>
              </div>

              {favoriteArticles.length > 0 ? (
                <ArticleGrid articles={favoriteArticles} />
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/60 mb-2">No favorites yet</p>
                  <p className="text-sm text-foreground/40">
                    Click the heart icon on any article{' '}
                    <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
                    save it here.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && isOwn && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Profile Settings
                </h2>
                <p className="text-foreground/60 mb-6">
                  Manage your account preferences and notifications.
                </p>
              </div>

              {/* Profile Settings */}
              <div className="space-y-6">
                <div className="p-6 bg-muted/30 rounded-lg">
                  <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                    <UserIcon className="w-5 h-5" />
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={userSettings.name}
                        onChange={(e) => updateUserSetting('name', e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => updateUserSetting('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userSettings.bio}
                      maxLength={280}
                      onChange={(e) => updateUserSetting('bio', e.target.value.slice(0, 280))}
                      placeholder="Tell readers a bit about yourself (max 280 chars)"
                      className="min-h-[100px]"
                    />
                    <div className="text-xs text-foreground/60 mt-1 text-right">{userSettings.bio.length}/280</div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-6 bg-muted/30 rounded-lg">
                  <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Alerts</p>
                        <p className="text-sm text-foreground/60">Get notified about new articles</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.emailAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting('emailAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-foreground/60">Weekly summary of top articles</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.weeklyDigest}
                        onCheckedChange={(checked) => updateNotificationSetting('weeklyDigest', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Drops</p>
                        <p className="text-sm text-foreground/60">Latest product releases and collabs</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.newDrops}
                        onCheckedChange={(checked) => updateNotificationSetting('newDrops', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Comments & Replies</p>
                        <p className="text-sm text-foreground/60">When someone replies{' '}
                          <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
                          your comments
                        </p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.comments}
                        onCheckedChange={(checked) => updateNotificationSetting('comments', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div className="p-6 bg-muted/30 rounded-lg">
                  <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                    <Palette className="w-5 h-5" />
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-foreground/60">Toggle dark/light theme</p>
                    </div>
                    <Switch
                      checked={userSettings.theme === 'dark'}
                      onCheckedChange={(checked) => updateUserSetting('theme', checked ? 'dark' : 'light')}
                    />
                  </div>
                </div>

                <Button className="w-full bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white" onClick={async () => {
                  try {
                    await updateName(userSettings.name);
                    await updateBio(userSettings.bio);
                    setActiveTab('articles');
                    toast.success('Changes saved successfully', { duration: 1000 });
                  } catch (e) {
                    console.error(e);
                    toast.error('Failed to save changes');
                  }
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && isOwn && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-headlines)' }}>
                    My Submissions
                  </h2>
                  <p className="text-foreground/60">Track your submitted articles and their status.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={fetchMySubmissions} disabled={subsLoading}>Refresh</Button>
                  <Button size="sm" variant="secondary" onClick={copyDebugInfo}>Copy Debug Info</Button>
                </div>
              </div>

              {subsError && <div className="text-red-500 text-sm">{subsError}</div>}

              {subsLoading ? (
                <div className="text-center py-12 text-foreground/60">Loading…</div>
              ) : mySubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/60 mb-4">No submissions yet</p>
                  <p className="text-sm text-foreground/40 mb-6">
                    Ready{' '}<span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}share your sock story?
                  </p>
                  <Button asChild className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white">
                    <Link to="/submit">Submit Your Story</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleSubmissions.map((s) => (
                    <div key={s.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{s.title}</div>
                        <div>
                          {s.status === 'pending' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/30">Pending</span>
                          )}
                          {s.status === 'approved' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/30">Approved</span>
                          )}
                          {s.status === 'declined' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/30">Declined</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-foreground/60 mt-1">{new Date(s.createdAt).toLocaleString()} • {s.category}</div>
                      {s.excerpt && (
                        <div className="text-sm text-foreground/80 mt-3">{s.excerpt}</div>
                      )}
                      {s.status === 'declined' && s.moderationComment && (
                        <div className="text-sm text-red-600 mt-3">Moderator comment: {s.moderationComment}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[#FF00A8] hover:underline"
            >
              ← Back{' '}
              <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
              home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}