import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="January 17, 2025">
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to JobEZ. These Terms of Service ("Terms") govern your access
            to and use of JobEZ's services, including our website, mobile
            applications, and related services (collectively, the "Services").
          </p>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using our Services, you agree to be bound by these
            Terms. If you do not agree to these Terms, please do not use our
            Services.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Eligibility
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            To use JobEZ, you must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be at least 16 years of age</li>
            <li>
              Have the legal capacity to enter into a binding agreement
            </li>
            <li>
              Not be prohibited from using our Services under applicable laws
            </li>
            <li>
              Provide accurate and complete information during registration
            </li>
          </ul>
        </section>

        {/* Account Registration */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Registration and Security
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1. Creating an Account
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>
              You may create a Candidate account or a Company/Employer account
            </li>
            <li>
              You are responsible for maintaining accurate account information
            </li>
            <li>One person or entity may only maintain one account</li>
            <li>
              You must not create an account on behalf of someone else without
              permission
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            2. Account Security
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You are responsible for safeguarding your password</li>
            <li>
              You must notify us immediately of any unauthorized access
            </li>
            <li>
              You are liable for all activities conducted through your account
            </li>
            <li>JobEZ is not liable for losses from unauthorized account use</li>
          </ul>
        </section>

        {/* User Conduct */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Conduct and Responsibilities
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Acceptable Use
          </h3>
          <p className="text-gray-700 mb-3">You agree to use our Services only for lawful purposes. You agree NOT to:</p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Post false, misleading, or fraudulent information</li>
            <li>Impersonate another person or entity</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Distribute spam, viruses, or malicious code</li>
            <li>Scrape, harvest, or collect user data without permission</li>
            <li>Use automated systems to access the Services (except as permitted)</li>
            <li>Interfere with or disrupt the Services</li>
            <li>Circumvent security measures or access restrictions</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Content Standards
          </h3>
          <p className="text-gray-700 mb-3">
            All content you post must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be accurate and not misleading</li>
            <li>Comply with applicable laws and regulations</li>
            <li>Not violate third-party rights</li>
            <li>Not contain discriminatory or offensive material</li>
            <li>Be relevant to professional networking and job seeking</li>
          </ul>
        </section>

        {/* For Job Seekers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Terms for Job Seekers
          </h2>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Profile Information:</h4>
              <p className="text-gray-700">
                You warrant that all information in your profile, resume, and applications
                is accurate and truthful. False information may result in account termination.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Job Applications:</h4>
              <p className="text-gray-700">
                When you apply for a job, your profile and application materials will be
                shared with the employer. You understand that JobEZ does not guarantee
                employment or interviews.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Profile Visibility:</h4>
              <p className="text-gray-700">
                Your profile may be visible to employers and recruiters. You can control
                visibility settings in your account preferences.
              </p>
            </div>
          </div>
        </section>

        {/* For Employers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Terms for Employers
          </h2>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Job Postings:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Job postings must be for legitimate employment opportunities</li>
                <li>You must have authority to post on behalf of the company</li>
                <li>Postings must comply with employment and anti-discrimination laws</li>
                <li>You must not post jobs for commission-only or pyramid schemes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Candidate Data:</h4>
              <p className="text-gray-700">
                You agree to use candidate information only for recruitment purposes and
                in compliance with applicable data protection laws. You must not share,
                sell, or misuse candidate data.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Equal Opportunity:</h4>
              <p className="text-gray-700">
                You must comply with all applicable employment laws and provide equal
                opportunity regardless of race, color, religion, sex, national origin,
                age, disability, or other protected characteristics.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Intellectual Property Rights
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            JobEZ's Property
          </h3>
          <p className="text-gray-700 mb-4">
            The Services, including all content, features, and functionality, are owned
            by JobEZ and protected by copyright, trademark, and other intellectual property
            laws. You may not copy, modify, distribute, or reverse engineer any part of
            our Services.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Your Content
          </h3>
          <p className="text-gray-700 mb-3">
            You retain ownership of content you post on JobEZ. However, you grant us a
            worldwide, non-exclusive, royalty-free license to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use, reproduce, and display your content to provide our Services</li>
            <li>Share your content with other users as intended by the Services</li>
            <li>Create derivative works for service improvement</li>
            <li>Use your content in marketing materials (with your consent)</li>
          </ul>
        </section>

        {/* Payment Terms */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Terms
          </h2>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Premium Services:</h4>
              <p className="text-gray-700">
                Some features require payment. Fees are charged in advance and are
                non-refundable except as required by law or stated in our refund policy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Billing:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>You authorize us to charge your payment method</li>
                <li>Price changes will be communicated in advance</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Refunds:</h4>
              <p className="text-gray-700">
                Refund requests must be submitted within 14 days of purchase.
                Contact support@jobez.com for refund inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Termination
          </h2>

          <p className="text-gray-700 mb-3">
            We may suspend or terminate your account if you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Violate these Terms</li>
            <li>Engage in fraudulent or illegal activity</li>
            <li>Create risk or legal exposure for JobEZ</li>
            <li>Fail to pay fees when due</li>
          </ul>

          <p className="text-gray-700">
            You may delete your account at any time through account settings. Upon
            termination, your right to use the Services ceases immediately.
          </p>
        </section>

        {/* Disclaimers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Disclaimers and Limitations of Liability
          </h2>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
            <p className="text-gray-800 font-semibold mb-2">IMPORTANT LEGAL NOTICE:</p>
            <p className="text-gray-700 text-sm">
              THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
              JOBEZ DOES NOT GUARANTEE EMPLOYMENT, INTERVIEWS, OR HIRING OUTCOMES.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No Warranties
          </h3>
          <p className="text-gray-700 mb-3">
            We disclaim all warranties, express or implied, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Merchantability or fitness for a particular purpose</li>
            <li>Accuracy, reliability, or completeness of content</li>
            <li>Uninterrupted or error-free service</li>
            <li>Security of data transmission</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Limitation of Liability
          </h3>
          <p className="text-gray-700">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOBEZ SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
            LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION.
          </p>
        </section>

        {/* Indemnification */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Indemnification
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify and hold harmless JobEZ, its affiliates, and their
            respective officers, directors, employees, and agents from any claims,
            liabilities, damages, and expenses (including legal fees) arising from:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
            <li>Your use of the Services</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another person or entity</li>
            <li>Content you post on the Services</li>
          </ul>
        </section>

        {/* Dispute Resolution */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dispute Resolution
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Governing Law
          </h3>
          <p className="text-gray-700 mb-4">
            These Terms shall be governed by and construed in accordance with the laws
            of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Arbitration
          </h3>
          <p className="text-gray-700">
            Any disputes arising from these Terms or the Services shall be resolved
            through binding arbitration in accordance with the rules of [Arbitration Body].
            You waive your right to a jury trial or to participate in a class action.
          </p>
        </section>

        {/* Miscellaneous */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Miscellaneous
          </h2>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">Changes to Terms:</h4>
              <p className="text-gray-700">
                We may modify these Terms at any time. Material changes will be
                notified via email or platform notice. Continued use constitutes
                acceptance of revised Terms.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Severability:</h4>
              <p className="text-gray-700">
                If any provision is found unenforceable, the remaining provisions
                will remain in full force and effect.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Entire Agreement:</h4>
              <p className="text-gray-700">
                These Terms constitute the entire agreement between you and JobEZ
                regarding use of the Services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Assignment:</h4>
              <p className="text-gray-700">
                You may not assign these Terms without our consent. We may assign
                our rights and obligations without restriction.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you have questions about these Terms, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> legal@jobez.com
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> JobEZ, Inc., [Your Address]
            </p>
            <p className="text-gray-700">
              <strong>Support:</strong> support@jobez.com
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
