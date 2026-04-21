import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, loading, fetchProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!user) {
    return <div>Not authenticated. <button onClick={fetchProfile} className="text-violet-400 hover:underline">Retry</button></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.avatarUrl || `https://avatar.vercel.sh/${user.githubId}.png`} 
            alt={user.username}
            className="w-20 h-20 rounded-full border-2 border-violet-600"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Role:</span>
            <p className={`ml-2 font-medium ${user.role === 'pro' ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {user.role.toUpperCase()}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Daily Reviews:</span>
            <p className="ml-2">{user.dailyReviewCount}</p>
          </div>
          {user.lastReviewDate && (
            <div>
              <span className="text-gray-400">Last Review:</span>
              <p className="ml-2">{user.lastReviewDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

