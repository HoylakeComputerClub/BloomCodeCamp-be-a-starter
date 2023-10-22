import React, { createContext, useContext } from 'react';
import { useLocalState } from '../utils/useLocalStorage';

const UserContext = createContext();

const UserProvider = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    return <UserContext.Provider value={jwt}></UserContext.Provider>
};

function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context;
}

export { UserProvider, useUser };

