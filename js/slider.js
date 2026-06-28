/**
 * slider.js – Premier Schools Exhibition
 * Handles:
 *  - Hero: dual-axis image column slider (vertical scroll + horizontal swap)
 *  - Choose School: desktop grid, mobile slider with swipe + dots + autoplay
 *  - Exhibition: card slider with prev/next, swipe, keyboard nav, autoplay, equal heights
 */

'use strict';

/* ── Utility ────────────────────────────────────────────────────── */
const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function announce(msg) {
  const region = document.getElementById('aria-live-region');
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = msg; });
}

/* ── Hero Image Columns: pause vertical scroll on hover ──────────
   The hero already has CSS scrollUp animation on .hero__images-track.
   We just need to pause on hover and handle the dual-axis concept
   by also supporting horizontal column swapping on mobile.           */
function initHeroImages() {
  const columns = document.querySelectorAll('.hero__images-column');
  if (!columns.length) return;

  columns.forEach(col => {
    const track = col.querySelector('.hero__images-track');
    if (!track) return;

    // Pause vertical scroll on hover (WCAG 2.1 SC 2.2.2)
    col.addEventListener('mouseenter', () => {
      if (!prefersReduced()) {
        track.style.animationPlayState = 'paused';
      }
    });
    col.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
    col.addEventListener('focusin', () => {
      track.style.animationPlayState = 'paused';
    });
    col.addEventListener('focusout', () => {
      track.style.animationPlayState = 'running';
    });
  });

  // On mobile, show only one column and allow horizontal swipe
  function setupMobileHeroSwipe() {
    const container = document.querySelector('.hero__images');
    if (!container) return;

    let touchStartX = 0;
    let currentColumn = 0;
    const cols = [...document.querySelectorAll('.hero__images-column')];

    if (window.innerWidth >= 768) {
      cols.forEach(c => { c.style.display = ''; });
      return;
    }

    // Hide non-active columns on very small screens
    function showColumn(idx) {
      cols.forEach((c, i) => {
        c.style.display = (i === idx) ? '' : 'none';
      });
      currentColumn = idx;
    }

    if (window.innerWidth < 480) {
      showColumn(0);

      container.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      container.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            showColumn((currentColumn + 1) % cols.length);
          } else {
            showColumn((currentColumn - 1 + cols.length) % cols.length);
          }
        }
      }, { passive: true });
    } else {
      cols.forEach(c => { c.style.display = ''; });
    }
  }

  setupMobileHeroSwipe();

  let heroResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(heroResizeTimer);
    heroResizeTimer = setTimeout(setupMobileHeroSwipe, 200);
  });
}

/* ── Choose School Slider ────────────────────────────────────────── */
function initChooseSchoolSlider() {
  const track    = document.getElementById('choose-track');
  const prevBtn  = document.getElementById('choose-prev');
  const nextBtn  = document.getElementById('choose-next');
  const dotsWrap = document.getElementById('choose-dots');
  const dots     = dotsWrap ? [...dotsWrap.querySelectorAll('.dot')] : [];
  const cards    = track ? [...track.querySelectorAll('.school-card')] : [];

  if (!track || cards.length === 0) return;

  let currentIndex  = 0;
  let isMobile      = false;
  let touchStartX   = 0;
  let touchEndX     = 0;
  let autoPlayTimer = null;

  function checkMode() {
    isMobile = window.innerWidth < 1024;

    if (isMobile) {
      track.style.display = 'flex';
      track.style.gridTemplateColumns = '';

      const slideW = track.parentElement.offsetWidth;
      cards.forEach(card => {
        card.style.flex    = `0 0 ${slideW}px`;
        card.style.width   = `${slideW}px`;
        card.style.margin  = '0';
      });

      if (dotsWrap) dotsWrap.style.display = 'flex';
      if (prevBtn)  prevBtn.style.display  = 'flex';
      if (nextBtn)  nextBtn.style.display  = 'flex';
      goTo(currentIndex, false);
    } else {
      track.style.display             = '';
      track.style.gridTemplateColumns = '';
      track.style.transform           = '';
      cards.forEach(card => {
        card.style.flex  = '';
        card.style.width = '';
        card.style.margin = '';
      });
      if (dotsWrap) dotsWrap.style.display = 'none';
      if (prevBtn)  prevBtn.style.display  = 'none';
      if (nextBtn)  nextBtn.style.display  = 'none';
      stopAutoPlay();
    }
  }

  function goTo(index, animate = true) {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));

    track.style.transition = (animate && !prefersReduced())
      ? 'transform 0.4s ease'
      : 'none';

    const slideW = track.parentElement.offsetWidth;
    track.style.transform = `translateX(-${currentIndex * slideW}px)`;

    updateDots();
    updateAriaState();
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle('dot--active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function updateAriaState() {
    const slider = document.getElementById('choose-slider');
    const label = cards[currentIndex]?.getAttribute('aria-label') || '';
    if (slider) {
      slider.setAttribute('aria-label',
        `School type ${currentIndex + 1} of ${cards.length}: ${label}`
      );
    }
    announce(`Card ${currentIndex + 1} of ${cards.length}: ${label}`);
  }

  function next() { goTo(currentIndex < cards.length - 1 ? currentIndex + 1 : 0); }
  function prev() { goTo(currentIndex > 0 ? currentIndex - 1 : cards.length - 1); }

  function startAutoPlay() {
    if (!isMobile || prefersReduced()) return;
    stopAutoPlay();
    autoPlayTimer = setInterval(next, 4500);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }

  // Button events
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); stopAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); stopAutoPlay(); });

  // Dot events
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); stopAutoPlay(); });
  });

  // Touch swipe
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    startAutoPlay();
  }, { passive: true });

  // Keyboard navigation
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (!isMobile) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); stopAutoPlay(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); stopAutoPlay(); }
  });

  // Pause on hover / focus
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', () => { if (isMobile) startAutoPlay(); });
  track.addEventListener('focusin', stopAutoPlay);
  track.addEventListener('focusout', () => { if (isMobile) startAutoPlay(); });

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      checkMode();
      if (isMobile) startAutoPlay();
    }, 200);
  });

  // Init
  checkMode();
  if (isMobile) startAutoPlay();
}

