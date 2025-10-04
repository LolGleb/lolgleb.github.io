import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addBrand, AdminBrand, generateBrandId } from '../db/brandsDb';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner@2.0.3';

export function AdminBrandCreatePage() {
  // Form state
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandImage, setBrandImage] = useState('');
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
  const [brandDescription, setBrandDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!brandName.trim()) {
      setError('Name is required');
      return;
    }
    if (!brandLogo.trim()) {
      setError('Logo is required');
      return;
    }

    try {
      setLoading(true);
      const brand: AdminBrand = {
        id: generateBrandId(),
        name: brandName.trim(),
        logo: brandLogo.trim(),
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
      await addBrand(brand);
      toast.success('Brand added');
      navigate('/admin/brands');
    } catch (err) {
      console.error(err);
      setError('Failed to add brand');
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
        <h1 className="text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>Create Brand</h1>
        <Button asChild variant="secondary">
          <Link to="/admin/brands">Back to Brands</Link>
        </Button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 border border-border rounded-lg p-4 md:p-6 bg-card">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Name</label>
          <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand name" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="adminBrandLogoFileCreate" className="block text-sm mb-1">Logo</label>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border border-border">
              {brandLogo ? (
                <img src={brandLogo} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No logo</div>
              )}
            </div>
            <div>
              <input id="adminBrandLogoFileCreate" type="file" accept="image/*" className="hidden" onChange={(e) => {
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
              <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('adminBrandLogoFileCreate')?.click()}>
                Choose file
              </Button>
              <div className="text-xs text-foreground/60 mt-1">Upload a square logo (JPG, PNG, GIF). Up to 5MB.</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="adminBrandImageFileCreate" className="block text-sm mb-1">Cover image (optional)</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-16 rounded-md overflow-hidden bg-muted border border-border">
              {brandImage ? (
                <img src={brandImage} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">No image</div>
              )}
            </div>
            <div>
              <input id="adminBrandImageFileCreate" type="file" accept="image/*" className="hidden" onChange={(e) => {
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
              <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('adminBrandImageFileCreate')?.click()}>
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

        {/* Meta Fields */}
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
                  <Checkbox id={`create-cat-${opt}`} checked={checked} onCheckedChange={(v) => {
                    const on = Boolean(v);
                    setBrandCategories((prev) => on ? Array.from(new Set([...prev, opt])) : prev.filter((x) => x !== opt));
                  }} />
                  <label htmlFor={`create-cat-${opt}`} className="text-sm">{opt}</label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">About</label>
          <Textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder="Short description" rows={4} />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          {error && <div className="text-red-500 text-sm mr-auto">{error}</div>}
          <Button type="button" variant="secondary" asChild>
            <Link to="/admin/brands">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create Brand'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminBrandCreatePage;
