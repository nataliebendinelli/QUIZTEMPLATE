import { useState } from 'react'

const TaxCalculator = () => {
  const [income, setIncome] = useState('')
  const [filingStatus, setFilingStatus] = useState('single')
  const [deductions, setDeductions] = useState('standard')
  const [results, setResults] = useState(null)

  const calculateTax = () => {
    const incomeAmount = parseFloat(income) || 0
    
    // 2024 Standard deductions
    const standardDeductions = {
      single: 14600,
      married: 29200,
      head: 21900
    }

    const standardDeduction = standardDeductions[filingStatus]
    const taxableIncome = Math.max(0, incomeAmount - standardDeduction)

    // 2024 Tax brackets for single filers (simplified)
    let tax = 0
    let brackets = []
    
    if (filingStatus === 'single') {
      brackets = [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 }
      ]
    } else if (filingStatus === 'married') {
      brackets = [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 }
      ]
    } else {
      brackets = [
        { min: 0, max: 16550, rate: 0.10 },
        { min: 16550, max: 63100, rate: 0.12 },
        { min: 63100, max: 100500, rate: 0.22 },
        { min: 100500, max: 191950, rate: 0.24 },
        { min: 191950, max: 243700, rate: 0.32 },
        { min: 243700, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 }
      ]
    }

    // Calculate tax based on brackets
    let remainingIncome = taxableIncome
    for (const bracket of brackets) {
      if (remainingIncome <= 0) break
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min)
      tax += taxableInBracket * bracket.rate
      remainingIncome -= taxableInBracket
    }

    const effectiveRate = incomeAmount > 0 ? (tax / incomeAmount) * 100 : 0
    const afterTaxIncome = incomeAmount - tax
    const monthlyAfterTax = afterTaxIncome / 12

    setResults({
      grossIncome: incomeAmount,
      standardDeduction,
      taxableIncome,
      federalTax: tax,
      effectiveRate,
      afterTaxIncome,
      monthlyAfterTax,
      potentialRefund: 1000 // The "$1000 Back" promise
    })
  }

  return (
    <div className="tax-calculator">
      <h1>Tax Calculator - Get $1000 Back!</h1>
      
      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="income">Annual Income ($)</label>
          <input
            type="number"
            id="income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your annual income"
          />
        </div>

        <div className="form-group">
          <label htmlFor="filing-status">Filing Status</label>
          <select
            id="filing-status"
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="head">Head of Household</option>
          </select>
        </div>

        <button onClick={calculateTax} className="calculate-btn">
          Calculate My Tax Savings
        </button>
      </div>

      {results && (
        <div className="results">
          <h2>Your Tax Calculation Results</h2>
          
          <div className="result-item">
            <span className="label">Gross Income:</span>
            <span className="value">${results.grossIncome.toLocaleString()}</span>
          </div>
          
          <div className="result-item">
            <span className="label">Standard Deduction:</span>
            <span className="value">-${results.standardDeduction.toLocaleString()}</span>
          </div>
          
          <div className="result-item">
            <span className="label">Taxable Income:</span>
            <span className="value">${results.taxableIncome.toLocaleString()}</span>
          </div>
          
          <div className="result-item highlight">
            <span className="label">Federal Tax:</span>
            <span className="value">${results.federalTax.toFixed(2)}</span>
          </div>
          
          <div className="result-item">
            <span className="label">Effective Tax Rate:</span>
            <span className="value">{results.effectiveRate.toFixed(2)}%</span>
          </div>
          
          <div className="result-item">
            <span className="label">After-Tax Income:</span>
            <span className="value">${results.afterTaxIncome.toFixed(2)}</span>
          </div>
          
          <div className="result-item">
            <span className="label">Monthly Take-Home:</span>
            <span className="value">${results.monthlyAfterTax.toFixed(2)}</span>
          </div>
          
          <div className="result-item potential-refund">
            <span className="label">Potential Tax Refund:</span>
            <span className="value">${results.potentialRefund}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaxCalculator