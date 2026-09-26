import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Terms of Use | Promoga',
  description:
    "Promoga Terms of Use - Read the terms and conditions governing your use of Promoga Technologies Inc.'s online services and website.",
  openGraph: {
    title: 'Promoga Terms of Use',
    description:
      "Promoga Terms of Use - Read the terms and conditions governing your use of Promoga Technologies Inc.'s online services and website.",
    type: 'website',
    siteName: 'Promoga',
  },
  twitter: {
    card: 'summary',
    site: '@Promoga',
    creator: '@Promoga',
  },
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-teal to-teal-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Use
            </h1>
            <p className="text-white/80 text-lg">Welcome to Promoga!</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <article className="max-w-3xl mx-auto">

            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga consists of online services and a website located at www.promoga.com, including subdomains, (the <strong>“Service”</strong>) that are provided to you by Promoga Technologies Inc. (<strong>“Promoga”</strong>).
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Use of the Service is governed by these Terms of Use and a Privacy Policy detailing how Promoga collects, uses and discloses your information. You must agree to the Terms of Use and Privacy Policy in order to use the Service.
            </p>

            <p className="text-neutral-dark/85 leading-relaxed mb-10">
              <strong>By clicking “I agree” or by using the Service, you agree to be bound by the Terms of Use and Privacy Policy.</strong> If you are using the Service on behalf of an organization, you represent that you have authority to bind the organization to the Terms of Use and Privacy Policy and are agreeing on behalf of that organization. Where you are using the Service on behalf of an organization, “you” refers to that organization.
            </p>

            {/* Section 1 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">1. Updates</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga reserves the right, at its sole discretion, to change or add or remove portions of the Terms of Use or Privacy Policy at any time (<strong>“Updates”</strong>). Promoga shall notify you of Updates by email, if you provided an email address, and to make them available at www.promoga.com. Unless Promoga states otherwise, Updates are automatically effective 30 days after posting on www.promoga.com.
            </p>

            {/* Section 2 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">2. Using the Service</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service may require hardware including, without limitation, a computer or mobile device and an Internet connection. You agree to provide all hardware and the Internet connection required to use the Service and to pay all fees incurred by you when accessing the Service through an Internet connection.
            </p>

            {/* Section 3 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">3. Service Subscription</h2>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">3.1 Service Subscription</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service is an online portal that connects fitness consumers, providers and facilities. You must be of the age of majority in your jurisdiction in order to use the Service. Except as otherwise provided in the Terms of Use, Promoga grants you a revocable, non-exclusive, non-transferrable subscription to use the Service as permitted herein (the <strong>“Subscription”</strong>). You acknowledge and agree that no title or ownership interest in the Service or Subscription is transferred or assigned to you and that the Terms of Use is not a sale of any right to the Service or Subscription.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">3.2 Accounts</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Subscription may require you to register an Account to access, or use certain features of, the Service. Creating an Account requires you to select a user name and password (<strong>“Login Information”</strong>). You are solely responsible for keeping Login Information confidential and agree to be bound by any use of your Login Information, including purchases, whether or not you authorized such use. If you become aware of, or reasonably suspect, an unauthorized use of your Subscription or Account, you must immediately change the password that is part of your Login Information. Any questions concerning unauthorized use may be emailed to Promoga at info@promoga.com.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">3.3 Information Collection</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Registering or using a Subscription or Account(s) requires you to provide Promoga with personal information that is collected and used in accordance with Promoga’s Privacy Policy. You agree to provide accurate and complete personal information to Promoga and to update your information if it changes. The Privacy Policy is available at www.promoga.com/privacy-policy.
            </p>

            {/* Section 4 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">4. Fitness Pass Terms</h2>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">4.1 Fitness Pass General Terms</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              The Service allows you to purchase fitness activity passes (each, a <strong>“Fitness Pass”</strong>) from fitness providers through the Service (each, a <strong>“Fitness Provider”</strong>). You may only use a Fitness Pass for the number of activity sessions, with the particular Fitness Provider for which it was purchased, until the expiration date set by the Fitness Provider, and thereafter the pass expires. Notwithstanding the foregoing, each Fitness Pass expires upon the earliest of:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>(a) your failure to agree to or pay any Additional Fees or Additional Terms (as each is defined below);</li>
              <li>(b) a Fitness Provider ceasing to operate in such capacity; or</li>
              <li>(c) termination of your Subscription or a Fitness Provider’s Subscription by Promoga.</li>
            </ul>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              You are not entitled to a refund of any kind upon expiration of a Fitness Pass. A Fitness Pass may be transferred or gifted to a third party and who is required to create an Account on the Service in order to access and use such Fitness Pass.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">4.2 Fitness Pass Purchase Information</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              If you wish to purchase a Fitness Pass, you may be asked to provide certain information relevant to your purchase including, without limitation, your first and last name, credit card information, billing address and an email address (<strong>“Payment Information”</strong>). By purchasing a Fitness Pass you acknowledge and agree that Promoga may provide Payment Information to third parties for processing purposes and that such third parties may collect, use and disclose your Payment Information pursuant to such third parties’ privacy terms. It is your obligation to review and determine the acceptability of such third party privacy and other service terms.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">4.3 Fitness Pass Cancellation</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              You may cancel any Fitness Pass you purchase up to 48 hours after purchase or up to 48 hours prior to the first Fitness Pass activity commencing, whichever occurs first, through the cancellation feature located within your Account on the Service (the <strong>“Cancellation Period”</strong>). Notwithstanding the foregoing, if your Fitness Pass was free, you may cancel up to 24 hours prior to the related activity commencing. Following the Cancellation Period, you are not entitled to a refund of any kind.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">4.4 Additional Fees and Terms</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              Fitness Providers may impose additional fees including, without limitation, for the use of certain amenities, activities or equipment (<strong>“Additional Fees”</strong>). Your Fitness Pass excludes Additional Fees, which are your sole responsibility to pay.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Additionally, Fitness Providers may require you to sign a liability waiver or similar document or agree to additional terms governing your Fitness Pass, participation in a fitness activity or use of a fitness facility (<strong>“Additional Terms”</strong>). All Additional Fees and Additional Terms shall be presented to you prior to purchasing a Fitness Pass. It is up to you to review and determine the acceptability of any Additional Terms that a Fitness Provider requires you to agree to.
            </p>

            {/* Section 5 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">5. Fitness Provider Terms</h2>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">5.1 General Terms</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              By offering Fitness Passes through the Service as a Fitness Provider, you shall honor any Fitness Passes presented to you in digital form and confirmed valid by Promoga so long as the Fitness Pass holder pays any Additional Fees and complies with any Additional Terms. Where you desire to impose Additional Fees and/or Additional Terms on prospective Fitness Pass customers, you shall post such Additional Fees and Additional Terms on the applicable Promoga fitness activity page within the Service.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              If you cease to operate as a Fitness Provider you must immediately terminate your Account and Subscription pursuant to section 8 below and notify Promoga of your termination by contacting yogi@promoga.com.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">5.2 Fitness Provider Information</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              As a Fitness Provider, you agree to accurately describe the fitness activities you offer including, but not limited to, the type, duration, content, facilities and location of such fitness activities and shall update any information promptly upon any change occurring. Additionally, your represent and warrant that any information you provide about yourself as a Fitness Provider including, but not limited to, personal information, qualifications and certifications and insurance coverage is accurate and agree to update any information promptly upon any change occurring. Any personal information you provide is collected, used and disclosed consistent with the Privacy Policy.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">5.3 Service Fee and Commission</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              Promoga charges Fitness Providers a fee to offer Fitness Passes through the Service (<strong>“Service Fee”</strong>) and which is calculated based upon the pre-discounted price of a Fitness Pass. By offering Fitness Passes for purchase through the Service, you acknowledge and agree that Promoga, and third parties retained by Promoga, shall on your behalf charge such prices as set by you for Fitness Passes, apply coupons created by you to such prices, deduct the Service Fee and apply any applicable tax to such Service Fee (<strong>“Proceeds”</strong>). Proceeds are remitted by a third party and are remitted minus returns, chargebacks, taxes, duties, and other charges on such terms as set by Promoga and such third party. In order to receive Proceeds, you must create an account and agree to the terms set by such third party and it is your sole responsible to review and determine the acceptability of such third party terms. You acknowledge and agree that you have no right to, and shall not request, an audit or otherwise review or challenge any calculation or remittance of Proceeds.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The current Subscription Fee is set out, and agreed to you, at the time and on the page where you create a fitness activity within the Service.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">5.4 Fitness Provider Taxation</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              It is the Fitness Provider’s sole responsibility to calculate, collect and remit any applicable taxes relating to Fitness Passes or any other products or services it sells through the Service. As a Fitness Provider, you shall indemnify, defend and hold Promoga harmless from any liability for, or assessment of, any claims or penalties with respect to such taxes, including any liability for, or assessment of, withholding taxes imposed on Promoga by the relevant taxing authorities with respect to any Proceeds paid to you.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">5.5 Fitness Provider Waiver</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              Fitness Provider shall be responsible for providing a medical consent and waiver of liability form (the <strong>“Waiver”</strong>) to each Service user prior to providing fitness activities. Fitness Provider understands and agrees that Promoga is not responsible for the Waiver and Promoga shall not be liable for any and all claims, losses or damages relating to the Waiver or Fitness Provider’s failure to provide such Waiver. Fitness Provider shall be responsible and liable for any and all claims, losses or damages if the Waiver is not provided or if such Waiver does not fully protect Fitness Provider from liability.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              If the Fitness Provider provides the Waiver to Service users, Service users are responsible for reviewing the Waiver prior to engaging in fitness activities. Promoga is not responsible for Service users’ failure to review the Waiver and Promoga shall not be liable for any and all claims, losses or damages relating to the Waiver.
            </p>

            {/* Section 6 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">6. Fitness Facility Terms</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service permits owners of facilities suitable for fitness activities to advertise their facilities for use by Fitness Providers. By listing a fitness facility on the Service, you represent and warrant that you have all rights and licenses required to rent the facility to Fitness Providers, that the facility is safe, secure and fit for the particular fitness purpose and that the email and phone number you provide in the listing are correct. Promoga’s facility listing service is for informational purposes only and Promoga does not review listings or otherwise facilitate transactions between Fitness Providers and facilities.
            </p>

            {/* Section 7 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">7. Service Features</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service features available to you vary depending upon your Subscription and Account type and are subject to change at any time, on one or more occasions, at Promoga’s sole discretion without notice and without any compensation or refund to you.
            </p>

            {/* Section 8 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">8. Termination</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              A Fitness Provider may terminate a Subscription by notifying Promoga of its intention to terminate, such termination being effective the earliest of the:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>(a) expiration of all outstanding Fitness Passes sold on the Fitness Provider’s behalf by Promoga;</li>
              <li>(b) use of all outstanding Fitness Passes sold on the Fitness Provider’s behalf by Promoga; or</li>
              <li>(c) the date the Fitness Provider ceases to operate in such capacity.</li>
            </ul>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              All other users may terminate a Subscription by ceasing to use the Service.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              Promoga, in its sole discretion, may terminate any Account and related Subscription at any time without notice or reason and, at such time, all Account information may be discarded and all Fitness Passes rendered invalid. Any suspected conduct in violation of these Terms of Use may be grounds for termination.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Upon termination of your Subscription, or the Subscription of a Fitness Provider with respect to which you hold Fitness Passes, you are not entitled to a refund or other compensation of any kind and agree that Promoga shall not be liable to you or any third party for such termination and any related loss. Notwithstanding the foregoing, you shall pay any outstanding Service Fee, tax, duty and charge, as of the effective date of termination.
            </p>

            {/* Section 9 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">9. Code of Conduct</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              The following Code of Conduct applies to your use of the Service. You agree to not, and not encourage others to, use the Service as follows:
            </p>
            <ul className="list-[lower-alpha] pl-6 space-y-2 text-neutral-dark/85 leading-relaxed mb-6">
              <li>to locate a Fitness Provider, fitness facilities or fitness consumers and then complete the transaction offline in order to circumvent your obligation to pay for the Service;</li>
              <li>communicate with Service users directly or indirectly by way of, or provide contact information to Service users in the form of, an email address, website URL, phone number or online video, voice or message chat, unless expressly permitted by Promoga;</li>
              <li>if you are a Fitness Provider, refusing to honor a valid Fitness Pass or misrepresenting your facilities or services;</li>
              <li>engage in abusive, defamatory, libelous, threatening or any other conduct that is objectionable or offensive;</li>
              <li>communicate, link to, post, submit or upload content that contains nudity or other sexual material, violence or any other objectionable or offensive conduct;</li>
              <li>abuse, bully or harass users of the Service or encourage others to do the same;</li>
              <li>infringe or violate the rights of any third party including, without limitation: (i) contractual rights; (ii) copyright, patent, trademark or trade secret rights; (iii) privacy rights; (iv) publicity rights; or (v) the terms of any confidentiality agreement;</li>
              <li>attempt to gain, or gain, unauthorized access to the Service, including, without limitation, through the use of another user’s Account or through any method not approved by Promoga;</li>
              <li>collect other user’s personal information or any other online contact information, or solicit from users the same;</li>
              <li>advertise or offer for sale products or services regardless of whether or not for profit, except as provided for in the Terms of Service;</li>
              <li>use the Service to transmit any data that contains, or redirects to, any virus or other harmful data;</li>
              <li>encumber, sell or license the Service, including, without limitation, a Subscription or Account, in any way;</li>
              <li>copy, damage, decompile, disassemble, impair, modify or reverse engineer the Service or otherwise attempt to derive its source code or meta data files, except as permitted by applicable law; or</li>
              <li>encourage or engage in illegal activities.</li>
            </ul>

            {/* Section 10 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">10. Third Party Software and Services</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service incorporates software and services provided or licensed to Promoga by third parties (<strong>“Third Party Technology”</strong>). The Terms of Use do not grant you any license, right, title or other interest in Third Party Technology. Use of Third Party Technology may require you to enter into agreements between you and a third party. You shall review and determine the acceptability of any Third Party Technology agreement. Promoga makes no representations or warranties regarding Third Party Technology. You agree that Promoga will not be liable for any claim, loss or damage relating to Third Party Technology.
            </p>

            {/* Section 11 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">11. Ownership</h2>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">11.1 Promoga’s Ownership Rights</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga retains all right, title and interest in the Service including, without limitation, all copyrights, patents, trademarks, trade secrets, industrial designs, utility models and any other rights recognized pursuant to the laws of any country or jurisdiction, whether or not protected by law. Promoga hereby retains all rights not expressly granted in the Terms of Use.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">11.2 Ownership of User Content</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-4">
              User content includes any data or content that you or other users create, enter, submit, upload or transfer using the Service or in conjunction with Third Party Technology (<strong>“User Content”</strong>). By providing User Content you represent and warrant that you have all consents, licenses and rights necessary to provide and license the User Content and you hereby grant Promoga an irrevocable, fully-paid, royalty-free, non-exclusive, perpetual, worldwide license to User Content under all copyright, trademark, trade secret, patent, privacy and publicity rights and any other intellectual or industrial property rights you own or control to use, broadcast, disclose, display, distribute, modify, make derivative works of, publicly perform, publish, record, reproduce, sublicense (on multiple levels), translate, transmit or otherwise exploit for all purposes and in all formats and mediums now known or hereafter developed and for all purposes without attribution, notice, permission or payment to you or any third party.
            </p>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              For clarity, “User Content” does not include Google user data obtained through Google OAuth or Google APIs, Payment Information, or other personal information, except to the extent you intentionally include such information in content that you choose to make public through the Service. Notwithstanding anything in this Section 11.2, Promoga uses Google user data, Payment Information, personal information, and data obtained through third-party OAuth integrations only as described in the Privacy Policy and applicable third-party platform policies, including, for Google user data, the{' '}
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal/80 underline">Google API Services User Data Policy</a>{' '}
              and its Limited Use requirements. The license granted in this Section 11.2 does not apply to such data.
            </p>

            {/* Section 12 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">12. Disclaimer</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Service is provided “as is” and Promoga disclaims any and all warranties, express or implied, including without limitation any implied warranties of merchantability, fitness for a particular purpose or non-infringement of third party rights, to the extent authorized by law. Without limiting the foregoing, Promoga makes no representations that use of the Service will not infringe any copyright, patent, trademark or other rights held by a third party. Further and without limiting the foregoing, Promoga makes no representations or warranties that the Service will meet your requirements, is appropriate for your needs or that operation will be uninterrupted, continuously available, error free or will not harm your computer or mobile device. No oral or written advice or information provided by Promoga, its directors, officers, employees, agents, contractors or partners, shall create any warranty or condition not expressly stated in this agreement. Please note that some jurisdictions do not allow the disclaimer of implied contract terms and, as a result, this section 12 may not apply to you in its entirety.
            </p>

            {/* Section 13 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">13. Limitation of Liability, Indemnity</h2>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">13.1 Limitation of Liability and Indemnification of Promoga</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Fitness providers and facilities are third parties and Promoga is not an agent or otherwise connected with fitness providers or facilities other than by providing a service that connects fitness consumers, providers and facilities. You agree that Promoga shall not be liable to you for any loss or damage of any kind arising out of or relating to the terms of use or use of the service, third party technology or facilities, amenities, equipment, products, waivers or services provided by fitness providers or other third parties and including, without limitation, special, indirect, consequential, incidental, punitive or exemplary damages, loss of data, loss of content, loss of profits, loss of any contract, loss of goodwill and any and all other damages or losses, even if Promoga has been advised of the possibility of such loss or damage. You agree to indemnify, defend and hold Promoga, its directors, officers, employees, agents, contractors and partners, harmless from and against any claim, liability, injury, damage, cost, loss or expense that arises from your, or any third party’s, use of the service or facilities, amenities, equipment, products, waivers or services provided by fitness providers or other third parties. This limitation applies to any cause of action or claims in the aggregate, whether in an equitable, legal or common law action arising hereunder and including, without limitation, breach of contract, breach of warranty or indemnity, misrepresentation, negligence, strict liability and other torts. Without limiting the foregoing, you agree that Promoga’s maximum aggregate liability to you in any case whatsoever will be the lesser of: (1) the amount you paid to Promoga in the 12 months immediately preceding the date of the harm in question; and (2) $100 (CAD). Please note that some jurisdictions do not allow the limitation or exclusion of liability or incidental or consequential damages such that certain exclusions above may not apply to you.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">13.2 Claim Indemnification Process</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga shall promptly provide you written notice of the claim against Promoga and, at your expense, give all reasonable assistance. You may not settle any claim unless it unconditionally releases Promoga of all liability.
            </p>

            {/* Section 14 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">14. Equitable Remedies</h2>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              You agree that Promoga would be irreparably damaged if the Terms of Use are not specifically observed and, therefore, you agree that Promoga shall be entitled, without bond, other security or proof of damages, to appropriate equitable remedies with respect to your breach of the Terms of Use, in addition to other remedies available to Promoga under applicable law.
            </p>

            {/* Section 15 */}
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mt-12 mb-4">15. General</h2>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">15.1 Relationship of the Parties</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Nothing in the Terms of Use shall be construed to create any partnership, joint venture, employer-employee or agency relationship between you and Promoga. Promoga is not an agent or otherwise connected with Fitness Providers other than by providing a Service that connects fitness consumers, Fitness Providers and facilities.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">15.2 Governing Law</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Terms of Use are governed by and construed under the laws of the province of British Columbia. You agree that any claim or dispute be resolved by courts located in Vancouver, British Columbia and hereby submit to the personal jurisdiction of such courts.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">15.3 Severability</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              To the extent any section, clause, provision or sentence or part thereof of the Terms of Use is determined to be illegal, invalid or unenforceable by competent authority in any jurisdiction, then that portion will be severed and the remainder of the Terms of Use given full force and effect.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">15.4 No Waiver</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              Promoga’s failure to assert or enforce any right contained in the Terms of Use does not constitute a waiver of that right.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">15.5 Statute of Limitation</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              You agree that any claim arising out of or relating to these Terms of Use or the Service must commence within one (1) year following the date the cause of action accrues and, thereafter, such claim is permanently barred.
            </p>

            <h3 className="font-heading text-xl font-semibold text-neutral-dark mt-8 mb-3">15.6 Entire Agreement</h3>
            <p className="text-neutral-dark/85 leading-relaxed mb-6">
              The Terms of Use constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes any prior oral or written agreements, communications, representations or undertakings provided to you. To the extent the Terms of Use conflict with the provisions of the Privacy Policy, the conflicting provisions in the Privacy Policy govern.
            </p>

          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
