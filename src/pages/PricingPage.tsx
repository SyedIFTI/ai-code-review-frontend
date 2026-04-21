import React, { useState } from 'react';
import apiClient from '../hooks/apiClient';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const [loadingPrice, setLoadingPrice] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoadingPrice(priceId);
      const res = await apiClient.post('/api/v1/stripe/create-checkout', { priceId });
      console.log(res.data)
      if (res.data && res.data.data.url) {
        window.location.href = res.data.data.url; // Redirect to Stripe Checkout page
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to initialize checkout. Please try again.');
      console.error('Checkout failed', error?.response?.data);
    } finally {
      setLoadingPrice(null);
    }
  };

  return (
<div className="flex flex-col items-center py-8 md:py-16 px-4 w-full">
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
    <p className="text-gray-400 max-w-xl mx-auto">
      Get advanced AI code reviews, deeper analysis, and priority access by subscribing 
      to one of our premium tiers.
    </p>
  </div>

  {/* Pricing Cards Container */}
  <div className="w-full max-w-5xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      
      {/* Tier 1: Pro Plan */}
      <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 flex flex-col hover:border-violet-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]">
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Pro Developer</h3>
        
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-5xl font-bold text-white">$9</span>
          <span className="text-gray-500 text-lg">/ month</span>
        </div>

        <ul className="flex-1 space-y-4 mb-10 text-gray-400 text-sm">
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> 50 Code Reviews per day
          </li>
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> Standard Priority Processing
          </li>
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> Basic Refactoring Suggestions
          </li>
        </ul>

        <button
          onClick={() => handleSubscribe('price_1TL8HlL74QcM1JqmVnPB02cv')}
          disabled={loadingPrice !== null}
          className="w-full py-3.5 px-6 bg-[#222] hover:bg-[#2a2a2a] disabled:opacity-50 text-white rounded-2xl font-medium transition-colors border border-gray-700 mt-auto"
        >
          {loadingPrice === 'price_1TL8HlL74QcM1JqmVnPB02cv' ? 'Processing...' : 'Subscribe to Pro'}
        </button>
      </div>

      {/* Tier 2: Max Plan (Recommended) */}
      <div className="bg-[#111111] border border-violet-500/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        {/* Recommended Badge */}
        <div className="absolute -top-4 right-8 bg-violet-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-5 rounded-full shadow-lg">
          Most Popular
        </div>

        <h3 className="text-xl font-semibold text-violet-400 mb-2">Maximum Edge</h3>
        
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-5xl font-bold text-white">$19</span>
          <span className="text-gray-500 text-lg">/ month</span>
        </div>

        <ul className="flex-1 space-y-4 mb-10 text-gray-400 text-sm">
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> Unlimited Code Reviews
          </li>
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> Highest Priority Processing
          </li>
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> Advanced Architecture & Security Scans
          </li>
          <li className="flex items-center gap-3">
            <span className="text-violet-500">✓</span> Premium Support
          </li>
        </ul>

        <button
          onClick={() => handleSubscribe('price_1TL8IWL74QcM1JqmSoPJDjXc')}
          disabled={loadingPrice !== null}
          className="w-full py-3.5 px-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl font-medium transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)] mt-auto"
        >
          {loadingPrice === 'price_1TL8IWL74QcM1JqmSoPJDjXc' ? 'Processing...' : 'Upgrade to Max'}
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default PricingPage;
