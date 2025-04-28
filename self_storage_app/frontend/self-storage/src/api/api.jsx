import axios from "axios";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
// import { defaultProvider } from "@aws-sdk/credential-provider-node";
// import { Sha256 } from "@aws-crypto/sha256-js";

const REGION = "eu-west-1";
const SERVICE = "execute-api";
const BASE_URL = "https://asgt8dbww4.execute-api.eu-west-1.amazonaws.com/Prod";

const createSignedRequest = async (method, urlPath, token, body = null) => {
    const signer = new SignatureV4({
        region: REGION,
        service: SERVICE,
        // credentials: ,
        sha256: token,
    });

    const request = new HttpRequest({
        method,
        hostname: new URL(BASE_URL).hostname,
        path: urlPath,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return signer.sign(request);
};

const createApiClient = (token = null) => {
    const apiClient = axios.create({
        baseURL: BASE_URL, // Always use the full base URL to ensure proper signing
    });

    // Interceptor to sign requests
    apiClient.interceptors.request.use(async (config) => {
        try {
            const urlPath = config.url.startsWith("/") ? config.url : `/${config.url}`;
            const signedRequest = await createSignedRequest(
                config.method.toUpperCase(),
                urlPath,
                token,
                config.data
            );

            // Apply signed headers to the request
            config.headers = {
                ...config.headers,
                ...signedRequest.headers,
            };

            return config;
        } catch (error) {
            console.error("Error signing request:", error);
            throw error;
        }
    });

    return apiClient;
};

export async function checkAdminStatus(userId, authToken) {
    try {
        const apiClient = createApiClient(authToken);
        const endpoint = `/users/${userId}/isAdmin`;
        console.log(`Making request to: ${apiClient.defaults.baseURL}${endpoint}`);

        const response = await apiClient.post(endpoint);
        return response.data.isAdmin; // Boolean indicating admin status
    } catch (error) {
        if (error.response) {
            console.error("API error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Request setup error:", error.message);
        }
        return false; // Default to non-admin on error
    }
}

export async function fetchStorageUnits(token) {
    try {
        const apiClient = createApiClient(token);
        const response = await apiClient.get("/storage-units");
        return response.data;
    } catch (error) {
        console.error("Error fetching storage units:", error);
        throw error;
    }
}


export default createApiClient;
