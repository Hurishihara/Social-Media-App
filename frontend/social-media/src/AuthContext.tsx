import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./utils/axiosConfig";

interface AuthContextProps {
    isAuthenticated: boolean;
    loading: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authApi = api('auth');
                await authApi.get('/check-auth');
                setIsAuthenticated(true);
            }
            catch {
                setIsAuthenticated(false);
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated}}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}