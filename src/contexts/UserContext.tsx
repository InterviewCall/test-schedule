'use client';

import { createContext, FC, ReactNode, useEffect, useState } from 'react';

import { User } from '@/types';

interface ContextData {
    userDetails: User
    setUser: (data: User) => void
}

interface ContexProps {
    children: ReactNode
}

export const UserContext = createContext<ContextData>(null!);

const UserContextProvider: FC<ContexProps> = ({ children }) => {
    const [userDetails, setUserDetails] = useState<User>(null!);
    const [loading, setLoading] = useState(true);

    function setUser(data: User) {
        setUserDetails(data);
        sessionStorage.setItem('userDetails', JSON.stringify(data));
    }


    useEffect(() => {
        const stored = sessionStorage.getItem('userDetails');
        if(stored) setUserDetails(JSON.parse(stored));
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <UserContext.Provider value={{ userDetails, setUser }}>
            { children }
        </UserContext.Provider>
    );
};

export default UserContextProvider;