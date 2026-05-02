import React, { Children, createContext, useContext, useEffect, useState } from 'react'

const userContext = createContext(null);

const UserContext = ({children}) => {

    const [user, setUser] = useState({});

    const [profiles, setProfiles] = useState([])

    const isLoggedIn = () => {
        return user.loggedin;
    }

    const pullUser = () => {
        const rawUser = localStorage.getItem("user")
        return JSON.parse(rawUser);
    }

    const pushUser = (name) => {
        localStorage.setItem("user", JSON.stringify({name, loggedin: true}))
        setUser(user);
    }

    useEffect(()=>{
        setTimeout(function(){
            const localUser = pullUser();

            if (localUser.loggedin) {
                setUser(localUser);
            }
        }, 10)
    }, []);

    useEffect(()=>{
        console.log(user);
    }, [user])
    

  return (
    <userContext.Provider value={{ user, profiles, pushUser, pullUser, isLoggedIn }}>
        {children}
    </userContext.Provider>
  )
}

export default UserContext;

export const useUserContext = ()=>{
    return useContext(userContext);
}