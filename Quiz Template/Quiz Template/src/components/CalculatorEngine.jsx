import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { Decimal } from 'decimal.js';
import { Calculator, DollarSign, Percent, TrendingUp } from 'lucide-react';

export default function CalculatorEngine({ formula, variables, onResult, title = "Calculator" }) {
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    calculateResult();
  }, [values, formula]);

  const calculateResult = () => {
    try {
      if (!formula || Object.keys(values).length === 0) {
        setResult(null);
        return;
      }

      // Check if all required variables have values
      const requiredVars = variables || [];
      const hasAllValues = requiredVars.every(varName => 
        values[varName] !== undefined && values[varName] !== ''
      );

      if (!hasAllValues) {
        setResult(null);
        return;
      }

      // Convert string values to numbers
      const numericValues = {};
      Object.entries(values).forEach(([key, value]) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          numericValues[key] = numValue;
        }
      });

      // Use mathjs to evaluate the formula
      const calculatedResult = evaluate(formula, numericValues);
      
      // Use Decimal.js for precise decimal calculations
      const preciseResult = new Decimal(calculatedResult);
      
      setResult(preciseResult.toNumber());
      setError(null);
      
      // Notify parent component
      onResult?.(preciseResult.toNumber(), numericValues);
      
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const updateValue = (variable, value) => {
    setValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const formatResult = (value) => {
    if (value === null || value === undefined) return '';
    
    // Format based on the type of calculation
    if (formula.includes('*') && formula.includes('100')) {
      // Likely a percentage
      return `${value.toFixed(2)}%`;
    } else if (formula.includes('mortgage') || formula.includes('payment')) {
      // Currency formatting
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    } else {
      // Default numeric formatting
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="text-blue-600" size={24} />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      <div className="space-y-4">
        {variables?.map((variable) => (
          <div key={variable} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {variable.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <input
              type="number"
              step="any"
              value={values[variable] || ''}
              onChange={(e) => updateValue(variable, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter ${variable}`}
            />
          </div>
        ))}

        {formula && (
          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <div className="text-sm font-medium text-gray-600 mb-1">Formula:</div>
            <code className="text-sm font-mono text-gray-800">{formula}</code>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {result !== null && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-lg font-semibold text-blue-900">
              Result: {formatResult(result)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-built calculator components
export function ROICalculator({ onResult }) {
  return (
    <CalculatorEngine
      title="ROI Calculator"
      formula="((revenue - investment) / investment) * 100"
      variables={['revenue', 'investment']}
      onResult={onResult}
    />
  );
}

export function MortgageCalculator({ onResult }) {
  return (
    <CalculatorEngine
      title="Mortgage Calculator"
      formula="principal * (monthlyRate * (1 + monthlyRate)^months) / ((1 + monthlyRate)^months - 1)"
      variables={['principal', 'monthlyRate', 'months']}
      onResult={onResult}
    />
  );
}

export function LoanCalculator({ onResult }) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!principal || !rate || !years) return;

    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12; // Monthly rate
    const n = parseFloat(years) * 12; // Total months

    const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    const calculationResult = {
      monthlyPayment,
      totalPayment,
      totalInterest
    };

    setResult(calculationResult);
    onResult?.(calculationResult);
  };

  useEffect(() => {
    calculate();
  }, [principal, rate, years]);

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="text-green-600" size={24} />
        <h3 className="text-xl font-semibold">Loan Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Enter loan amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (% per year)
          </label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Enter interest rate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Enter loan term"
          />
        </div>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-lg font-semibold text-green-900">
                Monthly Payment: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(result.monthlyPayment)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">Total Payment</div>
                <div className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(result.totalPayment)}
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">Total Interest</div>
                <div className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(result.totalInterest)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SavingsCalculator({ onResult }) {
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!monthlyDeposit || !interestRate || !years) return;

    const pmt = parseFloat(monthlyDeposit);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly rate
    const n = parseFloat(years) * 12; // Total months

    // Future value of annuity formula
    const futureValue = pmt * ((Math.pow(1 + r, n) - 1) / r);
    const totalDeposits = pmt * n;
    const interestEarned = futureValue - totalDeposits;

    const calculationResult = {
      futureValue,
      totalDeposits,
      interestEarned
    };

    setResult(calculationResult);
    onResult?.(calculationResult);
  };

  useEffect(() => {
    calculate();
  }, [monthlyDeposit, interestRate, years]);

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-600" size={24} />
        <h3 className="text-xl font-semibold">Savings Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Deposit ($)
          </label>
          <input
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter monthly deposit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter interest rate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Years
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number of years"
          />
        </div>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-lg font-semibold text-blue-900">
                Future Value: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(result.futureValue)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">Total Deposits</div>
                <div className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(result.totalDeposits)}
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">Interest Earned</div>
                <div className="font-semibold text-green-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(result.interestEarned)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}