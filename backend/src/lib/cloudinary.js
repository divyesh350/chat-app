import {v2 as cloudinary} from "cloudinary";
import { config } from "dotenv"; 

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    timeout: 60000 // 60 seconds timeout for Cloudinary operations
});

// Configure default upload options
cloudinary.config({
    upload_preset: "profile_pics",
    resource_type: "auto",
    chunk_size: 6000000, // 6MB chunks for large files
    eager: [
        { width: 400, height: 400, crop: "fill", quality: "auto" }
    ],
    eager_async: true
});

export default cloudinary;