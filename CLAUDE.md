# Claude Development Context for Applied AI Investing Pitch Deck

## Project Overview
This is a **React-based interactive pitch presentation** for Applied AI Investing - showcasing the "YouTube of Algorithmic Trading" concept. The app presents a 10-slide investor pitch deck with professional styling and smooth animations.

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
- ✅ Interactive slide navigation (keyboard arrows, click indicators)
- ✅ 10 professionally styled slides with company pitch content
- ✅ Smooth CSS transitions and animations
- ✅ Fully responsive design (desktop, tablet, mobile)
- ✅ Professional styling with gradient backgrounds

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
- Implement hash-based routing (`window.location.hash`)
- Use CSS-only animations and transitions
- Embed all data directly in React components
- Use browser APIs for features (Fullscreen, Print, etc.)

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

### App.js (lines to note)
- `slides` array (lines 8-69): Contains all slide content
- `renderSlideContent()` (lines 107-542): Renders slide-specific content
- Navigation functions (lines 71-96): Handle slide transitions
- Keyboard controls (lines 98-105): Arrow key navigation

### App.css (key sections)
- `.presentation-app` (lines 15-43): Main layout and background
- Slide-specific styles: `.title-slide`, `.problem-slide`, etc.
- Responsive breakpoints (lines 1070-1160): Mobile optimizations
- Animation keyframes: `@keyframes` declarations

## Common Development Tasks

### Adding New Features
1. Check S3 compatibility first
2. Update `TASKS.md` with implementation details
3. Use browser-native APIs when possible
4. Test on mobile devices and various screen sizes
5. Ensure accessibility (ARIA labels, keyboard navigation)

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

## Current Todo Status
See `TodoWrite` tool for active task tracking. Always update todos when starting/completing tasks.

---
**Remember**: Every feature must work in AWS S3 static hosting environment!