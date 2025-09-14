# Applied AI Investing - Pitch Deck

A React-based interactive pitch presentation for Applied AI Investing, designed to showcase the "YouTube of Algorithmic Trading" concept to potential investors and partners.

## Overview

This is a single-page application (SPA) presenting a 10-slide pitch deck that covers:
- Problem statement in retail AI trading
- Our BYOA (Bring Your Own Algorithm) solution
- Market opportunity ($600M+ TAM)
- Competitive landscape analysis
- Revenue projections ($1.8B+ potential by Year 5)
- Go-to-market strategy
- Investment ask and partnership opportunities

## Technology Stack

- **React 18** - Frontend framework
- **CSS3** with modern animations and responsive design
- **Static deployment** - Optimized for AWS S3 hosting
- **No backend dependencies** - Pure client-side application

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm run build && npx serve -s build
```

## Deployment to AWS S3

1. Build the production version:
   ```bash
   npm run build
   ```

2. Upload the `build/` folder contents to your S3 bucket

3. Configure S3 bucket for static website hosting:
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)

4. Set bucket policy for public read access

## Features

### Current Features
- ✅ Interactive slide navigation with keyboard controls (←/→ arrows)
- ✅ Responsive design for desktop, tablet, and mobile
- ✅ Smooth slide transitions and animations
- ✅ Visual slide indicators and counter
- ✅ Professional styling with gradient backgrounds and hover effects

### Navigation Controls
- **Arrow Keys**: Navigate between slides
- **Click Indicators**: Jump to specific slide
- **Previous/Next Buttons**: Navigate sequentially
- **Mobile-Friendly**: Touch-optimized controls

## Project Structure

```
src/
├── App.js          # Main presentation component with slide content
├── App.css         # All styling including responsive design
├── index.js        # React app entry point
└── index.css       # Global styles and resets

public/
├── index.html      # HTML template
└── ...             # Static assets
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Optimized for presentation displays and projectors

## Performance

- Lightweight bundle size
- CSS animations for smooth performance
- Optimized for fast loading on CDN
- No external API dependencies

---

**Contact**: founders@appliedaiinvesting.com