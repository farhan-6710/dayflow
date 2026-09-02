import { BASE_URL } from "@config/config";

export const REQUEST_TYPE = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
};

export const API_URL = {
  EXPO_PUSH_NOTIFICATION: {
    url: "https://exp.host/--/api/v2/push/send",
    type: "POST",
  },
  AUTH: {
    url: BASE_URL + "/auth",
    type: "POST",
  },
  STORE_EXPO_TOKEN: {
    url: BASE_URL + "/api/store_expo_token",
    type: "POST",
  },
  // Updated to match server REST endpoints
  GET_REMINDERS: {
    url: BASE_URL + "/api/reminders",
    type: "GET",
  },
  GET_REMINDER_BY_ID: {
    url: (id: string) => BASE_URL + `/api/reminders/${id}`,
    type: "GET",
  },
  ADD_REMINDER: {
    url: BASE_URL + "/api/reminders",
    type: "POST",
  },
  UPDATE_REMINDER: {
    url: (id: string) => BASE_URL + `/api/reminders/${id}`,
    type: "PATCH",
  },
  DELETE_REMINDER: {
    url: (id: string) => BASE_URL + `/api/reminders/${id}`,
    type: "DELETE",
  },
};
