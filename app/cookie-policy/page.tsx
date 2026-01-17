import LegalLayout from "@/components/legal/LegalLayout";

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="January 17, 2025">
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Are Cookies?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cookies are small text files that are placed on your device when you
            visit a website. They are widely used to make websites work more
            efficiently and provide information to website owners.
          </p>
          <p className="text-gray-700 leading-relaxed">
            JobEZ uses cookies and similar tracking technologies to enhance your
            experience, analyze usage, and deliver personalized content.
          </p>
        </section>

        {/* Types of Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Types of Cookies We Use
          </h2>

          <div className="space-y-6">
            {/* Essential Cookies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                1. Essential Cookies
              </h3>
              <p className="text-gray-700 mb-3">
                These cookies are necessary for the website to function properly.
                They enable core functionality such as security, authentication,
                and session management.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Session cookies for authentication</li>
                  <li>Security cookies to prevent fraud</li>
                  <li>Load balancing cookies</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Duration:</strong> Session or up to 1 year
                </p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2. Analytics and Performance Cookies
              </h3>
              <p className="text-gray-700 mb-3">
                These cookies help us understand how visitors interact with our
                website by collecting and reporting information anonymously.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Google Analytics cookies</li>
                  <li>Page view tracking</li>
                  <li>Feature usage analytics</li>
                  <li>Error tracking</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Duration:</strong> Up to 2 years
                </p>
              </div>
            </div>

            {/* Functionality Cookies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3. Functionality Cookies
              </h3>
              <p className="text-gray-700 mb-3">
                These cookies enable enhanced functionality and personalization,
                such as remembering your preferences and settings.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Language preferences</li>
                  <li>Display settings</li>
                  <li>Recently viewed jobs</li>
                  <li>Saved search filters</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Duration:</strong> Up to 1 year
                </p>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                4. Marketing and Advertising Cookies
              </h3>
              <p className="text-gray-700 mb-3">
                These cookies are used to deliver relevant advertisements and
                track ad campaign performance. They may be set by third-party
                advertising partners.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Facebook Pixel</li>
                  <li>Google Ads conversion tracking</li>
                  <li>LinkedIn Insights Tag</li>
                  <li>Retargeting cookies</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Duration:</strong> Up to 2 years
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Third-Party Cookies and Services
          </h2>
          <p className="text-gray-700 mb-4">
            We use various third-party services that may set cookies on your
            device. These services include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Google Analytics
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Analyzes website traffic and user behavior
              </p>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#34A1CD] hover:underline"
              >
                Google Privacy Policy →
              </a>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Facebook/Meta
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Social login and advertising
              </p>
              <a
                href="https://www.facebook.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#34A1CD] hover:underline"
              >
                Facebook Privacy Policy →
              </a>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">LinkedIn</h4>
              <p className="text-sm text-gray-600 mb-2">
                Social login and professional insights
              </p>
              <a
                href="https://www.linkedin.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#34A1CD] hover:underline"
              >
                LinkedIn Privacy Policy →
              </a>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Google OAuth
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Authentication and login services
              </p>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#34A1CD] hover:underline"
              >
                Google Privacy Policy →
              </a>
            </div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Managing Your Cookie Preferences
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Through Our Platform
          </h3>
          <p className="text-gray-700 mb-4">
            You can manage your cookie preferences through our Cookie Settings.
            Note that disabling certain cookies may affect website functionality.
          </p>

          <div className="bg-[#34A1CD]/10 border border-[#34A1CD]/30 p-4 rounded-lg mb-6">
            <button className="w-full sm:w-auto px-6 py-3 bg-[#34A1CD] hover:bg-[#2E92BA] text-white rounded-lg font-medium transition">
              Cookie Settings
            </button>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Through Your Browser
          </h3>
          <p className="text-gray-700 mb-3">
            Most browsers allow you to control cookies through their settings:
          </p>

          <ul className="space-y-2">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#34A1CD] hover:underline"
              >
                Chrome →
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#34A1CD] hover:underline"
              >
                Firefox →
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#34A1CD] hover:underline"
              >
                Safari →
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#34A1CD] hover:underline"
              >
                Microsoft Edge →
              </a>
            </li>
          </ul>
        </section>

        {/* Do Not Track */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Do Not Track Signals
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Some browsers include a "Do Not Track" (DNT) feature. Currently,
            there is no industry standard for how to respond to DNT signals. We
            do not currently respond to DNT signals, but you can manage cookies
            through your browser settings or our Cookie Settings.
          </p>
        </section>

        {/* Mobile Devices */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mobile Devices and App Tracking
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Our mobile applications may use similar technologies to cookies,
            including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Device identifiers (IDFA, GAID)</li>
            <li>Local storage</li>
            <li>SDKs for analytics and advertising</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            You can manage tracking preferences through your device settings:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
            <li>
              <strong>iOS:</strong> Settings &gt; Privacy &gt; Tracking
            </li>
            <li>
              <strong>Android:</strong> Settings &gt; Google &gt; Ads
            </li>
          </ul>
        </section>

        {/* Updates */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes
            in technology or legal requirements. The "Last updated" date at the
            top indicates when the policy was last revised.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Cookies?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you have questions about our use of cookies, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> privacy@jobez.com
            </p>
            <p className="text-gray-700">
              <strong>Data Protection Officer:</strong> dpo@jobez.com
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
