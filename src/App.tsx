import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthCallback from './pages/AuthPages/AuthCallback';
import LoginWithGitHub from './pages/AuthPages/LoginWithGitHub';
import Home from './pages/Home';
import ReviewPage from './pages/AIReviewPages/ReviewPage';
import PricingPage from './pages/PricingPage';
import SubscriptionDetailsPage from './pages/SubscriptionDetailsPage';
import SuccessPage from './pages/PaymentPages/SuccessPage';
import CancelPage from './pages/PaymentPages/CancelPage';
import Profile from './pages/AuthPages/Profile';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginWithGitHub />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/subscription" element={<SubscriptionDetailsPage />} />
              <Route path="/review/:reviewId" element={<ReviewPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
              <Route path="/billing" element={<CancelPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Analytics />
    </AuthProvider>
  );
};

export default App;

