/* ==========================================================================
   Capital Refurbishment Solutions — funnel script
   UTM persistence, sticky CTA, FAQ accordion, hero video, redirect helpers.
   No dependencies.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   HERO VIDEO
   Drop the film in here after the shoot. Accepts either:
     an MP4   — "https://.../meet-the-team.mp4"  (or a local path, "video/team.mp4")
     a YouTube URL — any of watch?v=, youtu.be/, or /embed/ forms
   Leave it as "" and the slot renders the poster with a play overlay and does
   nothing on click. No layout change either way.
--------------------------------------------------------------------------- */
var PAGE_VIDEO_URL = "";

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. UTM / click-id capture
     Captured on first landing, held in sessionStorage, re-applied to
     internal links and to the GoHighLevel form embed.
  ------------------------------------------------------------------ */
  var TRACKED = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'fbclid', 'gclid', 'ttclid', 'msclkid'
  ];
  var STORE_KEY = 'crs_attribution';

  function readStore() {
    try {
      return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeStore(data) {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) { /* private mode — links still carry params within the session */ }
  }

  function captureParams() {
    var params = new URLSearchParams(window.location.search);
    var stored = readStore();
    var changed = false;

    TRACKED.forEach(function (key) {
      var value = params.get(key);
      if (value && value !== stored[key]) {
        stored[key] = value;
        changed = true;
      }
    });

    if (changed) writeStore(stored);
    return stored;
  }

  var attribution = captureParams();

  function hasAttribution() {
    for (var k in attribution) {
      if (Object.prototype.hasOwnProperty.call(attribution, k)) return true;
    }
    return false;
  }

  function decorate(url) {
    var target = new URL(url, window.location.href);
    TRACKED.forEach(function (key) {
      if (attribution[key] && !target.searchParams.has(key)) {
        target.searchParams.set(key, attribution[key]);
      }
    });
    return target.toString();
  }

  /* Carry attribution across internal navigation (index -> thank-you, etc). */
  function decorateLinks() {
    if (!hasAttribution()) return;
    var links = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(links, function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (e) {
        return;
      }
      if (url.origin !== window.location.origin) return;

      link.setAttribute('href', decorate(href));
    });
  }

  /* Push attribution into the GoHighLevel embed as query params.
     GHL prefills hidden fields whose keys match the query string.
     IF YOUR FORM DOES NOT PREFILL: open the form in the GHL builder and add
     hidden fields with these exact keys —
     utm_source, utm_medium, utm_campaign, utm_content, utm_term,
     gclid, fbclid, ttclid, msclkid */
  function decorateFormEmbed() {
    if (!hasAttribution()) return;
    var frame = document.querySelector('.form-embed iframe');
    if (!frame) return;

    var src = frame.getAttribute('src');
    if (!src) return;

    var next = decorate(src);
    if (next !== src) frame.setAttribute('src', next);
  }

  /* ------------------------------------------------------------------
     2. Sticky mobile CTA — shows once the hero is scrolled past
  ------------------------------------------------------------------ */
  function initStickyCta() {
    var bar = document.querySelector('[data-sticky]');
    var hero = document.querySelector('.hero');
    if (!bar || !hero) return;

    bar.hidden = false;

    /* The bar is wanted once the hero is behind you, except while the form is
       on screen — it would sit on top of it. The form is directly below the
       hero, so both states change constantly and each must be tracked. */
    var pastHero = false;
    var formOnScreen = false;

    var render = function () {
      bar.classList.toggle('is-on', pastHero && !formOnScreen);
    };

    var form = document.getElementById('project-form');

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        pastHero = !entries[0].isIntersecting;
        render();
      }, { rootMargin: '-70px 0px 0px 0px' }).observe(hero);

      if (form) {
        new IntersectionObserver(function (entries) {
          formOnScreen = entries[0].isIntersecting;
          render();
        }, { threshold: 0.2 }).observe(form);
      }
    } else {
      window.addEventListener('scroll', function () {
        pastHero = window.pageYOffset > hero.offsetHeight * 0.8;
        if (form) {
          var box = form.getBoundingClientRect();
          formOnScreen = box.top < window.innerHeight && box.bottom > 0;
        }
        render();
      }, { passive: true });
    }
  }

  /* ------------------------------------------------------------------
     3. FAQ accordion
  ------------------------------------------------------------------ */
  function initFaq() {
    var root = document.querySelector('[data-faq]');
    if (!root) return;

    var buttons = root.querySelectorAll('.faq-q');

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var expanded = button.getAttribute('aria-expanded') === 'true';

        /* one open at a time */
        Array.prototype.forEach.call(buttons, function (other) {
          other.setAttribute('aria-expanded', 'false');
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        });

        if (!expanded) {
          button.setAttribute('aria-expanded', 'true');
          var panel = document.getElementById(button.getAttribute('aria-controls'));
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     4. Redirect helper
     The primary redirect is set inside GoHighLevel
     (form settings > On submit > Redirect to /thank-you).
     This listener is a backstop for embeds that post a submit message
     instead of navigating. It only fires on messages from the GHL host.
  ------------------------------------------------------------------ */
  function initRedirectHelper() {
    if (!document.querySelector('.form-embed')) return;

    window.addEventListener('message', function (event) {
      if (!/leadconnectorhq\.com$|msgsndr\.com$/.test(String(event.origin).replace(/^https?:\/\//, ''))) return;

      var payload = event.data;
      var type = payload && (payload.type || payload.event || payload.action);
      if (!type) return;

      if (/submit|submitted|form_submit/i.test(String(type))) {
        window.location.href = decorate('/thank-you');
      }
    }, false);
  }


  /* ------------------------------------------------------------------
     4b. Hero video
     Click-to-play so nothing from YouTube loads until the viewer asks.
  ------------------------------------------------------------------ */
  function youTubeId(url) {
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  function initVideo() {
    var slot = document.querySelector('[data-video]');
    if (!slot) return;

    var button = slot.querySelector('[data-video-play]');
    if (!button) return;

    var url = String(typeof PAGE_VIDEO_URL === 'string' ? PAGE_VIDEO_URL : '').trim();

    if (!url) {
      /* No film yet — poster stays, overlay stays, click does nothing. */
      slot.classList.add('is-awaiting');
      button.setAttribute('aria-disabled', 'true');
      button.addEventListener('click', function (event) { event.preventDefault(); });
      return;
    }

    button.addEventListener('click', function () {
      var frame;
      var id = youTubeId(url);

      if (id) {
        frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        frame.title = 'Meet the team behind your build';
        frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
        frame.setAttribute('allowfullscreen', '');
      } else {
        frame = document.createElement('video');
        frame.src = url;
        frame.controls = true;
        frame.autoplay = true;
        frame.playsInline = true;
      }

      frame.className = 'video-player';
      button.replaceWith(frame);
    }, { once: true });
  }

  /* ------------------------------------------------------------------
     5. Misc
  ------------------------------------------------------------------ */
  function initYear() {
    var slots = document.querySelectorAll('[data-year]');
    Array.prototype.forEach.call(slots, function (slot) {
      slot.textContent = String(new Date().getFullYear());
    });
  }

  /* Anchor CTAs scroll to the form. CSS handles smooth behaviour; this only
     covers browsers that ignore scroll-behavior on the root element. */
  function initAnchors() {
    var supportsSmooth = 'scrollBehavior' in document.documentElement.style;
    if (supportsSmooth) return;

    var anchors = document.querySelectorAll('a[href^="#"]');
    Array.prototype.forEach.call(anchors, function (anchor) {
      anchor.addEventListener('click', function (event) {
        var id = anchor.getAttribute('href').slice(1);
        var target = id && document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView();
      });
    });
  }

  function init() {
    decorateLinks();
    decorateFormEmbed();
    initStickyCta();
    initFaq();
    initVideo();
    initRedirectHelper();
    initYear();
    initAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
