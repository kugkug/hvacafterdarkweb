import { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: string | null; // Often `user` starts as null
    login: (user: string, userToken: string) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState('');
    const [userToken, setUserToken] = useState('');

    const login = (user: string, userToken: string) => {
        setUser(user);
        setUserToken(userToken);
    };

    const logout = () => {
        setUser('user');
        setUserToken('');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
