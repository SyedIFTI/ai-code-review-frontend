import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import HistoryTab from './HistoryTab';
import ProtectedRoute from './ProtectedRoute';

export default function Layout() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error?.message || 'Error connecting to GitHub.');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-mono flex flex-col">
      <HistoryTab isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Header */}
      <header className="border-b border-gray-800 bg-[#111111] py-4">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors mr-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <Link to="/" className="flex items-center justify-center gap-2 sm:gap-3">
              <img src="/src/assets/logo.webp" alt="CodeReview AI Logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px] object-contain flex-shrink-0" />
              <h1 className="hidden xs:block text-lg sm:text-xl md:block md:text-2xl font-semibold tracking-tight truncate text-white">CodeReview AI</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
            ) : !user ? (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-4 py-2 bg-[#222] text-gray-200 hover:bg-[#333] rounded-lg transition-all text-sm font-medium border border-gray-700 hover:border-violet-500 hover:text-violet-400"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57" />
                </svg>
                Sign in
              </button>
            ) : (
              <div className="relative">
                <button className="flex items-center gap-2 p-2 hover:bg-[#222] rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      user.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium hidden md:block max-w-[120px] truncate">{user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-200 hover:bg-[#222] rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#222] rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <ProtectedRoute />
      </main>
    </div>
  );
}

