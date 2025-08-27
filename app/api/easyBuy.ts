import client from "./client";

// Get Products
const getProducts = () => client.get("/v1/easybuy/buyer/products");


const getProductsByCategory = (categoryId: string) =>
  client.get(`/v1/easybuy/buyer/products?categoryId=${categoryId}`);


const joinEasyBuy = (values: any) =>
  client.post("/v1/easybuy/profile/", values);

// Cart
const getCart = () => client.get("/v1/easybuy/buyer/cart");


const deleteFromCart = (productId: string) =>
  client.delete(`/v1/easybuy/buyer/cart`, { productId });
const addToCart = (productId: string, quantity?: number) =>
  client.post("/v1/easybuy/buyer/cart", {
    productId: productId,
    quantity: quantity || 1,
  });

// Delibary Information
const getDelibaryInformation = () =>
  client.get("/easybuy/buyer/delivery-information/");

// Coupon
const checkCoupon = () => client.get("/easybuy/buyer/check-coupon/");

// Orders
const orders = () => client.get("/easybuy/buyer/orders/");

// Swap
const swapProducts = (values: any) =>
  client.post("/easybuy/buyer/orders/", values);
const getAllSwap = () => client.get("/easybuy/buyer/orders/");
const getSingleSwap = () => client.get("/easybuy/buyer/orders/");
const deleteSwap = () => client.delete("/easybuy/buyer/orders/");

// Partner
const addProduct = (formData: any) =>
  client.post("/v1/easybuy/partner/products", formData);
const getCategories = () => client.get("/v1/easybuy/categories");
const getPartnerProducts = () => client.get("/easybuy/partner/products/");
const getPartnerProductsByCategory = (categoryId: string) =>
  client.get(`/easybuy/buyer/products/?categoryId=${categoryId}`);

// Coupon
const getInstallmentPlans = (
  amount: number,
  installmentPlan: string,
  numberOfInstallments: string
) => {
  return client.post("/v1/easybuy/buyer/calculate-installment", {
    totalAmount: amount,
    installmentPlan: installmentPlan,
    numberOfInstallments: numberOfInstallments,
  });
};

// Check Out
const checkOut = (
  paymentMethod: string,
  installmentPlan?: string,
  numberOfInstallments?: number
) => {
  return client.post("/v1/easybuy/buyer/checkout", {
    paymentMethod,
    installmentPlan,
    numberOfInstallments,
  });
};

export default {
  getProducts,
  joinEasyBuy,
  getCart,
  deleteFromCart,
  getDelibaryInformation,
  checkCoupon,
  checkOut,
  orders,
  swapProducts,
  getAllSwap,
  getSingleSwap,
  deleteSwap,
  addToCart,
  addProduct,
  getCategories,
  getPartnerProducts,
  getProductsByCategory,
  getPartnerProductsByCategory,
  getInstallmentPlans,
};

// {
//     "msg": "\"installmentPlan\" must be one of [weekly, monthly, quarterly, annually, null]"
// }


// {
//     "message": "Check Out",
//     "data": {
//         "result": {
//             "order": {
//                 "user": "687eab3d6893e4a87c0edcf2",
//                 "cartItems": [
//                     {
//                         "product": "687f785161cfe5f3d7a83065",
//                         "quantity": 1,
//                         "price": 300000,
//                         "partner": "687f6f2061cfe5f3d7a82ee4",
//                         "_id": "687fe73ea98e5a384ced5f96"
//                     }
//                 ],
//                 "paymentStatus": "pending",
//                 "totalAmount": 327000,
//                 "discountedAmount": 0,
//                 "orderStatus": "processing",
//                 "paymentMethod": "wallet",
//                 "isDiscounted": false,
//                 "transactionReference": "EAS-7265eb4495ade8db4e",
//                 "installmentDetails": {
//                     "isInstallment": true,
//                     "installmentPlan": "weekly",
//                     "installments": [
//                         {
//                             "amount": 51750,
//                             "dueDate": "2025-07-22T19:32:14.129Z",
//                             "status": "pending",
//                             "paymentDate": null,
//                             "_id": "687fe73ea98e5a384ced5f97"
//                         },
//                         {
//                             "amount": 51750,
//                             "dueDate": "2025-07-29T19:32:14.129Z",
//                             "status": "pending",
//                             "paymentDate": null,
//                             "_id": "687fe73ea98e5a384ced5f98"
//                         },
//                         {
//                             "amount": 51750,
//                             "dueDate": "2025-08-05T19:32:14.129Z",
//                             "status": "pending",
//                             "paymentDate": null,
//                             "_id": "687fe73ea98e5a384ced5f99"
//                         },
//                         {
//                             "amount": 51750,
//                             "dueDate": "2025-08-12T19:32:14.129Z",
//                             "status": "pending",
//                             "paymentDate": null,
//                             "_id": "687fe73ea98e5a384ced5f9a"
//                         }
//                     ],
//                     "orderId": "f2a789e7d08719bc7e0fa9ac00553cd023a83661"
//                 },
//                 "paystackAuthorization": null,
//                 "_id": "687fe73ea98e5a384ced5f95",
//                 "createdAt": "2025-07-22T19:32:14.136Z",
//                 "updatedAt": "2025-07-22T19:32:14.136Z",
//                 "__v": 0
//             },
//             "checkout_url": "https://checkout.paystack.com/spxm9xgzxbdcwp7"
//         },
//         "paidWithWallet": false
//     },
//     "success": true
// } 