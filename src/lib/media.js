import { db, storage, auth } from '$lib/firebase.js';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const THUMB_MAX_DIM = 400;
const THUMB_QUALITY = 0.8;

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
}

export async function getImageDimensions(file) {
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        const dims = await new Promise((resolve, reject) => {
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = reject;
            img.src = url;
        });
        return dims;
    } finally {
        URL.revokeObjectURL(url);
    }
}

export async function generateThumbnail(file, maxDim = THUMB_MAX_DIM) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', THUMB_QUALITY);
    });

    return { blob, width, height };
}

export async function uploadMedia(file) {
    if (!file.type.startsWith('image/')) {
        throw new Error('Only image files can be uploaded to the media library.');
    }

    const [dims, thumb] = await Promise.all([
        getImageDimensions(file),
        generateThumbnail(file)
    ]);

    const timestamp = Date.now();
    const filename = sanitizeFilename(file.name);
    const storagePath = `media/${timestamp}-${filename}`;
    const thumbnailPath = `media/thumbs/${timestamp}-${filename}`;

    const originalRef = ref(storage, storagePath);
    const thumbnailRef = ref(storage, thumbnailPath);

    await Promise.all([
        uploadBytes(originalRef, file, { contentType: file.type }),
        uploadBytes(thumbnailRef, thumb.blob, { contentType: 'image/jpeg' })
    ]);

    const [url, thumbnailUrl] = await Promise.all([
        getDownloadURL(originalRef),
        getDownloadURL(thumbnailRef)
    ]);

    const mediaDoc = {
        url,
        thumbnailUrl,
        storagePath,
        thumbnailPath,
        filename,
        contentType: file.type,
        width: dims.width,
        height: dims.height,
        size: file.size,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || null
    };

    const docRef = await addDoc(collection(db, 'media'), mediaDoc);

    return { id: docRef.id, ...mediaDoc };
}

export async function listMedia({ pageSize = 24, after = null } = {}) {
    const constraints = [orderBy('createdAt', 'desc'), limit(pageSize)];
    if (after) {
        constraints.splice(1, 0, startAfter(after));
    }
    const q = query(collection(db, 'media'), ...constraints);
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const lastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
    return { items, lastDoc };
}
