import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import {  FiClock, FiBookOpen, FiAward } from 'react-icons/fi';
import GameCard from '../components/Game';
import AdBanner from '../components/AdBanner';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [libraryStats, setLibraryStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');

  useEffect(() => {
    fetchLibraryStats();
    fetchRecentGames();
  }, []);

  const fetchLibraryStats = async () => {
    try {
      const response = await axiosInstance.get('library/stats/');
      setLibraryStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentGames = async () => {
    try {
      const response = await axiosInstance.get('library/');
      setRecentGames(response.data.results?.slice(0, 3) || response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch recent games:', error);
    }
  };

  const handleUpdateBio = async () => {
    const success = await updateProfile({ bio });
    if (success) {
      setEditing(false);
    }
  };

  const stats = [
    { label: 'Total Games', value: libraryStats?.total_games || 0, icon: FiBookOpen, color: 'text-primary' },
    { label: 'Playtime', value: `${libraryStats?.total_playtime || 0}h`, icon: FiClock, color: 'text-secondary' },
    { label: 'Completed', value: libraryStats?.completed_games || 0, icon: FiClock , color: 'text-tertiary' },
    { label: 'XP Points', value: user?.xp_points || 0, icon: FiAward, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="glass-panel rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=8455ef&color=fff`}
                alt={user?.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-space font-black text-on-surface mb-2">
                {user?.username}
              </h1>
              <p className="text-on-surface-variant mb-4">
                Member since {new Date(user?.join_date).toLocaleDateString()}
              </p>
              
              {editing ? (
                <div className="flex gap-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex-1 px-4 py-2 bg-surface-highest border border-white/10 rounded-lg focus:outline-none focus:border-primary text-on-surface"
                    rows="3"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleUpdateBio}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-surface-highest text-on-surface-variant rounded-lg hover:bg-surface"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-on-surface-variant mb-3">{user?.bio || 'No bio yet'}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-secondary hover:underline text-sm"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-2xl font-space font-black text-on-surface">{stat.value}</span>
              </div>
              <p className="text-on-surface-variant text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Recent Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-space font-bold text-on-surface mb-6">Recently Played</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentGames.map((libraryItem) => (
              <GameCard key={libraryItem.id} game={libraryItem.game} />
            ))}
          </div>
        </div>
        
        {/* Advertisement */}
        <AdBanner type="banner" />
      </div>
    </div>
  );
};

export default Dashboard;