import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { addBrandSubmission, generateSubmissionId, type BrandSubmission as DbBrandSubmission } from '../db/brandSubmissionsDb';

const BRAND_CATEGORIES = [
  'Performance Athletic',
  'Luxury Fashion',
  'Streetwear',
  'Sustainable',
  'Basic Essentials',
  'Novelty & Fun',
  'Medical & Therapeutic',
  'Outdoor & Hiking'
];

const CONTACT_TYPES = [
  { id: 'website', label: 'Official Website', placeholder: 'https://example.com' },
  { id: 'contact', label: 'Contact Page', placeholder: 'https://example.com/contact' },
  { id: 'support', label: 'Customer Service', placeholder: 'https://example.com/support' },
  { id: 'chat', label: 'Live Chat Page', placeholder: 'https://example.com/chat' },
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/brandname' },
  { id: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/brandname' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/brandname' },
  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@brandname' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@brandname' },
  { id: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/brandname' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/brandname' }
];

const WHERE_TO_BUY_PLATFORMS = [
  { id: 'official', label: 'Official Website', placeholder: 'https://brandname.com' },
  { id: 'amazon', label: 'Amazon', placeholder: 'https://amazon.com/...' },
  { id: 'walmart', label: 'Walmart', placeholder: 'https://walmart.com/...' },
  { id: 'target', label: 'Target', placeholder: 'https://target.com/...' },
  { id: 'macys', label: 'Macy\'s', placeholder: 'https://macys.com/...' },
  { id: 'asos', label: 'ASOS', placeholder: 'https://asos.com/...' },
  { id: 'nordstrom', label: 'Nordstrom', placeholder: 'https://nordstrom.com/...' },
  { id: 'zappos', label: 'Zappos', placeholder: 'https://zappos.com/...' },
  { id: 'footlocker', label: 'Foot Locker', placeholder: 'https://footlocker.com/...' },
  { id: 'other', label: 'Other Store', placeholder: 'https://otherstore.com/...' }
];

const SUBMISSION_STATUS = [
  'pending', 'reviewing', 'approved', 'rejected'
];


