import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ExternalLink, Twitter, Instagram, FileText, MessageCircle, Heart, Settings, User as UserIcon, Bell, Mail, Palette } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ArticleGrid } from '../components/ArticleGrid';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { mockArticles, mockComments } from '../data/mockData';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { NotFoundPage } from './NotFoundPage';

type TabType = 'articles' | 'favorites' | 'settings' | 'submissions';

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isOwnProfile } = useAuth();
  const { favorites, favoritesCount } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  
  // Mock user settings for demonstration
  const [userSettings, setUserSettings] = useState({
    name: currentUser?.name || 'Alex Rivera',
    email: currentUser?.email || 'alex@example.com',
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
  
  // Find author from articles or use current user for own profile
  const authorArticles = mockArticles.filter(article => article.author?.id === id);
  const author = authorArticles.length > 0 ? authorArticles[0].author : (isOwn ? currentUser : null);
  
  if (!author || !id) {
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

  // Get favorite articles (only for own profile)
  const favoriteArticles = isOwn ? mockArticles.filter(article => favorites.includes(article.id)) : [];

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

  // Define tabs based on ownership
  const tabs = isOwn ? [
    { id: 'articles' as TabType, label: 'Articles', icon: FileText, count: authorArticles.length },
    { id: 'favorites' as TabType, label: 'Favorites', icon: Heart, count: favoritesCount },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    { id: 'submissions' as TabType, label: 'My Submissions', icon: FileText, count: 0 }
  ] : [
    { id: 'articles' as TabType, label: 'Articles', icon: FileText, count: authorArticles.length }
  ];

  return (
    <>
      <SEO 
        title={`${author.name} — ${isOwn ? 'Profile' : 'Author Profile'}`}
        description={author.bio || `Read articles by ${author.name} on Ticket to Socks`}
        keywords={`${author.name}, author, sock culture, streetwear, fashion writer`}
      />
      
      <main className="min-h-screen bg-background">
        {/* Author Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-full">
                  <ImageWithFallback
                    src={author.avatar}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl lg:text-4xl mb-2" style={{ fontFamily: 'var(--font-headlines)' }}>
                      {author.name}
                    </h1>
                    {author.bio && (
                      <p className="text-foreground/80 text-lg leading-relaxed max-w-2xl">
                        {author.bio}
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
                Articles by {author.name}
              </h2>

              {authorArticles.length > 0 ? (
                <ArticleGrid articles={authorArticles} />
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

                <Button className="w-full bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && isOwn && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  My Submissions
                </h2>
                <p className="text-foreground/60 mb-6">
                  Track your submitted articles and their status.
                </p>
              </div>

              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60 mb-4">No submissions yet</p>
                <p className="text-sm text-foreground/40 mb-6">
                  Ready{' '}
                  <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
                  share your sock story?
                </p>
                <Button asChild className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white">
                  <Link to="/submit">Submit Your Story</Link>
                </Button>
              </div>
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