import React, { createContext, useContext, useEffect, useState } from 'react'

const profileContext = createContext(null);

const ProfilesContext = ({ children }) => {

    const [profiles, setProfiles] = useState([]);

    const createProfile = (apps, name) => {
        setProfiles(prev => {
            const updated = [...prev, { id: Date.now(), apps, name }];
            localStorage.setItem("profiles", JSON.stringify(updated));
            return updated;
        });
    }

    useEffect(() => {
        const localProfiles = JSON.parse(localStorage.getItem("profiles"));
        if (localProfiles) {
            setProfiles(localProfiles);
        }
    }, []);

    return (
        <profileContext.Provider value={{ profiles, createProfile }}>
            {children}
        </profileContext.Provider>
    )
}

export default ProfilesContext;

export const useProfileContext = () => {
    return useContext(profileContext);
}