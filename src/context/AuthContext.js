import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEMO_USERS, ROLES, ROLE_CONFIG, getDashboardPath, hasPermission, getTenantType } from '../config/roleConfig';
import { db } from '../services/DatabaseService';

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

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem('forwardsflow_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Load tenant data
          if (parsedUser.tenantId) {
            const tenantData = await db.getOrganization(parsedUser.tenantId);
            setTenant(tenantData);
          }
        } catch (e) {
          console.error('Error loading saved user:', e);
          localStorage.removeItem('forwardsflow_user');
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user in demo users
    const demoUser = DEMO_USERS[email.toLowerCase()];
    
    if (!demoUser || demoUser.password !== password) {
      setError('Invalid email or password');
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }

    // Create user object (without password)
    const { password: _, ...userWithoutPassword } = demoUser;
    const authenticatedUser = {
      ...userWithoutPassword,
      lastLogin: new Date().toISOString(),
      roleConfig: ROLE_CONFIG[demoUser.role],
    };

    // Load tenant data
    let tenantData = null;
    if (demoUser.tenantId) {
      tenantData = await db.getOrganization(demoUser.tenantId);
    }

    // Save to localStorage
    localStorage.setItem('forwardsflow_user', JSON.stringify(authenticatedUser));
    
    setUser(authenticatedUser);
    setTenant(tenantData);
    setLoading(false);

    // Create audit log
    await db.createAuditLog({
      action: 'login',
      userId: authenticatedUser.id,
      userEmail: authenticatedUser.email,
      tenantId: authenticatedUser.tenantId,
      ipAddress: 'demo',
    });

    return { success: true, user: authenticatedUser, tenant: tenantData };
  }, []);

  const logout = useCallback(async () => {
    if (user) {
      await db.createAuditLog({
        action: 'logout',
        userId: user.id,
        userEmail: user.email,
        tenantId: user.tenantId,
      });
    }
    
    localStorage.removeItem('forwardsflow_user');
    setUser(null);
    setTenant(null);
    setError(null);
  }, [user]);

  const register = useCallback(async (registrationData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would create a pending user
    setLoading(false);
    return {
      success: true,
      message: 'Registration submitted successfully. Please wait for admin approval.',
    };
  }, []);

  // Permission checking
  const can = useCallback((permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);

  // Get dashboard path for current user
  const getDefaultDashboard = useCallback(() => {
    if (!user) return '/login';
    return getDashboardPath(user.role);
  }, [user]);

  // Check if user belongs to a specific tenant
  const belongsToTenant = useCallback((tenantId) => {
    if (!user) return false;
    return user.tenantId === tenantId;
  }, [user]);

  // Get user's tenant type
  const getUserTenantType = useCallback(() => {
    if (!user) return null;
    return getTenantType(user.role);
  }, [user]);

  // Check role
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
    // State
    user,
    tenant,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Auth methods
    login,
    logout,
    register,
    
    // Permission methods
    can,
    hasRole,
    
    // Role checks
    isForwardsFlowAdmin,
    isBankAdmin,
    isInvestorAdmin,
    isBankUser,
    isInvestorUser,
    
    // Utility methods
    getDefaultDashboard,
    belongsToTenant,
    getUserTenantType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
