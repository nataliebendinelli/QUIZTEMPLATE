import Decimal from 'decimal.js';

export const WOTC_CATEGORIES = {
  VETERANS: {
    id: 'veterans',
    label: 'Military Veterans',
    percentage: 0.20,
    creditAmount: 5600,
    description: 'up to $5,600 per hire'
  },
  SNAP: {
    id: 'snap',
    label: 'People receiving food stamps',
    percentage: 0.30,
    creditAmount: 2400,
    description: 'up to $2,400 per hire'
  },
  LONG_TERM_UNEMPLOYED: {
    id: 'ltu',
    label: 'People unemployed for 6+ months',
    percentage: 0.30,
    creditAmount: 2400,
    description: 'up to $2,400 per hire'
  },
  JOB_TRAINING: {
    id: 'job_training',
    label: 'People from job training programs',
    percentage: 0.30,
    creditAmount: 2400,
    description: 'up to $2,400 per hire'
  },
  LOW_INCOME_AREAS: {
    id: 'low_income',
    label: 'People living in low-income areas',
    percentage: 0.30,
    creditAmount: 3000,
    description: 'up to $3,000 per hire'
  },
  NOT_SURE: {
    id: 'not_sure',
    label: 'Not sure',
    percentage: 0.20,
    creditAmount: 1200,
    description: 'up to $1,200 per hire'
  }
};

export const RD_CREDIT_TIERS = {
  SMALL: {
    min: 5000,
    max: 25000,
    qualifyChance: 0.60,
    averageCredit: 3000
  },
  MEDIUM: {
    min: 25000,
    max: 100000,
    qualifyChance: 0.70,
    averageCredit: 12000
  },
  LARGE: {
    min: 100000,
    max: Infinity,
    qualifyChance: 0.80,
    averageCredit: 35000
  }
};

export const EMPOWERMENT_ZONE_CONFIG = {
  percentageOfEmployees: 0.15,
  creditPerEmployee: 3000
};

export const roundToHundred = (value) => {
  const decimal = new Decimal(value);
  return decimal.dividedBy(100).round().times(100).toNumber();
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];