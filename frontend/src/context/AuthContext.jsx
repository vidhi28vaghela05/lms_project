import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        const name = sessionStorage.getItem('name');
        const _id = sessionStorage.getItem('_id');
        if (token) {
            setUser({ token, role, name, _id });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        sessionStorage.setItem('token', userData.token);
        sessionStorage.setItem('role', userData.role);
        sessionStorage.setItem('name', userData.name);
        sessionStorage.setItem('_id', userData._id);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
