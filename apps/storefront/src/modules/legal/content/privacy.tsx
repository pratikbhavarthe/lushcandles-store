import { BUSINESS } from "@lib/legal/business"
import {
  Detail,
  GrievanceOfficer,
  InternalLink,
  type LegalSection,
} from "@modules/legal/components"

const B = BUSINESS

/**
 * The cookies this storefront sets (lib/data/cookies.ts, locale-actions.ts,
 * onboarding.ts and middleware.ts). Keep in sync when adding one, and add
 * analytics or advertising tools here, with consent, before switching them on.
 */
const COOKIES = [
  { name: "_medusa_cart_id", purpose: "Remembers your shopping bag.", lifetime: "7 days" },
  { name: "_medusa_jwt", purpose: "Keeps you signed in to your account.", lifetime: "7 days" },
  {
    name: "_medusa_pending_customer",
    purpose: "Holds sign-up details while you verify your email.",
    lifetime: "1 day",
  },
  { name: "_medusa_cache_id", purpose: "Serves the correct version of pages to your browser.", lifetime: "1 day" },
  { name: "_medusa_locale", purpose: "Remembers your language choice.", lifetime: "1 year" },
  { name: "_medusa_onboarding", purpose: "Used only during store setup; removed straight away.", lifetime: "Session" },
]

export const privacyIntro = (
  <p>
    This policy explains what personal data {B.tradeName} collects when you visit our website or
    buy from us, why we use it, who we share it with and the rights you have under India&apos;s
    Digital Personal Data Protection Act, 2023. In short: we collect what we need to sell and
    deliver your candles, we don&apos;t sell your data, and we only send marketing if you agree to it.
  </p>
)

