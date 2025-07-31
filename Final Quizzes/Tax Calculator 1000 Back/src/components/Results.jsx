import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Download, Share2, DollarSign, Check } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import toast from 'react-hot-toast';
import CountUp from './CountUp';
import { formatCurrency } from '../data/constants';
import { trackLeadSubmit, trackShareClick } from '../utils/analytics';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required')
});

const Results = ({ results, formData, onRestart }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shareUrl = window.location.href;
  const shareTitle = `I could save ${formatCurrency(results.total)} in tax credits with Accrue!`;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Submit lead to backend
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          estimatedSavings: results.total,
          quizData: formData,
          breakdown: results.breakdown
        })
      });

      if (response.ok) {
        trackLeadSubmit(results.total);
        setShowBreakdown(true);
        toast.success('Thanks! We\'ll be in touch within 24 hours.');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (platform) => {
    trackShareClick(platform, results.total);
  };

  return (
    <div className="quiz-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <DollarSign className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="mb-2">Your Business Could Save</h2>
        
        <div className="text-5xl md:text-6xl font-bold text-accrue-navy mb-2">
          <CountUp end={results.total} duration={2000} prefix="$" separator="," />
        </div>
        
        <p className="text-xl text-gray-600 mb-4">in Annual Tax Credits</p>
        
        <div className="flex items-center justify-center gap-2 text-green-600 mb-8">
          <Check className="w-5 h-5" />
          <span className="font-medium">These credits reduce what you owe in taxes</span>
        </div>
      </motion.div>

      {!showBreakdown ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h3 className="text-center mb-6">Want help claiming these credits?</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('name')}
                type="text"
                placeholder="Your Name"
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="Phone Number"
                maxLength="10"
                className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Claim Your 90-Day Guarantee'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              We guarantee we'll find your eligible tax credits, or your first payroll is free!
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>✓ No credit card required</span>
              <span>✓ Expert support included</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="mb-4">Your Tax Credit Breakdown</h3>
            
            <Accordion.Root type="single" collapsible className="space-y-2">
              {results.breakdown.wotc > 0 && (
                <Accordion.Item value="wotc" className="border rounded-lg">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">WOTC Credit</div>
                        <div className="text-sm text-gray-600">
                          {results.details.wotcQualifiedHires} qualified hires
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accrue-navy">
                          {formatCurrency(results.breakdown.wotc)}
                        </span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 accordion-chevron" />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-4 pb-4 text-sm text-gray-600">
                    Work Opportunity Tax Credit for hiring from targeted groups including veterans, 
                    SNAP recipients, and long-term unemployed individuals.
                  </Accordion.Content>
                </Accordion.Item>
              )}

              {results.breakdown.rd > 0 && (
                <Accordion.Item value="rd" className="border rounded-lg">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">R&D Credit</div>
                        <div className="text-sm text-gray-600">
                          {Math.round(results.details.rdQualifyChance * 100)}% qualification chance
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accrue-navy">
                          {formatCurrency(results.breakdown.rd)}
                        </span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 accordion-chevron" />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-4 pb-4 text-sm text-gray-600">
                    Research & Development tax credit for businesses investing in innovation and 
                    product improvement. Up to $250,000 can be applied against payroll taxes.
                  </Accordion.Content>
                </Accordion.Item>
              )}

              {results.breakdown.empowerment > 0 && (
                <Accordion.Item value="empowerment" className="border rounded-lg">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">Empowerment Zone Credit</div>
                        <div className="text-sm text-gray-600">
                          Business located in qualified zone
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accrue-navy">
                          {formatCurrency(results.breakdown.empowerment)}
                        </span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 accordion-chevron" />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-4 pb-4 text-sm text-gray-600">
                    Credit for businesses operating in designated empowerment zones, 
                    encouraging job creation in economically distressed areas.
                  </Accordion.Content>
                </Accordion.Item>
              )}

              {results.breakdown.state > 0 && (
                <Accordion.Item value="state" className="border rounded-lg">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">State Hiring Credit</div>
                        <div className="text-sm text-gray-600">
                          {results.details.stateProgram?.name} program
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accrue-navy">
                          {formatCurrency(results.breakdown.state)}
                        </span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 accordion-chevron" />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-4 pb-4 text-sm text-gray-600">
                    State-specific hiring incentives that can be combined with federal credits 
                    for maximum savings.
                  </Accordion.Content>
                </Accordion.Item>
              )}
            </Accordion.Root>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Total Annual Savings</span>
                <span className="font-bold text-2xl text-accrue-navy">
                  {formatCurrency(results.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-accrue-gray rounded-xl p-6 text-center">
            <h3 className="mb-4">Share Your Savings</h3>
            <div className="flex justify-center gap-4 mb-4">
              <FacebookShareButton url={shareUrl} quote={shareTitle} onClick={() => handleShare('facebook')}>
                <button className="btn-secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Facebook
                </button>
              </FacebookShareButton>
              
              <TwitterShareButton url={shareUrl} title={shareTitle} onClick={() => handleShare('twitter')}>
                <button className="btn-secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </button>
              </TwitterShareButton>
              
              <LinkedinShareButton url={shareUrl} title={shareTitle} onClick={() => handleShare('linkedin')}>
                <button className="btn-secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  LinkedIn
                </button>
              </LinkedinShareButton>
            </div>
            
            <button onClick={onRestart} className="text-accrue-blue hover:underline">
              Calculate again with different numbers
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>These are estimates based on government programs.</p>
        <p>Actual amounts depend on IRS verification.</p>
        <p>Talk to a tax professional for specific advice.</p>
      </div>
    </div>
  );
};

export default Results;