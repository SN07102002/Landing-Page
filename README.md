# Premier Schools Exhibition – Landing Page

**22nd Edition** 

A production-ready, pixel-perfect landing page built with semantic HTML5, custom CSS3, and vanilla JavaScript. No frameworks, no dependencies.

---

## Project Structure

```
Landing-Page/
├── index.html
├── README.md
├── favicon.svg
├── css/
│   ├── style.css          # Core styles, BEM, CSS variables
│   ├── responsive.css     # Media queries, mobile-first
│   └── animations.css     # All keyframes and transitions
├── js/
│   ├── main.js            # Entry point, scroll effects, form
│   ├── slider.js          # Choose School + Exhibition sliders
│   ├── logos.js           # Infinite logo scroll animation
│   └── accessibility.js   # WCAG 2.2 AA helpers, ARIA
└── assets/
    ├── images/
    ├── icons/
    ├── logos/
    └── fonts/
```

---

## Sections

1. **Header** – Fixed navbar with logo badge and "Register Now" button
2. **Hero** – Three-column layout: text/event info | image grid | enquiry form
3. **Stats** – 4 achievement stats with decorative laurel wreaths
4. **Participating Schools (Logos)** – Infinite dual-row logo slider
5. **Choose the School** – 4 image cards (desktop grid → mobile slider)
6. **Pre-Schedule** – Split CTA section with background photo
7. **Exhibition Highlights** – Scrollable card slider with prev/next controls
8. **Footer** – Contact info, addresses, social icons, copyright

---

## Tech Stack

- **HTML5** – Semantic elements, ARIA roles, W3C valid
- **CSS3** – Custom properties (variables), BEM naming, flexbox, grid
- **JavaScript (ES6+)** – Modular, no frameworks, no jQuery

---

## Features

### Sliders
- **Choose School**: Desktop 4-column grid → mobile slider with swipe, dots, autoplay
- **Exhibition**: Card carousel, prev/next buttons, swipe, equal-height cards, autoplay
- **Logo Strip**: Infinite CSS animation, row 1 (L→R), row 2 (R→L), pause on hover/focus

### Accessibility (WCAG 2.2 AA)
- Skip to content link
- ARIA labels on all interactive elements
- ARIA roles: `region`, `tablist`, `tab`, `group`, `banner`, `contentinfo`
- Keyboard navigation: Arrow keys for dots, Tab for all controls
- Visible focus indicators
- Screen reader live region announcements
- `prefers-reduced-motion` respected (all animations disabled)
- Proper alt text on all images
- Form validation with accessible error messages

### Performance
- Images loaded with `loading="lazy"` (eager for above-fold)
- Fonts via Google Fonts with `preconnect`
- `will-change` on animated elements
- Passive event listeners for touch/scroll
- Debounced resize handlers

### Cross-Browser
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS and Android browsers
- No vendor prefixes needed (modern targets)

---

## How to Run

1. Open `index.html` with **Live Server** (VS Code extension)
   - Right-click `index.html` → *Open with Live Server*

2. Navigate to `http://localhost:5500` (or your server port)

> **Note:** The logo images are loaded from Wikipedia/Unsplash URLs. For production, replace with local assets in `/assets/logos/` and `/assets/images/`.

---

## Color Palette

| Name            | Hex       | Usage                        |
|-----------------|-----------|------------------------------|
| Navy            | `#0d0b2e` | Hero left, footer background |
| Navy Mid        | `#1a0a3c` | Logo badge, header accent    |
| Purple Deep     | `#2d1b69` | Exhibition background        |
| Purple          | `#4b2a9c` | Accents, focus rings         |
| Purple Mid      | `#6c3fc7` | Hero form background         |
| Purple Light    | `#c4b5fd` | Decorative                   |
| Purple Card     | `#e9d8fd` | Exhibition card background   |
| Gold            | `#f5c842` | Logo text, primary highlight |
| Cream           | `#fdf6e3` | Event pill background        |

---

## Typography

- **Poppins** – Primary font (headings, body, UI)
- **Inter** – Fallback sans-serif
- System stack fallback for performance

---

## QA Checklist

- [x] W3C HTML validation pass
- [x] CSS validation pass
- [x] Axe accessibility audit (0 critical/serious issues)
- [x] Keyboard-only navigation works end-to-end
- [x] Screen reader tested (VoiceOver / NVDA)
- [x] Mobile (375px), tablet (768px), desktop (1280px+)
- [x] `prefers-reduced-motion` tested
- [x] Form validation and success state
- [x] All sliders work with touch/swipe
- [x] Logo animation pauses on hover and focus
- [x] Cross-browser: Chrome, Firefox, Safari, Edge

---

## License

© 2025 Premier Schools Exhibition. All rights reserved.
