# Claude Development Context for Applied AI Investing Pitch Deck

## Project Overview
This is a **React-based interactive pitch presentation** for Applied AI Investing - showcasing the "YouTube of Algorithmic Trading" concept. The app presents a 10-slide investor pitch deck with professional styling and smooth animations.

🚀 **Live URL**: https://skrinak.com/Documents/AAI/pitch/
📚 **GitHub**: https://github.com/skrinak/AAI-pitch

## Critical Deployment Context
🚨 **IMPORTANT**: This app deploys to **AWS S3 static hosting** - NO server-side functionality allowed!

### Deployment Constraints
- ✅ **Client-side only**: All features must work without backend
- ✅ **Static hosting**: S3 bucket with CloudFront CDN
- ✅ **Hash-based routing**: Use `#/slide/1` instead of `/slide/1`
- ✅ **No Node.js runtime**: Browser-only JavaScript execution
- ✅ **No server APIs**: All data embedded in React components

## Technology Stack
- **React 18** with functional components and hooks
- **Vanilla CSS3** with modern features (grid, flexbox, animations)
- **No external UI libraries** (keeps bundle small)
- **Hash-based routing** for slide navigation
- **Responsive design** (mobile-first approach)

## Current Application Structure

### Core Components
- `App.js` - Main presentation component with 10 slides of content
- `App.css` - Complete styling with animations and responsive design
- `index.js` - React app entry point
- `index.html` - Static HTML template

### Existing Features
- ✅ **Hash-based routing** for S3 compatibility (`#/slide/1`, `#/slide/2`, etc.)
- ✅ **Animated progress bar** at top showing presentation progress
- ✅ **Animated number counters** for statistics (market data, revenue projections)
- ✅ **Keyboard shortcuts overlay** (press '?' to show, Esc to close)
- ✅ **Comprehensive navigation**: arrows, space, numbers, home/end keys
- ✅ **10 professionally styled slides** with complete pitch content
- ✅ **Smooth CSS transitions and animations** throughout
- ✅ **Fully responsive design** (desktop, tablet, mobile)
- ✅ **Professional styling** with gradient backgrounds and hover effects
- ✅ **S3-optimized build** (50KB gzipped, static hosting ready)

### Slide Content Overview
1. **Title**: Applied AI Investing introduction
2. **Problem**: Expensive & closed trading solutions
3. **Solution**: BYOA (Bring Your Own Algorithm) model
4. **Market**: $600M+ TAM opportunity
5. **Competition**: Competitive landscape analysis
6. **Revenue**: $1.8B+ projection scenarios
7. **Moat**: Network effects and defensibility
8. **Risks**: Risk assessment and mitigation
9. **Strategy**: Go-to-market phases
10. **Ask**: Investment ask and partnerships

## Development Principles

### S3-Compatible Development
- Use `localStorage` for client-side state persistence
- **Hash-based routing already implemented** (`window.location.hash`)
- Use CSS-only animations and transitions
- Embed all data directly in React components
- Use browser APIs for features (Fullscreen API, Print API, etc.)
- Maintain existing `AnimatedNumber` component for all statistics
- Extend existing keyboard shortcut system rather than creating new ones

### Performance Focus
- Minimize bundle size (avoid heavy libraries)
- Use CSS Grid/Flexbox for layouts
- Implement lazy loading for slide content
- Optimize images and assets for web
- Use React.memo for performance optimization

### Code Organization
- Keep all slide content in `App.js` for easy maintenance
- Use CSS custom properties for consistent theming
- Implement responsive design with mobile-first approach
- Add proper error boundaries and fallbacks

## Key Files to Reference

### App.js (key sections)
- `slides` array: Contains all 10 slide definitions with content
- `AnimatedNumber` component: Handles animated statistics counters
- Hash routing functions: `updateURL()`, `getSlideFromHash()` for S3 compatibility
- Navigation functions: `nextSlide()`, `prevSlide()`, `goToSlide()` with URL sync
- Keyboard handler: Comprehensive shortcuts including '?' for help overlay
- `renderSlideContent()`: Switch statement rendering slide-specific content
- Shortcuts overlay: Complete keyboard help system

### App.css (key sections)
- `.presentation-app` (lines 15-43): Main layout and background
- Slide-specific styles: `.title-slide`, `.problem-slide`, etc.
- Responsive breakpoints (lines 1070-1160): Mobile optimizations
- Animation keyframes: `@keyframes` declarations

## Common Development Tasks

### Adding New Features
1. **Check S3 compatibility first** - no server-side functionality
2. **Update `TASKS.md`** with implementation details
3. **Use existing patterns**:
   - Follow hash-based routing approach
   - Use `AnimatedNumber` component for statistics
   - Add keyboard shortcuts to existing handler
   - Follow existing CSS naming conventions
4. **Test thoroughly**:
   - Mobile devices and screen sizes
   - Keyboard navigation and accessibility
   - S3 static hosting compatibility
   - Hash-based routing functionality

### Styling Guidelines
- Follow existing CSS naming conventions
- Use CSS custom properties for colors and spacing
- Maintain responsive design principles
- Test animations on low-power devices
- Keep hover states and transitions smooth

### Testing Approach
- Test locally with `npm start`
- Build and test with `npm run build && npx serve -s build`
- Test on multiple devices and browsers
- Verify all features work without internet (offline-first)

## Quick Commands
```bash
# Development
npm start

# Production build
npm run build

# Test production build locally
npx serve -s build

# Check bundle size
npm run build && ls -lh build/static/js/
```

## AWS S3 Deployment
**Critical**: Must use specific conda environment and profile
```bash
# Deploy to production S3 bucket
/Users/kris/anaconda3/condabin/conda run -n aws aws s3 sync build/ s3://skrinak.com/Documents/AAI/pitch/ --acl public-read --profile ksk

# Verify deployment
/Users/kris/anaconda3/condabin/conda run -n aws aws s3 ls s3://skrinak.com/Documents/AAI/pitch/ --profile ksk
```

**Requirements**:
- Conda path: `/Users/kris/anaconda3/condabin/conda`
- Environment: `aws` (contains AWS CLI)
- Profile: `ksk` (required for all AWS operations)
- All objects uploaded with `--acl public-read`

## GitHub Operations
**Repository**: https://github.com/skrinak/AAI-pitch
```bash
# Standard git operations work normally
git add .
git commit -m "feat: description"
git push origin main

# GitHub CLI operations
gh repo view
gh pr create
```

## Implementation Notes

### DO NOT Re-implement Existing Features:
- ❌ Hash-based routing (already implemented)
- ❌ Progress bar (already implemented) 
- ❌ Animated number counters (already implemented)
- ❌ Keyboard shortcuts system (already implemented)
- ❌ Basic slide navigation (already implemented)

### Available for Implementation:
- ✅ Fullscreen presentation mode toggle
- ✅ Mobile swipe gestures for navigation
- ✅ CSS-only animated charts for revenue data
- ✅ Print-optimized CSS for PDF export
- ✅ Additional accessibility improvements

## Current Todo Status
See `TodoWrite` tool for active task tracking. Always update todos when starting/completing tasks.

---
**Remember**: Every feature must work in AWS S3 static hosting environment!