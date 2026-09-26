import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Promoga',
  description:
    "Promoga Privacy Policy - Learn about how Promoga Technologies Inc. collects, uses and discloses information about our users.",
  openGraph: {
    title: 'Promoga Privacy Policy',
    description:
      'Promoga Privacy Policy - Effective Date: June 22, 2026. Learn about how Promoga Technologies Inc. collects, uses and discloses information about our users.',
    type: 'website',
    siteName: 'Promoga',
  },
  twitter: {
    card: 'summary',
    site: '@Promoga',
    creator: '@Promoga',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-teal to-teal-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/80 text-lg">Effective Date: June 22, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <article className="max-w-3xl mx-auto">

            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              This Privacy Policy applies to the Promoga online services and website located at promoga.com, including subdomains, (the “Service”) and details information that Promoga Technologies Inc. (“Promoga”) collects, uses and discloses about our users, including you.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              We collect and use your information internally and may disclose your information to third parties outside of Promoga in certain situations described in the Privacy Policy.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-10">
              The Privacy Policy addresses two kinds of information: (1) Personal Information; and (2) Anonymous Information. Personal Information identifies you and includes, for example, your first and last name, address, email address and other information that alone, or combined, identifies you. Anonymous Information does not identify you and may be combined with Anonymous Information about other users.
            </p>

            {/* Section 1 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">1. What Information We Collect</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">We collect Personal Information as follows:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>If you register an account for the Service using your email address, we collect your first and last name and email address.</li>
              <li>If you register an account for the Service using your Google or Facebook account, we collect your first and last name, profile picture, and other basic profile information you authorize that service to share with us. For Google sign-in specifically, see Section 7 below.</li>
              <li>We collect account profile information that you voluntarily enter or consent to the collection of including any image you upload, your city and/or locality derived from geolocation data (but not a specific address), your description, phone number and your professional certifications and qualifications.</li>
              <li>If you list an activity space on the Service, we collect your first and last name, email address, phone number and the address of the listed space.</li>
              <li>We collect your email address to facilitate the exchange of private messages you send to other users through the messaging functionality contained within the Service.</li>
              <li>We collect the content of private messages sent to other users through the Service for such reasons as preventing abuse of the Service.</li>
              <li>If you connect a third-party service, such as Google, Facebook, or Stripe, to your account, we collect the information you authorize that service to share with us.</li>
              <li>If you sign up for an email list, we collect your first and last name and email address.</li>
              <li>If you contact us for technical support, participate in surveys, or otherwise communicate with us, we collect records concerning such communications and that may contain Personal Information you provide about yourself.</li>
            </ul>

            <p className="text-neutral-dark/85 leading-relaxed mb-4">We collect Anonymous Information as follows:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>We collect all Anonymous Information concerning how you use the Service, such as metrics and other types of statistical data. For example, we collect anonymous statistics concerning demographic information, user behavior, geographical location and technology used to access the Service.</li>
              <li>We collect Service diagnostic information including logs, error reports and events and the type, number, date and page relating to this information.</li>
            </ul>

            {/* Section 2 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">We use Personal and Anonymous Information internally to provide the Service to you, to understand our user needs and to provide you with better service and information, in particular:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>To host, display, transmit and validate information you provide to us through the Service in order to facilitate Service features.</li>
              <li>We use your email address to contact you in connection with your activities on the Service including, for example, verifying your email address, delivering fitness activity passes or other content you purchased through the Service, confirming any activity or space you list on the Service, to transmit and deliver messages sent to you by Service users and, if you previously consented, to contact you with marketing or promotional emails.</li>
              <li>To improve or expand our content and offerings, including research into user demographics and behavior or to resolve technical issues.</li>
              <li>To establish and maintain Service subscriptions and account(s).</li>
            </ul>

            {/* Section 3 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">3. Third Parties We Disclose Information To</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">We disclose Personal and Anonymous Information to third parties, who may be located in a foreign jurisdiction and subject to foreign laws, as follows.</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>Information you include in your account profile is public information and can be viewed by third parties, such as other users, who access the Service. Please only disclose information in your profile and in private messages on the Service you are comfortable with third parties viewing.</li>
              <li>We disclose your transaction information relating to purchases made through the Service to third parties for payment processing and fraud prevention purposes.</li>
              <li>When you connect with or share information on a third party service, such service may collect Personal and/or Anonymous Information. Additionally, third parties may collect Anonymous Information from cookies and other tracking technologies placed on the Service. Please refer to sections 5 and 6 below for more information concerning third party information practices.</li>
              <li>Promoga may disclose your information to our parent companies, affiliates, subsidiaries, service providers or contractors for internal purposes. Although your information is stored in Canada, some of our personnel and contractors who may access it are located outside Canada (see Section 9, Data Storage Location and Cross-Border Access).</li>
              <li>To respond to inquiries from law enforcement or to defend our rights or the rights of others.</li>
            </ul>

            {/* Section 4 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">4. Children</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service is not directed to children under the age of 13 and we do not knowingly collect personal information from children under the age of 13. If we learn that we inadvertently collected Personal Information from a child under the age of 13, we will delete that information as quickly as possible. If you are a parent or guardian of a child who you believe provided Promoga with Personal Information without your consent, please contact Promoga at privacy@promoga.com or the address listed below.
            </p>

            {/* Section 5 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              The Service uses cookies, web beacons and similar tracking technologies to collect Anonymous Information concerning your behavior on the Service. Additionally, third party software or services may register, alter or change cookies, or modify local storage on the Service to collect Anonymous Information. A cookie is a small file placed on your computer and acts as a unique identifier. A cookie does not allow access to your computer or any information about you other than Anonymous Information and the data you choose to share. By declining to accept cookies or by disabling JavaScript you will not have access to certain Service features.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service does not respond to web browser “Do Not Track” signals.
            </p>

            {/* Section 6 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">6. Third Party Software and Services</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service may involve third party software or services, the use of which may disclose your Personal or Anonymous Information to third parties. Additionally, third party software and services may collect Personal Information about your online activities over time and across different websites. For example, logging into the Service through a third party service may result in that third party collecting Personal and/or Anonymous Information about you. The Privacy Policy only applies to information that Promoga collects, uses or discloses and does not apply to the collection, use or disclosure of information by third parties through third party software or services. Use of third party software or services may require you to accept a third party’s agreement. It is your sole responsibility to refer to such third party’s privacy policy and other agreements and to determine whether they are acceptable to you.
            </p>

            {/* Section 7 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">7. Google OAuth &amp; Google User Data</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              If you choose to sign in with Google or connect Google Calendar to your Promoga account, Promoga accesses only the Google user data that you authorize during the Google OAuth consent flow. Depending on the features you enable, this may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li><strong>Google account profile data</strong> — your name, email address, and profile picture, used to create, authenticate, and maintain your Promoga account.</li>
              <li><strong>Google Calendar data</strong> — calendar availability (free/busy) information and, where required for the scheduling feature you enable, calendar event information, used only to sync your schedule, prevent double-bookings, create or update bookings you request, and display your availability within Promoga.</li>
            </ul>

            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              <strong>How we use Google user data.</strong> Promoga uses Google user data only to provide, maintain, secure, and improve the Google-connected scheduling and account features that are visible in the Service. We do not use Google user data for advertising, retargeting, market research unrelated to the feature you enabled, profiling, lending or credit decisions, or any purpose unrelated to the Google-connected functionality.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              <strong>How we store and delete Google user data.</strong> Promoga stores Google user data only as needed to provide the connected feature, maintain account integrity, troubleshoot errors, comply with legal obligations, and enforce our rights. You may disconnect Google Calendar or revoke Promoga’s access at any time through your{' '}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal/80 underline">Google Account permissions</a>{' '}
              or your Promoga account settings, after which Promoga will stop collecting new Google user data and will delete or de-identify stored Google user data within a commercially reasonable period, unless retention is required for security, legal compliance, dispute resolution, or backup integrity.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              <strong>With whom we share, transfer, or disclose Google user data.</strong> Promoga shares, transfers, or discloses Google user data only in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li><strong>To service providers, contractors, and subprocessors</strong> that process data for Promoga under confidentiality and data-processing obligations — such as cloud hosting, database, infrastructure, logging, monitoring, security, and customer-support providers — solely as necessary to operate, secure, and support the Service.</li>
              <li><strong>To Google’s APIs</strong>, at your direction, when Promoga reads your availability or creates, updates, or syncs calendar entries as part of the Google Calendar feature you enabled.</li>
              <li><strong>To Promoga clients or other users</strong>, only as part of the user-facing scheduling feature you enable, and only to display availability or booking status that you choose to make available through the Service. Promoga does not disclose private Google Calendar event titles, descriptions, attendees, locations, or notes to other users unless you expressly choose to share that information.</li>
              <li><strong>For security or abuse prevention</strong>, when necessary to investigate bugs, security incidents, abuse, or violations of our terms.</li>
              <li><strong>For legal compliance</strong>, when required by applicable law, regulation, legal process, or enforceable governmental request.</li>
              <li><strong>In a merger, acquisition, financing, reorganization, or sale of assets</strong>, only as permitted by Google’s Limited Use requirements and applicable law, and, where required, after obtaining your explicit prior consent.</li>
            </ul>

            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              Promoga does not sell, rent, or otherwise transfer Google user data to advertising platforms, data brokers, information resellers, or other third parties for advertising, retargeting, personalized advertising, unrelated market research, or credit/lending purposes.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              Promoga does not allow humans to read Google user data except: where you ask us to do so (for example, for support); where it is necessary for security or to investigate abuse; where required by law; or where the data has been aggregated and de-identified for internal operations in accordance with applicable law.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga’s use and transfer of information received from Google APIs will adhere to the{' '}
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal/80 underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>

            {/* Section 8 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">8. Information Storage and Retention</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Your Personal Information held by Promoga is retained until you request its deletion pursuant to section 13 or until Promoga no longer requires such information for the purpose for which it was collected. We may retain certain information where necessary to comply with legal, accounting, tax, fraud-prevention, or dispute-resolution obligations, and copies may persist in routine backups for a limited period before being overwritten.
            </p>

            {/* Section 9 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">9. Data Storage Location and Cross-Border Access</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga is based in Vancouver, British Columbia, Canada, and your Personal Information is stored on servers and infrastructure located in Canada. However, to operate, support, and maintain the Service, certain of our personnel, contractors, and service providers located outside Canada may access your Personal Information. When your information is accessed from outside Canada, it may be subject to the laws of the jurisdiction from which it is accessed, including lawful access requests by courts, law enforcement, or government authorities in those jurisdictions. Where Personal Information is accessed from outside Canada, Promoga uses contractual and other measures intended to provide a comparable level of protection to that required under applicable Canadian law.
            </p>

            {/* Section 10 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">10. Change of Ownership or Business Transition</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              In the event of, or in preparation for, a change of ownership or control of Promoga, or a business transition such as the sale of Promoga assets, we may disclose your Personal and Anonymous Information to third parties who will have the right to continue to collect and use such information in the manner set forth in this Privacy Policy. Any transfer of Google user data in connection with such a transition will comply with Google’s Limited Use requirements.
            </p>

            {/* Section 11 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">11. Security</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online. The Service uses industry standard SSL (secure socket layer) encryption to transfer information internally and between the Service and third parties and stores information using RSA encryption, a SHA-256 hash and a 2048 bit public key.
            </p>

            {/* Section 12 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">12. Updates</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga reserves the right, at its sole discretion, to change or add or remove portions of the Privacy Policy at any time (“Updates”). Promoga shall notify you of Updates by email, if you provided an email address, and to make them available at promoga.com. You are deemed to accept any Update by continuing to use the Service. Unless Promoga states otherwise, Updates are automatically effective 30 days after posting on promoga.com.
            </p>

            {/* Section 13 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">13. Your Rights</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              You may contact Promoga to obtain a copy of any Personal Information we have collected about you, the production of which may be subject to a fee as permitted by applicable law. In addition, you may contact Promoga to correct or delete such information, unless retention is necessary for our legitimate business purposes, required by applicable law, in the control of a third party or where correction or deletion is not technically feasible. For Google user data specifically, you may revoke Promoga’s access at any time through your{' '}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal/80 underline">Google Account permissions</a>.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              If you have a concern about how we handle your Personal Information that we are unable to resolve, you may contact the Office of the Privacy Commissioner of Canada.
            </p>

            {/* Section 14 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">14. Marketing Communications</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              We send commercial electronic messages, such as marketing or promotional emails, only where you have consented to receive them. Every commercial electronic message we send identifies Promoga and includes a working unsubscribe mechanism. You may withdraw your consent and opt out of marketing communications at any time by using the unsubscribe link in any such message or by contacting us at privacy@promoga.com; we will give effect to your request promptly and, in any event, within the period required by applicable law.
            </p>

            {/* Section 15 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">15. Contact Us</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              If you have questions or comments about the Privacy Policy or Promoga’s data collection in general, or wish to reach our Privacy Officer, please contact us at privacy@promoga.com or:
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga Technologies Inc.<br />
              1771 Robson Street-1463<br />
              Vancouver, BC V6G 1C9
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              All Personal Information included in questions or comments about the Privacy Policy or Promoga’s data collection in general, provided via email, mail or telephone, will be kept confidential.
            </p>

            <p className="text-neutral-dark/60 italic text-sm mt-12 pt-8 border-t border-neutral-dark/10">
              Last updated: June 22, 2026
            </p>

          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
