export type HTTP_METHODS = "GET" | "PATCH" | "PUT" | "POST" | "DELETE" | "OPTIONS";

type AUTH_ROUTES = "LOGIN" | "LOGOUT" | "REFRESH" | "REGISTER" | "AUTH_QUERY";
type NOTE_ROUTES = "GET_ALL_NOTES" | "CREATE_NOTE" | "UPDATE_NOTE" | "DELETE_NOTE";
type USER_ROUTES = "UPDATE_USER" | "DELETE_USER";

type API_ROUTES = AUTH_ROUTES | NOTE_ROUTES | USER_ROUTES;

export type Endpoint = {
    URL: string;
    METHOD: HTTP_METHODS;
}

export type Endpoints = {
    [key in API_ROUTES]: Endpoint
}