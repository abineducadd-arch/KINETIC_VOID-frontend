import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

const GameCard = ({ game }) => {
  return (
    <Link to={`/games/${game.slug}`} className="group block">
      <div className="bg-surface rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-all hover:transform hover:scale-105 duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={game.cover_image || 'https://via.placeholder.com/300x200'}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {game.discount_price && (
            <div className="absolute top-2 right-2 bg-tertiary text-white px-2 py-1 text-xs font-bold rounded">
              -{Math.round((1 - game.discount_price / game.price) * 100)}%
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-space font-bold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <FiStar className="text-yellow-500 fill-yellow-500" size={14} />
              <span className="text-sm text-on-surface-variant">{game.rating}</span>
            </div>
            <span className="text-xs text-on-surface-variant uppercase">{game.genre}</span>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="font-bold">
              {game.discount_price ? (
                <>
                  <span className="text-secondary">${game.discount_price}</span>
                  <span className="text-xs text-on-surface-variant line-through ml-2">${game.price}</span>
                </>
              ) : (
                <span className="text-secondary">${game.price}</span>
              )}
            </div>
            <button className="px-3 py-1 text-sm bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;