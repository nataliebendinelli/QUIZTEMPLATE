import Decimal from 'decimal.js';
import { WOTC_CATEGORIES, RD_CREDIT_TIERS, EMPOWERMENT_ZONE_CONFIG, roundToHundred } from '../data/constants.js';
import empowermentZones from '../data/empowerment_zones.json';
import stateRules from '../data/state_credit_rules.json';

export class CreditCalculator {
  constructor(input) {
    this.hires = input.hires || 0;
    this.state = input.state || '';
    this.zip = input.zip || '';
    this.rdSpend = input.rdSpend || 0;
    this.categories = input.categories || [];
  }

  calculate() {
    const wotcCredit = this.calculateWOTC();
    const rdCredit = this.calculateRDCredit();
    const empowermentCredit = this.calculateEmpowermentZoneCredit();
    const stateCredit = this.calculateStateCredit();

    // Handle conflicts between WOTC and Empowerment Zone
    const resolvedCredits = this.resolveConflicts({
      wotc: wotcCredit,
      empowerment: empowermentCredit
    });

    const totalCredit = new Decimal(resolvedCredits.wotc)
      .plus(rdCredit)
      .plus(resolvedCredits.empowerment)
      .plus(stateCredit);

    return {
      total: roundToHundred(totalCredit.toNumber()),
      breakdown: {
        wotc: roundToHundred(resolvedCredits.wotc),
        rd: roundToHundred(rdCredit),
        empowerment: roundToHundred(resolvedCredits.empowerment),
        state: roundToHundred(stateCredit)
      },
      details: {
        wotcQualifiedHires: this.getWOTCQualifiedHires(),
        rdQualifyChance: this.getRDQualifyChance(),
        empowermentQualified: this.isInEmpowermentZone(),
        stateProgram: this.getStateProgram()
      }
    };
  }

  calculateWOTC() {
    if (this.categories.length === 0 || this.hires === 0) return 0;

    // Find the category with the highest percentage
    let highestCategory = null;
    let highestPercentage = 0;

    this.categories.forEach(categoryId => {
      const category = Object.values(WOTC_CATEGORIES).find(c => c.id === categoryId);
      if (category && category.percentage > highestPercentage) {
        highestCategory = category;
        highestPercentage = category.percentage;
      }
    });

    if (!highestCategory) return 0;

    const qualifiedHires = Math.ceil(this.hires * highestCategory.percentage);
    const credit = new Decimal(qualifiedHires).times(highestCategory.creditAmount);

    return credit.toNumber();
  }

  calculateRDCredit() {
    if (this.rdSpend < RD_CREDIT_TIERS.SMALL.min) return 0;

    let tier = null;
    if (this.rdSpend < RD_CREDIT_TIERS.SMALL.max) {
      tier = RD_CREDIT_TIERS.SMALL;
    } else if (this.rdSpend < RD_CREDIT_TIERS.MEDIUM.max) {
      tier = RD_CREDIT_TIERS.MEDIUM;
    } else {
      tier = RD_CREDIT_TIERS.LARGE;
    }

    // According to PDF page 4: Base credit = R&D spend × 20%, then apply qualify chance
    const baseCredit = new Decimal(this.rdSpend).times(0.20);
    const conservativeEstimate = baseCredit.times(tier.qualifyChance);

    return conservativeEstimate.toNumber();
  }

  calculateEmpowermentZoneCredit() {
    if (!this.zip || !this.isInEmpowermentZone()) return 0;

    const qualifiedEmployees = Math.ceil(this.hires * EMPOWERMENT_ZONE_CONFIG.percentageOfEmployees);
    const credit = new Decimal(qualifiedEmployees).times(EMPOWERMENT_ZONE_CONFIG.creditPerEmployee);

    return credit.toNumber();
  }

  calculateStateCredit() {
    if (!this.state || !stateRules[this.state] || !stateRules[this.state].enabled) return 0;

    const stateConfig = stateRules[this.state];
    const qualifiedHires = Math.ceil(this.hires * stateConfig.percentage);
    const credit = new Decimal(qualifiedHires).times(stateConfig.creditPerHire);

    return credit.toNumber();
  }

  resolveConflicts(credits) {
    // If both WOTC and Empowerment Zone apply, use the higher amount
    if (credits.wotc > 0 && credits.empowerment > 0) {
      if (credits.wotc >= credits.empowerment) {
        return { wotc: credits.wotc, empowerment: 0 };
      } else {
        return { wotc: 0, empowerment: credits.empowerment };
      }
    }
    return credits;
  }

  isInEmpowermentZone() {
    return empowermentZones.zones.includes(this.zip);
  }

  getWOTCQualifiedHires() {
    if (this.categories.length === 0 || this.hires === 0) return 0;

    let highestPercentage = 0;
    this.categories.forEach(categoryId => {
      const category = Object.values(WOTC_CATEGORIES).find(c => c.id === categoryId);
      if (category && category.percentage > highestPercentage) {
        highestPercentage = category.percentage;
      }
    });

    return Math.ceil(this.hires * highestPercentage);
  }

  getRDQualifyChance() {
    if (this.rdSpend < RD_CREDIT_TIERS.SMALL.min) return 0;

    if (this.rdSpend < RD_CREDIT_TIERS.SMALL.max) {
      return RD_CREDIT_TIERS.SMALL.qualifyChance;
    } else if (this.rdSpend < RD_CREDIT_TIERS.MEDIUM.max) {
      return RD_CREDIT_TIERS.MEDIUM.qualifyChance;
    } else {
      return RD_CREDIT_TIERS.LARGE.qualifyChance;
    }
  }

  getStateProgram() {
    if (!this.state || !stateRules[this.state]) return null;
    return stateRules[this.state];
  }
}

export const calculateTaxCredits = (input) => {
  const calculator = new CreditCalculator(input);
  return calculator.calculate();
};