export function BrandSubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brandName: '',
    categories: [] as string[],
    description: '',
    about: '',
    founded: '',
    headquarters: '',
    madeIn: '',
    contacts: {} as { [key: string]: string },
    priceRange: [] as string[],
    logo: null as File | null,
    heroImage: null as File | null,
    referralProgram: {
      hasProgram: 'no' as 'yes-link' | 'yes-contact' | 'no',
      link: '',
      email: ''
    },
    whereToBuy: {} as { [key: string]: string },
    reasonForSubmission: '',
    hasPermission: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/auth', { 
        state: { from: { pathname: '/brand/submit' } }
      });
      return;
    }

    if (!formData.hasPermission) {
      toast.error('Please confirm you have permission to submit this brand');
      return;
    }

    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    if (formData.priceRange.length === 0) {
      toast.error('Please select at least one price range');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission: DbBrandSubmission = {
        id: generateSubmissionId(),
        name: (formData.brandName || '').trim(),
        description: (formData.about || formData.description || '').trim(),
        website: (formData.contacts['website'] || '').trim() || undefined,
        tags: formData.categories,
        madeIn: formData.madeIn ? [formData.madeIn] : undefined,
        priceRange: formData.priceRange,
        authorId: currentUser?.id || 'anonymous',
        authorName: currentUser?.name || 'Anonymous',
        authorEmail: currentUser?.email || undefined,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      await addBrandSubmission(submission);
      setSubmitted(true);
      toast.success('Brand submitted successfully!', {
        description: "We'll review your submission and get back to you within 3-5 business days."
      });

    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePriceRangeToggle = (priceRange: string) => {
    setFormData(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(priceRange)
        ? prev.priceRange.filter(p => p !== priceRange)
        : [...prev.priceRange, priceRange]
    }));
  };

  const handleContactChange = (contactType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [contactType]: value
      }
    }));
  };

  const handleImageUpload = (imageType: 'logo' | 'heroImage', file: File) => {
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        [imageType]: file
      }));
    } else {
      toast.error('Please upload an image file (JPG, PNG, GIF, WebP)');
    }
  };

  const handleImageRemove = (imageType: 'logo' | 'heroImage') => {
    setFormData(prev => ({
      ...prev,
      [imageType]: null
    }));
  };

  const handleReferralProgramChange = (hasProgram: 'yes-link' | 'yes-contact' | 'no') => {
    setFormData(prev => ({
      ...prev,
      referralProgram: {
        ...prev.referralProgram,
        hasProgram,
        // Clear fields when changing program type
        link: hasProgram === 'yes-link' ? prev.referralProgram.link : '',
        email: hasProgram === 'yes-contact' ? prev.referralProgram.email : ''
      }
    }));
  };

  const handleReferralFieldChange = (field: 'link' | 'email', value: string) => {
    setFormData(prev => ({
      ...prev,
      referralProgram: {
        ...prev.referralProgram,
        [field]: value
      }
    }));
  };

  const handleWhereToBuyChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      whereToBuy: {
        ...prev.whereToBuy,
        [platform]: value
      }
    }));
  };

  if (submitted) {
    return (
      <>
        <SEO 
          title="Brand Submitted | Ticket to Socks"
          description="Your brand submission has been received and is under review."
        />
        
        <main className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 style={{ fontFamily: 'var(--font-headlines)' }}>
                  Brand Submitted Successfully!
                </h1>
                <p className="text-foreground/70">
                  Thank you for submitting <strong>{formData.brandName}</strong> to our brand directory.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Under Review
                      </Badge>
                      <span className="text-sm text-foreground/60">
                        Expected review time: 3-5 business days
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>What happens next:</strong></p>
                      <ul className="space-y-1 text-foreground/70 ml-4">
                        <li>• Our team will review the brand information</li>
                        <li>• We may reach out for additional details</li>
                        <li>• You'll receive an email with the decision</li>
                        <li>• Approved brands appear in our directory within 24 hours</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/brands">
                    Browse Brands
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Submit New Brand | Ticket to Socks"
        description="Help us expand our sock brand directory by submitting brands you'd like to see featured."
      />
      
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="ghost" size="sm">
                <Link to="/brands" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Brands
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              <h1 style={{ fontFamily: 'var(--font-headlines)' }}>
                Submit New Brand
              </h1>
              <p className="text-foreground/70 text-lg">
                Help us expand our sock brand directory by submitting brands you'd like to see featured.
              </p>
            </div>
          </div>

          {/* Login Alert */}
          {!isAuthenticated && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <Link to="/auth" className="text-[#FF00A8] hover:underline">
                  Sign in
                </Link> to submit a brand and track your submissions.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about the brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    value={formData.brandName}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                    placeholder="Enter the exact brand name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief one-line description of the brand"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About the Brand *</Label>
                  <Textarea
                    id="about"
                    value={formData.about}
                    onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                    placeholder="Detailed description of the brand, its mission, what makes it unique..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      type="number"
                      value={formData.founded}
                      onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                      placeholder="2020"
                      min="1800"
                      max="2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headquarters">Headquarters</Label>
                    <Input
                      id="headquarters"
                      value={formData.headquarters}
                      onChange={(e) => setFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="madeIn">Made In</Label>
                    <Input
                      id="madeIn"
                      value={formData.madeIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, madeIn: e.target.value }))}
                      placeholder="Country/Region"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Images */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Images</CardTitle>
                <CardDescription>
                  Upload visual assets to make the brand profile more engaging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label>Brand Logo</Label>
                  <p className="text-sm text-foreground/60">
                    Square format recommended. Will be displayed in a circle (200x200px max)
                  </p>
                  
                  {!formData.logo ? (
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-[#FF00A8]/50 transition-colors cursor-pointer group"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageUpload('logo', file);
                      }}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-[#FF00A8] transition-colors" />
                      <p className="text-sm text-foreground/70 mb-1">
                        <span className="text-[#FF00A8]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-foreground/50">
                        PNG, JPG, GIF or WebP (max 5MB)
                      </p>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('logo', file);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.logo)}
                          alt="Brand logo preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-border"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove('logo')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium">{formData.logo.name}</p>
                        <p className="text-xs text-foreground/60">
                          {(formData.logo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          Replace Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hero Image Upload */}
                <div className="space-y-3">
                  <Label>Hero Image</Label>
                  <p className="text-sm text-foreground/60">
                    Main brand image for the brand page. Landscape format recommended (800x600px max)
                  </p>
                  
                  {!formData.heroImage ? (
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-[#FF00A8]/50 transition-colors cursor-pointer group"
                      onClick={() => document.getElementById('hero-upload')?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageUpload('heroImage', file);
                      }}
                    >
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 group-hover:text-[#FF00A8] transition-colors" />
                      <p className="text-sm text-foreground/70 mb-1">
                        <span className="text-[#FF00A8]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-foreground/50">
                        PNG, JPG, GIF or WebP (max 10MB)
                      </p>
                      <input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('heroImage', file);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.heroImage)}
                          alt="Hero image preview"
                          className="w-full max-w-md h-48 rounded-lg object-cover border-2 border-border"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove('heroImage')}
                          className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{formData.heroImage.name}</p>
                        <p className="text-xs text-foreground/60">
                          {(formData.heroImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('hero-upload')?.click()}
                        >
                          Replace Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories *</CardTitle>
                <CardDescription>
                  What categories best describe this brand? (Select all that apply)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BRAND_CATEGORIES.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardHeader>
                <CardTitle>Price Range *</CardTitle>
                <CardDescription>
                  What price ranges does this brand typically offer? (Select all that apply)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: '$', label: 'Budget ($0-10)', value: '$' },
                    { id: '$$', label: 'Mid-range ($11-22)', value: '$$' },
                    { id: '$$$', label: 'Premium ($23-50)', value: '$$$' },
                    { id: '$$$$', label: 'Luxury ($50+)', value: '$$$$' }
                  ].map(price => (
                    <div key={price.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={price.id}
                        checked={formData.priceRange.includes(price.value)}
                        onCheckedChange={() => handlePriceRangeToggle(price.value)}
                      />
                      <Label htmlFor={price.id} className="text-sm">
                        {price.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Help us find their official contact channels and social media (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {CONTACT_TYPES.map(contact => (
                    <div key={contact.id} className="space-y-2">
                      <Label htmlFor={contact.id}>{contact.label}</Label>
                      <Input
                        id={contact.id}
                        value={formData.contacts[contact.id] || ''}
                        onChange={(e) => handleContactChange(contact.id, e.target.value)}
                        placeholder={contact.placeholder}
                        type="url"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Referral Program - Admin Only */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Information</CardTitle>
                <CardDescription>
                  Internal information for editorial team (not displayed publicly)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Do you have a referral / affiliate program?</Label>
                  <RadioGroup
                    value={formData.referralProgram.hasProgram}
                    onValueChange={(value: 'yes-link' | 'yes-contact' | 'no') => handleReferralProgramChange(value)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes-link" id="referral-yes-link" className="h-5 w-5 text-[#FF00A8]" />
                        <Label htmlFor="referral-yes-link" className="text-sm font-normal cursor-pointer">
                          Yes — provide link
                        </Label>
                      </div>
                      
                      {formData.referralProgram.hasProgram === 'yes-link' && (
                        <div className="ml-6 space-y-2">
                          <Input
                            value={formData.referralProgram.link}
                            onChange={(e) => handleReferralFieldChange('link', e.target.value)}
                            placeholder="https://brandname.com/affiliates"
                            type="url"
                          />
                          <p className="text-xs text-foreground/60">Paste the public page for your affiliate/referral program.</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes-contact" id="referral-yes-contact" className="h-5 w-5 text-[#FF00A8]" />
                        <Label htmlFor="referral-yes-contact" className="text-sm font-normal cursor-pointer">
                          Yes — contact me
                        </Label>
                      </div>
                      
                      {formData.referralProgram.hasProgram === 'yes-contact' && (
                        <div className="ml-6 space-y-2">
                          <Input
                            value={formData.referralProgram.email}
                            onChange={(e) => handleReferralFieldChange('email', e.target.value)}
                            placeholder="partnerships@brandname.com"
                            type="email"
                          />
                          <p className="text-xs text-foreground/60">We’ll reach out to this email to discuss partnership details.</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="no" id="referral-no" className="h-5 w-5 text-[#FF00A8]" />
                        <Label htmlFor="referral-no" className="text-sm font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Where to Buy */}
            <Card>
              <CardHeader>
                <CardTitle>Where to Buy</CardTitle>
                <CardDescription>
                  Add links to stores where customers can purchase this brand's products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {WHERE_TO_BUY_PLATFORMS.map(platform => (
                    <div key={platform.id} className="space-y-2">
                      <Label htmlFor={`buy-${platform.id}`}>{platform.label}</Label>
                      <Input
                        id={`buy-${platform.id}`}
                        value={formData.whereToBuy[platform.id] || ''}
                        onChange={(e) => handleWhereToBuyChange(platform.id, e.target.value)}
                        placeholder={platform.placeholder}
                        type="url"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
                <CardDescription>
                  Tell us why you're submitting this brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reasonForSubmission">Why are you submitting this brand?</Label>
                  <Textarea
                    id="reasonForSubmission"
                    value={formData.reasonForSubmission}
                    onChange={(e) => setFormData(prev => ({ ...prev, reasonForSubmission: e.target.value }))}
                    placeholder="Tell us what makes this brand special and why it should be in our directory..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPermission"
                    checked={formData.hasPermission}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasPermission: !!checked }))}
                    required
                  />
                  <Label htmlFor="hasPermission" className="text-sm">
                    I confirm that I have permission to submit this brand and that all information provided is accurate. *
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link to="/brands">
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Brand'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}