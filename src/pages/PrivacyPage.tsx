import { SEO } from '../components/SEO';

export function PrivacyPage() {
  return (
    <>
      <SEO 
        title="Privacy Policy — Ticket to Socks"
        description="Privacy policy for Ticket to Socks - how we collect, use and protect your personal information."
        keywords="privacy policy, data protection, personal information, ticket to socks"
      />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
              Privacy Policy
            </h1>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Last updated: September 7, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Information We Collect
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                submit content, or contact us. This may include your name, email address, and any 
                content you choose to share.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                How We Use Your Information
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services, 
                communicate with you, and ensure a safe and engaging community experience.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Information Sharing
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties. 
                Content you choose to publish on our platform will be publicly visible.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Data Security
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Your Rights
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                You have the right to access, update, or delete your personal information. 
                You may also unsubscribe from our communications at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Cookies
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We use cookies to improve your browsing experience and analyze site traffic. 
                You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Contact Us
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us through 
                our website or by email.
              </p>
            </div>

            <div>
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Changes to This Policy
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify users of 
                any material changes by posting the new policy on this page.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}