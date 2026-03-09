# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static birthday invitation website (French, for "Maria") with no build system or dependencies. Open any HTML file directly in a browser, or serve with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

Pure HTML/CSS/JS — no framework, no bundler, no package manager.

### Files

- `index.html` — Home page (birthday message + gift request)
- `infos.html` — Practical info (address, time, directions)
- `menu.html` — Party menu
- `cadeau.html` — Gift details page
- `style.css` — Single shared stylesheet for all pages
- `template.js` — Single shared script loaded by every page
- `galerie/images_referentiel.json` — Array of external image URLs (ibb.co) used for the carousel

### Page Structure

Each HTML file contains only its unique content. `template.js` builds everything else at runtime:

```html
<body>
  <main class="card" role="main">
    <!-- unique page content here -->
  </main>
  <script src="template.js"></script>
</body>
```

After `template.js` runs, the DOM looks like:

```html
<canvas id="falling-leaves"></canvas>
<div class="page-wrapper">
  <div class="flowers"></div>   <!-- left vine, injected -->
  <main class="card">
    <div class="nav-pages">...</div>  <!-- injected -->
    <!-- page content -->
  </main>
  <div class="flowers" style="transform:scaleX(-1)"></div>  <!-- right vine -->
</div>
```

### template.js responsibilities

`template.js` builds the entire shared page structure at runtime — each HTML file only needs a `<main class="card">` with its unique content.

1. **Nav injection** — Builds `.nav-pages` and prepends it to `.card`. Detects the active page via `location.pathname`. To add a page, update the `NAV_LINKS` array.
2. **Structure injection** — Creates `<canvas id="falling-leaves">`, wraps `.card` in `.page-wrapper`, and adds `.flowers` divs on each side.
3. **SVG vine injection** — Inserts a `<template id="vine-tpl">` with an SVG vine (stem + leaves + flowers), then clones it into every `.flowers` element.
4. **Vine animations** — Applies CSS animation strings programmatically. Timing is driven by `GROW_DURATION` (top of file, currently 20 seconds).
5. **Falling leaves canvas** — Animates leaf particles on the fixed canvas behind all content.

### Navigation

Each page marks its own link with `class="active"` in the `.nav-pages` bar at the bottom of `.card`.

### Images

All images (signature, carousel photos) are hosted externally on ibb.co. `galerie/images_referentiel.json` holds carousel image URLs as a JSON array.

### CSS notes

- Font: *Cormorant Garamond* (Google Fonts, loaded via `@import`)
- Color palette: warm cream backgrounds, dark teal (`rgba(19,52,59,1)`) for headings, golden (`rgba(180,140,60,…)`) for accents/borders
- Carousel styles (`.carousel-*`) exist in `style.css` for potential future use
- Responsive breakpoints: `≤640px` and `≤380px`