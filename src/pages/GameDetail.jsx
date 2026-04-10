import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { FiStar, FiDownload, FiClock, FiAward } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';

const GameDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inLibrary, setInLibrary] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState('');

  useEffect(() => {
    fetchGameDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated && game) {
      checkLibraryStatus();
    }
  }, [isAuthenticated, game]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`games/${slug}/`);
      setGame(response.data);
    } catch (err) {
      console.error('Failed to fetch game:', err);
      setError(err.response?.status === 404 ? 'Game not found' : 'Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const checkLibraryStatus = async () => {
    if (!isAuthenticated) {
      setInLibrary(false);
      return;
    }
    try {
      const response = await axiosInstance.get('library/');
      const libraryItems = response.data.results || response.data;
      const owned = libraryItems.some(item => item.game?.slug === slug);
      setInLibrary(owned);
    } catch (error) {
      console.error('Failed to check library:', error);
    }
  };

  const addToLibrary = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to your library');
      return;
    }
    try {
      await axiosInstance.post('library/', { game_id: game.id, status: 'owned' });
      setInLibrary(true);
      setLibraryStatus('Added to your library!');
      setTimeout(() => setLibraryStatus(''), 3000);
    } catch (error) {
      console.error('Failed to add to library:', error);
      setLibraryStatus('Failed to add. Try again.');
      setTimeout(() => setLibraryStatus(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-on-surface-variant text-lg mb-4">{error || 'Game not found'}</p>
          <a href="/games" className="text-secondary hover:underline">← Back to Library</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={game.banner_image || game.cover_image || 'https://via.placeholder.com/1200x400?text=Game+Banner'}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase">
                {game.genre}
              </span>
              <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full">
                {game.developer}
              </span>
              {game.is_featured && (
                <span className="px-3 py-1 bg-tertiary/20 text-tertiary text-xs font-bold rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-space font-black text-on-surface mb-4">{game.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500 fill-yellow-500" />
                <span className="text-on-surface font-bold">{game.rating}</span>
                <span className="text-on-surface-variant text-sm">({game.total_ratings} reviews)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FiDownload size={18} />
                <span className="text-on-surface-variant text-sm">{game.download_size}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-space font-bold text-on-surface mb-4">About This Game</h2>
              <p className="text-on-surface-variant leading-relaxed">{game.description}</p>
            </div>
            
            {game.features && game.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-space font-bold text-on-surface mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-on-surface-variant">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-2xl font-space font-bold text-on-surface mb-4">System Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface rounded-xl p-6">
                  <h3 className="text-lg font-bold text-secondary mb-3">Minimum</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li><span className="font-semibold">OS:</span> {game.system_requirements_min?.os || 'N/A'}</li>
                    <li><span className="font-semibold">Processor:</span> {game.system_requirements_min?.processor || 'N/A'}</li>
                    <li><span className="font-semibold">Memory:</span> {game.system_requirements_min?.memory || 'N/A'}</li>
                    <li><span className="font-semibold">Graphics:</span> {game.system_requirements_min?.graphics || 'N/A'}</li>
                    <li><span className="font-semibold">Storage:</span> {game.system_requirements_min?.storage || 'N/A'}</li>
                  </ul>
                </div>
                
                <div className="bg-surface rounded-xl p-6">
                  <h3 className="text-lg font-bold text-tertiary mb-3">Recommended</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li><span className="font-semibold">OS:</span> {game.system_requirements_rec?.os || 'N/A'}</li>
                    <li><span className="font-semibold">Processor:</span> {game.system_requirements_rec?.processor || 'N/A'}</li>
                    <li><span className="font-semibold">Memory:</span> {game.system_requirements_rec?.memory || 'N/A'}</li>
                    <li><span className="font-semibold">Graphics:</span> {game.system_requirements_rec?.graphics || 'N/A'}</li>
                    <li><span className="font-semibold">Storage:</span> {game.system_requirements_rec?.storage || 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {game.achievements && game.achievements.length > 0 && (
              <div>
                <h2 className="text-2xl font-space font-bold text-on-surface mb-4">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 bg-surface rounded-xl p-4">
                      <FiAward className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-semibold text-on-surface">{achievement.title}</p>
                        <p className="text-sm text-on-surface-variant">{achievement.description}</p>
                        <p className="text-xs text-secondary mt-1">+{achievement.xp_reward} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface rounded-xl p-6 border border-white/5 sticky top-24">
              <div className="text-center mb-6">
                {game.discount_price ? (
                  <>
                    <span className="text-4xl font-space font-black text-secondary">${game.discount_price}</span>
                    <span className="text-lg text-on-surface-variant line-through ml-2">${game.price}</span>
                  </>
                ) : (
                  <span className="text-4xl font-space font-black text-secondary">${game.price}</span>
                )}
              </div>
              
              {inLibrary ? (
                <button className="w-full py-3 bg-green-600/20 text-green-400 font-semibold rounded-lg cursor-default">
                  ✓ In Your Library
                </button>
              ) : (
                <button
                  onClick={addToLibrary}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-dim text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                >
                  Add to Library
                </button>
              )}
              
              {libraryStatus && (
                <p className={`text-center text-sm mt-3 ${libraryStatus.includes('Failed') ? 'text-red-400' : 'text-secondary'}`}>
                  {libraryStatus}
                </p>
              )}
              
              {!isAuthenticated && (
                <p className="text-center text-xs text-on-surface-variant mt-3">
                  <a href="/login" className="text-secondary hover:underline">Login</a> to add to your library
                </p>
              )}
            </div>
            
            <div className="bg-surface rounded-xl p-6 border border-white/5">
              <h3 className="font-space font-bold text-on-surface mb-4">Game Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Developer</span>
                  <span className="text-on-surface">{game.developer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Publisher</span>
                  <span className="text-on-surface">{game.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Release Date</span>
                  <span className="text-on-surface">{new Date(game.release_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Genre</span>
                  <span className="text-on-surface uppercase">{game.genre}</span>
                </div>
              </div>
            </div>
            
            <AdBanner type="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;