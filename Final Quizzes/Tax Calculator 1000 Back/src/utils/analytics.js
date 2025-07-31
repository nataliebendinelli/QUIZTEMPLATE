// Google Analytics 4 Event Tracking
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Quiz Events
export const trackQuizStart = () => {
  trackEvent('quiz_start', {
    quiz_name: 'tax_credit_calculator',
    quiz_version: '1.0'
  });
};

export const trackStepComplete = (step, stepName) => {
  trackEvent('step_complete', {
    step_number: step,
    step_name: stepName,
    quiz_name: 'tax_credit_calculator'
  });
};

export const trackQuizComplete = (estimatedSavings) => {
  trackEvent('quiz_complete', {
    quiz_name: 'tax_credit_calculator',
    estimated_savings: estimatedSavings,
    value: estimatedSavings
  });
};

export const trackLeadSubmit = (estimatedSavings) => {
  trackEvent('lead_submit', {
    quiz_name: 'tax_credit_calculator',
    estimated_savings: estimatedSavings,
    value: estimatedSavings,
    currency: 'USD'
  });
};

export const trackShareClick = (platform, estimatedSavings) => {
  trackEvent('share', {
    method: platform,
    content_type: 'quiz_result',
    item_id: 'tax_credit_calculator',
    estimated_savings: estimatedSavings
  });
};

export const trackExitIntent = (currentStep) => {
  trackEvent('exit_intent_shown', {
    quiz_name: 'tax_credit_calculator',
    current_step: currentStep
  });
};

export const trackPDFDownload = () => {
  trackEvent('file_download', {
    file_name: 'tax_credit_cheat_sheet.pdf',
    file_extension: 'pdf',
    link_text: 'Download Tax Credit Cheat Sheet'
  });
};

// PostHog Integration (if needed)
export const initPostHog = () => {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.init('YOUR_POSTHOG_API_KEY', {
      api_host: 'https://app.posthog.com',
      autocapture: true,
      capture_pageview: true,
      mask_all_text: true,
      mask_all_element_attributes: true
    });
  }
};

// GrowthBook A/B Testing
export const getExperimentVariant = (experimentKey, defaultValue) => {
  if (typeof window !== 'undefined' && window.growthbook) {
    const result = window.growthbook.run({
      key: experimentKey,
      variations: [defaultValue, ...arguments].slice(2)
    });
    return result.value;
  }
  return defaultValue;
};