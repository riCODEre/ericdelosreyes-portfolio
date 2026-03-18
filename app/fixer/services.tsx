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



