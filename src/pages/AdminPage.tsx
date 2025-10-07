import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { addArticle, AdminArticle, AdminArticleCategory, deleteArticle, generateId, getAllArticles, updateArticle, getBrandIdsForArticle } from '../db/articlesDb';
import { addBrand, AdminBrand, deleteBrand as deleteBrandDb, generateBrandId, getAllBrands, updateBrand } from '../db/brandsDb';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ContentEditor, ContentEditorHandle } from '../components/ContentEditor';
import { Button } from '../components/ui/button';
import { Image as ImageIcon, Heading2, Heading3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { ArticleSubmission, getPendingSubmissions, updateSubmission, approveSubmission, declineSubmission, deleteSubmission } from '../db/submissionsDb';
import { BrandSubmission, getPendingBrandSubmissions, updateBrandSubmission, approveBrandSubmission, declineBrandSubmission, deleteBrandSubmission } from '../db/brandSubmissionsDb';
import { toast } from 'sonner@2.0.3';

export function AdminPage() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<AdminArticleCategory>('News');
  const [image, setImage] = useState('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [featured, setFeatured] = useState(false);
  const [readTime, setReadTime] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [articleBrandIds, setArticleBrandIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<AdminArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Brands form state
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandImage, setBrandImage] = useState('');
  const [brandDescription, setBrandDescription] = useState(''); // About
  const [brandWebsite, setBrandWebsite] = useState('');
  const [brandContacts, setBrandContacts] = useState<Array<{ label: string; url: string }>>([]);
  const [brandContactLabel, setBrandContactLabel] = useState('');
  const [brandContactUrl, setBrandContactUrl] = useState('');
  const [brandRating, setBrandRating] = useState<string>('');
  const [brandFounded, setBrandFounded] = useState<string>('');
  const [brandHeadquarters, setBrandHeadquarters] = useState<string>('');
  const [brandMadeIn, setBrandMadeIn] = useState<string>('');
  const [brandPrice, setBrandPrice] = useState<string>('');
  const [brandCategories, setBrandCategories] = useState<string[]>([]);
  const [brandEditingId, setBrandEditingId] = useState<string | null>(null);

  const [brandLoading, setBrandLoading] = useState(false);
  const [brandList, setBrandList] = useState<AdminBrand[]>([]);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [brandSuccess, setBrandSuccess] = useState<string | null>(null);

  // Moderation state
  const [pendingSubs, setPendingSubs] = useState<ArticleSubmission[]>([]);
  const [pendingBrandSubs, setPendingBrandSubs] = useState<BrandSubmission[]>([]);
  const [modError, setModError] = useState<string | null>(null);
  const [modSavingId, setModSavingId] = useState<string | null>(null);
  const [headingLevels, setHeadingLevels] = useState<Record<string, number>>({});

  // Refs for content editors per submission (to insert images at caret)
  const contentRefs = useRef<Record<string, ContentEditorHandle | null>>({});
  // Editor ref for Articles tab content field
  const articleContentRef = useRef<ContentEditorHandle | null>(null);
  const [articleHeadingLevel, setArticleHeadingLevel] = useState<number>(0);

  // Admin simple auth state
  const ADMIN_LS_KEY = 'tts_admin_auth';
  const [adminAuthed, setAdminAuthed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_LS_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Subsections tabs
  const [activeTab, setActiveTab] = useState<'articles' | 'brands' | 'moderation'>('articles');
  const location = useLocation();
  useEffect(() => {
    const p = location.pathname || '';
    if (p.includes('/admin/brands')) setActiveTab('brands');
    else if (p.includes('/admin/articles')) setActiveTab('articles');
    else if (p.includes('/admin/moderation')) setActiveTab('moderation');
  }, [location.pathname]);

  const grouped = useMemo(() => {
    const g: Record<AdminArticleCategory, AdminArticle[]> = { News: [], Drops: [], Stories: [] };
    for (const a of list) {
      if (g[a.category]) g[a.category].push(a as AdminArticle);
    }
    // Sort by publishedAt desc
    (Object.keys(g) as AdminArticleCategory[]).forEach((k) => {
      g[k] = g[k].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    });
    return g;
  }, [list]);

  async function refreshList() {
    const all = await getAllArticles();
    setList(all);
  }

  async function refreshBrands() {
    const all = await getAllBrands();
    setBrandList(all);
  }

  async function refreshSubmissions() {
    const all = await getPendingSubmissions();
    setPendingSubs(all);
  }

  async function refreshBrandSubmissions() {
    const all = await getPendingBrandSubmissions();
    setPendingBrandSubs(all);
  }

  function updateSub<K extends keyof ArticleSubmission>(id: string, key: K, value: ArticleSubmission[K]) {
    setPendingSubs((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }

  function updateBrandSub<K extends keyof BrandSubmission>(id: string, key: K, value: BrandSubmission[K]) {
    setPendingBrandSubs((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }

  async function saveSubmission(sub: ArticleSubmission) {
    setModError(null);
    try {
      setModSavingId(sub.id);
      await updateSubmission(sub);
      toast.success('Submission saved');
    } catch (e) {
      console.error(e);
      setModError('Failed to save submission');
      toast.error('Failed to save submission');
    } finally {
      setModSavingId(null);
    }
  }

  async function publishSubmission(sub: ArticleSubmission) {
    setModError(null);
    try {
      setModSavingId(sub.id);
      await approveSubmission(sub, new Date().toISOString());
      toast.success('Article published');
      await refreshSubmissions();
      await refreshList();
    } catch (e) {
      console.error(e);
      setModError('Failed to publish');
      toast.error('Failed to publish');
    } finally {
      setModSavingId(null);
    }
  }

  async function declineSubmissionWithComment(sub: ArticleSubmission) {
    setModError(null);
    const comment = (sub.moderationComment || '').trim();
    if (!comment) {
      toast.error('Please add a comment before declining');
      return;
    }
    try {
      setModSavingId(sub.id);
      await declineSubmission(sub, comment);
      toast.success('Submission declined');
      await refreshSubmissions();
    } catch (e) {
      console.error(e);
      setModError('Failed to decline');
      toast.error('Failed to decline');
    } finally {
      setModSavingId(null);
    }
  }

  async function removeSubmission(id: string) {
    try {
      setModSavingId(id);
      await deleteSubmission(id);
      setPendingSubs((prev) => prev.filter((s) => s.id !== id));
      toast.success('Submission deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete');
    } finally {
      setModSavingId(null);
    }
  }

  // Brand submissions moderation helpers
  async function saveBrandSubmission(sub: BrandSubmission) {
    setModError(null);
    try {
      setModSavingId(sub.id);
      await updateBrandSubmission(sub);
      toast.success('Brand submission saved');
    } catch (e) {
      console.error(e);
      setModError('Failed to save brand submission');
      toast.error('Failed to save brand submission');
    } finally {
      setModSavingId(null);
    }
  }

  async function publishBrandSubmission(sub: BrandSubmission) {
    setModError(null);
    try {
      setModSavingId(sub.id);
      await approveBrandSubmission(sub);
      toast.success('Brand approved and published');
      await refreshBrandSubmissions();
      await refreshBrands();
    } catch (e) {
      console.error(e);
      setModError('Failed to approve brand');
      toast.error('Failed to approve brand');
    } finally {
      setModSavingId(null);
    }
  }

  async function declineBrandSubmissionWithComment(sub: BrandSubmission) {
    setModError(null);
    const comment = (sub.moderationComment || '').trim();
    if (!comment) {
      toast.error('Please add a comment before declining');
      return;
    }
    try {
      setModSavingId(sub.id);
      await declineBrandSubmission(sub, comment);
      toast.success('Brand submission declined');
      await refreshBrandSubmissions();
    } catch (e) {
      console.error(e);
      setModError('Failed to decline brand submission');
      toast.error('Failed to decline brand submission');
    } finally {
      setModSavingId(null);
    }
  }

  async function removeBrandSubmission(id: string) {
    try {
      setModSavingId(id);
      await deleteBrandSubmission(id);
      setPendingBrandSubs((prev) => prev.filter((s) => s.id !== id));
      toast.success('Brand submission deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete brand submission');
    } finally {
      setModSavingId(null);
    }
  }

  useEffect(() => {
    if (adminAuthed) {
      refreshList();
      refreshBrands();
      refreshSubmissions();
      refreshBrandSubmissions();
    }
  }, [adminAuthed]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!image.trim()) {
      setError('Image is required');
      return;
    }

    try {
      setLoading(true);
      const article: AdminArticle = {
        id: editingId || generateId(),
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        category,
        image: image.trim(),
        publishedAt: new Date(date).toISOString(),
        featured,
        readTime: readTime.trim() || undefined,
        content: content.trim() || undefined,
        brandIds: articleBrandIds.length ? articleBrandIds : undefined,
      };
      if (editingId) {
        await updateArticle(article);
        setSuccess('Article updated');
        setEditingId(null);
      } else {
        await addArticle(article);
        setSuccess('Article added');
      }
      // Reset form
      setTitle('');
      setExcerpt('');
      setImage('');
      setFeatured(false);
      setReadTime('');
      setContent('');
      setDate(new Date().toISOString().slice(0, 10));
      setArticleBrandIds([]);
      await refreshList();
    } catch (err) {
      console.error(err);
      setError(editingId ? 'Failed to update article' : 'Failed to add article');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(a: AdminArticle) {
    setEditingId(a.id);
    setTitle(a.title);
    setExcerpt(a.excerpt || '');
    setCategory(a.category);
    setImage(a.image);
    setDate(new Date(a.publishedAt).toISOString().slice(0, 10));
    setFeatured(Boolean(a.featured));
    setReadTime(a.readTime || '');
    setContent(a.content || '');
    // Pre-fill from legacy column if present
    setArticleBrandIds(Array.isArray(a.brandIds) ? a.brandIds : []);
    // And refresh from join-table (preferred)
    getBrandIdsForArticle(a.id)
      .then((ids) => Array.isArray(ids) && setArticleBrandIds(ids))
      .catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setCategory('News');
    setImage('');
    setFeatured(false);
    setReadTime('');
    setContent('');
    setDate(new Date().toISOString().slice(0, 10));
    setArticleBrandIds([]);
  }

  async function onDelete(id: string) {
    await deleteArticle(id);
    await refreshList();
  }

  async function onDeleteBrand(id: string) {
    await deleteBrandDb(id);
    await refreshBrands();
  }

  function startBrandEdit(b: AdminBrand) {
    setBrandEditingId(b.id);
    setBrandName(b.name);
    setBrandLogo(b.logo || '');
    setBrandImage(b.image || '');
    setBrandDescription(b.description || '');
    setBrandWebsite(b.website || '');
    setBrandContacts(Array.isArray(b.contacts) ? b.contacts : []);
    setBrandContactLabel('');
    setBrandContactUrl('');
    setBrandRating(b.rating != null ? String(b.rating) : '');
    setBrandFounded(b.founded != null ? String(b.founded) : '');
    setBrandHeadquarters(b.headquarters || '');
    setBrandMadeIn(Array.isArray(b.madeIn) && b.madeIn.length ? b.madeIn[0] : '');
    setBrandPrice(Array.isArray(b.priceRange) && b.priceRange.length ? b.priceRange[0] : '');
    setBrandCategories(b.tags || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelBrandEdit() {
    setBrandEditingId(null);
    setBrandName('');
    setBrandLogo('');
    setBrandImage('');
    setBrandDescription('');
    setBrandWebsite('');
    setBrandContacts([]);
    setBrandContactLabel('');
    setBrandContactUrl('');
    setBrandRating('');
    setBrandFounded('');
    setBrandHeadquarters('');
    setBrandMadeIn('');
    setBrandPrice('');
    setBrandCategories([]);
  }

  async function onSubmitBrand(e: React.FormEvent) {
    e.preventDefault();
    setBrandError(null);
    setBrandSuccess(null);

    if (!brandName.trim()) {
      setBrandError('Brand name is required');
      return;
    }
    if (!brandLogo.trim() && !brandImage.trim()) {
      setBrandError('Logo or Image is required');
      return;
    }

    try {
      setBrandLoading(true);
      const brand: AdminBrand = {
        id: brandEditingId || generateBrandId(),
        name: brandName.trim(),
        logo: brandLogo.trim() || brandImage.trim(),
        image: brandImage.trim() || undefined,
        description: brandDescription.trim() || undefined,
        website: brandWebsite.trim() || undefined,
        contacts: brandContacts.length ? brandContacts : undefined,
        rating: brandRating ? Number(brandRating) : undefined,
        founded: brandFounded ? Number(brandFounded) : undefined,
        headquarters: brandHeadquarters.trim() || undefined,
        madeIn: brandMadeIn ? [brandMadeIn] : undefined,
        priceRange: brandPrice ? [brandPrice] : undefined,
        tags: brandCategories.length ? brandCategories : undefined,
      };
      if (brandEditingId) {
        await updateBrand(brand);
        setBrandSuccess('Brand updated');
        setBrandEditingId(null);
      } else {
        await addBrand(brand);
        setBrandSuccess('Brand added');
      }
      setBrandName('');
      setBrandLogo('');
      setBrandImage('');
      setBrandDescription('');
      setBrandWebsite('');
      setBrandContacts([]);
      setBrandContactLabel('');
      setBrandContactUrl('');
      setBrandRating('');
      setBrandFounded('');
      setBrandHeadquarters('');
      setBrandMadeIn('');
      setBrandPrice('');
      setBrandCategories([]);
      await refreshBrands();
    } catch (err) {
      console.error(err);
      setBrandError(brandEditingId ? 'Failed to update brand' : 'Failed to add brand');
    } finally {
      setBrandLoading(false);
    }
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminLogin === 'sock' && adminPassword === 'master') {
      try { localStorage.setItem(ADMIN_LS_KEY, 'true'); } catch {}
      setAdminAuthed(true);
      setAdminError(null);
    } else {
      setAdminError('Неверный логин или пароль');
    }
  }
    if (!adminAuthed) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Admin Login</h1>
        <form onSubmit={handleAdminLogin} className="space-y-4 border border-border rounded-lg p-6 bg-card">
          <div>
            <label className="block text-sm mb-1">Login</label>
            <Input value={adminLogin} onChange={(e) => setAdminLogin(e.target.value)} placeholder="Login" autoComplete="username" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <Input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
          </div>
          {adminError && <div className="text-red-500 text-sm">{adminError}</div>}
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Admin</h1>

      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 -mb-px ${activeTab === 'articles' ? 'text-[#FF00A8] border-b-2 border-[#FF00A8]' : 'text-foreground/60 hover:text-foreground'}`}
        >
          Articles
        </button>
        <button
          onClick={() => setActiveTab('brands')}
          className={`px-4 py-2 -mb-px ${activeTab === 'brands' ? 'text-[#FF00A8] border-b-2 border-[#FF00A8]' : 'text-foreground/60 hover:text-foreground'}`}
        >
          Brands
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 -mb-px ${activeTab === 'moderation' ? 'text-[#FF00A8] border-b-2 border-[#FF00A8]' : 'text-foreground/60 hover:text-foreground'}`}
        >
          Moderation
        </button>
      </div>

      {activeTab === 'articles' && (
        <>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Articles</h2>

          {!editingId && (
            <div className="mb-6 flex items-center justify-end">
              <Button asChild>
                <Link to="/admin/articles/new">Create Article</Link>
              </Button>
            </div>
          )}

          {editingId && (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 border border-border rounded-lg p-4 md:p-6 bg-card mb-10">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Excerpt</label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description" />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v as AdminArticleCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Drops">Drops</SelectItem>
                  <SelectItem value="Stories">Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Published date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="adminArticleImageFile" className="block text-sm mb-1">Image</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-16 rounded-md overflow-hidden bg-muted border border-border">
                  {image ? (
                    <img src={image} alt="Image preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No image</div>
                  )}
                </div>
                <div>
                  <input id="adminArticleImageFile" type="file" accept="image/*" className="hidden" onChange={(e) => {
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
                    reader.onload = () => setImage(String(reader.result || ''));
                    reader.onerror = () => toast.error('Failed to read file');
                    reader.readAsDataURL(file);
                  }} />
                  <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('adminArticleImageFile')?.click()}>
                    Choose file
                  </Button>
                  <div className="text-xs text-foreground/60 mt-1">Upload an image (JPG, PNG, GIF). Up to 5MB.</div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Read time</label>
              <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="e.g. 5 min read" />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox id="featured" checked={featured} onCheckedChange={(v) => setFeatured(Boolean(v))} />
              <label htmlFor="featured" className="text-sm">Featured</label>
            </div>

            {/* Link to Brands */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Brands featured in this article</label>
              {brandList.length === 0 ? (
                <div className="text-xs text-foreground/60">No brands yet. Add brands in the Brands tab to link them here.</div>
              ) : (
                <div className="max-h-48 overflow-auto border border-border rounded p-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                  {brandList.map((b) => {
                    const checked = articleBrandIds.includes(b.id);
                    return (
                      <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const on = Boolean(v);
                            setArticleBrandIds((prev) => {
                              if (on) {
                                if (prev.includes(b.id)) return prev;
                                return [...prev, b.id];
                              }
                              return prev.filter((x) => x !== b.id);
                            });
                          }}
                        />
                        <span>{b.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {articleBrandIds.length > 0 && (
                <div className="text-xs text-foreground/60 mt-1">Selected: {articleBrandIds.length}</div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm">Content (optional)</label>
                <div className="flex items-center gap-2" data-editor-static-controls="content">
                  <input
                    id="articleContentImageFiles"
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
                        if (articleContentRef.current) {
                          articleContentRef.current.insertImageBlocks(dataUrls.map((src, i) => ({ src, alt: valid[i].name })));
                        } else {
                          const blocks = dataUrls.map((src, i) => `![${valid[i].name}](${src})`).join('\n\n');
                          setContent(prev => `${prev}\n\n${blocks}\n\n`);
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error('Failed to insert image');
                      } finally {
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('articleContentImageFiles')?.click()}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Add image
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => articleContentRef.current?.toggleHeading(2)} aria-pressed={articleHeadingLevel === 2} className={articleHeadingLevel === 2 ? 'bg-[#FF00A8]/10 border-[#FF00A8] text-[#FF00A8]' : ''} title="H2">
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => articleContentRef.current?.toggleHeading(3)} aria-pressed={articleHeadingLevel === 3} className={articleHeadingLevel === 3 ? 'bg-[#FF00A8]/10 border-[#FF00A8] text-[#FF00A8]' : ''} title="H3">
                    <Heading3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ContentEditor
                id="adminContent"
                ref={articleContentRef}
                placeholder="Full content (optional). Use the Add image button to insert images."
                value={content}
                onChange={(val) => setContent(val)}
                style={{ minHeight: '16rem' }}
                imageClassName="inline-block h-64 max-w-[80%] rounded border border-border bg-muted align-middle"
                onFormatStateChange={(f) => setArticleHeadingLevel(f.headingLevel)}
                toolbarHideWhenVisibleSelector='[data-editor-static-controls="content"]'
              />
            </div>
            <div className="md:col-span-2">
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving…' : (editingId ? 'Update Article' : 'Add Article')}
                </Button>
                {editingId && (
                  <Button type="button" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                )}
              </div>
            </div>
          </form>
          )}

          <div className="space-y-8">
            {(['News','Drops','Stories'] as AdminArticleCategory[]).map((cat) => (
              <div key={cat}>
                <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>{cat}</h2>
                {grouped[cat].length === 0 ? (
                  <p className="text-sm text-foreground/60">No articles yet</p>
                ) : (
                  <ul className="space-y-3">
                    {grouped[cat].map((a) => (
                      <li key={a.id} className="flex items-start justify-between border border-border rounded-md p-3">
                        <div>
                          <div className="font-medium">{a.title}</div>
                          <div className="text-xs text-foreground/60">{new Date(a.publishedAt).toLocaleDateString()} • {a.readTime || '—'}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a href={a.image} target="_blank" rel="noreferrer" className="text-xs underline">Image</a>
                          <Button variant="secondary" size="sm" onClick={() => startEdit(a)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>Delete</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'brands' && (
        <>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Brands</h2>

          {!brandEditingId && (
            <div className="mb-6 flex items-center justify-end">
              <Button asChild>
                <Link to="/admin/brands/new">Create Brand</Link>
              </Button>
            </div>
          )}

          {brandEditingId && (
          <form onSubmit={onSubmitBrand} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 border border-border rounded-lg p-4 md:p-6 bg-card mb-10">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Name</label>
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand name" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="adminBrandLogoFile" className="block text-sm mb-1">Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border border-border">
                  {brandLogo ? (
                    <img src={brandLogo} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No logo</div>
                  )}
                </div>
                <div>
                  <input id="adminBrandLogoFile" type="file" accept="image/*" className="hidden" onChange={(e) => {
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
                    reader.onload = () => setBrandLogo(String(reader.result || ''));
                    reader.onerror = () => toast.error('Failed to read file');
                    reader.readAsDataURL(file);
                  }} />
                  <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('adminBrandLogoFile')?.click()}>
                    Choose file
                  </Button>
                  <div className="text-xs text-foreground/60 mt-1">Upload a square logo (JPG, PNG, GIF). Up to 5MB.</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="adminBrandImageFile" className="block text-sm mb-1">Cover image (optional)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-16 rounded-md overflow-hidden bg-muted border border-border">
                  {brandImage ? (
                    <img src={brandImage} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No image</div>
                  )}
                </div>
                <div>
                  <input id="adminBrandImageFile" type="file" accept="image/*" className="hidden" onChange={(e) => {
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
                    reader.onload = () => setBrandImage(String(reader.result || ''));
                    reader.onerror = () => toast.error('Failed to read file');
                    reader.readAsDataURL(file);
                  }} />
                  <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('adminBrandImageFile')?.click()}>
                    Choose file
                  </Button>
                  <div className="text-xs text-foreground/60 mt-1">Upload an image (JPG, PNG, GIF). Up to 5MB.</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Website (optional)</label>
              <Input value={brandWebsite} onChange={(e) => setBrandWebsite(e.target.value)} placeholder="https://brand.com" />
            </div>

            {/* Contacts */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Contacts (optional)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-xs mb-1 text-foreground/60">Label</label>
                  <Input value={brandContactLabel} onChange={(e) => setBrandContactLabel(e.target.value)} placeholder="e.g. Customer Support" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1 text-foreground/60">URL</label>
                  <Input value={brandContactUrl} onChange={(e) => setBrandContactUrl(e.target.value)} placeholder="mailto:support@brand.com or https://..." />
                </div>
              </div>
              <div className="mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const label = brandContactLabel.trim();
                    const url = brandContactUrl.trim();
                    if (!label || !url) {
                      toast.error('Please fill both label and URL');
                      return;
                    }
                    setBrandContacts((prev) => [...prev, { label, url }]);
                    setBrandContactLabel('');
                    setBrandContactUrl('');
                  }}
                >
                  Add contact
                </Button>
              </div>
              {brandContacts.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {brandContacts.map((c, i) => (
                    <li key={`${c.label}-${i}`} className="flex items-center justify-between text-sm border border-border rounded px-3 py-2 bg-background">
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">{c.label}</div>
                        <div className="text-foreground/60 truncate">{c.url}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setBrandContacts((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* New Brand Meta Fields */}
            <div>
              <label className="block text-sm mb-1">Rating</label>
              <Select value={brandRating} onValueChange={setBrandRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {['1','1.5','2','2.5','3','3.5','4','4.5','5'].map((v) => (
                    <SelectItem key={v} value={v}>{v} ★</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Founded</label>
              <Input type="number" inputMode="numeric" min={1800} max={2100} value={brandFounded} onChange={(e) => setBrandFounded(e.target.value)} placeholder="Year" />
            </div>
            <div>
              <label className="block text-sm mb-1">Headquarters</label>
              <Input value={brandHeadquarters} onChange={(e) => setBrandHeadquarters(e.target.value)} placeholder="City, Country" />
            </div>
            <div>
              <label className="block text-sm mb-1">Made In</label>
              <Select value={brandMadeIn} onValueChange={setBrandMadeIn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {['USA','China','Spain','France','Italy'].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Price</label>
              <Select value={brandPrice} onValueChange={setBrandPrice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price" />
                </SelectTrigger>
                <SelectContent>
                  {['$','$$','$$$'].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Categories</label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {['Streetwear','Performance','Collabs','Comfort','Social Impact','NYC','Hype'].map((opt) => {
                  const checked = brandCategories.includes(opt);
                  return (
                    <div key={opt} className="flex items-center space-x-2">
                      <Checkbox id={`cat-${opt}`} checked={checked} onCheckedChange={(v) => {
                        const on = Boolean(v);
                        setBrandCategories((prev) => on ? Array.from(new Set([...prev, opt])) : prev.filter((x) => x !== opt));
                      }} />
                      <label htmlFor={`cat-${opt}`} className="text-sm">{opt}</label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">About</label>
              <Textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder="Short description" rows={4} />
            </div>
            <div className="md:col-span-2">
              {brandError && <div className="text-red-500 text-sm mb-2">{brandError}</div>}
              {brandSuccess && <div className="text-green-600 text-sm mb-2">{brandSuccess}</div>}
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={brandLoading}>
                  {brandLoading ? 'Saving…' : (brandEditingId ? 'Update Brand' : 'Add Brand')}
                </Button>
                {brandEditingId && (
                  <Button type="button" variant="secondary" onClick={cancelBrandEdit}>Cancel</Button>
                )}
              </div>
            </div>
          </form>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>All Brands</h2>
              {brandList.length === 0 ? (
                <p className="text-sm text-foreground/60">No brands yet</p>
              ) : (
                <ul className="space-y-3">
                  {brandList.map((b) => (
                    <li key={b.id} className="flex items-start justify-between border border-border rounded-md p-3">
                      <div>
                        <div className="font-medium">{b.name}</div>
                        {b.website && (
                          <a className="text-xs underline" href={b.website} target="_blank" rel="noreferrer">{b.website}</a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {b.image && <a href={b.image} target="_blank" rel="noreferrer" className="text-xs underline">Image</a>}
                        <a href={b.logo} target="_blank" rel="noreferrer" className="text-xs underline">Logo</a>
                        <Button variant="secondary" size="sm" onClick={() => startBrandEdit(b)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => onDeleteBrand(b.id)}>Delete</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'moderation' && (
        <>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Moderation</h2>
          {modError && <div className="text-red-500 text-sm mb-4">{modError}</div>}
          <div className="space-y-10">
            <section>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>Article submissions</h3>
              {pendingSubs.length === 0 ? (
                <p className="text-sm text-foreground/60">No pending article submissions</p>
              ) : (
                <div className="space-y-6">
                  {pendingSubs.map((s) => (
                <div key={s.id} className="border border-border rounded-lg p-4 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground/60">From: <span className="font-medium text-foreground">{s.authorName}</span> • {new Date(s.createdAt).toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/30">Pending</div>
                      <Button size="sm" className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white" onClick={() => publishSubmission(s)} disabled={modSavingId === s.id}>Publish</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Title</label>
                      <Input value={s.title} onChange={(e) => updateSub(s.id, 'title', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Category</label>
                      <Select value={s.category} onValueChange={(v) => updateSub(s.id, 'category', v as AdminArticleCategory)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="News">News</SelectItem>
                          <SelectItem value="Drops">Drops</SelectItem>
                          <SelectItem value="Stories">Stories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Read time</label>
                      <Input value={s.readTime || ''} onChange={(e) => updateSub(s.id, 'readTime', e.target.value)} placeholder="e.g. 5 min read" />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox id={`featured-${s.id}`} checked={Boolean(s.featured)} onCheckedChange={(v) => updateSub(s.id, 'featured', Boolean(v))} />
                      <label htmlFor={`featured-${s.id}`} className="text-sm">Featured</label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Excerpt</label>
                      <Textarea value={s.excerpt} onChange={(e) => updateSub(s.id, 'excerpt', e.target.value)} rows={3} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor={`modImageFile-${s.id}`} className="block text-sm mb-1">Image</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-md overflow-hidden bg-muted border border-border">
                          {s.image ? (
                            <img src={s.image} alt="Image preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No image</div>
                          )}
                        </div>
                        <div>
                          <input id={`modImageFile-${s.id}`} type="file" accept="image/*" className="hidden" onChange={(e) => {
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
                            reader.onload = () => updateSub(s.id, 'image', String(reader.result || ''));
                            reader.onerror = () => toast.error('Failed to read file');
                            reader.readAsDataURL(file);
                          }} />
                          <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById(`modImageFile-${s.id}`)?.click()}>
                            Choose file
                          </Button>
                          <div className="text-xs text-foreground/60 mt-1">Upload an image (JPG, PNG, GIF). Up to 5MB.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor={`modContent-${s.id}`} className="block text-sm">Content</label>
                      <div className="flex items-center gap-2">
                        <input
                          id={`modContentImageFiles-${s.id}`}
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
                              const editor = contentRefs.current[s.id];
                              if (editor) {
                                editor.insertImageBlocks(dataUrls.map((src, i) => ({ src, alt: valid[i].name })));
                              } else {
                                const blocks = dataUrls.map((src, i) => `![${valid[i].name}](${src})`).join('\n\n');
                                updateSub(s.id, 'content', `${s.content || ''}\n\n${blocks}\n\n`);
                              }
                            } catch (err) {
                              console.error(err);
                              toast.error('Failed to insert image');
                            } finally {
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById(`modContentImageFiles-${s.id}`)?.click()}>
                          <ImageIcon className="w-4 h-4 mr-2" /> Add image
                        </Button>
                        <Button type="button" variant="secondary" size="sm" onClick={() => contentRefs.current[s.id]?.toggleHeading(2)} aria-pressed={headingLevels[s.id] === 2} className={headingLevels[s.id] === 2 ? 'bg-[#FF00A8]/10 border-[#FF00A8] text-[#FF00A8]' : ''} title="H2">
                          <Heading2 className="w-4 h-4" />
                        </Button>
                        <Button type="button" variant="secondary" size="sm" onClick={() => contentRefs.current[s.id]?.toggleHeading(3)} aria-pressed={headingLevels[s.id] === 3} className={headingLevels[s.id] === 3 ? 'bg-[#FF00A8]/10 border-[#FF00A8] text-[#FF00A8]' : ''} title="H3">
                          <Heading3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <ContentEditor
                      id={`modContent-${s.id}`}
                      ref={(el) => { contentRefs.current[s.id] = el; }}
                      placeholder="Edit content. Use the Add image button to insert images."
                      value={s.content}
                      onChange={(val) => updateSub(s.id, 'content', val)}
                      style={{ minHeight: '16rem' }}
                      imageClassName="inline-block h-64 max-w-[80%] rounded border border-border bg-muted align-middle"
                      onFormatStateChange={(f) => setHeadingLevels((prev) => ({ ...prev, [s.id]: f.headingLevel }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Moderator comment (for decline)</label>
                    <Textarea value={s.moderationComment || ''} onChange={(e) => updateSub(s.id, 'moderationComment', e.target.value)} rows={3} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => saveSubmission(s)} disabled={modSavingId === s.id}>{modSavingId === s.id ? 'Saving…' : 'Save'}</Button>
                    <Button size="sm" className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white" onClick={() => publishSubmission(s)} disabled={modSavingId === s.id}>Approve & Publish</Button>
                    <Button size="sm" variant="destructive" onClick={() => declineSubmissionWithComment(s)} disabled={modSavingId === s.id}>Decline</Button>
                    <Button size="sm" variant="secondary" onClick={() => removeSubmission(s.id)} disabled={modSavingId === s.id}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>Brand submissions</h3>
          {pendingBrandSubs.length === 0 ? (
            <p className="text-sm text-foreground/60">No pending brand submissions</p>
          ) : (
            <div className="space-y-6">
              {pendingBrandSubs.map((b) => (
                <div key={b.id} className="border border-border rounded-lg p-4 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground/60">From: <span className="font-medium text-foreground">{b.authorName}</span> • {new Date(b.createdAt).toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/30">Pending</div>
                      <Button size="sm" className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white" onClick={() => publishBrandSubmission(b)} disabled={modSavingId === b.id}>Approve</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Name</label>
                      <Input value={b.name} onChange={(e) => updateBrandSub(b.id, 'name', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Website</label>
                      <Input value={b.website || ''} onChange={(e) => updateBrandSub(b.id, 'website', e.target.value)} placeholder="https://brand.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Description</label>
                      <Textarea value={b.description || ''} onChange={(e) => updateBrandSub(b.id, 'description', e.target.value)} rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Tags (comma-separated)</label>
                      <Input value={(b.tags || []).join(', ')} onChange={(e) => updateBrandSub(b.id, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Streetwear, Performance, ..." />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Made In (comma-separated)</label>
                      <Input value={(b.madeIn || []).join(', ')} onChange={(e) => updateBrandSub(b.id, 'madeIn', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="USA, Italy" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Price Range (comma-separated)</label>
                      <Input value={(b.priceRange || []).join(', ')} onChange={(e) => updateBrandSub(b.id, 'priceRange', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="$, $$, $$$" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Moderator comment (for decline)</label>
                    <Textarea value={b.moderationComment || ''} onChange={(e) => updateBrandSub(b.id, 'moderationComment', e.target.value)} rows={3} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => saveBrandSubmission(b)} disabled={modSavingId === b.id}>{modSavingId === b.id ? 'Saving…' : 'Save'}</Button>
                    <Button size="sm" className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white" onClick={() => publishBrandSubmission(b)} disabled={modSavingId === b.id}>Approve & Publish</Button>
                    <Button size="sm" variant="destructive" onClick={() => declineBrandSubmissionWithComment(b)} disabled={modSavingId === b.id}>Decline</Button>
                    <Button size="sm" variant="secondary" onClick={() => removeBrandSubmission(b.id)} disabled={modSavingId === b.id}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
          </div>
        </>
      )}
    </div>
  );
}
