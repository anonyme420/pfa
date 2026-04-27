import { signIn, signOut } from "next-auth/react";

// Client-side auth service
export const authService = {
  async register(email: string, password: string, name?: string) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return await response.json();
  },

  async login(email: string, password: string) {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      throw new Error(result?.error || "Login failed");
    }

    return result;
  },

  async logout() {
    await signOut({ redirect: false });
  },
};

// Legacy local storage service (deprecated - kept for compatibility)
export const localAuthService = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  },

  getUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("auth_user");
    return user ? JSON.parse(user) : null;
  },

  setUser(user: any): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_user", JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_user");
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
