import '../styles/globals.css'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from '../firebase'
import Login from './login'
import Loading from '../components/Loading'
import { useEffect } from 'react'
import firebase from 'firebase'


function MyApp({ Component, pageProps }) {
  // it will check if there is any user loggedin if yes then assign all the details to user var
  // using loading state from firebase to handle on refresh loading state
  const [user, loading] = useAuthState(auth)

  // When new user logged in we want to store his data into our database so that to keep track of user's details
  useEffect(() => {
    if (user) {
      // if user is present we will push his details into db in user's collection
      //user.uid >> we get from google login

      // SET ({}), {merge:true}
      //here we are using set and merge because >> when the there is no user then with the help of set it will create user in db and it will keep on overwrite so to avoid that we use merge so that it will keep on appending new user 

      db.collection("users").doc(user.uid).set( 
        {
            email: user.email,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL
        }, 
        {merge: true}
      )
    }
  }, [user]) //it will run when the user change/logged in




  // using loading state from firebase to handle on refresh loading state; return Loading components
  if (loading) {
    return <Loading />
  }

  // checking if no user then return to login component
  if (!user) {
    return <Login />
  }

  // this is the entire app which we are seeing
  return <Component {...pageProps} />
}

export default MyApp
