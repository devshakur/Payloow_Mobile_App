import React, { createContext, ReactNode, useContext, useState } from "react";

// Define types for form values
interface FormValues {
  email?: string;
  phone?: string;
  password?: string;
  bvn?: string;
  firstName?: string;
  lastName?: string;
  image?: any;
  country?: string;
  state?: string;
  address?: string;
  pin?: string;
  otp?: string;
  bank?: string;
  accountNumber?: string;
  customer_code?: string;
  // rePin?: string;
}

// Define context type
interface FormContextType {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider props
interface FormProviderProps {
  children: ReactNode;
}

// Form Provider
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formValues, setFormValues] = useState<FormValues>({});

  return (
    <FormContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook
export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};

export default FormContext;
