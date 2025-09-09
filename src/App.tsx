import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  User, 
  LogOut, 
  Heart,
  Calendar,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { supabase, signUp, signIn, signOut, getCurrentUser, getUserProfile, deleteEscapeRoom, type EscapeRoom, type UserProfile } from './lib/supabase';
import RoomDetailsModal from './components/RoomDetailsModal';
import ProfilePage from './components/ProfilePage';
import FavoriteButton from './components/FavoriteButton';
import AttendButton from './components/AttendButton';

function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [escapeRooms, setEscapeRooms] = useState<EscapeRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<EscapeRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<EscapeRoom | null>(null);
  const [editingRoom, setEditingRoom] = useState<EscapeRoom | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');
  

  // Auth form states
  const [authFormData, setAuthFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Edit room modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
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

  useEffect(() => {
    checkUser();
    fetchEscapeRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [escapeRooms, searchTerm, selectedTheme, selectedLocation]);

  useEffect(() => {
    // Pre-populate form when editing a room
    if (editingRoom) {
      setEditFormData({
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
      setShowEditModal(true);
    }
  }, [editingRoom]);

  const checkUser = async () => {
    try {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profile } = await getUserProfile(currentUser.id);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEscapeRooms = async () => {
    await fetchEscapeRooms();
  };

  const fetchEscapeRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('escape_rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setEscapeRooms(data || []);
    } catch (error) {
      console.error('Error fetching escape rooms:', error);
    }
  };

  const filterRooms = () => {
  let filtered = escapeRooms;

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(room =>
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Theme filter
  if (selectedTheme) {
    filtered = filtered.filter(room => room.theme === selectedTheme);
  }

  // Location filter
  if (selectedLocation) {
    filtered = filtered.filter(room => room.location === selectedLocation);
  }

  setFilteredRooms(filtered);
};
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        if (authFormData.password !== authFormData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const { error } = await signUp(authFormData.email, authFormData.password, authFormData.name);
        if (error) throw error;
        
        alert('Account created successfully! Please check your email to verify your account.');
        setShowAuthModal(false);
      } else if (authMode === 'signin') {
        const { error } = await signIn(authFormData.email, authFormData.password);
        if (error) throw error;
        
        await checkUser();
        setShowAuthModal(false);
      }
    } catch (error: any) {
      setAuthError(error.message || 'An error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setUserProfile(null);
      setCurrentView('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewRoom = (room: EscapeRoom) => {
    setSelectedRoom(room);
  };

  const handleEditRoom = (room: EscapeRoom) => {
    setEditingRoom(room);
  };

  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRoom(null);
    setEditError(null);
    setEditFormData({
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price_per_person' || name === 'max_players' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRoom) return;
    
    setEditLoading(true);
    setEditError(null);

    try {
      const whatToExpectArray = editFormData.what_to_expect
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const roomData = {
        title: editFormData.title,
        theme: editFormData.theme,
        difficulty: editFormData.difficulty,
        location: editFormData.location,
        duration: editFormData.duration,
        price_per_person: editFormData.price_per_person,
        max_players: editFormData.max_players,
        description: editFormData.description,
        what_to_expect: whatToExpectArray,
        image_url: editFormData.image_url || 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      setEscapeRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? data : room
      ));
      
      // Close modal and show success
      handleCloseEditModal();
      alert('Escape room updated successfully!');
      
    } catch (err: any) {
      console.error('Error updating room:', err);
      setEditError(err.message || 'Failed to update escape room');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this escape room? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await deleteEscapeRoom(roomId);
      if (error) throw error;

      // Remove the room from local state
      setEscapeRooms(prev => prev.filter(room => room.id !== roomId));
      alert('Escape room deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting room:', error);
      alert(error.message || 'Failed to delete escape room. Please try again.');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={user}
        userProfile={userProfile}
        onNavigateBack={() => setCurrentView('home')}
        onCreateRoom={() => {}}
        onRoomCreated={refreshEscapeRooms}
      />
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
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300/80 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-300/60 rounded-full animate-float-medium"></div>
        
        {/* Electric arcs */}
        <div className="absolute top-1/3 left-0 w-1 h-20 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-electric-arc"></div>
        <div className="absolute bottom-1/3 right-0 w-1 h-16 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent animate-electric-arc animation-delay-400"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-slate-950/30 backdrop-blur-sm border-b border-blue-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-neon-pulse">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-2xl font-bold text-white">EscapeSync</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-blue-500/15">
              <div className="flex flex-col space-y-4">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section - Only for non-authenticated users */}
        {!user && (
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-neon-flicker">
                  Escape Rooms
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Immerse yourself in thrilling adventures, solve mind-bending puzzles, and create unforgettable memories 
                with friends and family in the most exciting escape rooms around.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl animate-neon-border"
                >
                  Start Your Adventure
                </button>
                <div className="text-gray-400 text-sm">
                  Join thousands of escape room enthusiasts
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          {user ? (
            /* Compact search for authenticated users */
            <div className="bg-slate-950/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/15">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search escape rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                
              </div>

              {/* Theme and Location Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Theme Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Filter by Theme
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">All Themes</option>
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
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Filter by Location
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">All Locations</option>
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
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full search section for non-authenticated users */
            <div className="bg-slate-950/30 backdrop-blur-sm rounded-xl p-8 border border-blue-500/15 animate-fade-in-up animation-delay-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Find Your Perfect Escape</h2>
                <p className="text-gray-300 text-lg">
                  Search through hundreds of unique escape room experiences
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search escape rooms by name, theme, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-lg"
                  />
                </div>
              
              </div>
            </div>
          )}

         
        </div>

        {/* Escape Rooms Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
  {searchTerm || selectedTheme || selectedLocation ? 'Search Results' : 'Featured Escape Rooms'}
  <span className="text-gray-400 text-lg ml-3">({filteredRooms.length})</span>
</h2>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No escape rooms found</h3>
              <p className="text-gray-400 mb-8">
                Try adjusting your search criteria or clearing the filters to see more results.
              </p>
              
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.id}
                  className="bg-slate-950/40 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/15 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Room Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.image_url}
                      alt={room.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(room.difficulty)}`}>
                        {room.difficulty}
                      </span>
                    </div>
                    
                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3">
                      {user && (
                        <FavoriteButton 
                          escapeRoomId={room.id} 
                          user={user}
                        />
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-semibold">{room.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{room.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{room.description}</p>
                    
                    {/* Room Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{room.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{room.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-3 w-3" />
                        <span>{room.max_players} players</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <DollarSign className="h-3 w-3" />
                        <span>${room.price_per_person}/person</span>
                      </div>
                    </div>

                    {/* Theme */}
                    <div className="mb-4">
                      <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-semibold">
                        {room.theme}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewRoom(room)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      {user && room.creator_id === user.id && (
                        <>
                          <button
                            onClick={() => handleEditRoom(room)}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          user={user}
          onClose={() => setSelectedRoom(null)}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
          onShowAuthModal={handleShowAuthModal}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-blue-500/30 w-full max-w-md animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
              <h2 className="text-2xl font-bold text-white">
                {authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-6">
              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">{authError}</p>
                </div>
              )}

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authFormData.name}
                    onChange={(e) => setAuthFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={authFormData.email}
                  onChange={(e) => setAuthFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              {authMode !== 'reset' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              )}

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={authFormData.confirmPassword}
                    onChange={(e) => setAuthFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {authLoading ? 'Loading...' : 
                  authMode === 'signin' ? 'Sign In' : 
                  authMode === 'signup' ? 'Create Account' : 
                  'Reset Password'
                }
              </button>

              <div className="text-center space-y-2">
                {authMode === 'signin' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Don't have an account? Sign up
                    </button>
                    <br />
               
                  </>
                ) : authMode === 'signup' ? (
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Already have an account? Sign in
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && editingRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-blue-500/30 w-[95vw] max-w-2xl min-h-fit my-4 animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-blue-500/20 sticky top-0 bg-slate-900/95 backdrop-blur-sm rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-white">Edit Escape Room</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmitEdit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {editError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                    <p className="text-red-400">{editError}</p>
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
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Enter room title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Theme *
                    </label>
                    <input
                      type="text"
                      name="theme"
                      value={editFormData.theme}
                      onChange={handleEditInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="e.g., Horror, Mystery, Sci-Fi"
                    />
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
                      value={editFormData.difficulty}
                      onChange={handleEditInputChange}
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
                      value={editFormData.duration}
                      onChange={handleEditInputChange}
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
                      value={editFormData.max_players}
                      onChange={handleEditInputChange}
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
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="e.g., Downtown, Mall, City Center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      Price per Person ($) *
                    </label>
                    <input
                      type="number"
                      name="price_per_person"
                      value={editFormData.price_per_person}
                      onChange={handleEditInputChange}
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
                    value={editFormData.description}
                    onChange={handleEditInputChange}
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
                    value={editFormData.what_to_expect}
                    onChange={handleEditInputChange}
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
                    value={editFormData.image_url}
                    onChange={handleEditInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-blue-500/20">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{editLoading ? 'Updating...' : 'Update Room'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;