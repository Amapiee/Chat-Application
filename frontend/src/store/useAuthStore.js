import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  isCheckingAuth: true, // Start with true to check auth status on app load

  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Set to true when starting to check auth status
    try{
      const response = await axiosInstance.get('/auth/check-auth');
      set ({ authUser: response.data.user }); 
    } catch (error) {
      console.log('Error checking auth status:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false }); // Set to false after checking auth status
    }
  },
    
  signup: async (data) => {
    set ({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data});
      toast.success("Signup successful! Please login to continue.");
    } catch (error) {
      toast.error("Error occurred while signing up.");
    } finally {
      set ({ isSigningUp: false });
    }
  },

  signout: async () => {
    try {
      await axiosInstance.post('/auth/signout');
      set({ authUser: null });
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Error occurred while logging out.");
    }
  },

  login : async (data) => {
    set ({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser : res.data});
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Error occurred while logging in.");
    } finally {
      set ({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      console.log("Updating profile with data:", data);
      const res = await axiosInstance.put('/auth/update-profile', data);
      console.log("Profile updated successfully");
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile.");
      console.log("Profile update error:", error);
    }finally {
      set({ isUpdatingProfile: false });
    }
  },
}));    