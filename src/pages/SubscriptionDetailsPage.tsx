import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../hooks/apiClient';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  email: string;
  username: string;
  subscriptionStatus: string;
  stripePriceId: string | null;
  dailyReviewCount: number;
  role: string;
}

const SubscriptionDetailsPage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/api/v1/auth/user');
        if (response.data && response.data.data) {
          setUser(response.data.data);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to fetch subscription details.');
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleManageBilling = async () => {
    try {
      setLoadingPortal(true);
      const res = await apiClient.post('/api/v1/stripe/create-portal');
      if (res.data && res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Could not load Stripe billing portal.');
      console.error('Failed to load billing portal', error);
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your plan? You will retain access until the end of your billing cycle.")) return;
    
    try {
      setCanceling(true);
      await apiClient.post('/api/v1/stripe/cancel-subscription');
      toast.success("Your subscription has been canceled successfully.");
      // Refresh the user state
      const response = await apiClient.get('/api/v1/auth/user');
      if (response.data && response.data.data) {
        setUser(response.data.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Could not cancel subscription.');
      console.error('Cancellation failed', error);
    } finally {
      setCanceling(false);
    }
  };

  const getPlanName = (priceId: string | null) => {
    if (priceId === 'price_1TL8HlL74QcM1JqmVnPB02cv') return 'Pro Developer';
    if (priceId === 'price_1TL8IWL74QcM1JqmSoPJDjXc') return 'Maximum Edge';
    return 'Free Tier';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-400">
        Could not load subscription details. Try logging in again.
      </div>
    );
  }

  const isActive = user.subscriptionStatus === 'active';

  return (
    <div className="flex flex-col items-center py-16 px-4 bg-[#0a0a0a] min-h-[calc(100vh-140px)]">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-8">Subscription Details</h1>
        
        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-800">
            <div>
              <p className="text-sm text-gray-400 mb-1">Current Plan</p>
              <h2 className="text-2xl font-semibold text-white">{getPlanName(user.stripePriceId)}</h2>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${isActive ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                {user.subscriptionStatus === 'active' ? 'Active' : user.subscriptionStatus === 'canceled' ? 'Canceled' : 'Free / Pending'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800/50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Account Email</p>
              <p className="text-gray-200 font-medium truncate">{user.email}</p>
            </div>
            
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800/50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Reviews Today</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-200 font-medium">{user.dailyReviewCount}</span>
                <span className="text-gray-600 text-sm">/ {isActive ? 'Unlimited' : '5'}</span>
              </div>
            </div>
          </div>

          {!isActive ? (
            <div className="mt-8 flex flex-col gap-4">
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                Upgrade Plan
              </button>
            </div>
          ) : (
            <div className="mt-8 text-center flex flex-col gap-4">
              <div className="flex gap-4">
                <button 
                  onClick={handleManageBilling}
                  disabled={loadingPortal || canceling}
                  className="flex-1 py-4 bg-[#222] hover:bg-[#2a2a2a] text-white rounded-xl font-bold transition-all border border-gray-700 disabled:opacity-50"
                >
                  {loadingPortal ? 'Redirecting...' : 'Manage Billing Portal'}
                </button>
                <button 
                  onClick={handleCancelSubscription}
                  disabled={loadingPortal || canceling}
                  className="flex-1 py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl font-bold transition-all border border-red-900/30 disabled:opacity-50"
                >
                  {canceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              </div>
               <p className="text-xs text-gray-500">
                You can cancel your subscription immediately or manage payment methods directly through the securely hosted Stripe Portal.
               </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsPage;
