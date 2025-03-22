export type HTTP_METHODS = "GET" | "PATCH" | "PUT" | "POST" | "DELETE" | "OPTIONS";

export interface Endpoints {
    [key: string]: {
        URL: string;
        METHOD: HTTP_METHODS;
    }
}