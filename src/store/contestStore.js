// hooks/useUserStore.js
import { create } from 'zustand';
import { collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const useContestStore = create((set, get) => ({
    contests: [],
    loading: false,

    // Fetch all contests with their boosters
    fetchContestWithBooster: async () => {
        set({ loading: true });
        const contestsSnap = await getDocs(collection(db, 'contests'));
        const contests = contestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const boostersSnap = await getDocs(collection(db, 'boosters'));
        const boosters = boostersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const ContestWithBooster = contests.map(contest => ({
            ...contest,
            boosters: boosters.filter(booster => booster.contestId === contest.id),
        }));

        set({ contests: ContestWithBooster, loading: false });
    },

    // Create contest and one booster
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

    // Update contest and a booster together
    updateContestWithBooster: async (contestId, updatedUser, boosterId, updatedPost) => {
        const batch = writeBatch(db);
        batch.update(doc(db, 'contests', contestId), updatedUser);
        batch.update(doc(db, 'boosters', boosterId), updatedPost);
        await batch.commit();
        get().fetchUsersWithPosts();
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
        get().fetchUsersWithPosts();
    },
}));

export default useContestStore;



// ==================================================================================
let a = {
    "boosterPackages": [
        {
            "name": "Booster",
            "price": 50,
            "vote": 1
        }
    ],
    "bonusPackages": [
        {
            "name": "Bonus",
            "price": 50,
            "paidVote": 1,
            "bonusVote": 2
        }
    ],
    "winnersPrice": [
        {
            "from": 1,
            "to": 1,
            "price": 50
        }
    ],
    "votingDate": [
        "2025-06-08T11:07",
        "2025-06-23T11:07"
    ],
    "regDate": [
        "2025-06-01T11:07",
        "2025-06-08T11:07"
    ],
    "tnc": "Terms and Conditions",
    "contestImage": "",
    "minVote": 2,
    "votePrice": 50,
    "contestCategory": "Influential Personalities",
    "contestName": "aaa"
}