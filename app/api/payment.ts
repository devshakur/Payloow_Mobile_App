import client from "./client";

const verifyCustomer = (
  customer_code: string,
  country: string,
  bvn: string,
  accountNumber: string,
  firstName: string,
  lastName: string,
  bank: string
) =>
  client.post("/v1/wallet/verify-customer", {
    customer_code: customer_code,
    country,
    type: "bank_account",
    account_number: accountNumber,
    bvn,
    bank_code: bank,
    first_name: firstName,
    last_name: lastName,
  });

const paymentTrasactions = () => client.get("/payment_gateway/transactions/");

const initiateFundingTrasactions = (amount: string) =>
  client.post("/payment_gateway/initiate_funding_transaction/", {
    amount: amount,
  });

const getSavedCard = () => client.get("/payment_gateway/save_card/");

const saveCard = () => client.post("/payment/save_card/");

const chargeCard = (data: object) =>
  client.post("/payment_gateway/intiate_funding_with_card_transaction/", data);

const verifyChargeCard = (data: object) =>
  client.post("/payment_gateway/verify_funding_with_card/", data);

const sendMoney = (
  amount: number,
  account_number: string,
  bank_code: string,
  account_name: string
) => {
  return client.post("/payment_gateway/send_money/", {
    amount,
    bankDetails: {
      account_number: account_number,
      bank_code: bank_code,
      account_name: account_name,
    },
  });
};

const getBankList = () => client.get("/v1/wallet/transfer/list-banks");

const validateAccountNumber = (accountNumber: string, bankCode: string) =>
  client.get(
    `/v1/wallet/transfer/resolve-account?account_number=${accountNumber}&bank_code=${bankCode}`
  );

const getTransactions = () => client.get("/v1/transactions/list");

export default {
  getBankList,
  sendMoney,
  verifyCustomer,
  paymentTrasactions,
  initiateFundingTrasactions,
  getSavedCard,
  chargeCard,
  verifyChargeCard,
  saveCard,
  validateAccountNumber,
  getTransactions,
};
