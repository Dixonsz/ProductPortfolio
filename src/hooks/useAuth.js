import {useCallback} from 'react';
import {authService} from '../services/authService';
import {useAuthStore} from '../store/authStore';

export function useAuth() {
    const {user, loading, setUser, clearUser} = useAuthStore();

    const login = useCallback(async (email, password) => {
        const user = await authService.login(email, password);
        setUser(user);
    }, [setUser]);

    const logout = useCallback(async () => {
        await authService.logout();
        clearUser();
    }, [clearUser]);

    return {
        user,
        loading,
        login,
        logout,
    };
}