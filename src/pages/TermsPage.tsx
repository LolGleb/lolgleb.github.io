import { SEO } from '../components/SEO';

export function TermsPage() {
  return (
    <>
      <SEO 
        title="Terms of Service — Ticket to Socks"
        description="Terms of service for Ticket to Socks - rules and guidelines for using our platform."
        keywords="terms of service, user agreement, community guidelines, ticket to socks"
      />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
              Terms of Service
            </h1>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Last updated: September 7, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Acceptance of Terms
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                By accessing and using Ticket to Socks, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to these terms, 
                please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                User Accounts
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to provide accurate, current, and complete information during registration 
                and to update such information as needed.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Content Guidelines
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                You retain ownership of content you submit, but grant us a license to use, display, 
                and distribute your content on our platform. Content must be original, respectful, 
                and relevant to sock culture and fashion.
              </p>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We reserve the right to remove content that violates our community guidelines or 
                is deemed inappropriate.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Prohibited Uses
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                You may not use our service for any unlawful purpose or to engage in any activity 
                that could harm, disable, overburden, or impair our platform. This includes but is 
                not limited to spam, harassment, or infringement of intellectual property rights.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Intellectual Property
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                The Ticket to Socks name, logo, and all related marks are our property. 
                All content on our platform, excluding user-generated content, is protected 
                by copyright and other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Limitation of Liability
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We provide our service "as is" without any warranties. We shall not be liable 
                for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of our service.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Termination
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We may terminate or suspend your account immediately, without prior notice, 
                for conduct that we believe violates these Terms of Service or is harmful 
                to our community.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Changes to Terms
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. We will notify users 
                of any material changes by posting the updated terms on our website.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Contact Information
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us 
                through our website or by email.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}