# HMA Marketing Dashboard 1.0

A comprehensive React-based marketing operations platform for Hummer Mower & Associates, designed to track campaign performance, demonstrate ROI, and scale marketing operations.

## 🎯 Overview

HMA Dashboard 1.0 is a professional marketing analytics platform that provides real-time insights into email campaigns, website performance, contact engagement, and project management. Built with React 19.1.0 and Material-UI, it's designed for GitHub Pages deployment with a static data architecture.

## ✨ Key Features

### Analytics & Reporting
- **Email Campaign Analytics**: Track open rates (60.6%), click rates (11.9%), and engagement trends
- **Website Performance**: Monitor GA4 metrics including sessions (1,703), users (1,277), and engagement
- **Contact Engagement**: Detailed interaction tracking across 1,152 unique contacts
- **Historical Trends**: 12-month trend visualization with month-over-month comparisons

### Project Management
- **Timeline Visualization**: Interactive Gantt charts for project tracking
- **Task Management**: Track completion rates and deadlines
- **Project Progress**: Real-time status updates with visual indicators
- **Resource Allocation**: Monitor team assignments and workload

### Data Management
- **Automated Updates**: Weekly data refresh system with versioning
- **Historical Preservation**: 24-month data archiving
- **Real Data Integrity**: Verified authentic HMA metrics (no placeholders)
- **Backup System**: Timestamped data backups before each update

### Marketing Assets
- **Materials Library**: Categorized asset management system
- **Newsletter Archive**: Performance tracking for all campaigns
- **Blog Analytics**: Engagement metrics and content performance
- **Brand Assets**: Centralized repository for marketing collateral

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/HMA-Marketing-Dashboard.git
cd HMA-Marketing-Dashboard

# Install dependencies
npm install

# Start development server
npm start
```

The dashboard will be available at `http://localhost:3000`

### Production Build

```bash
# Create optimized build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📊 Data Architecture

### Static JSON Structure
```
public/data/
├── email_analytics.json      # Email campaign metrics
├── website_analytics.json    # GA4 website data
├── linkedin_analytics.json   # LinkedIn performance
├── contacts.json            # Contact engagement data
├── projects.json            # Project management data
├── team.json               # Team information
├── trend_data.json         # Generated historical trends
├── last_updated.json       # Update timestamps
└── historical/             # Archived monthly data
    ├── email_historical.json
    ├── website_historical.json
    └── linkedin_historical.json
```

### Data Update Process

1. **Manual Updates**
   ```bash
   # Update dashboard with new data
   node scripts/update_dashboard_data.js
   
   # Deploy updated data
   npm run deploy-data
   ```

2. **Automated Updates** (via GitHub Actions)
   - Weekly updates every Monday at 9 AM
   - Automatic backups before updates
   - Data validation and consistency checks

## 🛠️ Technical Stack

- **Frontend**: React 19.1.0
- **UI Framework**: Material-UI 5.x
- **Charts**: Chart.js & Recharts
- **Routing**: React Router (HashRouter for GitHub Pages)
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages
- **Data Format**: Static JSON files

## 📈 Key Metrics Tracked

### Email Performance
- Open rates and click-through rates
- Campaign-by-campaign analysis
- Click-to-open ratios
- Engagement trends over time

### Website Analytics
- Sessions and unique users
- Page views and bounce rates
- Average session duration
- Traffic sources and user behavior

### Contact Engagement
- Individual contact interaction history
- Engagement scores and patterns
- Communication preferences
- Response rates by channel

## 🔐 Data Authenticity

This dashboard exclusively uses **real HMA data**. We maintain strict data authenticity through:
- Verification scripts that detect placeholder data
- Real data processors that validate metrics
- Historical preservation of actual performance
- Regular audits of data sources

See `DATA_AUTHENTICITY_PRINCIPLE.md` for details.

## 📱 Mobile Responsiveness

The dashboard is fully responsive and optimized for:
- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎨 Brand Consistency

- **Primary Color**: HMA Green (#105938)
- **Typography**: Roboto font family
- **Icons**: Material-UI icon set
- **Charts**: Consistent color palette across visualizations

## 🚦 Routes

- `/` - Main dashboard with KPI overview
- `/analytics/email` - Email campaign analytics
- `/analytics/website` - Website performance metrics
- `/analytics/linkedin` - LinkedIn engagement data
- `/contact-engagement` - Individual contact tracking
- `/timeline` - Project timeline visualization
- `/materials` - Marketing materials library
- `/trends` - Historical trend analysis
- `/project-tracker` - Project progress monitoring
- `/data-management` - Data update interface

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:
```
REACT_APP_GA_TRACKING_ID=your-ga-id
REACT_APP_API_ENDPOINT=your-api-url
```

### Customization
- Update brand colors in `src/theme.js`
- Modify navigation in `src/components/Layout/Sidebar.jsx`
- Add new metrics in `src/components/Dashboard/MetricCard.jsx`

## 📚 Documentation

- [Build Guide](./BUILD_GUIDE.md) - Detailed build and deployment instructions
- [Data Update Guide](./docs/data-update-guide.md) - How to update dashboard data
- [Component Documentation](./docs/components.md) - React component reference
- [API Reference](./docs/api-reference.md) - Data structure documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Check the [Build Guide](./BUILD_GUIDE.md)
- Review console logs for errors
- Validate JSON data structure
- Contact the development team

## 📄 License

This project is proprietary software owned by Hummer Mower & Associates. All rights reserved.

---

**Built with ❤️ for HMA's marketing team** | Version 1.0.0 | Last Updated: June 2025