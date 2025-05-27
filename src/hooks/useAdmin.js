import { useEffect, useState } from 'react';
import useDidMount from './useDidMount';
import { getAdmin } from '../utils/firebase';

const useAdmin = (user) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(() => {
    (async () => {
      try {
        if (!admin) {
          setLoading(true);
          const doc = await getAdmin(user)
          if (doc) {
            if (didMount) {
              setAdmin(doc);
              setLoading(false);
            }
          } else {
            setError('Admin not found.');
          }
        }
      } catch (err) {
        if (didMount) {
          setLoading(false);
          setError(err?.message || 'Something went wrong.');
        }
      }
    })();
  }, [user]);

  return { admin, isLoading, error };
};

export default useAdmin;