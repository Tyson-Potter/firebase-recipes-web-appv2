import firebase from "./FirebaseConfig";

import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(firebase);

const createDocument = async (collectionName, document) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), document);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const FirebaseFirestoreService = {
  createDocument,
};

export default FirebaseFirestoreService;
