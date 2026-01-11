import { create } from 'zustand';
import axios from 'axios';
import { refreshTokenService } from '../services/authService';  // Import refresh token service
import api from '../services/authInterceptor';  // Axios instance with interceptor

// Auth Store using Zustand
const useAuthStore = create((set) => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,

    // Action to login
    login: async (credentials) => {
        try {
            let newCredentials = {
                email: credentials.email,
                password: credentials.password
            }
            // Login and get tokens
            const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', newCredentials);
            const { access, refresh } = response.data;

            // Store tokens
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            console.log(access)
            // Fetch the user's profile using the /users/me/ endpoint
            const userProfileResponse = await api.get('/auth/users/me/');
            console.log('User profile:', userProfileResponse.data);
            const user = userProfileResponse.data;

            // Update the zustand store
            set({
                accessToken: access,
                refreshToken: refresh,
                user: user,
                isAuthenticated: true
            });
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    // Action to signup
    signup: async (userData) => {
        try {
            const payload = {
                username: userData.username,
                email: userData.email,
                password: userData.password,
            };
            await axios.post('http://127.0.0.1:8000/auth/signup/', payload);
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            throw error; // Re-throw to handle in component
        }
    },

    // Action to verify OTP
    verifyOtp: async (email, otpCode) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/verify-otp/', { email, otp_code: otpCode });
            const { access, refresh, user } = response.data;

            // Store tokens
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            set({
                accessToken: access,
                refreshToken: refresh,
                user: user,
                isAuthenticated: true
            });
            return true;
        } catch (error) {
            console.error('OTP Verification error:', error);
            throw error; // Re-throw to handle in component
        }
    },

    // Action to refresh the token (using refreshTokenService)
    refreshToken: async () => {
        try {
            const newAccessToken = await refreshTokenService();  // Using the refreshTokenService function

            // Update access token in Zustand store and localStorage
            set({ accessToken: newAccessToken });
            return newAccessToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
        }
    },

    // Action to resend OTP
    resendOtp: async (email) => {
        try {
            await axios.post('http://127.0.0.1:8000/auth/resend-otp/', { email });
            return true;
        } catch (error) {
            console.error('Resend OTP error:', error);
            throw error;
        }
    },

    // Action to logout
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,
        });

        // Redirect to login page after logout
        window.location.href = '/auth';
    },
}));

export default useAuthStore;
