import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { PageHead } from "@/components/Sections";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Privacy policy" />
      <section style={{ paddingBottom: 104 }}>
        <div className="wrap prose">
          <p>This policy explains what Clutch Auto Deals collects through this website and how we use it.</p>
          <h2>What we collect</h2>
          <p>When you send a form, we receive what you enter: your name, email, phone, the vehicle you're interested in, your ZIP code and any notes. We also see standard website analytics such as pages visited and device type.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To reply to your request and prepare quotes.</li>
            <li>To share the details needed with dealers and lenders when you ask us to source, lease or buy a vehicle.</li>
            <li>To keep a record of our conversations with you.</li>
          </ul>
          <p>We don't sell your personal information. Form submissions are stored with our website and customer-management provider, Wix.</p>
          <h2>Your choices</h2>
          <p>To see, correct or delete the information we hold about you, or to stop receiving messages from us, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phone}.</p>
          <h2>Contact</h2>
          <p>{SITE.name}, {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}.</p>
        </div>
      </section>
    </>
  );
}
