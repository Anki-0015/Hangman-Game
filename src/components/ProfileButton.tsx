
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { User } from 'lucide-react';
import ProfileModal from './ProfileModal';

const ProfileButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, profile } = useProfile();

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white"
        variant="outline"
      >
        <User className="h-4 w-4" />
        {isLoggedIn && profile ? profile.username : 'Login'}
      </Button>
      
      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProfileButton;
