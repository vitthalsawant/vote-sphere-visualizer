
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BarChartHorizontal, Home, LogOut, PlusCircle, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }
          
          if (data?.username) {
            setUsername(data.username);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BarChartHorizontal size={24} className="text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Poll Creator
            </span>
          </Link>
          
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/" className="hidden md:flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
              <Home className="mr-1 h-4 w-4" /> 
              <span>Home</span>
            </Link>
            
            <Link to="/dashboard" className="hidden md:flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
              <BarChartHorizontal className="mr-1 h-4 w-4" /> 
              <span>Dashboard</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Button variant="outline" asChild className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                  <Link to="/create" className="hidden sm:flex">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Poll
                  </Link>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-sm">
                    {username || 'User'}
                  </div>
                  <Button variant="ghost" size="icon" title="Sign Out" onClick={handleSignOut} className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <Link to="/auth">
                  <User className="mr-2 h-4 w-4" /> Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Separator />
    </header>
  );
};

export default Header;
