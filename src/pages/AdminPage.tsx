import { useEffect, useMemo, useState } from 'react';
import { addArticle, AdminArticle, AdminArticleCategory, deleteArticle, generateId, getAllArticles } from '../db/articlesDb';
import { addBrand, AdminBrand, deleteBrand as deleteBrandDb, generateBrandId, getAllBrands } from '../db/brandsDb';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

export function AdminPage() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<AdminArticleCategory>('News');
  const [image, setImage] = useState('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [featured, setFeatured] = useState(false);
  const [readTime, setReadTime] = useState('');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<AdminArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Brands form state
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandImage, setBrandImage] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brandWebsite, setBrandWebsite] = useState('');

  const [brandLoading, setBrandLoading] = useState(false);
  const [brandList, setBrandList] = useState<AdminBrand[]>([]);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [brandSuccess, setBrandSuccess] = useState<string | null>(null);

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

  useEffect(() => {
    if (adminAuthed) {
      refreshList();
      refreshBrands();
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
      setError('Image URL is required');
      return;
    }

    try {
      setLoading(true);
      const article: AdminArticle = {
        id: generateId(),
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        category,
        image: image.trim(),
        publishedAt: new Date(date).toISOString(),
        featured,
        readTime: readTime.trim() || undefined,
        content: content.trim() || undefined,
      };
      await addArticle(article);
      setSuccess('Article added');
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
      setError('Failed to add article');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    await deleteArticle(id);
    await refreshList();
  }

  async function onDeleteBrand(id: string) {
    await deleteBrandDb(id);
    await refreshBrands();
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
      setBrandError('Logo or Image URL is required');
      return;
    }

    try {
      setBrandLoading(true);
      const brand: AdminBrand = {
        id: generateBrandId(),
        name: brandName.trim(),
        logo: brandLogo.trim() || brandImage.trim(),
        image: brandImage.trim() || undefined,
        description: brandDescription.trim() || undefined,
        website: brandWebsite.trim() || undefined,
      };
      await addBrand(brand);
      setBrandSuccess('Brand added');
      setBrandName('');
      setBrandLogo('');
      setBrandImage('');
      setBrandDescription('');
      setBrandWebsite('');
      await refreshBrands();
    } catch (err) {
      console.error(err);
      setBrandError('Failed to add brand');
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
      <h1 className="text-3xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Admin: Articles</h1>

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
          <label className="block text-sm mb-1">Image URL</label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…" />
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Add Article'}
          </Button>
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
                      <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <hr className="my-10" />
      <h1 className="text-3xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>Admin: Brands</h1>

      <form onSubmit={onSubmitBrand} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 border border-border rounded-lg p-4 md:p-6 bg-card mb-10">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Name</label>
          <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand name" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Logo URL</label>
          <Input value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} placeholder="https://… (square logo)" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Image URL (optional)</label>
          <Input value={brandImage} onChange={(e) => setBrandImage(e.target.value)} placeholder="https://… (cover image)" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Website (optional)</label>
          <Input value={brandWebsite} onChange={(e) => setBrandWebsite(e.target.value)} placeholder="https://brand.com" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Description (optional)</label>
          <Textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder="Short description" rows={4} />
        </div>
        <div className="md:col-span-2">
          {brandError && <div className="text-red-500 text-sm mb-2">{brandError}</div>}
          {brandSuccess && <div className="text-green-600 text-sm mb-2">{brandSuccess}</div>}
          <Button type="submit" disabled={brandLoading}>
            {brandLoading ? 'Saving…' : 'Add Brand'}
          </Button>
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
                    <Button variant="destructive" size="sm" onClick={() => onDeleteBrand(b.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
