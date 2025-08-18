import client from "./client";

const getVariations = () => client.get("/v1/payloow-bills/data/list");

const getDiscos = () => client.get("/v1/payloow-bills/electricity/discos");

const getCables = () => client.get("/v1/payloow-bills/cable-tv/list");

const buyDataWithGongozConcept = (
  network: number | undefined,
  phone: string | undefined,
  planId: string | undefined
) =>
  client.get("/v1/gongoz-concept/buy-data", {
    network: network,
    mobile_number: phone,
    plan: planId,
  });

const buyData = (
  phone: string,
  transactionPin: string,
  network: string,
  validity: string,
  planId: string
) =>
  client.post("v1/payloow-bills/data", {
    phone: phone,
    transactionPin: transactionPin,
    network: network.toUpperCase(),
    planType: validity,
    planId: planId,
    ported: false,
  });

const buyAirtime = (
  phone: string,
  amount: number,
  transactionPin: string,
  network: string
) =>
  client.post("/v1/payloow-bills/airtime", {
    phone: phone,
    amount: amount,
    transactionPin: transactionPin,
    network: network.toUpperCase(),
  });

const buyElectricityWithGongozConcept = (
  network: number | undefined,
  phone: string | undefined,
  planId: string | undefined
) =>
  client.get("/v1/gongoz-concept/buy-lelctricity", {
    network: network,
    mobile_number: phone,
    plan: planId,
  });

const validateIUCWithGongozConcept = (
  network: string | undefined,
  phone: string | undefined,
  price: string | undefined
) =>
  client.get("/v1/gongoz-concept/validate-iuc", {
    phone: phone,
    network_id: network,
    amount: price,
  });

const validateMeterNumber = (
  disconumber: string,
  disconame: string,
  type: string
) =>
  client.get(
    `/v1/payloow-bills/electricity/validate-meter?meterNumber=${disconumber}&disco=${disconame}&type=${type}`
  );

const validateCableNumber = (smart_card_number: string, cable: string) =>
  client.get(
    `/v1/payloow-bills/cable-tv/validate?smart_card_number=${smart_card_number}&cablename=${cable}`
  );

const buyElectricity = (
  meterNumber: string,
  disco: string,
  type: string,
  transactionPin: string,
  phone: string,
  MeterType: string,
  amount: number,
  customerAddress: string,
  customerName: string
) =>
  client.post("/v1/payloow-bills/electricity", {
    meterNumber,
    disco,
    type,
    transactionPin,
    phone,
    MeterType,
    amount,
    customerAddress,
    customerName,
  });

const buyCable = (
  cableId: string,
  smartCardNumber: string,
  plan: string,
  customerName: string
) =>
  client.post("/v1/payloow-bills/electricity", {
    cablename: cableId,
    cableplan: plan,
    smart_card_number: smartCardNumber,
    customer_name: customerName,
  });

export default {
  getVariations,
  buyDataWithGongozConcept,
  buyData,
  validateIUCWithGongozConcept,
  buyElectricityWithGongozConcept,
  buyAirtime,
  getDiscos,
  validateMeterNumber,
  buyElectricity,
  validateCableNumber,
  getCables,
  buyCable,
};
