import React, { useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProtectedPage = ({ children }) => {
  const { isLoggedIn } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn()) {
        navigate("/auth");
      }
    }, 0);
  }, [isLoggedIn]);

  return <div>{children}</div>;
};

export default ProtectedPage;
