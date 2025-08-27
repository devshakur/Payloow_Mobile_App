import { useContext } from "react";

import AuthContext from "./context";
import authStorage from "./storage";
import { jwtDecode } from 'jwt-decode';

// Define types for better type safety
interface AuthResponse {
    "message": string,
    "data": {
      "auth": string
      "verified": boolean
    },
    "success": boolean
}

interface User {
  "user": {
    "_id": string,
    "phone": number,
    "role": string
  },
}

// UseContext should be typed correctly with the expected value of AuthContext
export default function useAuth() {
  const { user, setUser } = useContext(AuthContext); // Ensure AuthContext is typed properly

  const logIn = (responseObject: AuthResponse) => {
    // Decode the JWT token and map it to the User interface
    const decodedUser: User = jwtDecode(responseObject.data.auth);
    setUser(decodedUser); 
    authStorage.storeToken(responseObject.data.auth); 
  };

  const saveData = (data: User) => {
    setUser(data); // Update the user data in the context
  };

  const logOut = () => {
    setUser(null); // Clear the user data
    authStorage.removeToken(); // Remove tokens from storage
  };


  return { user, logIn, logOut, saveData };
}
