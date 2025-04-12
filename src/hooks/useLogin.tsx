import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "../helper/axios";
import { useNavigate, useLocation } from "react-router-dom";

export const useLogin = () => {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const login = async (email: any, user_password: any) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(`api/lms_login`, {
        email,
        user_password,
      });
      const userData = await response.data;
      
      if (userData.status_code === 500) {
        throw new Error(`${userData.detail}`);
      }
      dispatch({ type: "LOGIN", payload: userData });
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);
      const { from }: any = location.state || { from: { pathname: "/" } };
      navigate(from);
      window.scrollTo(0, 0);
    } catch (error) {
      // console.error("Error in useLogin", error);
      setError(error);
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
