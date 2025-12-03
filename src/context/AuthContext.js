import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { demoUsers, demoTenants } from '../data/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('forwardsflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('forwardsflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let matchedUser = null;
    for (const [key, userData] of Object.entries(demoUsers)) {
      if (userData.email.toLowerCase() === email.toLowerCase() && userData.password === password) {
        matchedUser = { ...userData };
        break;
      }
    }
    
    if (!matchedUser) {
      setError('Invalid email or password');
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
    
    if (matchedUser.tenantId) {
      const tenants = matchedUser.tenantType === 'investor' 
        ? demoTenants.investors 
        : demoTenants.banks;
      const tenant = tenants.find(t => t.id === matchedUser.tenantId);
      if (tenant) {
        matchedUser.tenant = tenant;
      }
    }
    
    matchedUser.lastLogin = new Date().toISOString();
    localStorage.setItem('forwardsflow_user', JSON.stringify(matchedUser));
    setUser(matchedUser);
    setLoading(false);
    
    return { success: true, user: matchedUser };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('forwardsflow_user');
    setUser(null);
    setError(null);
  }, []);

  const register = useCallback(async (registrationData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    return { 
      success: true, 
      message: 'Registration submitted successfully. Please wait for admin approval.'
    };
  }, []);

  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin': return '/admin';
      case 'tenant_admin': return user.tenantType === 'investor' ? '/investor/admin' : '/bank/admin';
      case 'tenant_user': return user.tenantType === 'investor' ? '/investor' : '/bank';
      default: return '/login';
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    getDashboardPath,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
