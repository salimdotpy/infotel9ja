import { deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { addDoc, collection, db } from "./firebase";
import { except_, keyToTitle } from ".";

const settingsCol = collection(db, "settings");

export async function fetchSetting(data_key = 'general') {
    try {
        const q = query(settingsCol, where("data_keys", "==", data_key));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return JSON.parse(doc.data().data_values);
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function updateSetting(form, data_key = 'general') {
    try {
        const q = query(settingsCol, where("data_keys", "==", data_key));
        const snapshot = await getDocs(q);
        const data = JSON.stringify(form);
        const date = new Date().toISOString();
        if (!snapshot.empty) {
            const docu = snapshot.docs[0];
            await updateDoc(doc(db, "settings", docu.id), { data_values: data, updated_at: date });
        } else {
            await addDoc(settingsCol, { data_keys: data_key, data_values: data, created_at: date, updated_at: date });
        }
        const tle = keyToTitle(data_key);
        return { message: `${tle.split('.')?.[0]} setting updated successfully!` };

    } catch (error) {
        return { error: error.message };
    }
}

export async function editSetting(req) {
    const { key, id, type, ...rest } = req;
    if (!type) return null;

    const inputContentValue = {};
    for (const [keyName, input] of Object.entries(rest)) {
        if (except_(keyName, ['key', 'type', 'id'])) {
            inputContentValue[keyName] = input;
        }
    }

    const date = new Date().toISOString();
    const dataKey = `${key}.${type}`;
    const dataValues = JSON.stringify(inputContentValue);

    try {
        if (id) {
            // ✅ Update by exact Firestore document ID
            await updateDoc(doc(db, "settings", id), { data_values: dataValues, updated_at: date,});
        } else {
            // ✅ Always add a new document if no ID
            await addDoc(settingsCol, { data_keys: dataKey, data_values: dataValues, created_at: date, updated_at: date,});
        }

        return { message: 'Content has been updated.' };
    } catch (error) {
        return { error: error.message };
    }
}

export async function removeSettings(req, col='settings') {
    const id = req.id;
    try {
        await deleteDoc(doc(db, col, id));
        return { message: 'Content has been removed.' };
    } catch (error) {
        return { error: 'Content not found.' };
    }
}

export async function updateStatus(req) {
    const { docRef, id, key, val, title} = req;
    const date = new Date().toISOString();
    try {
        await updateDoc(doc(db, docRef, id), { [key]: val, updated_at: date,});
        return { message: `${title} has been updated.` };
    } catch (error) {
        return { error: error.message };
    }
}