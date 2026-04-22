import express from "express";
import cookieParser from "cookie-parser";
import cors from"cors";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import userRoute from "./Routes/authRoutes.js"
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import isAuthenticated from "./middleware/isAuthenticated.js";
import {
    getDetections,
    uploadDetection,
    removeDetections
} from "./controllers/detectionController.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9-_]/g, "-");

        cb(null, `${Date.now()}-${baseName}${ext}`);
    }
});

const upload = multer({ storage });


///middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: frontendOrigin,
    credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//routes
app.use("/api/v1/user",userRoute);
app.post("/api/v1/detection/upload", isAuthenticated, upload.single("image"), uploadDetection);
app.get("/api/v1/detection/all", isAuthenticated, getDetections);
app.delete("/api/v1/detection/remove/:id", isAuthenticated, removeDetections);
// server working 
app.listen(PORT ,()=>{
    //connects to the database 
 connectDB();
console.log(`Server is listening at ${PORT}`);


})
