import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="January 17, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At JobEZ, we respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you
            visit our platform and tell you about your privacy rights and how the law protects you.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This policy applies to all users of JobEZ, including job seekers, employers, and visitors
            to our website and mobile applications.
          </p>
        </section>

        {/* Data We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Information You Provide</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
            <li><strong>Profile Information:</strong> Work experience, education, skills, resume/CV, professional summary</li>
            <li><strong>Company Information:</strong> Company name, industry, size, location, job postings</li>
            <li><strong>Communications:</strong> Messages sent through our platform, support requests</li>
            <li><strong>Payment Information:</strong> Billing details for premium services (processed securely by third-party payment processors)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect Automatically</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on platform</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Location Data:</strong> Approximate location based on IP address</li>
            <li><strong>Cookies and Similar Technologies:</strong> See our Cookie Policy for details</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Information from Third Parties</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Social media profiles (if you connect your account)</li>
            <li>Background check providers (with your consent)</li>
            <li>Publicly available sources</li>
          </ul>
        </section>

        {/* How We Use Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-3">We use your personal data for the following purposes:</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">For Job Seekers:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Match you with relevant job opportunities using AI algorithms</li>
                <li>Allow employers to find and contact you</li>
                <li>Track your job applications and provide status updates</li>
                <li>Send personalized job recommendations</li>
                <li>Improve your profile visibility to recruiters</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">For Employers:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Post and manage job listings</li>
                <li>Match candidates with your job openings</li>
                <li>Manage applications and communications with candidates</li>
                <li>Provide hiring analytics and insights</li>
                <li>Process payments for premium services</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">For All Users:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Communicate with you about our services</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sharing Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Share Your Information</h2>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800">With Other Users:</h4>
              <p className="text-gray-700">
                Your profile information is visible to employers when you apply for jobs or when
                they search for candidates. Employers' company information is visible to job seekers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">With Service Providers:</h4>
              <p className="text-gray-700">
                We share data with trusted third-party service providers who help us operate our
                platform (e.g., hosting, analytics, payment processing, email delivery).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">For Legal Reasons:</h4>
              <p className="text-gray-700">
                We may disclose your information if required by law, legal process, or to protect
                the rights, property, or safety of JobEZ, our users, or others.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Business Transfers:</h4>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your information may be
                transferred to the acquiring entity.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and audits</li>
            <li>Strict access controls and authentication</li>
            <li>Employee training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
          <p className="text-gray-700 mb-3">Depending on your location, you may have the following rights:</p>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> Object to certain processing of your data</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>

          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us at{" "}
            <a href="mailto:privacy@jobez.com" className="text-[#34A1CD] hover:underline">
              privacy@jobez.com
            </a>
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal data for as long as necessary to provide our services and for
            legitimate business purposes, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
            <li>Active accounts: Data retained while your account is active</li>
            <li>Deleted accounts: Some data retained for up to 90 days for recovery purposes</li>
            <li>Legal requirements: Data retained as required by applicable laws</li>
            <li>Dispute resolution: Data retained to resolve disputes or enforce agreements</li>
          </ul>
        </section>

        {/* International Transfers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place to protect your data in accordance with
            this privacy policy and applicable data protection laws.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are not intended for individuals under the age of 16. We do not knowingly
            collect personal data from children. If you believe we have collected data from a child,
            please contact us immediately.
          </p>
        </section>

        {/* Changes to Policy */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of material
            changes by posting the new policy on this page and updating the "Last updated" date.
            Your continued use of our services after changes become effective constitutes acceptance
            of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you have questions or concerns about this privacy policy or our data practices,
            please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> privacy@jobez.com</p>
            <p className="text-gray-700"><strong>Address:</strong> JobEZ, Inc., [Your Address]</p>
            <p className="text-gray-700"><strong>Data Protection Officer:</strong> dpo@jobez.com</p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
