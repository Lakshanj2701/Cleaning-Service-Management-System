import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('userInfo')); } catch { return null; }
  });

  const login = (newToken, userInfo) => {
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setToken(newToken);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
