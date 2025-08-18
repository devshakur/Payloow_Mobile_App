import client from "./client";

const getUser = () => client.get("/v1/get-current-user");
const setProfileImage = (formData: any) =>
  client.post("/v1/add-profile-picture", formData);

export default {
  getUser,
  setProfileImage,
};
