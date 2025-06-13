// hooks/useUserStore.js
import { create } from 'zustand';
import { collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { parseIfJson } from '@/utils';

const useContestStore = create((set, get) => ({
    contests: [],
    loading: false,
    fetchContestWithBoosterById: async (contestId) => {
        try {
            // Fetch contest data
            const contestDoc = await getDoc(doc(db, 'contests', contestId));
            if (!contestDoc.exists()) {
                return { error: "Contest not found" };
            }

            const contestData = contestDoc.data();

            // Fetch related boosters
            const boosterQuery = query(collection(db, 'boosters'), where('contestId', '==', contestId));
            const boosterSnap = await getDocs(boosterQuery);
            const boosters = boosterSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return {
                id: contestDoc.id,
                ...contestData,
                boosterPackages: boosters,
                bonusPackages: parseIfJson(contestData.bonusPackages),
                winnersPrice: parseIfJson(contestData.winnersPrice),
                regDate: parseIfJson(contestData.regDate),
                votingDate: parseIfJson(contestData.votingDate),
            };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Fetch all contests with their boosters
    fetchContestWithBooster: async () => {
        set({ loading: true });
        const contestsSnap = await getDocs(collection(db, 'contests'));
        const contests = contestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const boostersSnap = await getDocs(collection(db, 'boosters'));
        const boosters = boostersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const ContestWithBooster = contests.map(contest => ({
            ...contest,
            bonusPackages: parseIfJson(contest.bonusPackages),
            winnersPrice: parseIfJson(contest.winnersPrice),
            regDate: parseIfJson(contest.regDate),
            votingDate: parseIfJson(contest.votingDate),
            boosterPackages: boosters.filter(booster => booster.contestId === contest.id),
        }));

        set({ contests: ContestWithBooster, loading: false });
    },

    // Create contest and boosters
    createContestWithBooster: async (form) => {
        const boosterArray = form.boosterPackages;
        delete form.boosterPackages;
        form.bonusPackages = JSON.stringify(form.bonusPackages);
        form.winnersPrice = JSON.stringify(form.winnersPrice);
        form.votingDate = JSON.stringify(form.votingDate);
        form.regDate = JSON.stringify(form.regDate);
        const date = new Date().toISOString();
        try {
            const contestRef = await addDoc(collection(db, 'contests'), { ...form, created_at: date, updated_at: date });
            const boostersPromises = boosterArray.map(boosterData =>
                addDoc(collection(db, 'boosters'), { ...boosterData, contestId: contestRef.id, created_at: date, updated_at: date })
            );
            await Promise.all(boostersPromises);
            get().fetchContestWithBooster();
            // console.log(form, boosterArray);
            return { message: "Contest created successfully!" };
        } catch (error) {
            return { error: error.message };
        }
    },

    updateContestWithBooster: async (form) => {
        const batch = writeBatch(db);
        const date = new Date().toISOString();
        const boosterArray = form.boosterPackages; delete form.boosterPackages;
        const contestId = form.id; delete form.id;
        form.bonusPackages = JSON.stringify(form.bonusPackages);
        form.winnersPrice = JSON.stringify(form.winnersPrice);
        form.votingDate = JSON.stringify(form.votingDate);
        form.regDate = JSON.stringify(form.regDate);

        try {
            // Step 1: Prepare contest update
            batch.update(doc(db, 'contests', contestId), {...form, updated_at: date});

            // Step 2: Fetch current boosters from Firestore
            const existingBoosterSnap = await getDocs(query(collection(db, 'boosters'), where('contestId', '==', contestId)));
            const existingBoostersMap = {};
            existingBoosterSnap.forEach(docSnap => {
                existingBoostersMap[docSnap.id] = docSnap.data();
            });

            const updatedBoosterIds = new Set();

            // Step 3: Handle booster updates and additions
            for (const booster of boosterArray) {
                if (booster.id && existingBoostersMap[booster.id]) {
                    // Booster exists → update it
                    batch.update(doc(db, 'boosters', booster.id), { ...booster, contestId, updated_at: date, });
                    updatedBoosterIds.add(booster.id);
                } else {
                    // New booster → create it
                    const newBoosterRef = doc(collection(db, 'boosters'));
                    batch.set(newBoosterRef, { ...booster, contestId, created_at: date, updated_at: date, });
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
            get().fetchContestWithBooster();

            return { message: "Contest updated successfully." };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Delete contest and all their boosters
    deleteContestWithBooster: async (contestId) => {
        const boosterQuery = query(collection(db, 'boosters'), where('contestId', '==', contestId));
        const boosterSnap = await getDocs(boosterQuery);

        const deletePromises = boosterSnap.docs.map(docSnap =>
            deleteDoc(doc(db, 'boosters', docSnap.id))
        );
        await Promise.all(deletePromises);

        await deleteDoc(doc(db, 'contests', contestId));
        get().fetchContestWithBooster();
    },
}));

export default useContestStore;