import { useEffect, useRef, useCallback, memo } from "react";
import { useChatStore } from "../store/useChatStore"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Separate Message component for better performance
const Message = memo(({ message, authUser, selectedUser, messageEndRef }) => (
  <motion.div
    key={message._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
    ref={messageEndRef}
  >
    <motion.div 
      className="chat-image avatar"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="size-10 rounded-full border">
        <img
          src={
            message.senderId === authUser._id
              ? authUser.profilePic || "/avatar.png"
              : selectedUser.profilePic || "/avatar.png"
          }
          alt="profile pic"
          loading="lazy"
        />
      </div>
    </motion.div>
    <div className="chat-header mb-1">
      <time className="text-xs opacity-50 ml-1">
        {formatMessageTime(message.createdAt)}
      </time>
    </div>
    <motion.div 
      className="chat-bubble flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {message.image && (
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={message.image}
          alt="Attachment"
          className="sm:max-w-[200px] rounded-md mb-2"
          loading="lazy"
        />
      )}
      {message.text && <p>{message.text}</p>}
    </motion.div>
  </motion.div>
));

Message.displayName = 'Message';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Memoize scroll handler
  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle socket subscription
  useEffect(() => {
    if (!selectedUser?._id) return;
    
    getMessages(selectedUser._id);
    
    // Only subscribe to messages if socket is available
    const socket = useAuthStore.getState().socket;
    if (socket?.connected) {
      subscribeToMessages();
    }
    
    return () => {
      if (socket?.connected) {
        unsubscribeFromMessages();
      }
    };
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col overflow-auto"
      >
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col overflow-auto"
    >
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <motion.div 
                className="chat-image avatar"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </motion.div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <motion.div 
                className="chat-bubble flex flex-col"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {message.image && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <MessageInput />
    </motion.div>
  )
}

export default ChatContainer