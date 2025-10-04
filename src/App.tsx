import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NewsletterProvider } from './contexts/NewsletterContext';
import { EngagementProvider } from './contexts/EngagementContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { DropsPage } from './pages/DropsPage';
import { StoriesPage } from './pages/StoriesPage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandPage } from './pages/BrandPage';
import { BrandCategoryPage } from './pages/BrandCategoryPage';
import { SearchPage } from './pages/SearchPage';
import { SubmitPage } from './pages/SubmitPage';
import { AboutPage } from './pages/AboutPage';
import { ArticlePage } from './pages/ArticlePage';
import { AuthorPage } from './pages/AuthorPage';
import { TagPage } from './pages/TagPage';
import { TagsPage } from './pages/TagsPage';
import { ProfileRedirect } from './pages/ProfileRedirect';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { BrandSubmitPage } from './pages/BrandSubmitPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';
import { AdminArticleCreatePage } from './pages/AdminArticleCreatePage';
import { AdminBrandCreatePage } from './pages/AdminBrandCreatePage';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <NewsletterProvider>
              <EngagementProvider>
                <div className="min-h-screen bg-background">
                  <ScrollToTop />
                  <Header />
                  <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/drops" element={<DropsPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brands/:slug" element={<BrandCategoryPage />} />
              <Route path="/brand/:id" element={<BrandPage />} />
              <Route path="/brand/submit" element={<BrandSubmitPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/profile" element={<ProfileRedirect />} />
              <Route path="/settings" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<AboutPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/author/:id" element={<AuthorPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/tag/:slug" element={<TagPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/admin" element={<Navigate to="/admin/articles" replace />} />
              <Route path="/admin/articles" element={<AdminPage />} />
              <Route path="/admin/articles/new" element={<AdminArticleCreatePage />} />
              <Route path="/admin/brands" element={<AdminPage />} />
              <Route path="/admin/brands/new" element={<AdminBrandCreatePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
                  <Footer />
                  <Toaster />
                </div>
              </EngagementProvider>
            </NewsletterProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}