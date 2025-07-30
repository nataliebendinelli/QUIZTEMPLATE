# Implementation Guide for New Tools

## 1. Social Sharing Implementation

### Basic Usage
```jsx
import SocialShare from './components/SocialShare';

// In your quiz results component
<SocialShare 
  quizTitle="Marketing Assessment"
  score={85}
  url="https://yoursite.com/quiz/marketing"
/>
```

### Advanced Features
- Track social shares with analytics
- Custom share messages per quiz
- Incentivize sharing with rewards
- Viral loop mechanics

## 2. Data Visualization Setup

### Quiz Analytics Dashboard
```jsx
import QuizAnalytics from './components/QuizAnalytics';

// In your admin panel
<QuizAnalytics quizId="quiz-123" />
```

### Custom Charts
```jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

// Conversion funnel visualization
const data = [
  { step: 'Started', users: 1000 },
  { step: 'Q1 Completed', users: 950 },
  { step: 'Q2 Completed', users: 850 },
  { step: 'Email Submitted', users: 650 },
  { step: 'Converted', users: 150 }
];
```

## 3. Testing Framework

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run cypress:open

# Component tests
npm run cypress:component
```

### Write Tests
```javascript
// Quiz component test
describe('QuizForm', () => {
  it('validates email input', () => {
    cy.mount(<QuizForm />);
    cy.get('[data-testid="email-input"]').type('invalid');
    cy.get('[data-testid="submit-btn"]').click();
    cy.contains('Please enter a valid email').should('be.visible');
  });
});
```

## 4. Lead Enrichment

### Setup
1. Get API key from Clearbit
2. Add to `.env`: `CLEARBIT_API_KEY=your_key`

### Usage
```javascript
import leadEnrichment from './services/leadEnrichment';

// Enrich on form submission
const handleQuizComplete = async (data) => {
  const enriched = await leadEnrichment.enrichLead(data.email);
  
  if (enriched.enriched) {
    // Save enriched data
    const leadScore = leadEnrichment.calculateLeadScore(enriched.data);
    
    // Route hot leads to sales
    if (leadScore.category === 'Hot') {
      notifySales(enriched.data);
    }
  }
};
```

## 5. Integration with Existing Tools

### Connect Analytics
```javascript
// In your main App component
import ReactGA from 'react-ga4';
import { hotjar } from '@hotjar/browser';
import posthog from 'posthog-js';

// Initialize
ReactGA.initialize('G-XXXXXXXXXX');
hotjar.initialize(HJID, HJSV);
posthog.init('YOUR_API_KEY');

// Track quiz events
const trackQuizStart = () => {
  ReactGA.event('quiz_start', { quiz_id: 'marketing-assessment' });
  posthog.capture('quiz_started');
};
```

### A/B Testing with GrowthBook
```jsx
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";

const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "YOUR_CLIENT_KEY",
  enableDevMode: true,
});

// Test different quiz flows
function QuizPage() {
  const showNewDesign = gb.getFeatureValue("new-quiz-design", false);
  
  return showNewDesign ? <ModernQuiz /> : <ClassicQuiz />;
}
```

## 6. Performance Optimization

### Lazy Load Heavy Components
```javascript
import { lazy, Suspense } from 'react';

const QuizAnalytics = lazy(() => import('./components/QuizAnalytics'));

function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <QuizAnalytics />
    </Suspense>
  );
}
```

### Optimize Charts
```javascript
// Use virtualization for large datasets
import { VirtualizedList } from 'react-window';

// Debounce chart updates
import { useMemo } from 'react';
const chartData = useMemo(() => processData(rawData), [rawData]);
```

## 7. Security Best Practices

### Sanitize User Input
```javascript
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### Rate Limiting
```javascript
// Already installed with express-rate-limit
app.use('/api/quiz', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
}));
```

## Next Steps

1. **Configure Environment Variables**
   - Add API keys for Clearbit, analytics tools
   - Set up test environment

2. **Customize Components**
   - Modify styling to match brand
   - Add custom quiz logic

3. **Set Up CI/CD**
   - Configure GitHub Actions
   - Add test automation

4. **Deploy**
   - Choose hosting (Vercel, Netlify, AWS)
   - Set up monitoring