//@ ts-nocheck

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  useContext,
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
// import { getAnalytics } from 'firebase/analytics'
import type { FirebaseApp } from 'firebase/app'
import firebaseConfig from '@hooks/firebaseConfig'
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail as authUpdateEmail,
  updatePassword as authUpdatePassword,
  UserCredential,
} from '@firebase/auth'
import { NextPage } from 'next'
import LazyLoading from '@components/LazyLoading'

export const getFirebaseInstance = () => initializeApp(firebaseConfig)
type user = User | null

export interface AuthContextProps {
  user: user
  signup: (email: string, password: string) => Promise<UserCredential>
  signin: (email: string, password: string) => Promise<UserCredential>
  signout: () => Promise<any>
  resetPassword: (email: string) => Promise<any>
  updateEmail: (email: string) => Promise<any>
  updatePassword: (password: string) => Promise<any>
}

export const AuthContext = createContext<AuthContextProps>(null)

function useAuth() {
  return useContext(AuthContext)
}

const SignUp = (auth: Auth) => async (email: string, password: string) =>
  await createUserWithEmailAndPassword(auth, email, password)

const SignIn = (auth: Auth) => async (email: string, password: string) =>
  await signInWithEmailAndPassword(auth, email, password)

const SignOut = (auth: Auth) => async () => await signOut(auth)

const ResetPassword = (auth: Auth) => async (email: string) =>
  await sendPasswordResetEmail(auth, email)

const UpdateEmail = (auth: Auth, user: user) => async (email: string) => {
  if (user) await authUpdateEmail(user, email)
  else throw new Error('User not logged in')
}

const UpdatePassword = (auth: Auth, user: user) => async (password: string) => {
  if (user) await authUpdatePassword(user, password)
  else throw new Error('User not logged in')
}

export const AuthProvider: NextPage = ({ children }) => {
  const [user, setUser] = useState<user>(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth(getFirebaseInstance())

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsuscribe
  }, [])

  const value = {
    user,
    signup: SignUp(auth),
    signin: SignIn(auth),
    signout: SignOut(auth),
    resetPassword: ResetPassword(auth),
    updateEmail: UpdateEmail(auth, user),
    updatePassword: UpdatePassword(auth, user),
  }

  return (
    <AuthContext.Provider value={value}>
      <LazyLoading isLoading={loading}>{children}</LazyLoading>
    </AuthContext.Provider>
  )
}

export default useAuth
