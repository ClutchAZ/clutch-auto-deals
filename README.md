# Clutch Auto Deals website

Custom Next.js site for clutchautodeals.com. Wix stays the back office: deals, brand
programs, the vehicle image library and every lead form live in the Wix dashboard.

## How content flows

| In Wix (CMS) | What it drives on the site |
|---|---|
| **Deals** | Every deal card, deal page, brand page, the homepage picks and the sitemap. Only rows with `active` checked show. `featured` puts a deal in the homepage hero and top row. |
| **Brands (monthly programs)** | One row per brand. Program month, default due at signing / miles / term, requirements and fine print. A deal with a blank field inherits the brand value, so changing the brand row updates every deal for that brand. Uncheck `Show on site` to hide a brand. Headline and intro override the brand page copy. |
| **Vehicle image library** | One row per make + model (add a trim or year row when a trim looks different). Every deal picks up the matching image automatically. Order: photo on the deal → library image → IMAGIN render (if a key is set) → neutral placeholder. Rows marked `Needs image` are the to-do list. |
| **Wix Forms: Website Quote Request** | Every form on the site (quote, deal review, sell your car, lock in a deal) submits here. Submissions appear in Forms & Submissions and create the contact in the Wix CRM. |

Pages refresh from Wix every 15 minutes. To publish a change immediately, open
`/api/revalidate?secret=<REVALIDATE_SECRET>`.

## Monthly update

1. Brands: set `programMonth` (e.g. "November 2026") and adjust defaults / fine print per brand.
2. Deals: uncheck `active` on expired programs, edit payments, or import new rows with
   `templates/deals-import-template.csv` (Wix CMS → Deals → Import). Badges are comma separated:
   LOYALTY, CONQUEST, NEW, DEMO, LOANER, FLEET, PREORDER, INBOUND.
3. Add any new models to the Vehicle image library with an image.

## Environment variables

See `.env.example`. `WIX_CLIENT_ID` and `WIX_LEAD_FORM_ID` are already filled in.
Set `REVALIDATE_SECRET` to any long random string. `IMAGIN_CUSTOMER_KEY` is optional.

## Run and deploy

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

Deploy on Vercel (import the repo, add the env vars), then point clutchautodeals.com at it.
Old Wix URLs redirect to their new pages (see `next.config.ts`).

If Wix can't be reached during a build, the site falls back to the snapshot in `src/data/`
so it never goes blank.

## Before launch

- Fill in Google rating, review count, link and 3–6 reviews in `src/lib/site.ts` (`REVIEWS`).
  Review sections stay hidden until then.
- Add images to the Vehicle image library.
