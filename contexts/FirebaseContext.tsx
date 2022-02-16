import { createContext } from 'react'
import type { FirebaseApp } from 'firebase/app'
import { getFirebaseInstance } from '@hooks/useFirebase'

const app = getFirebaseInstance()
const FirebaseContext = createContext<FirebaseApp>(app)
console.log('getting context')
export default FirebaseContext
