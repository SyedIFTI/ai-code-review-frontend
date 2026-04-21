import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-center">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">❌</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Checkout Cancelled</h1>
        <p className="text-gray-400 mb-6 max-w-md">
            Your checkout process was cancelled. Don't worry, no charges were made to your account!
        </p>
        <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#222] hover:bg-[#2a2a2a] border border-gray-700 text-white rounded-lg font-medium transition-all"
        >
            Return to Dashboard
        </button>
        </div>
    );
};

export default CancelPage;
