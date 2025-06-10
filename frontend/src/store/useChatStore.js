import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isAILoading: false,
  
    getUsers: async () => {
      set({ isUsersLoading: true });
      try {
        const res = await axiosInstance.get("/messages/users");
        set({ users: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isUsersLoading: false });
      }
    },
  
    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isMessagesLoading: false });
      }
    },
    sendMessage: async ({ text, image }) => {
      const { selectedUser } = get();
      const socket = useAuthStore.getState().socket;
      const authUser = useAuthStore.getState().authUser; // Get authUser
  
      try {
        // If the selected user is AI, use the AI endpoint
        if (selectedUser.isAI) {
          // Add user's message to the chat immediately
          const userMessage = {
            _id: Date.now(), // Temporary ID for immediate display
            senderId: authUser._id, // Your user ID
            receiverId: selectedUser._id, // AI user ID
            text: text,
            image: image, // Although image is disabled for AI, keep it for consistency
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, userMessage],
          }));

          set({ isAILoading: true });
          const { data } = await axiosInstance.post("/ai/chat", { text });
          set((state) => ({
            messages: [...state.messages, data],
          }));
          return;
        }
  
        // Regular user message handling
        const { data } = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
          text,
          image,
        });
  
        set((state) => ({
          messages: [...state.messages, data],
        }));
  
        if (socket) {
          socket.emit("sendMessage", data);
        }
      } catch (error) {
        console.error("Error in sendMessage:", error);
        toast.error(error.response.data.message || "Failed to send message");
        throw error;
      } finally {
        set({ isAILoading: false });
      }
    },
  
    subscribeToMessages: () => {
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
  
      socket.on("newMessage", (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
    },
  
    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      
      socket.off("newMessage");
    },
  
    setSelectedUser: (user) => set({ selectedUser: user }),
  }));