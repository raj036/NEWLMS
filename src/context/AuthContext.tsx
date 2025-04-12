import { createContext, useReducer, useEffect, Dispatch } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React from "react";

interface CurrentUserContextType {
  user: object;
  dispatch: Dispatch<any>;
}

export const AuthContext = createContext<CurrentUserContextType | null>(null);

export const authReducer = (
  state: any,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      const { exp } = jwtDecode(parsedUser.token);

      if (exp * 1000 < Date.now()) {
        localStorage.removeItem("user");
        dispatch({
          type: "LOGOUT",
          payload: undefined,
        });
        <Navigate to="/login" />;
      } else {
        dispatch({ type: "LOGIN", payload: parsedUser });
      }
    } else {
      localStorage.removeItem("user");
      dispatch({
        type: "LOGOUT",
        payload: undefined,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
