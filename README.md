# PrintCRM - Marketing & Digital Printing Management System

A comprehensive CRM application designed specifically for marketing and digital printing departments, featuring project management, calendar scheduling, stock management with multiple measurement units, and dynamic budget tracking.

## 🚀 Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

This application is pre-configured for one-click deployment to Netlify with serverless functions.

## ✨ Features

### 📊 **Project Management**

- Multi-status tracking (To Do, On Going, Pending Approval, Completed)
- Priority levels with visual indicators
- Progress tracking with milestone management
- Client and team assignment
- Timeline and deadline management
- Advanced filtering and search

### 📅 **Calendar & Timeline**

- Monthly calendar view with color-coded events
- Project timeline visualization
- Milestone tracking
- Event management (meetings, deadlines, production)
- Upcoming events preview

### 📦 **Smart Stock Management**

- Multiple measurement units (m², units, length, weight, volume)
- 14 different unit types for diverse materials
- Low stock alerts and out-of-stock tracking
- Supplier management with contact information
- Location and warehouse tracking
- Real-time inventory value calculation

### 💰 **Budget Management** (Ready for Implementation)

- Dynamic budget tracking
- Material cost integration
- Real-time cost calculations
- Profit/loss analysis
- Multi-currency support

### 🎨 **Modern UI/UX**

- Responsive design for all devices
- Professional dark/light theme support
- Intuitive navigation with role-based access
- Fast loading with optimized performance

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Express.js with Netlify Functions
- **Routing**: React Router 6 SPA mode
- **UI Components**: Radix UI + Lucide Icons
- **Build**: Vite for fast development and building
- **Deployment**: Netlify with automatic CI/CD

## 📁 Project Structure

```
client/                   # React SPA frontend
├── pages/               # CRM pages (Dashboard, Projects, etc.)
├── components/ui/       # Reusable UI components
├── components/layout/   # Layout components
├── lib/                # Utilities and helpers
└── global.css          # TailwindCSS styling

server/                  # Express API backend
├── routes/             # API route handlers
└── index.ts           # Server configuration

netlify/                # Netlify deployment
└── functions/         # Serverless functions

shared/                 # Shared TypeScript types
└── crm-types.ts       # CRM data models
```

## 🚀 Deployment Options

### Option 1: Automatic Netlify Deployment

1. Fork this repository
2. Connect to Netlify
3. Deploy automatically with pre-configured settings

### Option 2: Manual Netlify Deployment

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy with Netlify CLI
netlify deploy --prod --dir=dist/spa
```

### Option 3: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

## 📋 Environment Setup

### Required Files

- ✅ `netlify.toml` - Netlify configuration
- ✅ `.nvmrc` - Node.js version specification
- ✅ `package.json` - Dependencies and scripts
- ✅ API functions in `netlify/functions/`

### Environment Variables (Optional)

Set these in Netlify dashboard for production:

- `NODE_ENV=production`
- Any database connection strings
- API keys for external services

## 🔧 Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server (local)
npm run typecheck  # TypeScript validation
npm test          # Run tests
```

## 📊 CRM Features Overview

### Dashboard

- Real-time project statistics
- Revenue tracking
- Team utilization metrics
- Low stock alerts
- Upcoming deadlines

### Projects

- Create and manage printing projects
- Track through completion stages
- Assign team members
- Monitor budgets and timelines
- Client communication

### Calendar

- Visual project scheduling
- Milestone tracking
- Event management
- Timeline views
- Deadline monitoring

### Stock

- Multi-unit inventory tracking
- Supplier management
- Location tracking
- Automatic reorder alerts
- Value calculations

## 🤝 Contributing

This CRM is designed for marketing and digital printing operations. Contributions are welcome for:

- Additional measurement units
- Enhanced reporting features
- Integration with printing equipment
- Advanced budget forecasting
- Client portal features

## ��� License

This project is proprietary software designed for PrintCRM operations.

---

**Ready to deploy?** Click the Netlify button above or follow the deployment instructions in `DEPLOYMENT.md`.
