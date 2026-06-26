import { initializeApp } from 'firebase/app'
import { getFirestore }  from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyArC_C4ds3pm_gpIWL8b9cb80Y-8cvz8zc',
  authDomain:        'chikko-pikko-e704f.firebaseapp.com',
  projectId:         'chikko-pikko-e704f',
  storageBucket:     'chikko-pikko-e704f.firebasestorage.app',
  messagingSenderId: '765825171762',
  appId:             '1:765825171762:web:bd5190783dbff9180b572b',
  measurementId:     'G-P3JZM9W05M',
}

export const app = initializeApp(firebaseConfig)
export const db  = getFirestore(app)