export const privacySections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          <Detail value={B.legalName} label="Legal name" />, trading as {B.tradeName}, of{" "}
          <Detail value={B.registeredAddress} label="Registered address" />, decides how and why your
          personal data is processed. Under the Digital Personal Data Protection Act, 2023 (the
          &ldquo;DPDP Act&rdquo;) we are the <strong>Data Fiduciary</strong> and you are the{" "}
          <strong>Data Principal</strong>.
        </p>
        <p>
          We process personal data in line with the DPDP Act and the rules made under it, the
          Information Technology Act, 2000 and its rules, and other Indian laws that apply to us. This
          policy covers our website and orders placed on it.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Personal data we collect",
    body: (
      <>
        <h3>Data you give us</h3>
        <ul>
          <li>
            <strong>Contact and identity:</strong> name, email address and mobile number.
          </li>
          <li>
            <strong>Delivery and billing:</strong> addresses and PIN code, and your GSTIN if you ask for
            a business invoice.
          </li>
          <li>
            <strong>Account:</strong> sign-in email and password (stored only in encrypted, hashed form)
            and your order history.
          </li>
          <li>
            <strong>Orders:</strong> products bought, amounts, gift messages and delivery instructions.
          </li>
          <li>
            <strong>Communication:</strong> messages, emails, photos and call details when you contact
            customer care.
          </li>
          <li>
            <strong>Reviews:</strong> anything you choose to post publicly about a product.
          </li>
        </ul>
        <h3>Data collected automatically</h3>
        <ul>
          <li>
            <strong>Device and usage:</strong> IP address, browser and device type, pages viewed and the
            time of your visit, kept in server logs for security and troubleshooting.
          </li>
          <li>
            <strong>Cookies:</strong> small files that keep your bag and sign-in working (see section 9).
          </li>
        </ul>
        <h3>Data from others</h3>
        <ul>
          <li>
            <strong>Payment partner:</strong> whether a payment succeeded, the payment method type and a
            transaction reference. We never receive your full card number, CVV, UPI PIN or net banking
            password.
          </li>
          <li>
            <strong>Courier partner:</strong> delivery status and proof of delivery.
          </li>
        </ul>
        <p>
          We do not ask for sensitive data such as health, financial account, biometric or government ID
          information, and we ask you not to send it to us.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use it and on what basis",
    body: (
      <>
        <p>
          The DPDP Act lets us process personal data either with your consent or for certain
          &ldquo;legitimate uses&rdquo;, such as when you give us data for a specific purpose or when the
          law requires it. We use your data:
        </p>
        <ul>
          <li>
            <strong>To take, deliver and support your order:</strong> processing payment, packing and
            shipping, sending order and delivery updates, handling cancellations, returns and refunds,
            and answering your questions. You provide this data for that purpose.
          </li>
          <li>
            <strong>To run your account</strong>, if you create one.
          </li>
          <li>
            <strong>To meet legal obligations:</strong> issuing GST invoices, keeping tax and accounting
            records, responding to consumer complaints and lawful requests from authorities.
          </li>
          <li>
            <strong>To keep the website secure:</strong> preventing fraud, misuse and attacks.
          </li>
          <li>
            <strong>To send marketing</strong> such as new collections and offers by email, SMS or
            WhatsApp, <strong>only with your consent</strong>. Every marketing message has a way to opt
            out, and SMS and calls follow TRAI&apos;s commercial communication rules, including your
            Do Not Disturb preferences.
          </li>
        </ul>
        <p>
          We do not sell your personal data, and we do not use it for automated decisions that have a
          legal or similarly significant effect on you.
        </p>
      </>
    ),
  },
  {
    id: "consent",
    title: "Your consent and withdrawing it",
    body: (
      <>
        <p>
          Where we rely on consent, we ask for it clearly and separately for each purpose, and never
          assume it from a pre-ticked box. You can withdraw consent at any time, as easily as you gave
          it: use the unsubscribe link or opt-out instruction in any marketing message, or write to{" "}
          <Detail value={B.grievanceOfficer.email} label="Grievance email" />.
        </p>
        <p>
          Withdrawing consent does not affect processing that already happened, or processing we need
          to complete an order you have placed or to meet a legal obligation.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We share personal data only with service providers that process it for us under contract, and
          only what each needs:
        </p>
        <ul>
          <li>
            <strong>Payments:</strong> <Detail value={B.paymentPartners} label="Payment partner" />,
            to process your payment and refunds.
          </li>
          <li>
            <strong>Delivery:</strong> <Detail value={B.logisticsPartners} label="Courier partner" />,
            which receives your name, phone number and delivery address.
          </li>
          <li>
            <strong>Hosting and infrastructure:</strong> <Detail value={B.hosting} label="Hosting provider" />,
            where the website and its database run.
          </li>
          <li>
            <strong>Email and messaging providers</strong> that send order updates and, with consent,
            marketing.
          </li>
          <li>
            <strong>Professional advisers</strong> such as our accountants and lawyers, under a duty of
            confidentiality.
          </li>
        </ul>
        <p>
          We may also disclose data when Indian law requires it, for example to a court, tax authority
          or law enforcement agency with lawful authority, or to protect our rights or someone&apos;s
          safety. If our business is sold or restructured, your data may transfer to the new owner,
          who must continue to protect it in line with this policy.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Where your data is stored",
    body: (
      <p>
        Your data is stored with <Detail value={B.hosting} label="Hosting provider" />. Some service
        providers may process data outside India. We transfer data only to countries the Government of
        India has not restricted under section 16 of the DPDP Act, and require those providers to
        protect it to the standard this policy describes.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>
          We keep personal data only as long as we need it for the purpose it was collected for, or as
          long as the law requires, and then erase it or make it anonymous. In particular:
        </p>
        <ul>
          <li>
            Order and invoice records are kept for the period GST and income tax laws require us to
            keep accounts.
          </li>
          <li>
            Account data is kept while your account is open. If you ask us to delete your account, we
            erase it except for records the law requires us to keep.
          </li>
          <li>Marketing data is kept until you withdraw consent.</li>
          <li>Security logs are kept for the period required by law and then deleted.</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        We use reasonable security safeguards to protect personal data, including encrypted (HTTPS)
        connections, hashed passwords, restricted staff access and payment processing by a regulated
        payment aggregator, so card and banking details never reach our servers. No system is
        completely secure. If a personal data breach occurs, we will inform the Data Protection Board
        of India and the affected people, as the DPDP Act requires.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>
          We use only the cookies needed for the website to work. We do not use analytics, advertising
          or cross-site tracking cookies. If we ever add them, we will update this policy and ask for
          your consent first.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-lush-sand">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-lush-cotton/40 text-lush-ink">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Cookie</th>
                <th scope="col" className="px-4 py-3 font-medium">Purpose</th>
                <th scope="col" className="px-4 py-3 font-medium">Lasts</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((cookie) => (
                <tr key={cookie.name} className="border-t border-lush-sand">
                  <td className="px-4 py-3 font-mono text-xs text-lush-ink">{cookie.name}</td>
                  <td className="px-4 py-3">{cookie.purpose}</td>
                  <td className="whitespace-nowrap px-4 py-3">{cookie.lifetime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          You can block or delete cookies in your browser settings, but your bag and sign-in will not
          work without them.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act you have the right to:</p>
        <ul>
          <li>
            <strong>Access:</strong> a summary of the personal data we hold about you, how we process it
            and who we have shared it with.
          </li>
          <li>
            <strong>Correction and erasure:</strong> have inaccurate or incomplete data corrected,
            completed or updated, and data we no longer need erased.
          </li>
          <li>
            <strong>Withdraw consent</strong> where we rely on it (section 4).
          </li>
          <li>
            <strong>Grievance redressal:</strong> complain to us and get a response (section 12).
          </li>
          <li>
            <strong>Nominate</strong> another person to exercise these rights for you in the event of
            your death or incapacity.
          </li>
        </ul>
        <p>
          To use any of these rights, write to{" "}
          <Detail value={B.grievanceOfficer.email} label="Grievance email" /> from the email address on
          your account or order. We may ask you to confirm your identity before acting, and we respond
          within the time the law requires. You can update your name, addresses and phone number
          yourself in your <InternalLink href="/account">account</InternalLink>.
        </p>
        <p>
          The DPDP Act also asks Data Principals to give accurate information and not to file false or
          frivolous complaints or impersonate others.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our website is meant for adults. Under the DPDP Act, anyone under 18 is a child, and we do not
        knowingly collect a child&apos;s personal data without verifiable consent from a parent or legal
        guardian. If you believe a child has given us personal data, contact us and we will delete it.
        We do not track or target advertising at children.
      </p>
    ),
  },
  {
    id: "grievances",
    title: "Questions, complaints and grievance officer",
    body: (
      <>
        <p>
          For any question or complaint about your personal data, contact our grievance officer, who is
          also our point of contact for data protection queries:
        </p>
        <GrievanceOfficer />
        <p>
          Please let us try to resolve your complaint first. If you are not satisfied with our response,
          you can complain to the{" "}
          Data Protection Board of India under the DPDP Act.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We will update this policy when our practices or the law change, for example if we start using
        a new service provider or analytics. The date at the top shows when it last changed. If a
        change affects how we use data you have already given us, we will tell you by email and, where
        the law requires, ask for your consent again. See also our{" "}
        <InternalLink href="/terms">Terms of service</InternalLink>.
      </p>
    ),
  },
]
