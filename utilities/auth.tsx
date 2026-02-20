import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: string | null;
    token: string | null;
    name: string | null;
    login: (user: string, userToken: string, name: string) => void;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedName = localStorage.getItem('name');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(storedUser);
            setName(storedName);
            setToken(storedToken);
        }

        setIsLoading(false);
    }, []);

    const login = (user: string, userToken: string, name: string) => {
        setUser(user);
        setToken(userToken);
        setName(name);
        localStorage.setItem('user', user);
        localStorage.setItem('name', name);
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setName(null);
        localStorage.removeItem('user');
        localStorage.removeItem('name');
        localStorage.removeItem('token');

        navigate('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                name,
                login,
                logout,
                isLoading,
                isAuthenticated: !!user && !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