/* ── Exhibition Slider ───────────────────────────────────────────── */
function initExhibitionSlider() {
  const track   = document.getElementById('exhibition-track');
  const prevBtn = document.getElementById('exhibition-prev');
  const nextBtn = document.getElementById('exhibition-next');
  const slider  = document.getElementById('exhibition-slider');

  if (!track) return;

  const cards       = [...track.querySelectorAll('.exhibit-card')];
  let currentIdx    = 0;
  let visibleCount  = 4;
  let touchStartX   = 0;
  let dragDeltaX    = 0;
  let isDragging    = false;
  let baseOffset    = 0;
  let autoPlayTimer = null;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 600)  return 1;
    if (w < 900)  return 2;
    if (w < 1200) return 3;
    return 4;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount);
  }

  function getOffsetForIndex(index) {
    visibleCount = getVisibleCount();
    const gap = 24;
    const trackWidth = track.parentElement.offsetWidth;
    const cardWidth  = (trackWidth - gap * (visibleCount - 1)) / visibleCount;
    return Math.max(0, Math.min(index, maxIndex())) * (cardWidth + gap);
  }

  function equaliseCardHeights() {
    cards.forEach(c => { c.style.height = ''; });
    const maxH = Math.max(...cards.map(c => c.offsetHeight));
    cards.forEach(c => { c.style.height = `${maxH}px`; });
  }

  function goTo(index, animate = true) {
    currentIdx = Math.max(0, Math.min(index, maxIndex()));

    track.style.transition = (animate && !prefersReduced())
      ? 'transform 0.45s ease'
      : 'none';

    const offset = getOffsetForIndex(currentIdx);
    track.style.transform = `translateX(-${offset}px)`;
    updateNavBtns();
    updateAriaLabel();
  }

  function updateNavBtns() {
    const maxI = maxIndex();
    if (prevBtn) {
      prevBtn.disabled = currentIdx === 0;
      prevBtn.setAttribute('aria-disabled', currentIdx === 0 ? 'true' : 'false');
      prevBtn.classList.toggle('exhibition__nav-btn--active', currentIdx !== 0);
    }
    if (nextBtn) {
      nextBtn.disabled = currentIdx >= maxI;
      nextBtn.setAttribute('aria-disabled', currentIdx >= maxI ? 'true' : 'false');
      nextBtn.classList.toggle('exhibition__nav-btn--active', currentIdx < maxI);
    }
  }

  function updateAriaLabel() {
    if (slider) {
      slider.setAttribute('aria-label',
        `Exhibition highlights, showing cards ${currentIdx + 1} to ${Math.min(currentIdx + visibleCount, cards.length)} of ${cards.length}`
      );
      announce(`Showing exhibition cards ${currentIdx + 1} to ${Math.min(currentIdx + visibleCount, cards.length)} of ${cards.length}`);
    }
  }

  function next() { goTo(currentIdx < maxIndex() ? currentIdx + 1 : 0); }
  function prev() { goTo(currentIdx > 0 ? currentIdx - 1 : maxIndex()); }

  function startAutoPlay() {
    if (prefersReduced()) return;
    stopAutoPlay();
    autoPlayTimer = setInterval(next, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }

  // Navigation buttons
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); stopAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); stopAutoPlay(); });

  // Pointer drag (mouse + pen)
  track.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging   = true;
    touchStartX  = e.clientX;
    dragDeltaX   = 0;
    baseOffset   = getOffsetForIndex(currentIdx);
    track.style.transition = 'none';
    track.style.cursor     = 'grabbing';
    track.style.userSelect = 'none';
    track.setPointerCapture(e.pointerId);
    stopAutoPlay();
    e.preventDefault();
  });

  track.addEventListener('pointermove', e => {
    if (!isDragging) return;
    dragDeltaX = e.clientX - touchStartX;
    const offset = baseOffset - dragDeltaX;
    track.style.transform = `translateX(-${Math.max(0, offset)}px)`;
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor     = 'grab';
    track.style.userSelect = '';

    if (dragDeltaX < -40)     next();
    else if (dragDeltaX > 40) prev();
    else                      goTo(currentIdx, true);

    startAutoPlay();
  }

  window.addEventListener('pointerup',     endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Touch swipe
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    startAutoPlay();
  }, { passive: true });

  // Keyboard navigation
  if (slider) {
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); stopAutoPlay(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); stopAutoPlay(); }
    });
  }

  // Pause on hover / focus
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  track.addEventListener('focusin', stopAutoPlay);
  track.addEventListener('focusout', startAutoPlay);

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      equaliseCardHeights();
      goTo(currentIdx, false);
    }, 200);
  });

  // Init
  window.addEventListener('load', () => {
    equaliseCardHeights();
    goTo(0, false);
    startAutoPlay();
  });
}

/* ── Boot ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroImages();
  initChooseSchoolSlider();
  initExhibitionSlider();
});
