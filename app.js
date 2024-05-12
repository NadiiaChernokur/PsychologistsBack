import express from "express";
import morgan from "morgan";
import cors from "cors";
// import contactsRouter from "./routes/contactsRouter.js";
// import usersRouter from "./routes/usersRouters.js";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  orderByKey,
  limitToFirst,
  query,
} from "firebase/database";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import usersRouter from "./src/psychologischesRouter.js";

dotenv.config();
const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = process.env;
// mongoose
//   .connect(DB_HOST)
//   .then(() => {
//     app.listen(3000);
//     console.log("Database connection successful");
//   })
//   .catch((error) => {
//     console.log(error.message);
//     process.exit(1);
//   });
// const apiKey = process.env.apiKey;
// const authDomain = process.env.authDomain;
// const databaseURL = process.env.databaseURL;
// const projectId = process.env.projectId;
// const storageBucket = process.env.storageBucket;
// const messagingSenderId = process.env.messagingSenderId;
// const appId = process.env.appId;
// const measurementId = process.env.measurementId;
// export const firebaseConfig = {
//   apiKey: "AIzaSyBBRSIDcuZEamZAUDHOkk8C-KBAYh4CgUM",
//   authDomain: "psychologist-7ca39.firebaseapp.com",
//   projectId: "psychologist-7ca39",
//   storageBucket: "psychologist-7ca39.appspot.com",
//   messagingSenderId: "731245160647",
//   appId: "1:731245160647:web:c9b69e0f0b3b72e72bf6e2",
//   measurementId: "G-Z94C558Q6P",
// };
export const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};
// console.log(firebaseConfig);
const app2 = initializeApp(firebaseConfig, "app2");
export const userDatabase = getDatabase(app2);
export const auth = getAuth(app2);
// export const firebaseConfig = {
//   apiKey: "AIzaSyDckWQWECL9IMvRADUlAGifTcrRXWFzCyI",
//   authDomain: "psychologists-22f26.firebaseapp.com",
//   databaseURL:
//     "https://psychologists-22f26-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "psychologists-22f26",
//   storageBucket: "psychologists-22f26.appspot.com",
//   messagingSenderId: "931627865163",
//   appId: "1:931627865163:web:8b3ea51aa3d4b3743969ce",
//   measurementId: "G-R9E8GRCFFB",
// };

// const app1 = initializeApp(firebaseConfig1, "app1");
// const database = getDatabase(app1);
const app = express();
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/apy/users", usersRouter);
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.message.includes("E11000")) {
    console.log(err.message);
    return res.status(409).json({ Messege: "Email in use" });
  }
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
