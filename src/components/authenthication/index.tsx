import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { supabaseConfig } from '../../../src/supbase';

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

interface AuthContextType {
    session: Session | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    supabase: typeof supabase;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within a AuthProvider');
    return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        // Properly handle asynchronous fetching of the session
        const fetchSession = async () => {
            setLoading(true);
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            setLoading(false);
        };

        fetchSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(!session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading, setSession, supabase }}>
            {children}
        </AuthContext.Provider>
    );
};
