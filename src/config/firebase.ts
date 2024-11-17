import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCbm6L_FcZumK_x-_wMFF3F4pWAe7HQYGM',
  authDomain: 'anascrew-6b546.firebaseapp.com',
  databaseURL: 'https://anascrew-6b546-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'anascrew-6b546',
  storageBucket: 'anascrew-6b546.firebasestorage.app',
  messagingSenderId: '869848160499',
  appId: '1:869848160499:web:0484705de0ffa03efcff86',
  measurementId: 'G-8NZ6NB12T7',
}

const fb = initializeApp(firebaseConfig)
const analytics = getAnalytics(fb)
const auth = getAuth(fb)
const db = getFirestore(fb)

export { fb, analytics, auth, db }
