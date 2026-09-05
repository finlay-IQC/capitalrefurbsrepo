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

## Image manifest

Every image below is referenced by the pages. Until a file exists at the exact path,
the page shows a labelled placeholder block naming the file it wants. Drop the real
file in at that path and it appears automatically — no code change needed.

| Path | Used on | Shape | Notes |
| --- | --- | --- | --- |
| `images/hero/hero-main.jpg` | index hero | landscape, 2400×1600 | The single most important image. A finished, styled interior or a striking exterior. Text sits over it, so avoid a busy centre. |
| `images/hero/cta-band.jpg` | index final CTA | wide landscape | Can be a second angle of the hero property. |
| `images/projects/mechanism-01.jpg` | index, approach | portrait | Team or craft detail — someone actually working. |
| `images/projects/mechanism-02.jpg` | index, approach | portrait | Plans, schedule, or site setup. |
| `images/projects/mechanism-03.jpg` | index, approach | portrait | A finished room. |
| `images/projects/consultation.jpg` | index, "the call" | portrait or square | Homeowner and site manager over drawings. |
| `images/projects/project-01.jpg` | index + thank-you gallery | landscape | Full refurbishment |
| `images/projects/project-02.jpg` | index + thank-you gallery | landscape | Extension |
| `images/projects/project-03.jpg` | index + thank-you gallery | landscape | Loft conversion |
| `images/projects/project-04.jpg` | index + thank-you gallery | landscape | Kitchen |
| `images/projects/service-refurbishment.jpg` | index services | portrait | |
| `images/projects/service-extension.jpg` | index services | portrait | |
| `images/projects/service-loft.jpg` | index services | portrait | |
| `images/projects/service-kitchen.jpg` | index services | portrait | |

**Formats.** JPG for photos, PNG for anything needing transparency. iPhone `.HEIC`
files will not display in a browser — convert to JPG first (iPhone: Settings →
Camera → Formats → "Most Compatible").

**Size.** Aim for under 400 KB each, 2400px on the long edge. Straight-off-the-camera
files are often 8–12 MB and will make the page slow on mobile, which costs conversions.

**Uploading.** On GitHub: open the folder → Add file → Upload files → drag them in →
Commit changes. Filenames must match the table exactly, including the extension.

## Before launch

- [ ] Upload the images above
- [ ] Set the GHL form redirect: form settings → On submit → Redirect → `/thank-you.html`
- [ ] Add hidden UTM fields in the GHL form builder: `utm_source`, `utm_medium`,
      `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `ttclid`, `msclkid`
- [ ] Add the Google Ads conversion tag to `thank-you.html` (marked placeholder in the head)
- [ ] Verify the 5.0 star rating on the trust strip, or remove it — an unevidenced
      review claim breaches the CAP Code
- [ ] Replace the gallery captions with real project outcomes where they exist
- [ ] Complete `privacy.html` and `terms.html` (bracketed fields)
- [ ] Confirm the "within 1 working hour" callback promise on `thank-you.html`

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000
