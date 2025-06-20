import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTheme = create(
  persist(
    (set, get) => ({
        theme: 'light',
        toggleTheme: () => {
            if (get().theme === 'light') {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
            set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
        },
    }),
    { name: 'theme'},
  ),
);

export default useTheme;