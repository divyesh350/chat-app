import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL =import.meta.env.MODE === "development"? "http://localhost:5001" : "/"

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigninUp : false,
    isLogginIng:false,
    isUpdatingProfile: false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})
        } catch (error) {
            // console.log("Error in checkAuth",error)
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isSigningUp: false });
        }
      },
      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
    
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      updateProfile:async (data) => {
        set({isUpdatingProfile:true})
        try {
          const res = await axiosInstance.put("/auth/update-profile",data)
          set({authUser:res.data})          
        } catch (error) {
          toast.error(error.response.data.message);
        }
        finally{
          set({isUpdatingProfile:false})
        }
      },
      connectSocket: () => {
        const { authUser } = get();
        if (!authUser) return;
    
        // Disconnect existing socket if any
        if (get().socket?.connected) {
          get().socket.disconnect();
        }
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
    
        socket.on('connect', () => {
          console.log('Socket connected');
        });
    
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });
    
        set({ socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          // console.log("Received online users:", userIds);
          set({ onlineUsers: userIds });
        });
      },
    
      disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.disconnect();
          set({ socket: null, onlineUsers: [] });
        }
      },
}))