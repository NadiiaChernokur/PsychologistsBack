import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import express from "express";
import serviceAccount from "../path/psychologist-7ca39-firebase-f.json" assert { type: "json" };
import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, userDatabase } from "../";
import { getDatabase, set } from "firebase/database";
import { auth } from "../../app.js";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://psychologist-7ca39-default-rtdb.firebaseio.com",
});

const database = admin.database();
const ref = database.ref("/users");

export const getUsers = async (req, res, next) => {
  try {
    const snapshot = await ref.get();
    const results = snapshot.val();
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const snapshot = await ref.get();
    const result = snapshot.val();

    // if (result === null) {
    //   console.log("77777777");
    // }
    Object.values(result).forEach((usemail) => {
      if (email === usemail.email) {
        throw new Error("This address already exists. Log in");
      }
    });
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const { accessToken, stsTokenManager } = user;
    const userId = user.uid;

    const userData = {
      name: name,
      email: user.email,
      password: password,
      accessToken: accessToken,
      refreshToken: stsTokenManager.refreshToken,
    };

    // await set(ref(userDatabase, `users/${userId}`), userData);
    // await ref.child(userId).set(userData);

    await ref.child(`/${userId}`).set(userData);

    res.status(200).json({ userId, ...userData });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const snapshot = await ref.get();
    const result = snapshot.val();

    console.log(result);
    if (result === null) {
      throw new Error("This e-mail address is not registered");
    }

    const foundUser = Object.values(result).find(
      (user) => user.email === email
    );

    if (!foundUser) {
      throw new Error("This e-mail address is not registered");
    }

    if (foundUser.password !== password) {
      throw new Error("Invalid password");
    }

    res.status(203).json({ foundUser });
    return foundUser;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
