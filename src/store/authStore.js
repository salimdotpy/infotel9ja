import { create } from 'zustand'

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';

const useAuth = create((set) => ({
  user: null,
  role: null,
  loading: true,
  logout: async () => {
    await signOut(auth);
    set({ user: null, role: null });
  },
  setUser: (user, role) => set({ user, role, loading: false }),
}));

// 👇 Persistent listener on app load
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const role = userDoc.exists() ? userDoc.data().role : null;

    useAuth.getState().setUser(user, role);
  } else {
    useAuth.setState({ user: null, role: null, loading: false });
  }
});

export default useAuth;