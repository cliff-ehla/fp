import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf8'));

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function updatePosts() {
    console.log('Updating posts...');
    const snapshot = await db.collection('posts').get();
    let updatedCount = 0;
    const batchSize = 400;
    let batch = db.batch();
    
    for (let i = 0; i < snapshot.docs.length; i++) {
        const doc = snapshot.docs[i];
        const data = doc.data();
        
        let author_slugs = [];
        if (Array.isArray(data.authors)) {
            author_slugs = data.authors.map(a => a.slug).filter(Boolean);
        }
        
        let tag_slugs = [];
        if (Array.isArray(data.tags)) {
            tag_slugs = data.tags.map(t => t.slug).filter(Boolean);
        }
        
        batch.update(doc.ref, {
            author_slugs,
            tag_slugs
        });
        
        updatedCount++;
        
        if (updatedCount % batchSize === 0 || i === snapshot.docs.length - 1) {
            await batch.commit();
            console.log(`Committed ${updatedCount} posts`);
            batch = db.batch();
        }
    }
    console.log('Finished updating posts!');
}

async function updateEvents() {
    console.log('Updating events...');
    const snapshot = await db.collection('events').get();
    let updatedCount = 0;
    const batchSize = 400;
    let batch = db.batch();
    
    for (let i = 0; i < snapshot.docs.length; i++) {
        const doc = snapshot.docs[i];
        const data = doc.data();
        
        let artist_slugs = [];
        if (Array.isArray(data.artists)) {
            artist_slugs = data.artists.map(a => a.slug).filter(Boolean);
        }
        
        let tag_slugs = [];
        if (Array.isArray(data.tags)) {
            tag_slugs = data.tags.map(t => t.slug).filter(Boolean);
        }
        
        batch.update(doc.ref, {
            artist_slugs,
            tag_slugs
        });
        
        updatedCount++;
        
        if (updatedCount % batchSize === 0 || i === snapshot.docs.length - 1) {
            await batch.commit();
            console.log(`Committed ${updatedCount} events`);
            batch = db.batch();
        }
    }
    console.log('Finished updating events!');
}

async function main() {
    try {
        await updatePosts();
        await updateEvents();
        console.log('All updates complete.');
    } catch (error) {
        console.error('Error during update:', error);
    }
}

main();
