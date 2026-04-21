import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-center">
      <div className="w-24 h-24 bg-green-500/10 border border-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <span className="text-5xl">🎉</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        Thank you for subscribing! Your account has been upgraded to Premium access. 
        {sessionId && <span className="block mt-2 text-xs text-gray-600 font-mono text-center overflow-hidden text-ellipsis whitespace-nowrap px-4">Session: {sessionId}</span>}
      </p>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-all"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default SuccessPage;
