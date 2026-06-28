/**
 * main.js – Premier Schools Exhibition
 * Entry point: initialises all modules and handles shared DOM logic.
 */

'use strict';

// ── Scroll: add shadow to header ─────────────────────────────
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ── Scroll-triggered reveal animation ─────────────────────────
function initRevealOnScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const revealEls = document.querySelectorAll(
    '.stats__item, .school-card, .exhibit-card, .choose-school__title, .logos-section__title'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger using a small delay based on sibling index
          const siblings = [...entry.target.parentElement.children];
          const index = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

// ── Smooth anchor scroll for CTA buttons ──────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── Enquiry form submission ────────────────────────────────────
function initEnquiryForm() {
  const form = document.querySelector('.enquiry-form__form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = form.querySelector('#parent-name').value.trim();
    const phone = form.querySelector('#phone-number').value.trim();
    const grade = form.querySelector('#grade').value.trim();

    // Simple validation
    let valid = true;
    if (!name) {
      markInvalid(form.querySelector('#parent-name'), 'Please enter your name.');
      valid = false;
    } else {
      clearInvalid(form.querySelector('#parent-name'));
    }

    if (!phone || !/^[0-9+\s\-]{7,15}$/.test(phone)) {
      markInvalid(form.querySelector('#phone-number'), 'Please enter a valid phone number.');
      valid = false;
    } else {
      clearInvalid(form.querySelector('#phone-number'));
    }

    if (!valid) return;

    // Success feedback
    const submitBtn = form.querySelector('[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn__arrow-box" aria-hidden="true">✓</span><span>SENT!</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      form.reset();
    }, 3000);
  });
}

function markInvalid(el, msg) {
  el.setAttribute('aria-invalid', 'true');
  el.style.borderColor = '#f87171';

  let errEl = el.parentElement.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'form-error';
    errEl.style.cssText = 'color:#f87171;font-size:0.75rem;margin-top:0.25rem;display:block;';
    errEl.setAttribute('role', 'alert');
    el.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
}

function clearInvalid(el) {
  el.removeAttribute('aria-invalid');
  el.style.borderColor = '';
  const errEl = el.parentElement.querySelector('.form-error');
  if (errEl) errEl.remove();
}

// ── Initialise all modules ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initRevealOnScroll();
  initSmoothScroll();
  initEnquiryForm();
});