// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'

function useFireBase() {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: 'AIzaSyDvbix2zInEunDPyqwdZrYkZUAOSpkzFFs',
    authDomain: 'medbus-app.firebaseapp.com',
    projectId: 'medbus-app',
    storageBucket: 'medbus-app.appspot.com',
    messagingSenderId: '131533847221',
    appId: '1:131533847221:web:92219608da2a749dbe9cfc',
    measurementId: 'G-51VXQWEKB8',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  // const analytics = getAnalytics(app)

  return app
}
