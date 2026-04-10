import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AdBanner = ({ type = 'banner' }) => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    fetchAds();
  }, [type]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAd((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  const fetchAds = async () => {
    try {
      const response = await axiosInstance.get('ads/', {
        params: { ad_type: type }
      });
      setAds(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };

  const handleAdClick = async (ad) => {
    try {
      await axiosInstance.post(`ads/${ad.id}/track_click/`);
      if (ad.link_url) {
        window.open(ad.link_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  };

  if (ads.length === 0) return null;

  const ad = ads[currentAd];

  return (
    <div
      onClick={() => handleAdClick(ad)}
      className="cursor-pointer overflow-hidden rounded-lg bg-surface-highest border border-white/10 hover:border-primary/30 transition-all"
    >
      <div className="relative">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
        <div className="absolute bottom-2 left-3">
          <p className="text-xs text-secondary font-bold">Sponsored</p>
          <p className="text-sm text-on-surface font-semibold">{ad.title}</p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;