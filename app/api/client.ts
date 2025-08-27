import { create } from "apisauce";
import * as SecureStore from "expo-secure-store";

const url = "https://api.payloow.com/api";

const apiClient = create({
  baseURL: url,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const token = await SecureStore.getItemAsync("auth");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
});

export default apiClient;
