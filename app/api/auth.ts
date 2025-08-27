import { isEmail, normalizeNigerianPhone } from "@/app/utils/phone";
import client from "./client";

// Detect email vs phone and normalize phone to canonical 234XXXXXXXXXX
const login = (contact: string, password: string) => {
  const raw = (contact || "").trim();

  if (isEmail(raw)) {
    return client.post("/v1/login", { email: raw, password });
  }

  const normalizedPhone = normalizeNigerianPhone(raw);
  if (normalizedPhone) {
    return client.post("/v1/login", { phone: normalizedPhone, password });
  }
  // Last resort: attempt with raw digits (backend may validate)
  return client.post("/v1/login", { phone: raw.replace(/[^0-9]/g, ""), password });
};

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