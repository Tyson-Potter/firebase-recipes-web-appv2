import firebase from "./FirebaseConfig";

import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const db = getFirestore(firebase);

const createDocument = async (collectionName, document) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), document);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};


const readDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return documents;
};


const FirebaseFirestoreService = {
  createDocument,
  readDocuments,
};

export default FirebaseFirestoreService;
