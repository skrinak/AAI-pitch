# Applied AI Investing - Pitch Deck

🚀 **[VIEW LIVE PRESENTATION](https://skrinak.com/Documents/AAI/pitch/)**

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

## Live Deployment

**Production URL**: https://skrinak.com/Documents/AAI/pitch/

### Direct Slide Links
- Slide 1 (Title): https://skrinak.com/Documents/AAI/pitch/#slide/1
- Slide 2 (Problem): https://skrinak.com/Documents/AAI/pitch/#slide/2
- Slide 3 (Solution): https://skrinak.com/Documents/AAI/pitch/#slide/3
- And so on...

## Deployment to AWS S3

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy to S3 (requires conda environment 'aws' and profile 'ksk'):
   ```bash
   /Users/kris/anaconda3/condabin/conda run -n aws aws s3 sync build/ s3://skrinak.com/Documents/AAI/pitch/ --acl public-read --profile ksk
   ```

3. The site is automatically available with S3 static hosting configured

## Features

### Current Features
- ✅ **Hash-based routing** for S3 compatibility with direct slide linking
- ✅ **Animated progress bar** showing presentation progress
- ✅ **Animated number counters** for key statistics and financial data
- ✅ **Keyboard shortcuts overlay** (press '?' to view all shortcuts)
- ✅ **Interactive slide navigation** with multiple input methods
- ✅ **Responsive design** for desktop, tablet, and mobile
- ✅ **Professional animations** and smooth transitions
- ✅ **S3-optimized** with 50KB gzipped bundle size

### Navigation Controls
- **Arrow Keys**: ← Previous slide, → Next slide
- **Space Bar**: Next slide
- **Number Keys**: Jump to slide 1-9, 0 for slide 10
- **Home/End**: First/Last slide
- **Question Mark (?)**: Show/hide keyboard shortcuts overlay
- **Escape**: Close overlays
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