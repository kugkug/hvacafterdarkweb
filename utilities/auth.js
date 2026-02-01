import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [userToken, setUserToken] = useState('');
    const login = (user, userToken) => {
        setUser(user);
        setUserToken(userToken);
    };
    const logout = () => {
        setUser('user');
        setUserToken('');
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, logout }, children: children }));
};
export const useAuth = () => {
    return useContext(AuthContext);
};
