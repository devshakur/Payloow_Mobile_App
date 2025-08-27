import React, { createContext, ReactNode, useContext, useState } from "react";

// Notification
export interface Notification {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
}

// Wallet
export interface Wallet {
  _id: string;
  user: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Paystack customer object
export interface PaystackCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string;
  risk_action: string;
  international_format_phone: string;
}

// Dedicated account
export interface DedicatedAccount {
  bank: {
    name: string;
    id: number;
    slug: string;
  };
  account_name: string;
  account_number: string;
  assigned: boolean;
  currency: string;
  metadata: any;
  active: boolean;
  id: number;
  created_at: string;
  updated_at: string;
  assignment: {
    integration: number;
    assignee_id: number;
    assignee_type: string;
    expired: boolean;
    account_type: string;
    assigned_at: string;
    expired_at: string | null;
    assignment_expires_at: string | null;
  };
}

// Verification Details
export interface VerificationDetails {
  validatedAt: string;
  paystackResponse: {
    customer: PaystackCustomer;
    dedicated_account: DedicatedAccount;
    identification: {
      status: string;
    };
  };
}

// Paystack Customer Data
export interface PaystackCustomerData {
  transactions: any[];
  subscriptions: any[];
  authorizations: any[];
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  domain: string;
  customer_code: string;
  risk_action: string;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
  identified: boolean;
  identifications: any;
}

// Main User
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  balance?: {
    $numberDecimal: string;
  };
  bvn: string | null;
  bnvStatus: string;
  accountDisabled: boolean;
  role: string;
  pin: boolean;
  transactionPin: string | null;
  isStep: number;
  referenceId: string | null;
  country: string;
  state: string;
  Address: string;
  isVerified: boolean;
  isTutorVerified: boolean | null;
  bvnVerified: boolean;
  paystackCustomerCode: string;
  referralCode: string;
  easyBuyRole?: string | null; // remove the default for production
  investmentRole?: string | null; // remove the default for production
  elearningRole?: string | null; // remove the default for production
  easyBuyProfile: string | null;
  verificationDetails: VerificationDetails | null;
  paystackCustomerData: PaystackCustomerData;
  previousReference: any[];
  notification: Notification[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  wallet: {
    _id: string;
    user: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  dva: string;
  profilePicture: string | null;
  pendingVerificationDetails: any;
}

// Wrapper
export interface UserData {
  message: string;
  success: boolean;
  data: User;
}

// Context & Hook
interface UserContextType {
  user: UserData | null;
  setUser: (userData: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
