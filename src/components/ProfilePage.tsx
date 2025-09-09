import React, { useState, useEffect } from 'react';
import { User, Calendar, Mail, Heart, Plus, Eye, Trash2, ArrowLeft, X, MapPin, Clock, Users, DollarSign, Star, Edit } from 'lucide-react';
import { supabase, getUserFavorites, type EscapeRoom, type UserProfile } from '../lib/supabase';
import FavoriteButton from './FavoriteButton';

interface ProfilePageProps {
  user: any;
  userProfile: UserProfile | null;
  onNavigateBack: () => void;
  onCreateRoom: () => void;
  onRoomCreated?: () => void;
}

export default function ProfilePage({ 
  user, 
  userProfile, 
  onNavigateBack, 
  onCreateRoom,
  onRoomCreated
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'favorites'>('created');
  const [viewingRoom, setViewingRoom] = useState<EscapeRoom | null>(null);
  const [editingRoom, setEditingRoom] = useState<EscapeRoom | null>(null);
  const [createdRooms, setCreatedRooms] = useState<EscapeRoom[]>([]);
  const [favoriteRooms, setFavoriteRooms] = useState<EscapeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState<string | null>(null);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    difficulty: 'Medium',
    location: '',
    duration: 60,
    price_per_person: 25,
    max_players: 6,
    description: '',
    what_to_expect: '',
    image_url: ''
  });

  // Close modals when switching tabs
  const handleTabSwitch = (tab: 'created' | 'favorites') => {
    setActiveTab(tab);
    // Close any open modals when switching tabs
    setShowCreateModal(false);
    setEditingRoom(null);
    setViewingRoom(null);
    setShowEditProfile(false);
    setCreateError(null);
    setEditProfileError(null);
    // Reset form data
    setFormData({
      title: '',
      theme: '',
      difficulty: 'Medium',
      location: '',
      duration: 60,
      price_per_person: 25,
      max_players: 6,
      description: '',
      what_to_expect: '',
      image_url: ''
    });
  };

  useEffect(() => {
    fetchCreatedRooms();
    if (user) {
      fetchFavoriteRooms();
    }
  }, [user]);

  useEffect(() => {
    // Pre-populate form when editing a room
    if (editingRoom) {
      setFormData({
        title: editingRoom.title,
        theme: editingRoom.theme,
        difficulty: editingRoom.difficulty,
        location: editingRoom.location,
        duration: editingRoom.duration,
        price_per_person: editingRoom.price_per_person,
        max_players: editingRoom.max_players,
        description: editingRoom.description,
        what_to_expect: editingRoom.what_to_expect.join('\n'),
        image_url: editingRoom.image_url
      });
    }
  }, [editingRoom]);

  useEffect(() => {
    // Pre-populate profile form when editing profile
    if (showEditProfile && userProfile) {
      setProfileFormData({
        name: userProfile.name || '',
        email: userProfile.email || user?.email || ''
      });
    }
  }, [showEditProfile, userProfile, user]);
  useEffect(() => {
    if (activeTab === 'favorites' && user) {
      fetchFavoriteRooms();
    }
  }, [activeTab, user]);

  const fetchCreatedRooms = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('escape_rooms')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCreatedRooms(data || []);
    } catch (err: any) {
      console.error('Error fetching created rooms:', err);
      setError(err.message || 'Failed to load created rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteRooms = async () => {
    if (!user) return;
    
    try {
      setFavoritesLoading(true);
      const { data, error } = await getUserFavorites();
      
      if (error) throw error;
      
      // Extract escape room data from the favorites
      const rooms = data?.map((favorite: any) => favorite.escape_rooms).filter(Boolean) || [];
      setFavoriteRooms(rooms);
    } catch (err: any) {
      console.error('Error fetching favorite rooms:', err);
      setError(err.message || 'Failed to load favorite rooms');
    } finally {
      setFavoritesLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewRoom = (room: EscapeRoom) => {
    setViewingRoom(room);
  };

  const handleCloseRoomView = () => {
    setViewingRoom(null);
  };

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

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingRoom(null);
    setCreateError(null);
    setFormData({
      title: '',
      theme: '',
      difficulty: 'Medium',
      location: '',
      duration: 60,
      price_per_person: 25,
      max_players: 6,
      description: '',
      what_to_expect: '',
      image_url: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price_per_person' || name === 'max_players' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmitRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoom) {
      // Update existing room
      setCreateLoading(true);
      setCreateError(null);

      try {
        const whatToExpectArray = formData.what_to_expect
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);

        const roomData = {
          title: formData.title,
          theme: formData.theme,
          difficulty: formData.difficulty,
          location: formData.location,
          duration: formData.duration,
          price_per_person: formData.price_per_person,
          max_players: formData.max_players,
          description: formData.description,
          what_to_expect: whatToExpectArray,
          image_url: formData.image_url || 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=800',
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('escape_rooms')
          .update(roomData)
          .eq('id', editingRoom.id)
          .select()
          .single();

        if (error) throw error;

        // Update the room in local state
        setCreatedRooms(prev => prev.map(room => 
          room.id === editingRoom.id ? data : room
        ));
        
        // Refresh the list from database to ensure consistency
        await fetchCreatedRooms();
        
        // Close modal and show success
        handleCloseModal();
        setEditingRoom(null);
        setViewingRoom(null);
        alert('Escape room updated successfully!');
        
      } catch (err: any) {
        console.error('Error updating room:', err);
        setCreateError(err.message || 'Failed to update escape room');
      } finally {
        setCreateLoading(false);
      }
    } else {
      // Create new room
      setCreateLoading(true);
      setCreateError(null);

      try {
        const whatToExpectArray = formData.what_to_expect
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);

        const roomData = {
          title: formData.title,
          theme: formData.theme,
          difficulty: formData.difficulty,
          location: formData.location,
          duration: formData.duration,
          price_per_person: formData.price_per_person,
          max_players: formData.max_players,
          description: formData.description,
          what_to_expect: whatToExpectArray,
          recent_reviews: [],
          image_url: formData.image_url || 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=800',
          rating: 0.0,
          creator_id: user.id
        };

        const { data, error } = await supabase
          .from('escape_rooms')
          .insert([roomData])
          .select()
          .single();

        if (error) throw error;

        // Add the new room to the local state
        setCreatedRooms(prev => [data, ...prev]);
        
        // Refresh the list from database to ensure consistency
        await fetchCreatedRooms();
        
        // Close modal and show success
        handleCloseModal();
        alert('Escape room created successfully!');
        
        // Notify parent component that a room was created
        if (onRoomCreated) {
          onRoomCreated();
        }
        
      } catch (err: any) {
        console.error('Error creating room:', err);
        setCreateError(err.message || 'Failed to create escape room');
      } finally {
        setCreateLoading(false);
      }
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseProfileEdit = () => {
    setShowEditProfile(false);
    setEditProfileError(null);
    setProfileFormData({
      name: '',
      email: ''
    });
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditProfileLoading(true);
    setEditProfileError(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileFormData.name,
          email: profileFormData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Close modal and show success
      handleCloseProfileEdit();
      alert('Profile updated successfully!');
      
      // Refresh the page to show updated profile data
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setEditProfileError(err.message || 'Failed to update profile');
    } finally {
      setEditProfileLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    // Find the room to check ownership
    const roomToDelete = createdRooms.find(room => room.id === roomId);
    if (!roomToDelete || roomToDelete.creator_id !== user.id) {
      alert('You can only delete rooms that you created.');
      return;
    }

    if (!confirm('Are you sure you want to delete this escape room? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('escape_rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      // Remove the room from local state
      setCreatedRooms(prev => prev.filter(room => room.id !== roomId));
      alert('Escape room deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting room:', err);
      alert('Failed to delete escape room. Please try again.');
    }
  };

  const handleFavoriteChange = () => {
    // Refresh favorites when a favorite is added/removed
    if (activeTab === 'favorites') {
      fetchFavoriteRooms();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-purple-800/10 to-blue-900/20"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-mystery-orb"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/50 rounded-full animate-mystery-orb animation-delay-200"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-400/70 rounded-full animate-mystery-orb animation-delay-400"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={onNavigateBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Rooms</span>
        </button>

        {/* Header Section */}
        <div className="bg-slate-950/30 backdrop-blur-sm rounded-xl p-8 border border-blue-500/15 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Profile Picture Placeholder */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                {userProfile?.name || user?.email || 'User'}
              </h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-300 text-sm sm:text-base">
                <div className="flex items-center space-x-2 min-w-0">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>
                    Joined {userProfile?.created_at ? formatDate(userProfile.created_at) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Edit Profile Button */}
            <div className="flex items-center w-full sm:w-auto">
              <button
                onClick={handleEditProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/30 backdrop-blur-sm rounded-xl border border-blue-500/15 overflow-hidden mb-8">
          <div className="flex border-b border-blue-500/15">
            <button
              onClick={() => handleTabSwitch('created')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'created'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              My Created Rooms
            </button>
            <button
              onClick={() => handleTabSwitch('favorites')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Favorited Rooms</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {!viewingRoom && (
            <div className="p-8">
            {activeTab === 'created' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    My Created Rooms ({createdRooms.length})
                  </h2>
                  <button
                    onClick={handleCreateRoom}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Room</span>
                  </button>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {createdRooms.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No rooms created yet</h3>
                    <p className="text-gray-400 mb-6">
                      Start building your escape room empire! Create your first room to get started.
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={handleCreateRoom}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Room
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdRooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={room.image_url}
                            alt={room.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(room.difficulty)}`}>
                              {room.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-2">{room.title}</h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{room.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                            <span>Created {formatDate(room.created_at)}</span>
                            <span>${room.price_per_person}/person</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewRoom(room)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    My Favorite Rooms ({favoriteRooms.length})
                  </h2>
                </div>

                {favoritesLoading ? (
                  <div className="text-center py-12">
                    <div className="text-white text-xl">Loading favorites...</div>
                  </div>
                ) : favoriteRooms.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No favorite rooms yet</h3>
                    <p className="text-gray-400 mb-6">
                      Start exploring escape rooms and click the heart icon to add them to your favorites!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={room.image_url}
                            alt={room.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(room.difficulty)}`}>
                              {room.difficulty}
                            </span>
                            <FavoriteButton 
                              escapeRoomId={room.id} 
                              user={user}
                              onFavoriteChange={handleFavoriteChange}
                            />
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-2">{room.title}</h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{room.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                            <span>{room.theme} • {room.location}</span>
                            <span>${room.price_per_person}/person</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewRoom(room)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>

        {/* Room Details View */}
        {viewingRoom && (
          <div className="bg-slate-950/30 backdrop-blur-sm rounded-xl border border-blue-500/15 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCloseRoomView}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white">{viewingRoom.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(viewingRoom.difficulty)}`}>
                  {viewingRoom.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {user && (
                  <FavoriteButton 
                    escapeRoomId={viewingRoom.id} 
                    user={user}
                    onFavoriteChange={handleFavoriteChange}
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
                  <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">{viewingRoom.location}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
                  <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white font-semibold">{viewingRoom.duration} min</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
                  <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Max Players</p>
                  <p className="text-white font-semibold">{viewingRoom.max_players} people</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/30">
                  <DollarSign className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white font-semibold">${viewingRoom.price_per_person}/person</p>
                </div>
              </div>

              {/* About This Experience */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">About This Experience</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {viewingRoom.description}
                </p>
              </div>

              {/* What to Expect */}
              {viewingRoom.what_to_expect && viewingRoom.what_to_expect.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">What to Expect</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingRoom.what_to_expect.map((item, index) => (
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
                  <span className={`px-6 py-3 rounded-full text-lg font-semibold border ${getDifficultyColor(viewingRoom.difficulty)}`}>
                    {viewingRoom.difficulty}
                  </span>
                </div>
              </div>

              {/* Theme & Setting */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Theme & Setting</h3>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <h4 className="text-xl font-semibold text-white">{viewingRoom.theme}</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Immerse yourself in a carefully crafted {viewingRoom.theme.toLowerCase()} environment designed to transport you into another world. 
                    Every detail has been meticulously planned to create an authentic and engaging experience.
                  </p>
                </div>
              </div>

              {/* Recent Reviews */}
              {viewingRoom.recent_reviews && viewingRoom.recent_reviews.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {viewingRoom.recent_reviews.map((review, index) => (
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

              {/* Owner Actions */}
              {user && viewingRoom.creator_id === user.id && (
                <div className="border-t border-blue-500/20 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Manage This Room</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setEditingRoom(viewingRoom)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Room</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {(showCreateModal || editingRoom) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-blue-500/30 w-[95vw] max-w-2xl min-h-fit my-4 animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-blue-500/20 sticky top-0 bg-slate-900/95 backdrop-blur-sm rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-white">
                {editingRoom ? 'Edit Escape Room' : 'Create New Escape Room'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmitRoom} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {createError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                  <p className="text-red-400">{createError}</p>
                </div>
              )}

              {/* Title and Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Room Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                    placeholder="Enter room title"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Theme *
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  >
                    <option value="">Select a theme</option>
                    <option value="Horror">Horror</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Historical">Historical</option>
                    <option value="Crime">Crime</option>
                    <option value="Zombie">Zombie</option>
                    <option value="Prison Break">Prison Break</option>
                    <option value="Pirate">Pirate</option>
                    <option value="Space">Space</option>
                    <option value="Medieval">Medieval</option>
                    <option value="Steampunk">Steampunk</option>
                    <option value="Western">Western</option>
                  </select>
                </div>
              </div>

              {/* Difficulty, Duration, Max Players */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="180"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Max Players *
                  </label>
                  <input
                    type="number"
                    name="max_players"
                    value={formData.max_players}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Location and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  >
                    <option value="">Select a location</option>
                    <option value="Downtown">Downtown</option>
                    <option value="Mall">Mall</option>
                    <option value="City Center">City Center</option>
                    <option value="Shopping District">Shopping District</option>
                    <option value="Entertainment District">Entertainment District</option>
                    <option value="Business District">Business District</option>
                    <option value="Suburbs">Suburbs</option>
                    <option value="Waterfront">Waterfront</option>
                    <option value="Historic District">Historic District</option>
                    <option value="University Area">University Area</option>
                    <option value="Airport Area">Airport Area</option>
                    <option value="Industrial District">Industrial District</option>
                    <option value="Tourist Area">Tourist Area</option>
                    <option value="Residential Area">Residential Area</option>
                    <option value="Uptown">Uptown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Price per Person ($) *
                  </label>
                  <input
                    type="number"
                    name="price_per_person"
                    value={formData.price_per_person}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                  placeholder="Describe the escape room experience..."
                />
              </div>

              {/* What to Expect */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  What to Expect (one item per line)
                </label>
                <textarea
                  name="what_to_expect"
                  value={formData.what_to_expect}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                  placeholder={`Challenging puzzles\nImmersive storyline\nTeam collaboration required\nHigh-tech props`}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-blue-500/20">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {editingRoom ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>
                    {createLoading 
                      ? (editingRoom ? 'Updating...' : 'Creating...') 
                      : (editingRoom ? 'Update Room' : 'Create Room')
                    }
                  </span>
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-blue-500/30 w-full max-w-md animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={handleCloseProfileEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitProfileEdit} className="p-6 space-y-6">
              {editProfileError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">{editProfileError}</p>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileFormData.name}
                  onChange={handleProfileInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileFormData.email}
                  onChange={handleProfileInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-blue-500/20">
                <button
                  type="button"
                  onClick={handleCloseProfileEdit}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProfileLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{editProfileLoading ? 'Updating...' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}