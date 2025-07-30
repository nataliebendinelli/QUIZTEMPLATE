# SurveyJS Setup Guide

## What's Included

1. **survey-library**: Core SurveyJS library for rendering forms
2. **survey-creator**: Drag-and-drop form builder tool

## Quick Start

### Option 1: Using CDN (Easiest)
```html
<!-- Add to your HTML -->
<script src="https://unpkg.com/survey-core/survey.core.min.js"></script>
<script src="https://unpkg.com/survey-js-ui/survey-js-ui.min.js"></script>
<link href="https://unpkg.com/survey-core/defaultV2.min.css" type="text/css" rel="stylesheet">
```

### Option 2: NPM Installation
```bash
npm install survey-core survey-js-ui survey-creator-core survey-creator-js
```

## Basic Quiz Example

```javascript
const surveyJson = {
  title: "Lead Generation Quiz",
  pages: [{
    questions: [{
      type: "radiogroup",
      name: "industry",
      title: "What industry are you in?",
      choices: ["Technology", "Healthcare", "Finance", "Other"],
      isRequired: true
    }, {
      type: "text",
      name: "email",
      title: "What's your email?",
      inputType: "email",
      isRequired: true
    }]
  }],
  completedHtml: "Thank you for completing our quiz!"
};

// Initialize survey
const survey = new Survey.Model(surveyJson);
survey.render("surveyContainer");

// Capture leads
survey.onComplete.add((result) => {
  console.log("Lead captured:", result.data);
  // Send to your CRM or database
});
```

## Calculator Example

```javascript
const calculatorJson = {
  title: "ROI Calculator",
  pages: [{
    questions: [{
      type: "text",
      name: "revenue",
      title: "Monthly Revenue",
      inputType: "number",
      isRequired: true
    }, {
      type: "text",
      name: "costs",
      title: "Monthly Costs",
      inputType: "number",
      isRequired: true
    }]
  }],
  calculatedValues: [{
    name: "profit",
    expression: "{revenue} - {costs}"
  }, {
    name: "roi",
    expression: "({profit} / {costs}) * 100"
  }],
  completedHtmlOnCondition: [{
    expression: "{roi} > 0",
    html: "Your ROI is {roi}%! Let's discuss how we can improve it further."
  }]
};
```

## Resources

- Documentation: https://surveyjs.io/documentation
- Examples: https://surveyjs.io/form-library/examples/overview
- Form Builder Demo: https://surveyjs.io/create-free-survey