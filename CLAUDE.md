# Claude Development Guide - Applied AI Investing Pitch

## Project Overview
React-based interactive pitch deck for Applied AI Investing with 11 slides, product slideshow, and presenter guide.

**Live URLs:**
- Main Pitch: http://aai-pitch.s3-website-us-west-2.amazonaws.com  
- Product Slideshow: http://aai-pitch.s3-website-us-west-2.amazonaws.com/slideshow.html
- Presenter Guide: http://aai-pitch.s3-website-us-west-2.amazonaws.com/presenter-guide.html

## CRITICAL: AWS S3 Static Hosting Only
**DO:** Client-side only, hash-based routing, browser APIs
**DO NOT:** Server-side code, backend APIs, Node.js runtime

## Components
- **Main Pitch** (`src/App.js`): 11-slide React presentation with hash routing
- **Product Slideshow** (`public/slideshow.html`): 11 product screenshots with auto-scroll  
- **Presenter Guide** (`public/presenter-guide.html`): Talking points and timing

## Key Features  
- Hash-based routing for S3 compatibility
- Animated statistics and progress tracking
- Keyboard shortcuts (? for help)
- Mobile responsive design
- Auto-scrolling for tall images (home/portfolio slides)
- Founders page with LinkedIn photos

## Development Commands
```bash
# Development server
npm start

# Production build  
npm run build

# Test production locally
npx serve -s build -l 3001
```

## AWS S3 Deployment
**CRITICAL: Use conda environment and profile**
```bash
# Activate conda environment and deploy
source /Users/kris/anaconda3/etc/profile.d/conda.sh && conda activate aws && aws s3 sync build/ s3://aai-pitch --profile ksk --delete
```

**Requirements:**  
- Conda path: `/Users/kris/anaconda3/condabin/conda`
- Environment: `aws` 
- Profile: `ksk`


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