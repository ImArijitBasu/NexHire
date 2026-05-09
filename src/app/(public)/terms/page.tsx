export default function TermsPage() {
  return (
    <div className="container max-w-4xl px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-10">Last updated: May 7, 2026</p>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using NexHire (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including job seekers, employers, and administrators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must be at least 18 years old to create an account</li>
            <li>One person may only maintain one account per role (Seeker or Employer)</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Job Seekers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Job seekers may create profiles, upload resumes, apply for jobs, and use AI career tools. All information provided must be truthful and accurate. Misrepresentation of qualifications, experience, or identity is strictly prohibited and may result in account termination.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Employers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Employers may create company profiles, post job listings, and review applications. All job postings must be for legitimate, legal employment opportunities. Discriminatory postings, misleading job descriptions, or fraudulent listings are prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. AI Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            NexHire provides AI-powered tools including resume analysis, cover letter generation, job matching, and interview coaching. These tools are provided as assistance only and should not be considered professional career advice. AI-generated content should be reviewed and customized before use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All platform content, designs, logos, and software are owned by NexHire. Users retain ownership of their own content (resumes, profiles, cover letters). By uploading content, you grant NexHire a license to process and display it within the platform&apos;s services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Prohibited Conduct</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Scraping, harvesting, or collecting user data without authorization</li>
            <li>Attempting to circumvent security measures or rate limits</li>
            <li>Posting spam, malware, or malicious content</li>
            <li>Impersonating another person or organization</li>
            <li>Using the platform for any illegal purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            NexHire is provided &quot;as is&quot; without warranties of any kind. We do not guarantee job placement, interview success, or the accuracy of AI-generated content. We are not liable for any decisions made based on information provided through our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these Terms of Service from time to time. Users will be notified of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@nexhire.com" className="text-primary hover:underline">legal@nexhire.com</a>{' '}
            or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
