import firebase from 'firebase/app';
import 'firebase/auth';

// Inisialisasi Firebase Authentication
const auth = firebase.auth();

// Fungsi untuk login dengan akun Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      // Handle signed-in user
      const user = result.user;
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
}

export default function login() {
    return (
        <>
        <button onClick={() => signInWithGoogle()} type="">Login via gmail</button>
        </>
    )
}