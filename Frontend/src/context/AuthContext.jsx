import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // You might want to validate the token here
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    try {
      // Ensure we're not storing sensitive data
      const safeUserData = {
        id: userData.id,
        name: userData.name || 'Admin',
        email: userData.email,
        isAdmin: userData.isAdmin || false,
        token: userData.token
      };
      
      setUser(safeUserData);
      localStorage.setItem('adminUser', JSON.stringify(safeUserData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('adminUser');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
