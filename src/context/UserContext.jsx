import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const userContext = createContext(null);

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedin: false, name: "" });

  const [profiles, setProfiles] = useState([]);

  const isLoggedIn = () => {
    console.log(user.loggedin);
    return user.loggedin;
  };

  const pullUser = () => {
    const rawUser = localStorage.getItem("user");
    return JSON.parse(rawUser);
  };

  const pushUser = (name) => {
    const newUser = { name, loggedin: true };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  useEffect(() => {
    setTimeout(function () {
      const localUser = pullUser();

      if (localUser && localUser.loggedin) {
        setUser(localUser);
      }
    }, 0);
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <userContext.Provider
      value={{ user, profiles, pushUser, pullUser, isLoggedIn }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserContext;

export const useUserContext = () => {
  return useContext(userContext);
};
