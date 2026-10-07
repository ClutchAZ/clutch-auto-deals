import type { Metadata } from "next";
import { REVIEWS, SITE } from "@/lib/site";
import { PageHead, QuoteSection, ReviewsBlock } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What Clutch Auto Deals customers say about leasing and buying through us.",
  alternates: { canonical: "/reviews" },
};

export default function Reviews() {
  return (
    <>
      <PageHead
        eyebrow="Reviews"
        title="What our customers say"
        lede={REVIEWS.rating ? `★ ${REVIEWS.rating} from ${REVIEWS.count} Google reviews.` : "Read our reviews on Google, or ask us to connect you with a recent customer."}
      >
        {REVIEWS.googleUrl ? (
          <a className="btn btn-orange" href={REVIEWS.googleUrl}>Read on Google</a>
        ) : (
          <a className="btn btn-orange" href={SITE.smsHref}>Text us</a>
        )}
      </PageHead>
      <ReviewsBlock />
      <QuoteSection />
    </>
  );
}
