import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp
} from "firebase/database";

import { database } from "../firebase";

export const setAdminOnline = (username) => {
  const statusRef = ref(database, `admins/${username}`);

  set(statusRef, {
    username: username,
    online: true,
    lastActive: serverTimestamp()
  });

  onDisconnect(statusRef).set({
    username: username,
    online: false,
    lastActive: serverTimestamp()
  });
};

export const listenAdminStatus = (callback) => {
  const adminsRef = ref(database, "admins");

  return onValue(adminsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
};

export const setAdminOffline = async (username) => {
  const statusRef = ref(database, `admins/${username}`);

  try {
    await set(statusRef, {
      username: username,
      online: false,
      lastActive: serverTimestamp()
    });

    console.log("ADMIN OFFLINE:", username);
  } catch (error) {
    console.error("Firebase Offline Error:", error);
  }
};