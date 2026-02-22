// // import express, { urlencoded } from "express";
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import postRoute from "./routes/post.route.js";
// import messageRoute from "./routes/message.route.js";
// import { app,server } from "./socket/socket.js";
// import { Server } from "./socket/socket.js";
// import path from 'path';

// import dotenv from "dotenv";
// dotenv.config({});

// const PORT = process.env.PORT || 8000;

// const __dirname = path.resolve();
// console.log(__dirname);

// // const app = express();

// app.get("/", (req, res) => {
//   return res.status(200).json({
//     message: "I'm coming from backend",
//     success: true,
//   });
// });

// //middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// const corsOptions = {
//   origin: process.env.URL,
//   credentials: true,
// };

// app.use(cors(corsOptions));

// // api
// app.use("/api/v1/user", userRoute);
// // "http://localhost:3000/api/v1/user/register"
// app.use("/api/v1/post", postRoute);
// app.use("/api/v1/message", messageRoute);

// // app.use(express.static(path.join(__dirname, "/frontend/dist")));
// // This route handler serves the main frontend entry point for any 
// // request that doesn't match a defined API route. 
// // It is essential for single-page applications (SPAs) like React or Vue 
// // to ensure the client-side router handles the navigation.

// app.get("*", (_, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

// server.listen(PORT, () => {
//   console.log(`Server listen at port ${PORT}`);
//   connectDB();
// });

// import express, { urlencoded } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import postRoute from "./routes/post.route.js";
// import messageRoute from "./routes/message.route.js";
// import { app, server } from "./socket/socket.js";
// import path from "path";
 
// dotenv.config();


// const PORT = process.env.PORT || 3000;

// const __dirname = path.resolve();

// //middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(urlencoded({ extended: true }));
// const corsOptions = {
//     origin: process.env.URL,
//     credentials: true
// }
// app.use(cors(corsOptions));

// // yha pr apni api ayengi
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/post", postRoute);
// app.use("/api/v1/message", messageRoute);


// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req,res)=>{
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// })


// server.listen(PORT, () => {
//     connectDB();
//     console.log(`Server listen at port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

import { app, server } from "./socket/socket.js"; // socket.js se app + server
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS FIX (VERY IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173", // React/Vite frontend
    credentials: true,
  })
);

// ---------------- ROUTES ----------------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// ---------------- FRONTEND BUILD (OPTIONAL) ----------------
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// ---------------- SERVER START ----------------
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running on http://localhost:${PORT}`);
});