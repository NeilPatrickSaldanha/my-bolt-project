import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addToFavorites, removeFromFavorites, checkIfFavorited } from '../lib/supabase';

interface FavoriteButtonProps {
  escapeRoomId: number;
  user: any;
  onFavoriteChange?: () => void;
}

export default function FavoriteButton({ escapeRoomId, user, onFavoriteChange }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [escapeRoomId, user]);

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await checkIfFavorited(escapeRoomId);
      setIsFavorited(data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!user) {
      alert('Please sign in to add favorites');
      return;
    }

    setLoading(true);
    
    try {
      if (isFavorited) {
        const { error } = await removeFromFavorites(escapeRoomId);
        if (error) throw error;
        setIsFavorited(false);
      } else {
        const { error } = await addToFavorites(escapeRoomId);
        if (error) throw error;
        setIsFavorited(true);
      }
      
      // Notify parent component of favorite change
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      if (error.message?.includes('duplicate')) {
        // Handle duplicate key error gracefully
        await checkFavoriteStatus();
      } else {
        alert('Failed to update favorites. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFavorited
          ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} 
      />
    </button>
  );
}