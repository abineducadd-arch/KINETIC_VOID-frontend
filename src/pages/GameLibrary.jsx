import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import GameCard from '../components/Game';   // adjust path if your component is named differently
import AdBanner from '../components/AdBanner';

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, [search, genre]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;
      
      const response = await axiosInstance.get('games/', { params });
      setGames(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axiosInstance.get('games/');
      const uniqueGenres = [...new Set(response.data.results?.map(g => g.genre) || response.data.map(g => g.genre))];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-5xl font-space font-black text-on-surface mb-4">Game Library</h1>
            <p className="text-on-surface-variant text-lg">Discover your next adventure in the void</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
          />
          
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-3 bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g} className="bg-surface-container-highest text-on-surface">
                {g.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        
        {/* Games Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            
            {games.length === 0 && (
              <div className="text-center py-12">
                <p className="text-on-surface-variant">No games found</p>
              </div>
            )}
          </>
        )}
        
        {/* Advertisement */}
        <AdBanner type="banner" />
      </div>
    </div>
  );
};

export default GameLibrary;