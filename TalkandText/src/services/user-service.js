import { get, set, ref, query, equalTo, orderByChild, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const getUserByHandle = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  return get(userRef).then((snapshot) => {
    return snapshot.val();
  });
};

export const getUserByHandleSnapshot = (handle) => {
  const userRef = ref(db, `users/${handle}`);
  return get(userRef);
};

export const createUserHandle = async (firstName, lastName, username, uid, email, phoneNumber, teams = []) => {

  return await set(ref(db, `users/${username}`), {
    firstName,
    lastName,
    username,
    uid,
    email,
    phoneNumber,
    teams,
    avatarUrl: "https://www.pngall.com/wp-content/uploads/15/King-Julien.png",
  })
};

export const getUserByUid = async (uid) => {
  const userSnapshot = await get(query(ref(db, `users`), orderByChild('uid'), equalTo(uid)))
  return userSnapshot.val()[Object.keys(userSnapshot.val())[0]]
}

export const getUserData = (uid) => {
  return get(query(ref(db, `users`), orderByChild('uid'), equalTo(uid)));
};

export const updateUser = async (username, userData) => {

  const userRef = ref(db, `users/${username}`)
  await update(userRef, userData)
}

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  }
  return [];
}

export const getUserTeams = async (username) => {
  return (await get(ref(db, `users/${username}/teams` ))).val()
}
