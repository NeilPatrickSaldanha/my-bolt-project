import React from 'react';
import { X, MapPin, Clock, Users, DollarSign, Star, Edit, Heart, Calendar, Trash2 } from 'lucide-react';
import { EscapeRoom } from '../lib/supabase';
import FavoriteButton from './FavoriteButton';
import AttendButton from './AttendButton';

interface RoomDetailsModalProps {
  room: EscapeRoom;
  user: any;
  onClose: () => void;
  onEdit?: (room: EscapeRoom) => void;
  onDelete?: (roomId: number) => void;
  onShowAuthModal?: (mode: 'signin' | 'signup') => void;
}

export default function RoomDetailsModal({ 
  room, 
  user, 
  onClose, 
  onEdit,
  onDelete,
  onShowAuthModal
}: RoomDetailsModalProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Advanced': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const isOwner = user && room.creator_id === user.id;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(room.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-blue-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20 sticky top-0 bg-slate-900/95 backdrop-blur-sm rounded-t-xl z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-white">{room.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(room.difficulty)}`}>
              {room.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {user && (
              <FavoriteButton 
                escapeRoomId={room.id} 
                user={user}
              />
            )}
            <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="h-6 w-6" />
          </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
              <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Location</p>
              <p className="text-white font-semibold">{room.location}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
              <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Duration</p>
              <p className="text-white font-semibold">{room.duration} min</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Max Players</p>
              <p className="text-white font-semibold">{room.max_players} people</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
              <DollarSign className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Price</p>
              <p className="text-white font-semibold">${room.price_per_person}/person</p>
            </div>
          </div>

          {/* About This Experience */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">About This Experience</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {room.description}
            </p>
          </div>

          {/* What to Expect */}
          {room.what_to_expect && room.what_to_expect.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">What to Expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.what_to_expect.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <p className="text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Level */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Difficulty Level</h3>
            <div className="inline-block">
              <span className={`px-6 py-3 rounded-full text-lg font-semibold border ${getDifficultyColor(room.difficulty)}`}>
                {room.difficulty}
              </span>
            </div>
          </div>

          {/* Theme & Setting */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Theme & Setting</h3>
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <h4 className="text-xl font-semibold text-white">{room.theme}</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Immerse yourself in a carefully crafted {room.theme.toLowerCase()} environment designed to transport you into another world. 
                Every detail has been meticulously planned to create an authentic and engaging experience.
              </p>
            </div>
          </div>

          {/* Recent Reviews */}
          {room.recent_reviews && room.recent_reviews.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {room.recent_reviews.map((review, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{review.name}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attend Event Button */}
          {user && (
            <div className="border-t border-blue-500/20 pt-6">
              <div className="flex justify-center">
                <AttendButton 
                  escapeRoomId={room.id} 
                  user={user}
                />
              </div>
              <p className="text-center text-gray-400 text-sm mt-3">
                Register for this escape room event
              </p>
            </div>
          )}

          {/* Book Now Button for Non-Authenticated Users */}
          {!user && (
          <div className="border-t border-blue-500/20 pt-6">
            <div className="flex justify-center">
              <button 
                onClick={() => onShowAuthModal && onShowAuthModal('signin')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 flex items-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <Calendar className="h-6 w-6" />
                <span>Sign In to Register</span>
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-3">
              Sign in to register for this escape room event
            </p>
          </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="border-t border-blue-500/20 pt-6">
              <h3 className="text-xl font-bold text-white mb-4">Manage This Room</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => onEdit && onEdit(room)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Room</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Room</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}