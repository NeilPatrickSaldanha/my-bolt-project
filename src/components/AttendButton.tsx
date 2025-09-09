import React, { useState, useEffect } from 'react';
import { Calendar, CalendarCheck, CalendarX } from 'lucide-react';
import { registerForEvent, unregisterFromEvent, checkIfRegistered } from '../lib/supabase';

interface AttendButtonProps {
  escapeRoomId: number;
  user: any;
  onRegistrationChange?: () => void;
}

export default function AttendButton({ escapeRoomId, user, onRegistrationChange }: AttendButtonProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkRegistrationStatus();
    }
  }, [escapeRoomId, user]);

  const checkRegistrationStatus = async () => {
    try {
      const { data, status } = await checkIfRegistered(escapeRoomId);
      setIsRegistered(data);
      setRegistrationStatus(status);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const handleToggleRegistration = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!user) {
      alert('Please sign in to register for events');
      return;
    }

    setLoading(true);
    
    try {
      if (isRegistered) {
        const { error } = await unregisterFromEvent(escapeRoomId);
        if (error) throw error;
        setIsRegistered(false);
        setRegistrationStatus(null);
      } else {
        const { error } = await registerForEvent(escapeRoomId);
        if (error) throw error;
        setIsRegistered(true);
        setRegistrationStatus('registered');
      }
      
      // Notify parent component of registration change
      if (onRegistrationChange) {
        onRegistrationChange();
      }
    } catch (error: any) {
      console.error('Error toggling registration:', error);
      if (error.message?.includes('duplicate')) {
        // Handle duplicate key error gracefully
        await checkRegistrationStatus();
      } else {
        alert('Failed to update registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return {
        icon: Calendar,
        text: isRegistered ? 'Unregistering...' : 'Registering...',
        className: 'bg-gray-600 cursor-not-allowed'
      };
    }

    if (isRegistered) {
      return {
        icon: CalendarCheck,
        text: registrationStatus === 'cancelled' ? 'Registration Cancelled' : 'Registered',
        className: 'bg-green-600 hover:bg-red-600 hover:text-white'
      };
    }

    return {
      icon: Calendar,
      text: 'Register for Event',
      className: 'bg-blue-600 hover:bg-blue-700'
    };
  };

  const buttonContent = getButtonContent();
  const IconComponent = buttonContent.icon;

  return (
    <button
      onClick={handleToggleRegistration}
      disabled={loading}
      className={`${buttonContent.className} text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 flex items-center space-x-3 shadow-lg hover:shadow-xl ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={isRegistered ? 'Click to unregister' : 'Click to register for this event'}
    >
      <IconComponent className="h-6 w-6" />
      <span>{buttonContent.text}</span>
    </button>
  );
}