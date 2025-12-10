import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { DEMO_USERS, ROLES, ROLE_CONFIG, getDashboardPath, hasPermission, getTenantType } from '../config/roleConfig';

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
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref to prevent double-submission
  const loginInProgress = useRef(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('forwardsflow_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          
          // Validate the saved user has required fields
          if (parsedUser && parsedUser.email && parsedUser.role) {
            setUser(parsedUser);
            
            // Set tenant from user data
            if (parsedUser.tenantId) {
              setTenant({
                id: parsedUser.tenantId,
                name: parsedUser.tenantName,
                type: parsedUser.tenantType,
              });
            }
          } else {
            // Invalid saved user, clear it
            localStorage.removeItem('forwardsflow_user');
          }
        }
      } catch (e) {
        console.error('Error loading saved user:', e);
        localStorage.removeItem('forwardsflow_user');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    // Prevent double-submission
    if (loginInProgress.current) {
      console.log('Login already in progress, ignoring duplicate request');
      return { success: false, error: 'Login in progress' };
    }
    
    loginInProgress.current = true;
    setError(null);

    try {
      // Find user in demo users (case-insensitive email)
      const normalizedEmail = email.toLowerCase().trim();
      const demoUser = DEMO_USERS[normalizedEmail];
      
      console.log('Login attempt:', normalizedEmail);
      console.log('User found:', !!demoUser);
      
      if (!demoUser) {
        const errorMsg = 'User not found. Please check your email address.';
        setError(errorMsg);
        loginInProgress.current = false;
        return { success: false, error: errorMsg };
      }
      
      // Case-sensitive password comparison
      if (demoUser.password !== password) {
        console.log('Password mismatch');
        const errorMsg = 'Invalid password. Please try again.';
        setError(errorMsg);
        loginInProgress.current = false;
        return { success: false, error: errorMsg };
      }

      // Create user object (without password)
      const { password: _, ...userWithoutPassword } = demoUser;
      const authenticatedUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
        roleConfig: ROLE_CONFIG[demoUser.role],
      };

      // Set tenant data
      const tenantData = {
        id: demoUser.tenantId,
        name: demoUser.tenantName,
        type: demoUser.tenantType,
      };

      // Save to localStorage
      localStorage.setItem('forwardsflow_user', JSON.stringify(authenticatedUser));
      
      // Update state
      setUser(authenticatedUser);
      setTenant(tenantData);
      setError(null);

      console.log('Login successful:', authenticatedUser.email, 'Role:', authenticatedUser.role);

      loginInProgress.current = false;
      
      return { success: true, user: authenticatedUser, tenant: tenantData };
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      loginInProgress.current = false;
      return { success: false, error: errorMsg };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('forwardsflow_user');
    setUser(null);
    setTenant(null);
    setError(null);
    loginInProgress.current = false;
  }, []);

  // Force reset function
  const forceReset = useCallback(() => {
    localStorage.removeItem('forwardsflow_user');
    localStorage.removeItem('forwardsflow_tenant');
    setUser(null);
    setTenant(null);
    setError(null);
    loginInProgress.current = false;
  }, []);

  const register = useCallback(async (registrationData) => {
    return {
      success: true,
      message: 'Registration submitted successfully. Please wait for admin approval.',
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const can = useCallback((permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);

  const getDefaultDashboard = useCallback(() => {
    if (!user) return '/login';
    return getDashboardPath(user.role);
  }, [user]);

  const belongsToTenant = useCallback((tenantId) => {
    if (!user) return false;
    return user.tenantId === tenantId;
  }, [user]);

  const getUserTenantType = useCallback(() => {
    if (!user) return null;
    return getTenantType(user.role);
  }, [user]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  const isForwardsFlowAdmin = useCallback(() => {
    return hasRole(ROLES.FORWARDSFLOW_ADMIN);
  }, [hasRole]);

  const isBankAdmin = useCallback(() => {
    return hasRole(ROLES.BANK_ADMIN);
  }, [hasRole]);

  const isInvestorAdmin = useCallback(() => {
    return hasRole(ROLES.INVESTOR_ADMIN);
  }, [hasRole]);

  const isBankUser = useCallback(() => {
    return [ROLES.BANK_ADMIN, ROLES.BANK_LENDER, ROLES.BANK_CALLER, ROLES.BANK_COMPLIANCE, ROLES.BANK_RISK].includes(user?.role);
  }, [user]);

  const isInvestorUser = useCallback(() => {
    return [ROLES.INVESTOR_ADMIN, ROLES.INVESTOR_ANALYST].includes(user?.role);
  }, [user]);

  const value = {
    user,
    tenant,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    clearError,
    forceReset,
    can,
    hasRole,
    isForwardsFlowAdmin,
    isBankAdmin,
    isInvestorAdmin,
    isBankUser,
    isInvestorUser,
    getDefaultDashboard,
    belongsToTenant,
    getUserTenantType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
