import axios from 'axios';
import React, { useEffect, useState } from 'react';
import type { HistoryItem } from '../types/tpes';
import { Link } from 'react-router-dom';
import apiClient from '../hooks/apiClient';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface HistoryTabProps {
  isOpen: boolean;
  onClose: () => void;
}

// const mockHistory = [
//   { id: 1, title: 'Review utils.ts formatting', date: 'Today, 10:23 AM' },
//   { id: 2, title: 'Fix auth controller bugs', date: 'Yesterday, 2:45 PM' },
//   { id: 3, title: 'React components cleanup', date: 'Mar 15, 2026' },
//   { id: 4, title: 'Optimize database queries', date: 'Mar 14, 2026' },
//   { id: 5, title: 'Initial Docker setup', date: 'Mar 10, 2026' },
// ];

export default function HistoryTab({ isOpen, onClose }: HistoryTabProps) {
  const { user, logout } = useAuth();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // const [selectedHistory, setSelectedHistory] = useState<boolean>(false)
  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoadingHistory(true);
        const response = await apiClient.get(`/api/v1/ai/history`, { withCredentials: true });
        console.log(response.data);
        setHistoryData(response.data?.data || []);
      } catch (error : any) {
        toast.error(error?.response?.data?.message || 'Failed to load history items');
        console.error('Fetch history failed', error);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] xs:w-[85vw] sm:w-80 md:w-80 lg:w-80 xl:w-80 bg-[#111111] border-r border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <img src="/src/assets/logo.webp" alt="CodeReview AI Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white truncate">CodeReview AI</h1>
          </Link>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Quick Links */}
        <div className="p-3 border-b border-gray-800 flex flex-col gap-1">
          <Link 
            to="/" 
            onClick={onClose}
            className="w-full text-left py-2.5 px-3 mb-1 rounded-lg text-violet-100 bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 hover:border-violet-500/50 transition-colors flex items-center gap-3 font-semibold shadow-[0_0_15px_rgba(139,92,246,0.1)]"
          >
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Chat
          </Link>
          <Link 
            to="/pricing" 
            onClick={onClose}
            className="w-full text-left py-2.5 px-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors flex items-center gap-3 font-medium"
          >
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Price
          </Link>
          <Link 
            to="/subscription" 
            onClick={onClose}
            className="w-full text-left py-2.5 px-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors flex items-center gap-3 font-medium"
          >
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Payment
          </Link>
          <Link 
            to="/profile" 
            onClick={onClose}
            className="w-full text-left py-2.5 px-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors flex items-center gap-3 font-medium"
          >
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profile
          </Link>
        </div>

        {/* History Section Heading */}
        <div className="px-5 pt-5 pb-2">
           <h2 className="text-gray-500 text-xs font-bold tracking-wider uppercase">Recent History</h2>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 space-y-1">
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <p className="text-sm">Loading history...</p>
            </div>
          ) : historyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
              <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <p className="text-sm">No recent reviews yet.</p>
            </div>
          ) : (
            historyData.map((item) => (
              <Link
            to={`/review/${item.id}`}
            state={{selectedHistory:true}}
              key={item.id}
              className="w-full text-left p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-gray-800 group flex items-start gap-3"
            onClick={onClose}
            >
              <div  className="mt-0.5 text-gray-500 group-hover:text-violet-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <h4 className="text-gray-200 text-sm font-semibold group-hover:text-white truncate capitalize">
                    {item.language} Review
                  </h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider ${item.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                    item.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                      'bg-violet-500/10 text-violet-400'
                    }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {new Date(item.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </Link>
            ))
          )}
        </div>

        {/* User Profile Footer */}
        {user && (
          <div className="p-4 border-t border-gray-800 bg-[#151515] mt-auto">
            <div className="flex items-center gap-3 hover:bg-[#222] p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-violet-400 font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{user.username}</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="text-gray-500 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
