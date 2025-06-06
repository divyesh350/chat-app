import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"
import { Camera, Mail, User, Calendar, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // Reduced to 1MB
const MAX_DIMENSION = 400; // Reduced to 400px
const COMPRESSION_QUALITY = 0.6; // Reduced quality for smaller size

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_DIMENSION) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY);
          
          // Clean up
          canvas.remove();
          img.remove();
          
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Processing image...');

    try {
      // Compress the image
      const compressedImage = await compressImage(file);
      
      // Update the preview
      setSelectedImg(compressedImage);
      
      // Update profile
      const response = await updateProfile({ profilePic: compressedImage });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Profile picture updated successfully! 🎉');
      
      // Update the preview with the new image URL from response
      if (response?.profilePic) {
        setSelectedImg(response.profilePic);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 408:
            toast.error('Upload timed out. Please try a smaller image.');
            break;
          case 413:
            toast.error('Image file is too large. Please try a smaller image.');
            break;
          case 400:
            toast.error('Invalid image format. Please try a different image.');
            break;
          case 404:
            toast.error('User not found. Please try logging in again.');
            break;
          default:
            toast.error('Failed to upload image. Please try again.');
        }
      } else if (error.message === 'Upload timeout') {
        toast.error('Upload took too long. Please try a smaller image.');
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
      
      // Reset the image preview on error
      setSelectedImg(authUser.profilePic || "/avatar.png");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 py-4"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-base-300 rounded-xl p-6 space-y-6 shadow-lg"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="mt-1 text-zinc-400">Your profile information</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center gap-3"
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-28 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              />
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary hover:bg-primary/80
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  shadow-lg
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </motion.label>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-sm text-zinc-400"
            >
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </motion.p>
            <motion.p 
              variants={itemVariants}
              className="text-xs text-zinc-500"
            >
              Max file size: 1MB
            </motion.p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <motion.div 
              variants={itemVariants}
              className="space-y-1.5"
            >
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <motion.p 
                whileHover={{ scale: 1.02 }}
                className="px-4 py-2 bg-base-200 rounded-lg border border-base-content/10 hover:border-primary/50 transition-colors"
              >
                {authUser?.fullName}
              </motion.p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="space-y-1.5"
            >
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <motion.p 
                whileHover={{ scale: 1.02 }}
                className="px-4 py-2 bg-base-200 rounded-lg border border-base-content/10 hover:border-primary/50 transition-colors"
              >
                {authUser?.email}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-4 bg-base-200 rounded-xl p-4 shadow-inner"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-lg font-medium mb-3 flex items-center gap-2"
            >
              <Shield className="w-5 h-5 text-primary" />
              Account Information
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="space-y-2 text-sm"
            >
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between py-2 border-b border-zinc-700"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Member Since
                </span>
                <span className="text-zinc-400">{authUser.createdAt?.split("T")[0]}</span>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between py-2"
              >
                <span>Account Status</span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-green-500 font-medium"
                >
                  Active
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage