import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken"); // CHANGED: Added storedToken check
    return storedUser && storedToken ? JSON.parse(storedUser) : null; // CHANGED: Use storedToken in check
    });

    const login = (userData, accessToken) => { // CHANGED: Accept accessToken parameter
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken); // ADDED: Store Access Token
    localStorage.setItem("role", userData.role);
    };
    
    const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken"); // ADDED: Remove Access Token
    localStorage.removeItem("role"); 
    };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);