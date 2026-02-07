# CLAUDE.md

## Project Overview

Personal portfolio website for Dustyn Winder, deployed via **GitHub Pages** at [dswinder.xyz](https://dswinder.xyz). Single-page static site showcasing business ventures and contact information.

## Repository Structure

```
dswinder-repo.github.io/
├── CNAME        # Custom domain config (dswinder.xyz)
├── CLAUDE.md    # This file
└── index.html   # Entire site: HTML + embedded CSS + inline JS
```

This is an intentionally minimal repository. The entire site lives in a single `index.html` file with no build tools, no dependencies, and no frameworks.

## Tech Stack

- **HTML5** with embedded `<style>` and `<script>` blocks
- **Vanilla CSS** (no preprocessors)
- **Vanilla JavaScript** (no libraries or frameworks)
- **GitHub Pages** for hosting and deployment

## Development Workflow

### Deployment

Push to `main` branch triggers automatic GitHub Pages deployment. No build step required.

### Local Development

Open `index.html` directly in a browser. No server or tooling needed.

### No Build/Test/Lint Commands

There is no `package.json`, no test suite, no linter, and no build system. Changes are validated visually in a browser.

## Code Conventions

### File Organization

All HTML, CSS, and JavaScript lives in `index.html`:
- **CSS**: Embedded in a `<style>` block in `<head>` (lines 7-154)
- **HTML**: Body content (lines 156-204)
- **JavaScript**: Inline `<script>` block at end of `<body>` (lines 206-223)

### CSS Patterns

- **Class naming**: kebab-case (e.g., `.toggle-container`, `.link-style`)
- **Theming**: Light/dark mode via `body.light` / `body.dark` class toggling
- **Layout**: Max-width 800px centered container
- **Font**: `'Courier New', monospace` throughout
- **Responsiveness**: Mobile breakpoint at 600px
- **Indentation**: 4 spaces

### JavaScript Patterns

- Theme preference persisted to `localStorage`
- Default theme: `light`
- No external dependencies

### Design System

| Element      | Light Mode   | Dark Mode    |
|--------------|-------------|-------------|
| Background   | `#ffffff`   | `#000000`   |
| Text         | `#000000`   | `#ffffff`   |
| Links        | `#007700`   | `#00ff00`   |
| Stealth text | `#666666`   | `#ffffff`   |

### Content Sections

Each business venture follows a consistent pattern:
```html
<div class="section">
    <h2>[emoji] [Name]</h2>
    <p>[Description]</p>
    <p><a href="[url]" target="_blank">→ [domain]</a></p>
</div>
<hr>
```

## Key Considerations for AI Assistants

1. **Keep it simple** - This site is intentionally minimal. Do not introduce build tools, frameworks, or dependencies unless explicitly asked.
2. **Single-file architecture** - All code belongs in `index.html`. Do not split into separate CSS/JS files unless requested.
3. **Preserve the aesthetic** - Monospace font, crosshair cursor, flying plane animation, and the terminal-inspired look are deliberate design choices.
4. **Theme support** - Any new styles must work in both light and dark modes.
5. **Mobile responsive** - Test any layout changes against the 600px breakpoint.
6. **No sensitive data** - Email is obfuscated as "dswinder at me dot com" on purpose. Do not replace with a mailto: link.
7. **External links** - All external links use `target="_blank"`.
