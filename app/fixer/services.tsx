import { apiClient } from "@/app/services";

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/auth/login", {
            email,
            password
        });
        return response.data.message;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export const logoutUser = async () => {
    try {
        const response = await apiClient.post("/auth/logout");
        return response.data.message;
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
}



