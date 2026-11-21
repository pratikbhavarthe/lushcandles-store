import { BUSINESS } from "@lib/legal/business"
import {
  Detail,
  ExternalLink,
  GrievanceOfficer,
  InternalLink,
  type LegalSection,
} from "@modules/legal/components"

const B = BUSINESS

export const termsIntro = (
  <p>
    These terms govern your use of the {B.tradeName} website and every purchase you make on it.
    They are written for customers in India and sit alongside your rights under the Consumer
    Protection Act, 2019, which these terms never reduce.
  </p>
)

export const termsSections: LegalSection[] = [
  {
    id: "about-us",
    title: "About us and these terms",
    body: (
      <>
        <p>
          This website is operated by <Detail value={B.legalName} label="Legal name" />, a{" "}
          <Detail value={B.entityType} label="Entity type" /> trading as {B.tradeName} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;). We sell the products listed on this website directly to
          you; we are not a marketplace for other sellers.
        </p>
        <ul>
          <li>
            Registered address: <Detail value={B.registeredAddress} label="Registered address" />
          </li>
          <li>
            GSTIN: <Detail value={B.gstin} label="GSTIN" />
          </li>
          {B.cin && <li>CIN / LLPIN: {B.cin}</li>}
          <li>
            Customer care: <Detail value={B.supportEmail} label="Support email" />,{" "}
            <Detail value={B.supportPhone} label="Support phone" /> (
            <Detail value={B.supportHours} label="Support hours" />)
          </li>
        </ul>
        <p>
          By browsing the website, creating an account or placing an order, you agree to these terms
          and to our <InternalLink href="/privacy">Privacy policy</InternalLink>,{" "}
          <InternalLink href="/shipping">Shipping policy</InternalLink> and{" "}
          <InternalLink href="/returns">Returns policy</InternalLink>, which form part of them. If you
          do not agree, please do not use the website.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can buy",
    body: (
      <>
        <p>
          You must be at least 18 years old and able to enter into a binding contract under the Indian
          Contract Act, 1872 to place an order. If you are under 18, a parent or legal guardian must
          place the order and accept these terms for you.
        </p>
        <p>
          We currently sell and deliver only within India. Information you give us, including your
          name, phone number and delivery address, must be true, current and complete.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <>
        <p>
          You can check out as a guest or create an account. If you create one, keep your password
          confidential and tell us promptly if you think someone else has used it. You are responsible
          for activity on your account unless it happened because of our fault.
        </p>
        <p>
          We may suspend or close an account that is used for fraud, abuse or a breach of these terms.
          Closing an account does not affect orders already placed or your rights in them.
        </p>
      </>
    ),
  },
  {
    id: "products",
    title: "Products and product information",
    body: (
      <>
        <p>
          We describe our candles, fragrances, sizes and ingredients as accurately as we can. Each
          product page and package carries the declarations required by the Legal Metrology (Packaged
          Commodities) Rules, 2011, including the maximum retail price (MRP), net quantity, the name
          and address of the manufacturer or packer, the country of origin and consumer care details.
        </p>
        <p>
          Candles are made and finished by hand. Small variations in colour, surface texture, frosting
          and scent strength between batches are normal and are not defects. Colours may also look
          slightly different on your screen.
        </p>
        <p>
          <strong>Safety.</strong> A burning candle is an open flame. Always follow the safety
          instructions on the label: never leave a burning candle unattended, keep it away from
          children, pets, draughts and anything flammable, burn it on a heat-resistant surface, trim
          the wick before each use and stop burning when about 1 cm of wax remains. If you have
          allergies or sensitivities, check the fragrance and ingredient information before use.
        </p>
      </>
    ),
  },
  {
    id: "prices",
    title: "Prices and taxes",
    body: (
      <>
        <p>
          Prices are in Indian rupees (₹) and include GST and all other applicable taxes. No product is
          sold above its MRP. Shipping charges, any other fees and the total amount payable are shown
          separately at checkout before you pay.
        </p>
        <p>
          Prices and offers can change, but a change never affects an order you have already placed.
          If a product is listed at an obviously wrong price because of a technical or typographical
          error, we will tell you before dispatch and you can either pay the correct price or cancel
          for a full refund.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Placing an order",
    body: (
      <>
        <p>
          Your order is an offer to buy. We accept it when we send you an order confirmation by email
          or SMS, and that is when the contract between us is formed. We will send you a GST invoice
          for every order.
        </p>
        <p>
          We may decline or cancel an order before dispatch if the product is out of stock, the
          delivery address is outside the areas our couriers serve, the payment fails or is flagged as
          fraudulent, or there is a pricing error as described above. If we cancel, we refund the full
          amount you paid, including shipping.
        </p>
        <p>
          We may limit the quantity per order to keep products available to individual customers.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment",
    body: (
      <>
        <p>
          You can pay using the methods shown at checkout. Payments are processed by{" "}
          <Detail value={B.paymentPartners} label="Payment partner" />, a payment aggregator regulated
          by the Reserve Bank of India. You enter your card, UPI or net banking details on their
          secure page: we never see or store your full card number, CVV, UPI PIN or banking password.
        </p>
        <p>
          If money is debited but the order is not confirmed, the amount is reversed to your original
          payment method automatically, usually within the timelines your bank or payment provider
          follows. Contact us if it is not.
        </p>
      </>
    ),
  },
  {
    id: "shipping",
    title: "Shipping and delivery",
    body: (
      <>
        <p>
          We ship through <Detail value={B.logisticsPartners} label="Courier partner" />. Estimated
          dispatch and delivery times are shown at checkout and in our{" "}
          <InternalLink href="/shipping">Shipping policy</InternalLink>; they are estimates, and
          delays can happen because of the courier, weather or events outside our control.
        </p>
        <p>
          Ownership and risk in the products pass to you on delivery. Please check your package when
          it arrives. Candles are fragile and wax can soften in heat: if a package arrives damaged,
          leaking or tampered with, keep the packaging and contact us as described in the{" "}
          <InternalLink href="/returns">Returns policy</InternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "cancellations-returns",
    title: "Cancellations, returns and refunds",
    body: (
      <>
        <p>
          You can cancel an order at no charge any time before it is dispatched. After dispatch,
          returns, replacements and refunds follow our{" "}
          <InternalLink href="/returns">Returns policy</InternalLink>, which sets out the return
          window, the condition products must be in and any items that cannot be returned for hygiene
          or safety reasons.
        </p>
        <p>
          A product that arrives damaged, defective, wrong or not as described will always be
          replaced or refunded in full, including the shipping charge.
        </p>
        <p>
          Once a cancellation or return is approved, we start the refund within{" "}
          <Detail value={B.refundStartDays} label="Refund timeline" /> working days, to your original
          payment method. The time it then takes to reach your account depends on your bank or payment
          provider. We do not charge cancellation fees.
        </p>
      </>
    ),
  },
  {
    id: "reviews",
    title: "Reviews and content you share",
    body: (
      <>
        <p>
          If you post a review, photo or other content on our website or tag us on social media, it
          must be your own, honest and lawful. You keep ownership of it, and you give us a
          non-exclusive, royalty-free licence to show it on our website and channels with credit to
          you. You can ask us to remove it at any time.
        </p>
        <p>
          We publish reviews whether positive or negative. We do not write, buy or edit reviews to
          change their meaning, in line with the Bureau of Indian Standards&apos; standard for online
          consumer reviews (IS 19000:2022). We may remove content that is abusive, unlawful, unrelated
          to the product or that reveals someone&apos;s personal information.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using the website, you agree not to:</p>
        <ul>
          <li>break any law, or use the website for fraud or to place orders in someone else&apos;s name</li>
          <li>
            try to gain unauthorised access to the website, its servers or other customers&apos; accounts,
            or introduce viruses or other harmful code
          </li>
          <li>scrape, copy or harvest content or data using automated tools without our written permission</li>
          <li>buy products in bulk for resale without our prior written agreement</li>
          <li>post content that is defamatory, obscene, hateful, misleading or infringes anyone&apos;s rights</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        The {B.tradeName} name, logo, product names, photographs, text, designs and the website itself
        belong to us or our licensors and are protected by Indian copyright and trade mark law. You may
        view and share pages for personal, non-commercial use, but you may not copy, modify or use them
        commercially without our written permission.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility to you",
    body: (
      <>
        <p>
          Nothing in these terms limits or excludes our liability where the law does not allow it,
          including your rights and remedies under the Consumer Protection Act, 2019 (such as product
          liability for defective products), or our liability for death or personal injury caused by
          our negligence, or for fraud.
        </p>
        <p>Subject to that:</p>
        <ul>
          <li>
            we are responsible for loss or damage you suffer that is a foreseeable result of our breaking
            these terms or failing to use reasonable care, and our total liability for an order is
            limited to the amount you paid for it
          </li>
          <li>
            we are not responsible for loss caused by using a product against its label instructions or
            safety warnings, or for business losses, as our products are sold for personal use
          </li>
          <li>
            we try to keep the website available and secure, but cannot promise it will always be
            uninterrupted or error-free
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "force-majeure",
    title: "Events outside our control",
    body: (
      <p>
        We are not responsible for delay or failure to perform caused by events beyond our reasonable
        control, such as natural disasters, epidemics, government orders, strikes, network failures or
        courier disruption. We will tell you as soon as we can and, if the delay is long, you can cancel
        the affected order for a full refund.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-party services and links",
    body: (
      <p>
        The website uses third-party services such as payment gateways and couriers, and may link to
        other websites. Their own terms and privacy policies apply to them. We are not responsible for
        the content of websites we do not control.
      </p>
    ),
  },
  {
    id: "grievances",
    title: "Complaints and grievance officer",
    body: (
      <>
        <p>
          If something has gone wrong, please contact customer care first at{" "}
          <Detail value={B.supportEmail} label="Support email" /> or{" "}
          <Detail value={B.supportPhone} label="Support phone" />. If you are not satisfied, you can
          write to our grievance officer, appointed under the Consumer Protection (E-Commerce) Rules,
          2020:
        </p>
        <GrievanceOfficer />
        <p>
          We acknowledge every complaint within 48 hours and resolve it within one month of receiving
          it. Please include your order number and a short description, with photos if the complaint is
          about damage.
        </p>
        <p>
          You can also contact the National Consumer Helpline on <strong>1915</strong> or at{" "}
          <ExternalLink href="https://consumerhelpline.gov.in">consumerhelpline.gov.in</ExternalLink>,
          or file a complaint with the appropriate Consumer Commission, including online through{" "}
          <ExternalLink href="https://edaakhil.nic.in">e-Daakhil</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <p>
        These terms are governed by the laws of India. Subject to your right to approach a Consumer
        Commission with jurisdiction where you live or work, as the Consumer Protection Act, 2019
        allows, the courts at <Detail value={B.jurisdiction} label="Jurisdiction" /> have jurisdiction
        over any dispute arising from these terms or your use of the website.
      </p>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <>
        <p>
          If a court finds part of these terms invalid, the rest stays in force. If we do not enforce a
          right straight away, we can still enforce it later. These terms, together with the policies
          they refer to, are the whole agreement between you and us about your use of the website.
        </p>
        <p>
          We may update these terms, for example to reflect changes in the law or in how we operate. The
          version that applies to an order is the one on the website when you placed it. We will show the
          date of the latest change at the top of this page and, for significant changes, tell
          account holders by email.
        </p>
      </>
    ),
  },
]
