import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import axiosInstance from "../utils/axiosInstance";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const saveUserTODB = async (user) => {
    const currentUser = {
      fullName: user?.displayName,
      email: user?.email,
      photoURL: user?.photoURL,
    };

    try {
      await axiosInstance.post("/users", currentUser);
    } catch (error) {
      console.error(
        "Database User Save Info",
        error.response?.data?.message || error.message
      );
    }
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).then((result) => {
      saveUserTODB(result.user);
      return result;
    });
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (name, photo) => {
  return updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photo,
  });
};

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  console.log(user)

  const authInfo = {
    googleLogin,
    logOut,
    user,
    createUser,
    loading,
    loginUser,
    updateUserProfile,
    saveUserTODB,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
