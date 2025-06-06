import { useEffect, useState, useCallback, memo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Separate UserItem component for better performance
const UserItem = memo(({ user, isSelected, isOnline, onClick }) => (
  <motion.button
    key={user._id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      w-full p-3 flex items-center gap-3
      hover:bg-base-300 transition-colors
      ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
    `}
  >
    <motion.div 
      className="relative mx-auto lg:mx-0"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <img
        src={user.profilePic || "/avatar.png"}
        alt={user.fullName}
        className="size-12 object-cover rounded-full"
        loading="lazy"
      />
      {isOnline && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-0 right-0 size-3 bg-green-500 
          rounded-full ring-2 ring-zinc-900"
        />
      )}
    </motion.div>

    <div className="hidden lg:block text-left min-w-0">
      <motion.div 
        className="font-medium truncate"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {user.fullName}
      </motion.div>
      <motion.div 
        className="text-sm text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {isOnline ? "Online" : "Offline"}
      </motion.div>
    </div>
  </motion.button>
));

UserItem.displayName = 'UserItem';

// Separate Header component
const SidebarHeader = memo(({ showOnlineOnly, setShowOnlineOnly, onlineCount }) => (
  <motion.div 
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="border-b border-base-300 w-full p-5"
  >
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ rotate: 15 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Users className="size-6" />
      </motion.div>
      <span className="font-medium hidden lg:block">Contacts</span>
    </div>
    <div className="mt-3 hidden lg:flex items-center gap-2">
      <motion.label 
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer flex items-center gap-2"
      >
        <input
          type="checkbox"
          checked={showOnlineOnly}
          onChange={(e) => setShowOnlineOnly(e.target.checked)}
          className="checkbox checkbox-sm"
        />
        <span className="text-sm">Show online only</span>
      </motion.label>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-zinc-500"
      >
        ({onlineCount} online)
      </motion.span>
    </div>
  </motion.div>
));

SidebarHeader.displayName = 'SidebarHeader';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Memoize filtered users
  const filteredUsers = useCallback(() => {
    return showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;
  }, [showOnlineOnly, users, onlineUsers]);

  // Calculate online count excluding current user
  const onlineCount = Math.max(0, onlineUsers.length - 1);

  // Memoize user selection handler
  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
    >
      <SidebarHeader 
        showOnlineOnly={showOnlineOnly}
        setShowOnlineOnly={setShowOnlineOnly}
        onlineCount={onlineCount}
      />

      <div className="overflow-y-auto w-full py-3">
        <AnimatePresence mode="popLayout">
          {filteredUsers().map((user) => (
            <UserItem
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              isOnline={onlineUsers.includes(user._id)}
              onClick={() => handleUserSelect(user)}
            />
          ))}
        </AnimatePresence>

        {filteredUsers().length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-zinc-500 py-4"
          >
            No online users
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default memo(Sidebar);