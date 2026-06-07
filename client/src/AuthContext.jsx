

import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token,    setToken]    = useState(localStorage.getItem('starmail_token'));
  const [username, setUsername] = useState(localStorage.getItem('starmail_username'));
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { setLoading(false); }, []);

  const login = (userToken, name) => {
    localStorage.setItem('starmail_token',    userToken);
    localStorage.setItem('starmail_username', name);
    setToken(userToken);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem('starmail_token');
    localStorage.removeItem('starmail_username');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};