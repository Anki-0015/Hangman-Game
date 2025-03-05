
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../models/Profile';
import profilesData from '../data/profiles.json';

interface ProfileContextType {
  profile: Profile | null;
  isLoggedIn: boolean;
  register: (username: string, password: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateScore: (newScore: number) => void;
}

// Helper function to save profiles to JSON
const saveProfilesToJSON = (profiles: Profile[]) => {
  try {
    // In a real application, this would be an API call to save to the server
    console.log('Saving profiles:', profiles);
    // For now, we'll keep using localStorage as a fallback
    // since we can't directly write to JSON files in the browser
    localStorage.setItem('hangman-profiles', JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving profiles:', error);
  }
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(profilesData.profiles);

  // Load profiles on initialization
  useEffect(() => {
    // In a real application, this would be an API call to fetch from the server
    const savedProfiles = localStorage.getItem('hangman-profiles');
    if (savedProfiles) {
      setAllProfiles(JSON.parse(savedProfiles));
    }

    // Check for active session
    const activeProfile = localStorage.getItem('hangman-active-profile');
    if (activeProfile) {
      setProfile(JSON.parse(activeProfile));
      setIsLoggedIn(true);
    }
  }, []);

  const register = (username: string, password: string) => {
    // Check if username already exists
    if (allProfiles.some(p => p.username === username)) {
      throw new Error('Username already exists');
    }

    const newProfile: Profile = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      password, // In a real app, this should be hashed
      score: 0,
      dateJoined: new Date().toISOString(),
    };
    
    setProfile(newProfile);
    setIsLoggedIn(true);
    
    const updatedProfiles = [...allProfiles, newProfile];
    setAllProfiles(updatedProfiles);
    saveProfilesToJSON(updatedProfiles);
    localStorage.setItem('hangman-active-profile', JSON.stringify(newProfile));
  };

  const login = (username: string, password: string): boolean => {
    const foundProfile = allProfiles.find(p => p.username === username && p.password === password);
    
    if (foundProfile) {
      setProfile(foundProfile);
      setIsLoggedIn(true);
      localStorage.setItem('hangman-active-profile', JSON.stringify(foundProfile));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem('hangman-active-profile');
  };

  const updateScore = (newScore: number) => {
    if (profile) {
      const updatedProfile = { ...profile, score: newScore };
      setProfile(updatedProfile);
      
      const updatedProfiles = allProfiles.map(p => 
        p.id === profile.id ? updatedProfile : p
      );
      
      setAllProfiles(updatedProfiles);
      saveProfilesToJSON(updatedProfiles);
      localStorage.setItem('hangman-active-profile', JSON.stringify(updatedProfile));
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, isLoggedIn, register, login, logout, updateScore }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
