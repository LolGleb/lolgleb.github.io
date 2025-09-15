import { useEffect, useMemo, useState } from 'react';
import { addArticle, AdminArticle, AdminArticleCategory, deleteArticle, generateId, getAllArticles, updateArticle } from '../db/articlesDb';
import { addBrand, AdminBrand, deleteBrand as deleteBrandDb, generateBrandId, getAllBrands, updateBrand } from '../db/brandsDb';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { ArticleSubmission, getPendingSubmissions, updateSubmission, approveSubmission, declineSubmission, deleteSubmission } from '../db/submissionsDb';
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
  const [modError, setModError] = useState<string | null>(null);
  const [modSavingId, setModSavingId] = useState<string | null>(null);

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

  function updateSub<K extends keyof ArticleSubmission>(id: string, key: K, value: ArticleSubmission[K]) {
    setPendingSubs((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
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

  useEffect(() => {
    if (adminAuthed) {
      refreshList();
      refreshBrands();
      refreshSubmissions();
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

  function handleAdminLogout() {
    try { localStorage.removeItem(ADMIN_LS_KEY); } catch {}
    setAdminAuthed(false);
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
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Content (optional)</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Full content (optional)" rows={6} />
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
          {pendingSubs.length === 0 ? (
            <p className="text-sm text-foreground/60">No pending submissions</p>
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
                    <label className="block text-sm mb-1">Content</label>
                    <Textarea value={s.content} onChange={(e) => updateSub(s.id, 'content', e.target.value)} rows={6} />
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
        </>
      )}
    </div>
  );
}
