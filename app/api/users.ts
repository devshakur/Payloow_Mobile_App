import client from "./client";

// Function to register a user
const register = (firstName: string, lastName: string, email: string, password: string, phone: string, country: string,  state: string, address: string) => {
  const userInfo = {
    firstName,
    lastName,
    email,
    password,
    country, 
    state, 
    phone,
    address,
    role: "user"
  };

  // Sending a POST request to the API with userInfo
  return client.post("/v1/register", userInfo);
};


export default { register};
