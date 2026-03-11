/* ================================================================
   Lynn Park Piano Studio — Main JavaScript
   ================================================================
   Sections:
     1. Mobile Navigation Toggle
     2. Active Nav Link Detection
     3. Scroll-Triggered Animations (IntersectionObserver)
     4. Interest Form Submission (Formspree)
     5. Schedule / Booking Form Submission (Formspree)
     6. Smooth Scroll for Anchor Links
   ================================================================

   FORMSPREE SETUP (one-time, ~2 minutes):
   ─────────────────────────────────────────
   1. Go to https://formspree.io and sign up for a free account
      using lynnmpk@gmail.com
   2. Click "New Form" and name it (e.g. "Interest Form")
   3. Copy the form's endpoint — it looks like:
      https://formspree.io/f/abcdefgh
   4. Paste that URL into the INTEREST_FORM_ENDPOINT constant below
   5. Repeat steps 2–4 for a second form ("Booking Form") and paste
      its URL into BOOKING_FORM_ENDPOINT
   6. Formspree will email you a verification link the first time a
      real submission arrives — click it to activate delivery

   ================================================================ */


/* ── Formspree endpoints — replace with your real form IDs ───── */

// INTEREST FORM: paste your Formspree endpoint here
// e.g. 'https://formspree.io/f/abcdefgh'
const INTEREST_FORM_ENDPOINT = 'https://formspree.io/f/INTEREST_FORM_ID';

// BOOKING FORM: paste your Formspree endpoint here
const BOOKING_FORM_ENDPOINT  = 'https://formspree.io/f/BOOKING_FORM_ID';

// Fallback email shown in error messages
const CONTACT_EMAIL = 'lynnmpk@gmail.com';


/* ── 1. Mobile Navigation Toggle ─────────────────────────────── */

const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when a link is clicked (mobile UX)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ── 2. Active Nav Link Detection ────────────────────────────── */

(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* ── 3. Scroll-Triggered Animations ──────────────────────────── */

const animatableEls = document.querySelectorAll('.fade-up');

if (animatableEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -64px 0px' }
  );
  animatableEls.forEach(el => observer.observe(el));
} else {
  animatableEls.forEach(el => el.classList.add('visible'));
}


/* ── 4. Interest Form Submission (Formspree) ─────────────────── */

const interestForm    = document.getElementById('interestForm');
const interestSuccess = document.getElementById('interestFormSuccess');
const interestSubmit  = interestForm?.querySelector('[type="submit"]');

if (interestForm) {
  interestForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Show loading state
    if (interestSubmit) {
      interestSubmit.disabled = true;
      interestSubmit.textContent = 'Sending…';
    }

    try {
      const response = await fetch(INTEREST_FORM_ENDPOINT, {
        method:  'POST',
        body:    new FormData(this),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // Show success message
        interestForm.style.display = 'none';
        if (interestSuccess) {
          interestSuccess.style.display = 'block';
          interestSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        const data = await response.json().catch(() => ({}));
        const msg  = data?.errors?.map(e => e.message).join(', ') || 'Unknown error';
        showFormError(interestSubmit, `Something went wrong (${msg}). Please email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> directly.`);
      }
    } catch (err) {
      showFormError(interestSubmit, `Could not send your message. Please email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> directly.`);
    }
  });
}


/* ── 5. Schedule Form Submission (Formspree) ─────────────────── */

const scheduleForm    = document.getElementById('scheduleForm');
const scheduleSuccess = document.getElementById('scheduleFormSuccess');
const scheduleSubmit  = scheduleForm?.querySelector('[type="submit"]');

if (scheduleForm) {
  scheduleForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (scheduleSubmit) {
      scheduleSubmit.disabled = true;
      scheduleSubmit.textContent = 'Sending…';
    }

    try {
      const response = await fetch(BOOKING_FORM_ENDPOINT, {
        method:  'POST',
        body:    new FormData(this),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        scheduleForm.style.display = 'none';
        if (scheduleSuccess) {
          scheduleSuccess.style.display = 'block';
          scheduleSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        const data = await response.json().catch(() => ({}));
        const msg  = data?.errors?.map(e => e.message).join(', ') || 'Unknown error';
        showFormError(scheduleSubmit, `Something went wrong (${msg}). Please email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> directly.`);
      }
    } catch (err) {
      showFormError(scheduleSubmit, `Could not send your message. Please email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> directly.`);
    }
  });
}


/* ── 6. Smooth Scroll for Anchor Links ───────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Show an inline error below a submit button.
 * Re-enables the button so the user can try again.
 */
function showFormError(submitBtn, htmlMessage) {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Try Again';
  }
  // Remove any existing error message first
  const existing = document.getElementById('formErrorMsg');
  if (existing) existing.remove();

  const err = document.createElement('p');
  err.id = 'formErrorMsg';
  err.style.cssText = 'color:#c0392b; font-size:0.9rem; margin-top:14px; text-align:center;';
  err.innerHTML = htmlMessage;
  submitBtn?.parentElement?.appendChild(err);
}
