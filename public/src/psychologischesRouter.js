// import admin from "firebase-admin";
import express from "express";
import { createUser, getUsers, loginUser } from "./controllers/userRouts.js";
// import serviceAccount from "./path/psychologist-7ca39-firebase-f.json" assert { type: "json" };
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://psychologist-7ca39-default-rtdb.firebaseio.com",
// });

// const database = admin.database();
// const ref = database.ref("/users");
const usersRouter = express.Router();
usersRouter.get("/", getUsers);
usersRouter.post("/register", createUser);
usersRouter.post("/login", loginUser);
// usersRouter.post("/logout", logoutUser);
export default usersRouter;
