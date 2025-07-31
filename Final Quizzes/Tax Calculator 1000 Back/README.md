# Accrue Tax Credit Calculator

An interactive web-based calculator that helps small business owners discover $10,000+ in payroll tax credits they qualify for.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your actual values

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 📋 Features

- **Multi-step Quiz**: 4-step interactive form with progress tracking
- **4 Credit Types**: WOTC, R&D, Empowerment Zone, and State credits
- **Smart Calculations**: Conservative estimates based on government programs
- **Mobile Responsive**: Optimized for all devices with touch-friendly controls
- **Analytics Integration**: GA4, Hotjar, PostHog tracking
- **Lead Capture**: Form validation with 90-day guarantee messaging
- **Exit Intent**: Modal with PDF download offer
- **Social Sharing**: Share results on Facebook, Twitter, LinkedIn

## 🏗️ Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── data/              # Configuration and constants
│   ├── utils/             # Calculation engine and analytics
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind styles
├── public/                # Static assets
├── index.html             # HTML template
└── package.json           # Dependencies
```

## 🔧 Configuration

### Analytics Setup

1. Replace `GA_MEASUREMENT_ID` in `index.html` with your Google Analytics ID
2. Replace `HOTJAR_ID` in `index.html` with your Hotjar ID
3. Update PostHog API key in `.env`

### Credit Rules

Edit the following files to update credit calculation rules:
- `src/data/constants.js` - WOTC categories and R&D tiers
- `src/data/state_credit_rules.json` - State-specific credits
- `src/data/empowerment_zones.json` - Qualifying ZIP codes

## 🧪 Testing

Run Cypress tests:
```bash
npm run test
```

Run Playwright tests:
```bash
npm run test:e2e
```

## 📊 Performance Targets

- Mobile Lighthouse score: ≥90
- Desktop Lighthouse score: ≥90
- Bundle size: <350KB gzipped
- Quiz completion rate: ≥55%
- Lead capture rate: ≥40%

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

Or use your preferred hosting platform (Netlify, AWS, etc.)

## 📝 License

Proprietary - Accrue Inc. All rights reserved.