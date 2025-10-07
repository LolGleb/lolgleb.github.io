import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addArticle, AdminArticle, AdminArticleCategory, generateId } from '../db/articlesDb';
import { getAllBrands, AdminBrand } from '../db/brandsDb';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ContentEditor, ContentEditorHandle } from '../components/ContentEditor';
import { Button } from '../components/ui/button';
import { Image as ImageIcon, Heading2, Heading3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner@2.0.3';

export function AdminArticleCreatePage() {
  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<AdminArticleCategory>('News');
  const [image, setImage] = useState('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [featured, setFeatured] = useState(false);
  const [readTime, setReadTime] = useState('');
  const [content, setContent] = useState('');
  const [articleBrandIds, setArticleBrandIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Brands
  const [brandList, setBrandList] = useState<AdminBrand[]>([]);
  const [brandLoading, setBrandLoading] = useState(false);

  // Editor helpers
  const articleContentRef = useRef<ContentEditorHandle | null>(null);
  const [articleHeadingLevel, setArticleHeadingLevel] = useState<number>(0);

  // Admin auth state (reuse the same simple gate as AdminPage)
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

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!adminAuthed) return;
    let cancelled = false;
    (async () => {
      try {
        setBrandLoading(true);
        const all = await getAllBrands();
        if (!cancelled) setBrandList(all);
      } catch (e) {
        toast.error('Failed to load brands');
      } finally {
        setBrandLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [adminAuthed]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
        id: generateId(),
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
      await addArticle(article);
      toast.success('Article added');
      navigate('/admin/articles');
    } catch (err) {
      console.error(err);
      setError('Failed to add article');
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>Create Article</h1>
        <Button asChild variant="secondary">
          <Link to="/admin/articles">Back to Articles</Link>
        </Button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 border border-border rounded-lg p-4 md:p-6 bg-card">
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
          {brandLoading ? (
            <div className="text-xs text-foreground/60">Loading brands...</div>
          ) : brandList.length === 0 ? (
            <div className="text-xs text-foreground/60">No brands yet. Add brands in the Admin &gt; Brands tab to link them here.</div>
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
            id="adminContentCreate"
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

        <div className="md:col-span-2 flex items-center gap-3">
          {error && <div className="text-red-500 text-sm mr-auto">{error}</div>}
          <Button type="button" variant="secondary" asChild>
            <Link to="/admin/articles">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create Article'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminArticleCreatePage;
