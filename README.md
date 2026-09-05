# Capital Refurbishment Solutions — Google Ads funnel

Static landing page funnel for cold Google Ads traffic. Vanilla HTML, CSS and JS.
No build step. Deploy the repo root as-is.

## Files

```
index.html        Landing page (hero → proof → problem → approach → services → FAQ → form → CTA)
thank-you.html    Post-submission page. Conversion event fires here only.
privacy.html      Privacy policy (placeholder — needs completing before launch)
terms.html        Terms of service (placeholder — needs completing before launch)
styles.css        All styling
script.js         UTM capture, sticky CTA, FAQ accordion, redirect helper
images/           Photography (see manifest below)
```

## Images

Six photographs are in the repo, all from the same project, supplied via Drive.
They are reused across fourteen slots with different crops.

| File | Room | Used for |
| --- | --- | --- |
| `images/hero/hero-main.jpg` | Kitchen | Hero background |
| `images/hero/cta-band.jpg` | Living room | Final CTA background |
| `images/projects/kitchen-crittall.jpg` | Kitchen | Gallery, Kitchen service tile |
| `images/projects/dining-crittall.jpg` | Dining room | Approach, gallery, Extensions tile |
| `images/projects/living-red-sofa.jpg` | Living room | Gallery |
| `images/projects/living-media-wall.jpg` | Living room | Approach, House Renovations tile |
| `images/projects/bedroom-wardrobes.jpg` | Bedroom | Approach, Loft Conversions tile |
| `images/projects/bedroom-panelled.jpg` | Bedroom | The-call section, gallery |

All resized to 1600px (hero 2000px) and compressed to ~250 KB each.

### Two problems with the current photography

**1. Every file carries a `© Amica Studio Ltd` watermark.** These are photographer
proofs, not licensed final files. The watermark is visible bottom-right on all six
and appears on the live page. Get clean licensed copies from Amica Studio before
spending money on traffic. Do not crop the watermark out — that is a separate
copyright problem on top of the licensing one.

**2. All six are interiors of one project.** There are no exteriors, no extensions,
no loft conversions, no work in progress, no before-and-afters. The gallery therefore
shows four rooms of one home rather than four different projects, and captions are
written by room, not by borough. The service tiles for Extensions and Loft Conversions
use interior shots that do not actually show either.

Photography that would materially improve the page, in priority order:

1. A rear or side-return extension, shot from the garden
2. A finished loft conversion showing the roofline or dormer
3. Exteriors of completed prime London properties
4. Before-and-after pairs of any project
5. The team on site — the approach section is about people, and currently has none

Adding any file at the paths above swaps it in. Missing files fall back to a
labelled placeholder block naming the path, so nothing breaks.

## Before launch

- [ ] Replace the watermarked Amica Studio proofs with licensed files
- [ ] Set the GHL form redirect: form settings → On submit → Redirect → `/thank-you.html`
- [ ] Add hidden UTM fields in the GHL form builder: `utm_source`, `utm_medium`,
      `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `ttclid`, `msclkid`
- [ ] Add the Google Ads conversion tag to `thank-you.html` (marked placeholder in the head)
- [ ] Add photography from other projects so the gallery shows four homes, not four rooms
- [ ] Complete `privacy.html` and `terms.html` (bracketed fields)
- [ ] Confirm the "within 1 working hour" callback promise on `thank-you.html`

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000
