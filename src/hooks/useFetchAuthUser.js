import { useEffect, useState } from 'react';
import useDidMount from './useDidMount';
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const useFetchAuthUser = (authUser) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          const snap = await getDoc(doc(db, "users", authUser.uid));
      
          if (snap.exists()) {
            setUser({id: snap.id, ...snap.data()});
          } else {
            setError(`${authUser.role} not found.'`);
          }
          setLoading(false);
        }}
        catch (err) {
          if (didMount) {
            setLoading(false);
            setError(err?.message || 'Something went wrong.');
          }
        }
    })();
  }, [authUser]);

  return { user, isLoading, error };
};

export default useFetchAuthUser;