import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth types
export type User = {
  id: string
  email: string
  user_metadata: {
    name?: string
  }
}

export type AuthError = {
  message: string
}

export type EscapeRoom = {
  id: number
  title: string
  theme: string
  difficulty: string
  location: string
  duration: number
  price_per_person: number
  rating: number
  description: string
  what_to_expect: string[]
  recent_reviews: Array<{
    name: string
    rating: number
    comment: string
  }>
  image_url: string
  max_players: number
  created_at: string
  creator_id?: string
}

export type UserProfile = {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export type Favorite = {
  id: number
  user_id: string
  escape_room_id: number
  created_at: string
}

export type EventAttendee = {
  id: number
  user_id: string
  escape_room_id: number
  attended_at: string
  status: 'registered' | 'attended' | 'cancelled'
  created_at: string
}

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // If user was created successfully, create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
        })

      if (profileError) throw profileError
    }

    return { data: authData, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error }
  }
}

// Enhanced delete function with ownership check
export const deleteEscapeRoom = async (roomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // First check if the user owns this room
    const { data: room, error: fetchError } = await supabase
      .from('escape_rooms')
      .select('creator_id')
      .eq('id', roomId)
      .single()

    if (fetchError) throw fetchError
    if (!room) throw new Error('Room not found')
    if (room.creator_id !== user.id) throw new Error('You can only delete rooms that you created')

    // If ownership is verified, proceed with deletion
    const { error } = await supabase
      .from('escape_rooms')
      .delete()
      .eq('id', roomId)

    return { error }
  } catch (error) {
    return { error }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    return { user: null, error }
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Favorites functions
export const addToFavorites = async (escapeRoomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        escape_room_id: escapeRoomId
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const removeFromFavorites = async (escapeRoomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('escape_room_id', escapeRoomId)

    return { error }
  } catch (error) {
    return { error }
  }
}

export const getUserFavorites = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        escape_rooms (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const checkIfFavorited = async (escapeRoomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: false, error: null }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('escape_room_id', escapeRoomId)
      .maybeSingle()

    return { data: !!data, error }
  } catch (error) {
    return { data: false, error }
  }
}

// Event Attendees functions
export const registerForEvent = async (escapeRoomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('event_attendees')
      .insert({
        user_id: user.id,
        escape_room_id: escapeRoomId,
        status: 'registered'
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const unregisterFromEvent = async (escapeRoomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('user_id', user.id)
      .eq('escape_room_id', escapeRoomId)

    return { error }
  } catch (error) {
    return { error }
  }
}

export const checkIfRegistered = async (escapeRoomId: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: false, error: null }

    const { data, error } = await supabase
      .from('event_attendees')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('escape_room_id', escapeRoomId)
      .maybeSingle()

    return { data: !!data, error, status: data?.status }
  } catch (error) {
    return { data: false, error, status: null }
  }
}

export const getEventAttendees = async (escapeRoomId: number) => {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        users (
          name,
          email
        )
      `)
      .eq('escape_room_id', escapeRoomId)
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const getUserAttendedEvents = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        escape_rooms (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}