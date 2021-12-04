import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB9YXvMNyYz2HJFGwWetdnHibMJTS6kXzQ",
    authDomain: "whatsapp-clone-f25d4.firebaseapp.com",
    projectId: "whatsapp-clone-f25d4",
    storageBucket: "whatsapp-clone-f25d4.appspot.com",
    messagingSenderId: "494925772349",
    appId: "1:494925772349:web:0efebb616578c568501c54",
    measurementId: "G-7SD5W84LF0"
};


// as we are using Next.js which do server side loading.
// we make sure that if firebase is not setup then initialize it, else load the existing once
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

const auth = app.auth()

// that google's login window
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };