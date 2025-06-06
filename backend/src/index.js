import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import cors from "cors";
import morgan from "morgan"
import { app , server} from "./lib/socket.js";
import path from "path"

dotenv.config();

const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(morgan("dev"));
app.use(cors({
  origin:"http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Add PATCH to allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true
}))

// Increase payload size limit and timeout
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set server timeout
server.timeout = 120000; // 2 minutes timeout

app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
  connectDB();
});
