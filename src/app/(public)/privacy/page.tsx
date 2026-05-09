export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: May 7, 2026</p>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you create an account on NexHire, we collect personal information such as your name, email address, professional title, location, and resume content. For employers, we also collect company information including company name, industry, and contact details.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            We automatically collect usage data including pages visited, features used, and interaction patterns to improve our AI matching algorithms and user experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>To provide AI-powered job matching and career tools</li>
            <li>To process job applications and connect seekers with employers</li>
            <li>To analyze resumes and generate career recommendations</li>
            <li>To send relevant job alerts and platform notifications</li>
            <li>To improve our services and AI algorithms</li>
            <li>To ensure platform security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. AI Data Processing</h2>
          <p className="text-muted-foreground leading-relaxed">
            NexHire uses Google Gemini AI to provide resume analysis, cover letter generation, job matching, and interview coaching. When you use these features, your data is processed through Google&apos;s AI services. We do not store raw AI processing logs and only retain the final results for your records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell your personal information. Your profile information is shared with employers only when you apply for a job. Company profiles are publicly visible to all users. We may share anonymized, aggregated data for research and platform improvement purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including JWT authentication, encrypted data transmission (HTTPS), rate limiting, and regular security audits. Passwords are hashed using bcrypt and never stored in plain text.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Access and download your personal data</li>
            <li>Update or correct your information</li>
            <li>Delete your account and all associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Request restriction of data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use essential cookies for authentication and session management. We also use analytics cookies to understand how users interact with our platform. You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@nexhire.com" className="text-primary hover:underline">privacy@nexhire.com</a>{' '}
            or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
