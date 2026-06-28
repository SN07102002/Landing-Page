/**
 * accessibility.js – Premier Schools Exhibition
 * WCAG 2.2 AA compliance helpers:
 *  - Focus trap utilities
 *  - Keyboard navigation for interactive components
 *  - ARIA live region updates
 *  - Focus visible polyfill class
 *  - prefers-reduced-motion listener
 */

'use strict';

/* ── Focus-visible class (fallback for older browsers) ────────── */
function initFocusVisible() {
  let usingMouse = false;

  document.addEventListener('mousedown', () => {
    usingMouse = true;
    document.body.classList.add('using-mouse');
  });

  document.addEventListener('keydown', () => {
    usingMouse = false;
    document.body.classList.remove('using-mouse');
  });
}

/* ── Skip link behaviour ─────────────────────────────────────── */
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  const main     = document.getElementById('main-content');
  if (!skipLink || !main) return;

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: false });
    // Clean up tabindex after blur
    main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
  });
}

/* ── Keyboard navigation for dot controls ────────────────────── */
function initDotKeyboard() {
  const dotGroups = document.querySelectorAll('[role="tablist"]');

  dotGroups.forEach(group => {
    const dots = [...group.querySelectorAll('[role="tab"]')];
    if (dots.length === 0) return;

    dots.forEach((dot, i) => {
      dot.addEventListener('keydown', (e) => {
        let nextIndex = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIndex = (i + 1) % dots.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIndex = (i - 1 + dots.length) % dots.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = dots.length - 1;
        }

        if (nextIndex !== null) {
          e.preventDefault();
          dots[nextIndex].focus();
          dots[nextIndex].click(); // trigger slider navigation
        }
      });
    });
  });
}

/* ── ARIA live region for slider announcements ────────────────── */
function initAriaLiveRegion() {
  // Use existing live region in HTML, or create if not present
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);
  }

  // Expose globally for slider modules to use
  window.announceToScreenReader = (message) => {
    liveRegion.textContent = '';
    requestAnimationFrame(() => {
      liveRegion.textContent = message;
    });
  };
}

/* ── Ensure interactive elements in sliders are keyboard reachable */
function initSliderTabIndex() {
  // Exhibit cards – allow individual card focus
  document.querySelectorAll('.exhibit-card').forEach((card, i) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'group');
  });

  // School cards
  document.querySelectorAll('.school-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'group');
  });
}

/* ── Respect prefers-reduced-motion at runtime ───────────────── */
function initReducedMotionListener() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleChange(e) {
    if (e.matches) {
      // Stop all logo track animations
      document.querySelectorAll('.logos-track__inner').forEach(inner => {
        inner.style.animationPlayState = 'paused';
      });
    } else {
      document.querySelectorAll('.logos-track__inner').forEach(inner => {
        inner.style.animationPlayState = 'running';
      });
    }
  }

  mediaQuery.addEventListener('change', handleChange);
  handleChange(mediaQuery);
}

/* ── Ensure form inputs have proper labels ───────────────────── */
function auditFormLabels() {
  document.querySelectorAll('input, textarea, select').forEach(input => {
    const id = input.id;
    if (!id) return;
    const label = document.querySelector(`label[for="${id}"]`);
    // If no visible label, ensure aria-label or placeholder describes it
    if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      if (input.placeholder) {
        input.setAttribute('aria-label', input.placeholder);
      }
    }
  });
}

/* ── Trap focus in modal overlays (future-proofing) ─────────── */
function trapFocus(container) {
  const focusableSelectors = [
    'a[href]', 'button:not([disabled])',
    'input:not([disabled])', 'select:not([disabled])',
    'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusable = [...container.querySelectorAll(focusableSelectors)];
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFocusVisible();
  initSkipLink();
  initDotKeyboard();
  initAriaLiveRegion();
  initSliderTabIndex();
  initReducedMotionListener();
  auditFormLabels();
});