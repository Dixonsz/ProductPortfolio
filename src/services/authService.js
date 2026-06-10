import { authAdapter } from "../adapters/authAdapter";
import { authApi } from "../api/endpoints/auth";

export const authService = {
  login: async (email, password) => {
    const { data, error } = await authApi.signIn(email, password);
    if (error) throw error;
    return authAdapter.toModel(data.user);
  },

  logout: async () => {
    const { error } = await authApi.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data, error } = await authApi.getSession();
    if (error) throw error;
    return authAdapter.toModel(data.session?.user);
  },
};
