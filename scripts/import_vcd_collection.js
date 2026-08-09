import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf8'));

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function batchSet(collectionName, items) {
    console.log(`Importing ${collectionName} (${items.length} items)...`);
    const chunkSize = 400;
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const batch = db.batch();
        for (const item of chunk) {
            const docRef = db.collection(collectionName).doc(String(item.num));
            batch.set(docRef, item);
        }
        await batch.commit();
        console.log(`  Committed batch ${Math.floor(i / chunkSize) + 1}/${Math.ceil(items.length / chunkSize)} for ${collectionName}`);
    }
}

async function deleteCollection(collectionName) {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) return;
    console.log(`Deleting old ${collectionName} (${snapshot.size} items)...`);
    const chunkSize = 400;
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += chunkSize) {
        const batch = db.batch();
        for (const doc of docs.slice(i, i + chunkSize)) {
            batch.delete(doc.ref);
        }
        await batch.commit();
    }
}

async function importVcdCollection() {
    // Remove the mistaken 'grammar_points' import from the wrong sheet.
    await deleteCollection('grammar_points');

    const data = JSON.parse(fs.readFileSync('scripts/data/vcd_collection.json', 'utf8'));
    await batchSet('vcd_collection', data);
    console.log('✅ VCD collection import complete!');
}

importVcdCollection().catch(console.error);
