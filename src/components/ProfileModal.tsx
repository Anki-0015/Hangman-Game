
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/hooks/use-toast';
import { Trophy, LogOut, User } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, isLoggedIn, register, login, logout } = useProfile();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast({
        title: "Username too short",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password.trim().length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (isRegistering) {
      register(username, password);
      toast({
        title: "Welcome!",
        description: `You've been registered as ${username}`,
        className: "bg-game-success text-white",
      });
    } else {
      const success = login(username, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: `You've been logged in as ${username}`,
          className: "bg-game-success text-white",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return;
      }
    }
    setUsername('');
    setPassword('');
    onClose();
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg text-white rounded-xl p-6 max-w-md w-full animate-fade-in shadow-xl border border-white/10">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          {isLoggedIn ? 'Your Profile' : (isRegistering ? 'Register to Play' : 'Login to Play')}
        </h2>
        
        {isLoggedIn && profile ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold">{profile.username}</h3>
            </div>
            
            <div className="space-y-3 bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Score</span>
                <span className="flex items-center font-bold">
                  <Trophy className="mr-1 w-4 h-4 text-yellow-400" />
                  {profile.score}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70">Joined</span>
                <span>{format(new Date(profile.dateJoined), 'MMM dd, yyyy')}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              className="w-full bg-white/10 hover:bg-white/20 mt-4 text-white"
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
                minLength={3}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90">
              {isRegistering ? 'Register & Play' : 'Login'}
            </Button>

            <p className="text-center text-sm text-white/70">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-purple-400 hover:text-purple-300"
              >
                {isRegistering ? 'Login here' : 'Register here'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
