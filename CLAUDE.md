# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## HMA Marketing Dashboard - Development Guide

### Build & Development Commands

```bash
# Install dependencies
npm install

# Generate static data files (runs automatically before start/build)
npm run generate-data

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Deploy to GitHub Pages (builds and deploys)
npm run deploy
```

### Project Architecture

This is a React-based marketing analytics dashboard for Hummer Mower & Associates that:

- **Uses static data generation**: The `scripts/generate-static-data.js` script creates JSON files in `public/data/` with mock analytics data
- **Deployed on GitHub Pages**: Uses HashRouter and PUBLIC_URL for static hosting compatibility  
- **Material-UI components**: All UI components use MUI (@mui/material) with a custom green/red theme
- **Mock Supabase client**: `src/supabaseClient.js` provides static mock responses instead of real database calls
- **Sidebar navigation**: Main navigation uses `src/components/Sidebar.jsx` with routes for Analytics, Projects, Materials, etc.

### Key Application Structure

- **Main App**: `src/App.jsx` sets up routing with HashRouter and MUI theme
- **Dashboard**: `src/components/Dashboard.jsx` is the main landing page showing analytics summaries
- **Data Flow**: Components fetch data from static JSON files in `/public/data/` rather than live APIs
- **Analytics Pages**: Separate pages for Email, Website, and LinkedIn analytics with chart visualizations
- **Project Management**: Timeline view and project detail pages for tracking marketing campaigns
- **Static Generation**: Data files are regenerated on each build via the `prestart` and `prebuild` scripts

### Data Management

The app uses static JSON files for all data:
- `public/data/email_analytics.json` - Email campaign metrics
- `public/data/website_analytics.json` - Website traffic data  
- `public/data/linkedin_analytics.json` - LinkedIn engagement metrics
- `public/data/contacts.json` - Contact management and engagement tracking
- `public/data/projects.json` - Marketing project timelines and tasks
- `public/data/team.json` - Team member information

### Component Patterns

- All components use Material-UI for consistent styling
- Data fetching uses standard fetch API with error handling
- Charts use Chart.js via react-chartjs-2
- Routing handled by react-router-dom with HashRouter for GitHub Pages compatibility
- File uploads use react-dropzone (though files are not actually stored)