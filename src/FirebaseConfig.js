import { initializeApp } from "firebase/app";

// const config = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };
const config = {
  apiKey: "AIzaSyBdS6jUGcKJVtF-sBDaz-Y9883TqilCgiM",
  authDomain: "fir-recipes-d1a53.firebaseapp.com",
  projectId: "fir-recipes-d1a53",
  storageBucket: "fir-recipes-d1a53.appspot.com",
  messagingSenderId: "743813663750",
  appId: "1:743813663750:web:df60bc82863c57e59dc787",
  measurementId: "G-5BCF3LG1YG",
};
// REACT_APP_API_KEY="AIzaSyBdS6jUGcKJVtF-sBDaz-Y9883TqilCgiM"
// REACT_APP_AUTH_DOMAIN="fir-recipes-d1a53.firebaseapp.com"
// REACT_APP_PROJECT_ID="fir-recipes-d1a53"
// REACT_APP_STORAGE_BUCKET="fir-recipes-d1a53.appspot.com"
// // REACT_APP_MESSAGING_SENDER_ID="743813663750"
// // REACT_APP_APP_ID="1:743813663750:web:df60bc82863c57e59dc787"
const firebase = initializeApp(config);

export default firebase;
