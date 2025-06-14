// hooks/useUserStore.js
import { create } from 'zustand';
import { collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { parseIfJson } from '@/utils';
import dayjs from 'dayjs';

const useContestantStore = create((set, get) => ({
    contestants: [],
    loading: false,
    fetchContestantWithBoosterById: async (contestantId) => {
        try {
            // Fetch contestant data
            const contestantDoc = await getDoc(doc(db, 'contestants', contestantId));
            if (!contestantDoc.exists()) {
                return { error: "Contestant not found" };
            }

            const contestantData = contestantDoc.data();

            // Fetch related boosters
            const boosterQuery = query(collection(db, 'boosters'), where('contestantId', '==', contestantId));
            const boosterSnap = await getDocs(boosterQuery);
            const boosters = boosterSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return {
                id: contestantDoc.id,
                ...contestantData,
                boosterPackages: boosters,
                bonusPackages: parseIfJson(contestantData.bonusPackages),
                winnersPrice: parseIfJson(contestantData.winnersPrice),
                regDate: parseIfJson(contestantData.regDate),
                votingDate: parseIfJson(contestantData.votingDate),
            };
        } catch (error) {
            return { error: error.message };
        }
    },

    notContestant: async (field, value) => {
        try {
            const q = query(collection(db, 'contestants'), where(field, '==', value));
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            return false;
        }
    },

    // Fetch all contestants with their boosters
    fetchContestantWithBooster: async () => {
        set({ loading: true });
        const contestantsSnap = await getDocs(collection(db, 'contestants'));
        const contestants = contestantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const boostersSnap = await getDocs(collection(db, 'boosters'));
        const boosters = boostersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const ContestantWithBooster = contestants.map(contestant => ({
            ...contestant,
            bonusPackages: parseIfJson(contestant.bonusPackages),
            winnersPrice: parseIfJson(contestant.winnersPrice),
            regDate: parseIfJson(contestant.regDate),
            votingDate: parseIfJson(contestant.votingDate),
            boosterPackages: boosters.filter(booster => booster.contestantId === contestant.id),
        }));

        set({ contestants: ContestantWithBooster, loading: false });
    },

    createContestant: async (form) => {
        const age = dayjs().diff(dayjs(form.dob), 'year')
        const date = new Date().toISOString();
        if (age < 16) return { error: "This contest is not for under 16" };
        const checkMobile = await get().notContestant('mobile', form.mobile);
        const checkEmail = await get().notContestant('email', form.email);
        if (checkMobile) return {error: "Phone number has been taken, try another valid one"};
        if (checkEmail) return {error: "Email has been taken, try another valid one"};
        try {
            const contestantRef = await addDoc(collection(db, 'contestants'), { ...form, created_at: date, updated_at: date });
            get().fetchContestantWithBooster();
            return { message: "Contestant created successfully!" };
        } catch (error) {
            return { error: error.message };
        }
    },

    updateContestantWithBooster: async (form) => {
        const batch = writeBatch(db);
        const date = new Date().toISOString();
        const boosterArray = form.boosterPackages; delete form.boosterPackages;
        const contestantId = form.id; delete form.id;
        form.bonusPackages = JSON.stringify(form.bonusPackages);
        form.winnersPrice = JSON.stringify(form.winnersPrice);
        form.votingDate = JSON.stringify(form.votingDate);
        form.regDate = JSON.stringify(form.regDate);

        try {
            // Step 1: Prepare contestant update
            batch.update(doc(db, 'contestants', contestantId), {...form, updated_at: date});

            // Step 2: Fetch current boosters from Firestore
            const existingBoosterSnap = await getDocs(query(collection(db, 'boosters'), where('contestantId', '==', contestantId)));
            const existingBoostersMap = {};
            existingBoosterSnap.forEach(docSnap => {
                existingBoostersMap[docSnap.id] = docSnap.data();
            });

            const updatedBoosterIds = new Set();

            // Step 3: Handle booster updates and additions
            for (const booster of boosterArray) {
                if (booster.id && existingBoostersMap[booster.id]) {
                    // Booster exists → update it
                    batch.update(doc(db, 'boosters', booster.id), { ...booster, contestantId, updated_at: date, });
                    updatedBoosterIds.add(booster.id);
                } else {
                    // New booster → create it
                    const newBoosterRef = doc(collection(db, 'boosters'));
                    batch.set(newBoosterRef, { ...booster, contestantId, created_at: date, updated_at: date, });
                }
            }

            // Step 4: Delete boosters that were removed
            for (const existingId of Object.keys(existingBoostersMap)) {
                if (!updatedBoosterIds.has(existingId)) {
                    batch.delete(doc(db, 'boosters', existingId));
                }
            }

            // Step 5: Commit and refresh
            await batch.commit();
            get().fetchContestantWithBooster();

            return { message: "Contestant updated successfully." };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Delete contestant and all their boosters
    deleteContestantWithBooster: async (contestantId) => {
        const boosterQuery = query(collection(db, 'boosters'), where('contestantId', '==', contestantId));
        const boosterSnap = await getDocs(boosterQuery);

        const deletePromises = boosterSnap.docs.map(docSnap =>
            deleteDoc(doc(db, 'boosters', docSnap.id))
        );
        await Promise.all(deletePromises);

        await deleteDoc(doc(db, 'contestants', contestantId));
        get().fetchContestantWithBooster();
    },
}));

export default useContestantStore;