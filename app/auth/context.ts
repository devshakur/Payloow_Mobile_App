import React, { createContext } from "react";

// Define types for your context
interface User {
  "user": {
    "_id": string,
    "phone": number,
    "role": string
  },
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Provide a default value for the context
const defaultContextValue: AuthContextType = {
  user: null,
  setUser: () => {}, 
};

// Create the context with the default value
const AuthContext = createContext<AuthContextType>(defaultContextValue);

export default AuthContext;
