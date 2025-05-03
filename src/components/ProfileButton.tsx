
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { User, LogOut } from 'lucide-react';

interface User {
  email: string;
  name: string;
}

const ProfileButton: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load user data from localStorage whenever it changes
  useEffect(() => {
    const checkUserStatus = () => {
      const savedUser = localStorage.getItem('weatherUser');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    
    // Check on mount
    checkUserStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkUserStatus);
    
    // Custom event for auth changes within the same window
    window.addEventListener('authChange', checkUserStatus);
    
    return () => {
      window.removeEventListener('storage', checkUserStatus);
      window.removeEventListener('authChange', checkUserStatus);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('weatherUser');
    setUser(null);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };
  
  const handleLogin = () => {
    navigate('/auth');
  };
  
  if (!user) {
    return (
      <Button
        onClick={handleLogin}
        variant="ghost"
        size="sm"
        className="glass hover:bg-white/30 text-white"
        aria-label="Login"
      >
        <User size={18} className="mr-2" />
        Login
      </Button>
    );
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="glass hover:bg-white/30 text-white"
          aria-label="Profile"
        >
          <User size={18} className="mr-2" />
          {user.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 glass backdrop-blur-lg border-white/20 text-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-white/70">{user.email}</p>
          </div>
          <div className="pt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
