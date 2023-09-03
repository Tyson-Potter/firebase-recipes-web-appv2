import firebase from "./FirebaseConfig";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

const db = getFirestore(firebase);

const createDocument = async (collectionName, document) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), document);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const readDocuments = async ({ collection: collectionName, queries }) => {
  let collectionRef = collection(db, collectionName);

  let queryRef = collectionRef;

  if (queries && queries.length > 0) {
    queries.forEach(({ field, condition, value }) => {
      queryRef = query(queryRef, where(field, condition, value));
    });
  }

  const querySnapshot = await getDocs(queryRef);
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return documents;
};

const updateDocument = async (collectionName, id, document) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, document);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const FirebaseFirestoreService = {
  createDocument,
  readDocuments,
  updateDocument,
};

export default FirebaseFirestoreService;
