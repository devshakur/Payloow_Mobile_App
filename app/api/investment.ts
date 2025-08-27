import client from "./client";

const approve = (investmentRequestId: string, status: string) =>
  client.post(`/v1/debtors-users/business/investment/${investmentRequestId}`, {
    status: status,
  });

const repay = (
  investmentRequestId: string,
  payments: { installmentId: string; amount: number }[]
) =>
  client.post(
    `/v1/debtors-users/business/investment/${investmentRequestId}/repay`,
    { payments }
  );

const getInvestmentsByInvestor = () =>
  client.get("/v1/investors-users/investments");

const getInvestmentsByDebtor = () =>
  client.get("/v1/debtors-users/business/investment");

const getBusiness = () => client.get("/v1/debtors-users/business");

const addLoan = (formData: any) => {
  return client.post("/v1/debtors-users/business/loan", formData);
};

const createBusiness = (formData: any) => {
  return client.post("/v1/debtors-users/business", formData);
};

const becomeInvestor = ({
  email,
  phoneNumber,
  industries,
}: {
  email: string;
  phoneNumber: string;
  industries: string[];
}) => {
  return client.post("/v1/investors-users/profile", {
    email,
    phoneNumber,
    industries,
  });
};

const becomeDebtor = (formData: any) => {
  return client.post("/v1/debtors-users/profile", formData);
};
const invest = (
  businessId: string,
  investmentAmount: number,
  expectedRoi: number,
  paymentFrequency: string,
  paymentTerm: number
) => {
  return client.post("/v1/investors-users/invest", {
    businessId,
    investmentAmount,
    expectedRoi,
    paymentFrequency,
    paymentTerm,
  });
};

export default {
  getBusiness,
  addLoan,
  createBusiness,
  invest,
  getInvestmentsByInvestor,
  getInvestmentsByDebtor,
  approve,
  repay,
  becomeDebtor,
  becomeInvestor,
};
