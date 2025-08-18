import client from "./client";

const login = (contact: string, password: string) =>
  client.post("/v1/login", { phone: contact, password });

const setPin = (pin: string) => client.post("/v1/set-transaction-pin", { pin });
const changePin = (currentPin: string, newPin: string) =>
  client.post("/v1/set-transaction-pin", { currentPin, newPin });
const changePassword = (currentPassword: string, newPassword: string) =>
  client.patch("/v1/change-password", { currentPassword, newPassword });
const resetPassword = (email: string) =>
  client.post("/v1/forget-password", { email });
const confirmPasswordReset = (email: string, otp: string, password: string) => {
  return client.post("/v1/reset-password", { email, password, code: otp });
};
const changeEmail = (email: string) =>
  client.patch("/v1/change-email", { email });
const logout = () => client.post("/v1/logout/");

export default {
  login,
  setPin,
  changePin,
  resetPassword,
  confirmPasswordReset,
  logout,
  changeEmail,
  changePassword,
};
