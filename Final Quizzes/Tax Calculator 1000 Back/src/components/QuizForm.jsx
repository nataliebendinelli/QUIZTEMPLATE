import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import { US_STATES, WOTC_CATEGORIES } from '../data/constants';
import { trackStepComplete } from '../utils/analytics';
import empowermentZones from '../data/empowerment_zones.json';

const QuizForm = ({ step, formData, onComplete, onBack }) => {
  const [localData, setLocalData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalData({});
    setErrors({});
  }, [step]);

  const validateStep = () => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!localData.hires || localData.hires <= 0) {
          newErrors.hires = 'Please enter the number of people hired';
        }
        break;
      case 2:
        if (!localData.state) {
          newErrors.state = 'Please select your state';
        }
        if (localData.hasRDSpend && (!localData.rdSpend || localData.rdSpend < 5000)) {
          newErrors.rdSpend = 'R&D spend must be at least $5,000';
        }
        break;
      case 3:
        if (!localData.categories || localData.categories.length === 0) {
          newErrors.categories = 'Please select at least one category';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      const stepNames = ['', 'hiring_volume', 'business_profile', 'hire_categories'];
      trackStepComplete(step, stepNames[step]);
      onComplete(localData);
    }
  };

  const isLowIncomeZoneAvailable = () => {
    return localData.zip && empowermentZones.zones.includes(localData.zip);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="mb-2">How many people have you hired in the last 12 months?</h2>
            <p className="text-gray-600 mb-6">This helps us calculate your potential tax credits.</p>
            
            <div className="mb-8">
              <input
                type="number"
                min="1"
                max="1000"
                value={localData.hires || formData.hires || ''}
                onChange={(e) => setLocalData({ ...localData, hires: parseInt(e.target.value) || 0 })}
                className={`form-input ${errors.hires ? 'border-red-500' : ''}`}
                placeholder="Enter number of hires"
              />
              {errors.hires && <p className="text-red-500 text-sm mt-1">{errors.hires}</p>}
              
              {/* Mobile-friendly slider */}
              <div className="mt-4 md:hidden">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[localData.hires || formData.hires || 0]}
                  onValueChange={(value) => setLocalData({ ...localData, hires: value[0] })}
                  max={100}
                  step={1}
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-accrue-blue rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accrue-blue" />
                </Slider.Root>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="mb-2">Tell us about your business</h2>
            <p className="text-gray-600 mb-6">Different states have different programs, and R&D spending unlocks additional credits.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What state is your business in?
                </label>
                <Select.Root
                  value={localData.state || formData.state}
                  onValueChange={(value) => setLocalData({ ...localData, state: value })}
                >
                  <Select.Trigger className={`form-input flex items-center justify-between ${errors.state ? 'border-red-500' : ''}`}>
                    <Select.Value placeholder="Select your state" />
                    <Select.Icon className="text-gray-400">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                      <Select.Viewport className="p-1">
                        {US_STATES.map((state) => (
                          <Select.Item
                            key={state.value}
                            value={state.value}
                            className="px-3 py-2 text-sm hover:bg-accrue-gray cursor-pointer rounded"
                          >
                            <Select.ItemText>{state.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What's your ZIP code? (optional)
                </label>
                <input
                  type="text"
                  pattern="[0-9]{5}"
                  maxLength="5"
                  value={localData.zip || formData.zip || ''}
                  onChange={(e) => setLocalData({ ...localData, zip: e.target.value.replace(/\D/g, '') })}
                  className="form-input"
                  placeholder="12345"
                />
                <p className="text-xs text-gray-500 mt-1">Helps us check for special zone credits</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Did you spend money on research and development in 2024?
                </label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setLocalData({ ...localData, hasRDSpend: true })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      localData.hasRDSpend === true ? 'bg-accrue-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalData({ ...localData, hasRDSpend: false, rdSpend: 0 })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      localData.hasRDSpend === false ? 'bg-accrue-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {localData.hasRDSpend && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much did you spend on R&D?
                  </label>
                  <div className="mb-2">
                    <input
                      type="number"
                      min="5000"
                      step="1000"
                      value={localData.rdSpend || formData.rdSpend || ''}
                      onChange={(e) => setLocalData({ ...localData, rdSpend: parseInt(e.target.value) || 0 })}
                      className={`form-input ${errors.rdSpend ? 'border-red-500' : ''}`}
                      placeholder="$5,000"
                    />
                    {errors.rdSpend && <p className="text-red-500 text-sm mt-1">{errors.rdSpend}</p>}
                  </div>
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={[localData.rdSpend || formData.rdSpend || 5000]}
                    onValueChange={(value) => setLocalData({ ...localData, rdSpend: value[0] })}
                    min={5000}
                    max={500000}
                    step={5000}
                  >
                    <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                      <Slider.Range className="absolute bg-accrue-blue rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accrue-blue" />
                  </Slider.Root>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$5,000</span>
                    <span>$500,000+</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="mb-2">Did you hire anyone from these groups in the last 12 months?</h2>
            <p className="text-gray-600 mb-6">Different groups qualify for different credit amounts.</p>
            
            <div className="space-y-3">
              {Object.values(WOTC_CATEGORIES).map((category) => {
                const isLowIncome = category.id === 'low_income';
                const isDisabled = isLowIncome && !isLowIncomeZoneAvailable();
                
                return (
                  <label
                    key={category.id}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                      isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-accrue-gray'
                    } ${
                      localData.categories?.includes(category.id) ? 'border-accrue-blue bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 mr-3"
                      checked={localData.categories?.includes(category.id) || false}
                      disabled={isDisabled}
                      onChange={(e) => {
                        const currentCategories = localData.categories || [];
                        if (e.target.checked) {
                          setLocalData({ ...localData, categories: [...currentCategories, category.id] });
                        } else {
                          setLocalData({ ...localData, categories: currentCategories.filter(c => c !== category.id) });
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{category.label}</div>
                      <div className="text-sm text-gray-600">{category.description}</div>
                      {isLowIncome && !isDisabled && (
                        <div className="text-xs text-green-600 mt-1">✓ Available in your ZIP code</div>
                      )}
                    </div>
                  </label>
                );
              })}
              {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="quiz-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
      >
        {renderStepContent()}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={onBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2 ml-auto"
          >
            {step === 3 ? 'Calculate My Credits' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizForm;