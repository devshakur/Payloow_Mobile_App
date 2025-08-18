import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

// Define the User type
interface User {
  _id: string;
}

interface JwtPayload {
  _id: string;
}

const token = "auth";

const storeToken = async (responseObject: any) => {
  const auth = responseObject;

  try {
    await SecureStore.setItemAsync(token, auth);
  } catch (error) {}
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(token);
  } catch (error) {}
};

const getUser = async (): Promise<User | null> => {
  const token = await getToken();
  if (!token) {
    return null; // Explicitly return null if no token is stored
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded && decoded._id) {
      return { _id: decoded._id };
    }
  } catch (error) {
  
  }

  return null;
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(token);
  } catch (error) {}
};

export default { getToken, getUser, removeToken, storeToken };
