import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try{
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error){
            toast.error(error.response?.data?.message || "Failed to load users.");
        } finally {
            set({ isUserLoading: false });
        }
    },
    
    getMessages: async (userID) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userID}`);
            set({ messages: res.data, selectedUser: userID });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages.");
        } finally{
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (userID) => set({ selectedUser: userID}),

    sendMessage: async (UserID, messageData) => {
        const {selectedUser, messages} = get();
        try{
            const res = await axiosInstance.post(`/messages/${UserID}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch(error){
            toast.error(error.response?.data?.message || "Failed to send message.");
        }
    }
}));