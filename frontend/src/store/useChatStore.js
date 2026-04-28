import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import {useAuthStore} from './useAuthStore.js';

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
            set({ messages: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages.");
        } finally{
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (userID) => set({ selectedUser: userID}),

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("Message sent successfully:", res.data);
            set({ messages: [...messages, res.data] });
        } catch(error){
            toast.error(error.response?.data?.message || "Failed to send message.");
        }
    },

    subscribeToMessages: () => {
        const selectedUser = get().selectedUser;
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const isMessageForCurrentChat = newMessage.senderID === selectedUser._id;
            if (!isMessageForCurrentChat) return;

            if (newMessage.senderID === selectedUser._id) {
                set((state) => ({ messages: [...state.messages, newMessage] }));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    
}));