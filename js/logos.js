/**
 * logos.js – Premier Schools Exhibition
 * Infinite logo slider with:
 *  - Row 1: scrolls left (content moves left)
 *  - Row 2: scrolls right (content moves right)
 *  - Pause on hover and on keyboard focus
 *  - Clones items for seamless CSS animation loop
 *  - Respects prefers-reduced-motion
 */

'use strict';

function initLogoSliders() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Duplicate track items so CSS animation can loop seamlessly.
   * The animation translates -50%, so we need exactly 2x content.
   */
  function duplicateTrackItems(innerEl) {
    const items = [...innerEl.querySelectorAll('.logo-item')];
    if (items.length === 0) return;

    const clone = items.map(el => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      return c;
    });
    clone.forEach(el => innerEl.appendChild(el));
  }

  function setupTrack(trackWrapper) {
    const inner = trackWrapper.querySelector('.logos-track__inner');
    if (!inner) return;

    // Clone for infinite loop
    duplicateTrackItems(inner);

    if (prefersReduced) {
      inner.style.animation = 'none';
      return;
    }

    // Pause/resume on hover
    trackWrapper.addEventListener('mouseenter', () => {
      inner.style.animationPlayState = 'paused';
    });
    trackWrapper.addEventListener('mouseleave', () => {
      inner.style.animationPlayState = 'running';
    });

    // Pause/resume on keyboard focus within
    trackWrapper.addEventListener('focusin', () => {
      inner.style.animationPlayState = 'paused';
    });
    trackWrapper.addEventListener('focusout', () => {
      inner.style.animationPlayState = 'running';
    });
  }

  document.querySelectorAll('.logos-track').forEach(trackWrapper => {
    setupTrack(trackWrapper);
  });
}

document.addEventListener('DOMContentLoaded', initLogoSliders);
