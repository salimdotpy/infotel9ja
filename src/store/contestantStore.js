// hooks/useUserStore.js
import { create } from 'zustand';
import { collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import dayjs from 'dayjs';

const useContestantStore = create((set, get) => ({
    contestants: [],
    loading: false,
    fetchContestantById: async (contestantId) => {//used
        try {
            // Fetch contestant data
            const contestantDoc = await getDoc(doc(db, 'contestants', contestantId));
            if (!contestantDoc.exists()) {
                return { error: "Contestant not found" };
            }
            const result = { id: contestantDoc.id, ...contestantDoc.data() };
            result.total = (result.votes || 0) + (result.bonus || 0);
            return result;
        } catch (error) {
            return { error: error.message };
        }
    },

    notContestant: async (field, value, fetch = false, id = false) => {//used
        try {
            const q = id ? query(collection(db, 'contestants'), where(field, '==', value), where('id', '!=', id)) :
            query(collection(db, 'contestants'), where(field, '==', value));
            const snapshot = await getDocs(q);
            if (fetch) {
                let result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                result = result.sort((a, b) => {
                    if (a.total > b.total) return -1;
                    if (a.total < b.total) return 1;
                    return 0;
                });
                return result;
            }
            return !snapshot.empty;
        } catch (error) {
            return false;
        }
    },

    fetchContestants: async () => {
        set({ loading: true });
        const contestantsSnap = await getDocs(collection(db, 'contestants'));
        let contestants = contestantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        contestants = contestants.sort((a, b) => {
            if (a.total > b.total) return -1;
            if (a.total < b.total) return 1;
            return 0;
        });
        let contenstantRef = [];
        for (const item of contestants) {
            const ref = await get().notContestant('referral', item.id, true);
            ref.all = ref.length || 0;
            contenstantRef.push({...item, referrals: ref.all});
        }

        set({ contestants: contenstantRef, loading: false });
    },

    fetchContestantSub: async (contestantId) => {//used
        const q = query(collection(db, 'subscriptions'), where('contestantId', '==', contestantId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const doc = data[data.length - 1];
            doc.expired = (dayjs(doc.expired_at).diff(dayjs()) < 1);
            return doc;
        }
        return false;
    },

    createContestant: async (form) => {
        const age = dayjs().diff(dayjs(form.dob), 'year')
        form.dob = form.dob.toISOString(); form.dob = form.dob.split('T')[0];
        form.votes = 0; form.bonus = 0; form.total = 0;
        const date = new Date().toISOString();
        if (age < 16) return { error: "This contest is not for under 16" };
        const checkMobile = await get().notContestant('mobile', form.mobile);
        const checkEmail = await get().notContestant('email', form.email);
        if (checkMobile) return {error: "Phone number has been taken, try another valid one"};
        if (checkEmail) return {error: "Email has been taken, try another valid one"};
        try {
            const contestantRef = await addDoc(collection(db, 'contestants'), { ...form, created_at: date, updated_at: date });
            get().fetchContestantWithBooster();
            return { message: "Contestant created successfully!", id: contestantRef.id };
        } catch (error) {
            return { error: error.message };
        }
    },

    updateContestant: async (form) => {
        const { id, dob, mobile, email } = form;
        const age = dayjs().diff(dayjs(dob), 'year')
        const date = new Date().toISOString();
        form.dob = form.dob.toISOString(); form.dob = form.dob.split('T')[0];
        if (age < 16) return { error: "This contest is not for under 16" };
        const checkMobile = await get().notContestant('mobile', mobile, false, id);
        const checkEmail = await get().notContestant('email', email, false, id);
        if (checkMobile) return {error: "Phone number has been taken, try another valid one"};
        if (checkEmail) return {error: "Email has been taken, try another valid one"};
        try {
            await updateDoc(doc(db, 'contestants', id), { ...form, updated_at: date, });
            return { message: 'Contestant updated successfully.' };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Delete contestant and all their dependant
    deleteContestant: async (contestantId) => {
        const subQuery = query(collection(db, 'subscriptions'), where('contestantId', '==', contestantId));
        const subSnap = await getDocs(subQuery);
        const subDeletePromises = subSnap.docs.map(docSnap =>
            deleteDoc(doc(db, 'subscriptions', docSnap.id))
        );
        await Promise.all(subDeletePromises);

        const transQuery = query(collection(db, 'transactions'), where('contestantId', '==', contestantId));
        const transSnap = await getDocs(transQuery);
        const transDeletePromises = transSnap.docs.map(docSnap =>
            deleteDoc(doc(db, 'transactions', docSnap.id))
        );
        await Promise.all(transDeletePromises);

        await deleteDoc(doc(db, 'contestants', contestantId));
        get().fetchContestantWithBooster();
    },
}));

export default useContestantStore;