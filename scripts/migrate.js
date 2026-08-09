import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf8'));

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function batchSet(collectionName, items) {
    console.log(`Migrating ${collectionName} (${items.length} items)...`);
    const chunkSize = 400;
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const batch = db.batch();
        for (const item of chunk) {
            const docRef = db.collection(collectionName).doc(String(item.id));
            const data = { ...item };
            
            // Format timestamps if present
            if (data.created_at) data.createdAt = new Date(data.created_at);
            if (data.updated_at) data.updatedAt = new Date(data.updated_at);
            if (data.published_at) data.publishedAt = new Date(data.published_at);
            if (data.start_date) data.startDate = new Date(data.start_date);
            if (data.end_date) data.endDate = new Date(data.end_date);
            if (data.membership_start) data.membershipStart = new Date(data.membership_start);
            if (data.membership_end) data.membershipEnd = new Date(data.membership_end);

            batch.set(docRef, data);
        }
        await batch.commit();
        console.log(`  Committed batch ${Math.floor(i / chunkSize) + 1}/${Math.ceil(items.length / chunkSize)} for ${collectionName}`);
    }
}

async function migrate() {
    const data = JSON.parse(fs.readFileSync('scratch/migration_data.json', 'utf8'));

    await batchSet('categories', data.categories);
    await batchSet('categories', data.event_categories); // merged into categories with type: 'event'
    await batchSet('authors', data.authors);
    await batchSet('tags', data.tags);
    await batchSet('abouts', data.abouts);
    await batchSet('posts', data.posts);
    await batchSet('events', data.events);

    console.log('✅ Firestore migration complete!');
}

migrate().catch(console.error);
