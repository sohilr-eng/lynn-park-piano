/* ================================================================
   Lynn Park Piano Studio — Main JavaScript
   ================================================================
   Sections:
     1. Mobile Navigation Toggle
     2. Active Nav Link Detection
     3. Scroll-Triggered Animations (IntersectionObserver)
     4. Interest Form Submission (localStorage)
     5. Schedule / Booking Form Submission (localStorage)
     6. Smooth Scroll for Anchor Links
   ================================================================ */


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
    // Mark active if href matches current page (or root → index.html)
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
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -64px 0px',
    }
  );

  animatableEls.forEach(el => observer.observe(el));
} else {
  // Fallback: make all elements visible immediately if no IntersectionObserver
  animatableEls.forEach(el => el.classList.add('visible'));
}


/* ── 4. Interest Form Submission (localStorage) ─────────────── */

const interestForm    = document.getElementById('interestForm');
const interestSuccess = document.getElementById('interestFormSuccess');

if (interestForm) {
  interestForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    const submission = {
      id:           Date.now(),
      submittedAt:  new Date().toISOString(),
      name:         getValue(this, 'name'),
      email:        getValue(this, 'email'),
      phone:        getValue(this, 'phone'),
      studentAge:   getValue(this, 'studentAge'),
      skillLevel:   getValue(this, 'skillLevel'),
      hearAbout:    getValue(this, 'hearAbout'),
      message:      getValue(this, 'message'),
    };

    // Persist to localStorage
    saveToLocalStorage('lynnpark_interest_submissions', submission);

    // Show success state
    if (interestSuccess) {
      interestForm.style.display = 'none';
      interestSuccess.style.display = 'block';
      interestSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}


/* ── 5. Schedule Form Submission (localStorage) ──────────────── */

const scheduleForm    = document.getElementById('scheduleForm');
const scheduleSuccess = document.getElementById('scheduleFormSuccess');

if (scheduleForm) {
  scheduleForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    const submission = {
      id:              Date.now(),
      submittedAt:     new Date().toISOString(),
      name:            getValue(this, 'name'),
      email:           getValue(this, 'email'),
      phone:           getValue(this, 'phone'),
      preferredDate:   getValue(this, 'preferredDate'),
      preferredTime:   getValue(this, 'preferredTime'),
      studentAge:      getValue(this, 'studentAge'),
      experienceLevel: getValue(this, 'experienceLevel'),
      message:         getValue(this, 'message'),
    };

    // Persist to localStorage
    saveToLocalStorage('lynnpark_booking_submissions', submission);

    // Show success state
    if (scheduleSuccess) {
      scheduleForm.style.display = 'none';
      scheduleSuccess.style.display = 'block';
      scheduleSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
 * Safely get form field value by name.
 * @param {HTMLFormElement} form
 * @param {string} name
 * @returns {string}
 */
function getValue(form, name) {
  const el = form.querySelector(`[name="${name}"]`);
  return el ? el.value.trim() : '';
}

/**
 * Append a submission object to a localStorage JSON array.
 * @param {string} key   - localStorage key
 * @param {object} data  - data object to append
 */
function saveToLocalStorage(key, data) {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (err) {
    console.error('Could not save form submission to localStorage:', err);
  }
}
