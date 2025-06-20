import { useEffect, useState } from 'react';
import useDidMount from './useDidMount';
import { getAdmin } from '../utils/firebase';
import { fetchSetting } from '@/utils/settings';
import { getContent, hexToRgb } from '@/utils';

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

export const useSettings = (data_key = 'system.data', all=null) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  const retry = async () => {
    try {
      if (!settings) {
        setLoading(true);
        const doc = all ? await getContent(data_key, 'settings', all===1) : await fetchSetting(data_key)
        if (doc) {
          if (didMount) {
            doc.siteColor = doc?.siteColor && hexToRgb(doc?.siteColor, false);
            setSettings(doc);
            setLoading(false);
          }
        } else {
          setError('Not found.');
        }
      }
    } catch (err) {
      if (didMount) {
        setLoading(false);
        setError(err?.message || 'Something went wrong.');
      }
    }
  }

  useEffect(() => {
    retry();
  }, [data_key, settings]);

  return { settings, isLoading, error, retry };
};