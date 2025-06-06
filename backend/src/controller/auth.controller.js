import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are Required" });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" }, error.message);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Creadintials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Creadintials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "Logged in Successfully",
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" }, error.message);
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" }, error.message);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Function to attempt upload with retries
    const attemptUpload = async (retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              profilePic,
              {
                resource_type: "auto",
                folder: "profile_pics",
                transformation: [
                  { width: 400, height: 400, crop: "fill" },
                  { quality: "auto" },
                  { fetch_format: "auto" }
                ],
                timeout: 30000, // Reduced timeout for each attempt
                chunk_size: 1000000, // Reduced chunk size to 1MB
                eager: [
                  { width: 400, height: 400, crop: "fill", quality: "auto" }
                ],
                eager_async: true,
                invalidate: true
              },
              (error, result) => {
                if (error) {
                  console.error(`Upload attempt ${attempt} failed:`, error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });

          if (result && result.secure_url) {
            return result;
          }
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error);
          if (attempt === retries) {
            throw error;
          }
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    };

    // Attempt the upload with retries
    const uploadResponse = await attemptUpload();

    if (!uploadResponse || !uploadResponse.secure_url) {
      return res.status(400).json({ message: "Failed to upload image" });
    }

    // Update user profile with new image URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update profile:", error);
    
    // Handle specific error cases
    if (error.message === 'Request Timeout' || error.name === 'TimeoutError') {
      return res.status(408).json({ 
        message: "Image upload timed out after multiple attempts. Please try a smaller image or try again later." 
      });
    }
    
    if (error.http_code === 413) {
      return res.status(413).json({ 
        message: "Image file is too large. Please try a smaller image (under 1MB)." 
      });
    }

    if (error.http_code === 400) {
      return res.status(400).json({ 
        message: "Invalid image format. Please try a different image (JPEG or PNG recommended)." 
      });
    }

    res.status(500).json({ 
      message: "Failed to update profile. Please try again later." 
    });
  }
};
export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };