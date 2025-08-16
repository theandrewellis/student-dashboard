import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

// 1) Replace the below config with your Firebase project's config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export const logout = async () => {
  await signOut(auth)
}

export const watchUser = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb)

export const getUserDoc = (uid: string) => doc(db, 'users', uid)
export const getPageDoc = (uid: string, pageId: string) => doc(db, 'users', uid, 'pages', pageId)

export const ensureUserInit = async (uid: string) => {
  const ref = getUserDoc(uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { createdAt: Date.now(), defaultPage: 'home', pages: ['home'] })
    await setDoc(getPageDoc(uid, 'home'), { widgets: [], updatedAt: Date.now(), title: 'Home' })
  }
}

export const savePage = async (uid: string, pageId: string, data: any) => {
  const ref = getPageDoc(uid, pageId)
  try {
    await updateDoc(ref, { ...data, updatedAt: Date.now() })
  } catch {
    await setDoc(ref, { ...data, updatedAt: Date.now() })
  }
}
