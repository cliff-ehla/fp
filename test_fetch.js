import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyC2ZA-uTWpmqcWmyNSt6MtgPR5jsYMI6fg',
    authDomain: 'floating-project-website.firebaseapp.com',
    projectId: 'floating-project-website',
    storageBucket: 'floating-project-website.firebasestorage.app',
    messagingSenderId: '278048319219',
    appId: '1:278048319219:web:a9168185187088e9997986',
    measurementId: 'G-LG64NXPNNF'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
    const postSnap = await getDoc(doc(db, 'posts', '478'));
    if (postSnap.exists()) {
        const data = postSnap.data();
        console.log("Categories:", data.categories);
        console.log("Category:", data.category);
        console.log("Tags:", data.tags);
        console.log("Related Posts:", data.related_posts);
        console.log("Authors:", data.authors);
        process.exit(0);
    } else {
        console.log("Post 478 not found.");
        process.exit(1);
    }
}
main().catch(console.error);
