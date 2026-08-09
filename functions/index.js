const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

const parseDate = (val) => {
    if (!val) return null;
    if (typeof val.toDate === 'function') {
        try {
            return val.toDate().toISOString();
        } catch (e) {
            console.error('Error calling toDate() on date field:', e);
        }
    }
    try {
        return new Date(val).toISOString();
    } catch (e) {
        console.error('Error parsing date field:', e);
        return null;
    }
};

const formatStrapiPost = (doc) => {
    const data = doc.data();
    const createdAt = parseDate(data.createdAt || data.created_at);
    const updatedAt = parseDate(data.updatedAt || data.updated_at);
    const publishedAt = parseDate(data.publishedAt || data.published_at);
    
    return {
        id: doc.id,
        attributes: {
            ...data,
            createdAt,
            updatedAt,
            publishedAt,
            image: {
                data: (data.mainImage || data.image) ? {
                    attributes: {
                        url: data.mainImage || data.image
                    }
                } : null
            },
            categories: {
                data: data.category ? [{
                    id: data.category.id,
                    attributes: {
                        name: data.category.name,
                        slug: data.category.slug
                    }
                }] : []
            },
            event_categories: {
                data: data.category ? [{
                    id: data.category.id,
                    attributes: {
                        name: data.category.name,
                        slug: data.category.slug
                    }
                }] : []
            },
            authors: {
                data: Array.isArray(data.authors) ? data.authors.map(a => ({
                    id: String(a.id),
                    attributes: {
                        ...a,
                        image: {
                            data: a.image ? { attributes: { url: a.image } } : null
                        }
                    }
                })) : []
            },
            tags: {
                data: Array.isArray(data.tags) ? data.tags.map(t => ({
                    id: String(t.id),
                    attributes: {
                        name: t.name,
                        slug: t.slug
                    }
                })) : []
            },
            events: {
                data: Array.isArray(data.events) ? data.events.map(e => ({
                    id: String(e.id),
                    attributes: {
                        ...e,
                        image: {
                            data: (e.mainImage || e.image) ? { attributes: { url: e.mainImage || e.image } } : null
                        }
                    }
                })) : []
            },
            related_posts: {
                data: Array.isArray(data.related_posts) ? data.related_posts.map(p => ({
                    id: String(p.id),
                    attributes: {
                        ...p,
                        image: {
                            data: (p.mainImage || p.image) ? { attributes: { url: p.mainImage || p.image } } : null
                        }
                    }
                })) : []
            }
        }
    };
};

const formatStrapiEvent = (doc) => {
    const data = doc.data();
    const createdAt = parseDate(data.createdAt || data.created_at);
    const updatedAt = parseDate(data.updatedAt || data.updated_at);
    const publishedAt = parseDate(data.publishedAt || data.published_at);
    const startDate = parseDate(data.startDate || data.start_date);
    const endDate = parseDate(data.endDate || data.end_date);

    return {
        id: doc.id,
        attributes: {
            ...data,
            createdAt,
            updatedAt,
            publishedAt,
            startDate,
            endDate,
            start_date: startDate,
            end_date: endDate,
            image: {
                data: (data.mainImage || data.image) ? {
                    attributes: {
                        url: data.mainImage || data.image
                    }
                } : null
            },
            categories: {
                data: data.category ? [{
                    id: data.category.id,
                    attributes: {
                        name: data.category.name,
                        slug: data.category.slug
                    }
                }] : []
            },
            event_categories: {
                data: data.category ? [{
                    id: data.category.id,
                    attributes: {
                        name: data.category.name,
                        slug: data.category.slug
                    }
                }] : []
            },
            artists: {
                data: Array.isArray(data.artists) ? data.artists.map(a => ({
                    id: String(a.id),
                    attributes: {
                        ...a,
                        image: {
                            data: a.image ? { attributes: { url: a.image } } : null
                        }
                    }
                })) : []
            },
            tags: {
                data: Array.isArray(data.tags) ? data.tags.map(t => ({
                    id: String(t.id),
                    attributes: {
                        name: t.name,
                        slug: t.slug
                    }
                })) : []
            },
            reviews: {
                data: Array.isArray(data.reviews) ? data.reviews.map(r => ({
                    id: String(r.id),
                    attributes: {
                        ...r,
                        image: {
                            data: (r.mainImage || r.image) ? { attributes: { url: r.mainImage || r.image } } : null
                        }
                    }
                })) : []
            }
        }
    };
};

const formatStrapiAuthor = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        attributes: {
            ...data,
            createdAt: parseDate(data.createdAt || data.created_at),
            updatedAt: parseDate(data.updatedAt || data.updated_at),
            image: {
                data: data.image ? {
                    attributes: {
                        url: data.image
                    }
                } : null
            }
        }
    };
};

// Helper to extract nested filter values
const getFilterVal = (obj, path) => {
    let current = obj;
    for (const key of path) {
        if (!current) return undefined;
        current = current[key];
    }
    if (typeof current === 'object' && current !== null && current['$eq'] !== undefined) {
        return current['$eq'];
    }
    return current;
};

// Handle /posts and /api/posts
const handlePosts = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const slug = getFilterVal(filters, ['slug']);
        const categorySlug = getFilterVal(filters, ['categories', 'slug']) || getFilterVal(filters, ['event_categories', 'slug']);
        const authorSlug = getFilterVal(filters, ['authors', 'slug']);
        const tagSlug = getFilterVal(filters, ['tags', 'slug']);
        
        let searchQuery = null;
        if (filters.$or) {
            const firstOr = Array.isArray(filters.$or) ? filters.$or[0] : filters.$or;
            searchQuery = firstOr?.title?.$containsi || firstOr?.content?.$containsi;
        }

        let query = db.collection('posts');

        if (slug) {
            query = query.where('slug', '==', slug);
        }
        if (categorySlug) {
            query = query.where('category.slug', '==', categorySlug);
        }
        if (authorSlug) {
            query = query.where('author_slugs', 'array-contains', authorSlug);
        }
        if (tagSlug) {
            query = query.where('tag_slugs', 'array-contains', tagSlug);
        }

        const sort = req.query.sort;
        let [field, direction] = sort ? sort.split(':') : ['createdAt', 'desc'];
        if (field === 'created_at') field = 'createdAt';
        const isDesc = direction === 'desc';

        const pageSize = parseInt(req.query.pagination?.pageSize) || 10;
        const page = parseInt(req.query.pagination?.page) || 1;
        const pageCountFn = (t) => Math.ceil(t / pageSize) || 1;

        let docs = [];
        let total = 0;

        if (searchQuery) {
            // Fallback: Firestore lacks full-text search, so download filtered subset & search in memory
            const snapshot = await query.get();
            let allDocs = snapshot.docs;

            const sq = searchQuery.toLowerCase();
            allDocs = allDocs.filter(doc => {
                const data = doc.data();
                return (data.title && data.title.toLowerCase().includes(sq)) || 
                       (data.content && data.content.toLowerCase().includes(sq));
            });

            allDocs.sort((a, b) => {
                let valA = a.data()[field] || a.data()[field === 'createdAt' ? 'created_at' : field] || '';
                let valB = b.data()[field] || b.data()[field === 'createdAt' ? 'created_at' : field] || '';
                if (valA < valB) return isDesc ? 1 : -1;
                if (valA > valB) return isDesc ? -1 : 1;
                return 0;
            });

            total = allDocs.length;
            docs = allDocs.slice((page - 1) * pageSize, page * pageSize);
        } else {
            // Native highly-optimized Firestore query
            query = query.orderBy(field, direction);
            
            const countSnapshot = await query.count().get();
            total = countSnapshot.data().count;

            const snapshot = await query.offset((page - 1) * pageSize).limit(pageSize).get();
            docs = snapshot.docs;
        }

        const formattedData = docs.map(formatStrapiPost);

        res.json({
            data: formattedData,
            meta: {
                pagination: { page, pageSize, total, pageCount: pageCountFn(total) }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

app.get('/posts', handlePosts);
app.get('/api/posts', handlePosts);

// Handle /events and /api/events
const handleEvents = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const slug = getFilterVal(filters, ['slug']);
        const categorySlug = getFilterVal(filters, ['event_categories', 'slug']) || getFilterVal(filters, ['categories', 'slug']);
        const artistSlug = getFilterVal(filters, ['artists', 'slug']);

        let searchQuery = null;
        if (filters.$or) {
            const firstOr = Array.isArray(filters.$or) ? filters.$or[0] : filters.$or;
            searchQuery = firstOr?.title?.$containsi || firstOr?.content?.$containsi;
        }

        let query = db.collection('events');

        if (slug) {
            query = query.where('slug', '==', slug);
        }
        if (categorySlug) {
            query = query.where('category.slug', '==', categorySlug);
        }
        if (artistSlug) {
            query = query.where('artist_slugs', 'array-contains', artistSlug);
        }

        const sort = req.query.sort;
        let [field, direction] = sort ? sort.split(':') : ['startDate', 'desc'];
        if (field === 'start_date') field = 'startDate';
        const isDesc = direction === 'desc';

        const pageSize = parseInt(req.query.pagination?.pageSize) || 10;
        const page = parseInt(req.query.pagination?.page) || 1;
        const pageCountFn = (t) => Math.ceil(t / pageSize) || 1;

        let docs = [];
        let total = 0;

        if (searchQuery) {
            const snapshot = await query.get();
            let allDocs = snapshot.docs;

            const sq = searchQuery.toLowerCase();
            allDocs = allDocs.filter(doc => {
                const data = doc.data();
                return (data.title && data.title.toLowerCase().includes(sq)) || 
                       (data.content && data.content.toLowerCase().includes(sq));
            });

            allDocs.sort((a, b) => {
                let valA = a.data()[field] || a.data()[field === 'startDate' ? 'start_date' : field] || '';
                let valB = b.data()[field] || b.data()[field === 'startDate' ? 'start_date' : field] || '';
                if (valA < valB) return isDesc ? 1 : -1;
                if (valA > valB) return isDesc ? -1 : 1;
                return 0;
            });

            total = allDocs.length;
            docs = allDocs.slice((page - 1) * pageSize, page * pageSize);
        } else {
            query = query.orderBy(field, direction);
            
            const countSnapshot = await query.count().get();
            total = countSnapshot.data().count;

            const snapshot = await query.offset((page - 1) * pageSize).limit(pageSize).get();
            docs = snapshot.docs;
        }

        const formattedData = docs.map(formatStrapiEvent);

        res.json({
            data: formattedData,
            meta: {
                pagination: { page, pageSize, total, pageCount: pageCountFn(total) }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

app.get('/events', handleEvents);
app.get('/api/events', handleEvents);

// Handle /categories and /api/categories
const handleCategories = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const slug = getFilterVal(filters, ['slug']);
        
        let snapshot = await db.collection('categories').get();
        let docs = snapshot.docs;

        docs = docs.filter(doc => doc.data().type === 'blog' || !doc.data().type);
        if (slug) {
            docs = docs.filter(doc => doc.data().slug === slug);
        }

        const data = docs.map(doc => ({
            id: doc.id,
            attributes: doc.data()
        }));

        res.json({ data });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

app.get('/categories', handleCategories);
app.get('/api/categories', handleCategories);

// Handle /event-categories and /api/event-categories
const handleEventCategories = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const slug = getFilterVal(filters, ['slug']);

        let snapshot = await db.collection('categories').where('type', '==', 'event').get();
        let docs = snapshot.docs;

        if (slug) {
            docs = docs.filter(doc => doc.data().slug === slug);
        }

        const data = docs.map(doc => ({
            id: doc.id,
            attributes: doc.data()
        }));

        res.json({ data });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

app.get('/event-categories', handleEventCategories);
app.get('/api/event-categories', handleEventCategories);

// Handle /abouts and /api/abouts
const handleAbouts = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const slug = getFilterVal(filters, ['slug']);

        let snapshot = await db.collection('abouts').get();
        let docs = snapshot.docs;

        if (slug) {
            docs = docs.filter(doc => doc.data().slug === slug);
        }

        const data = docs.map(doc => ({
            id: doc.id,
            attributes: doc.data()
        }));

        res.json({ data });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

app.get('/abouts', handleAbouts);
app.get('/api/abouts', handleAbouts);

// Handle /authors and /api/authors
const handleAuthors = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const slug = getFilterVal(filters, ['slug']);
        const isMember = getFilterVal(filters, ['is_member']);

        let snapshot = await db.collection('authors').get();
        let docs = snapshot.docs;

        if (slug) {
            docs = docs.filter(doc => doc.data().slug === slug);
        }
        if (isMember !== undefined) {
            const isMemBool = isMember === true || isMember === 'true';
            docs = docs.filter(doc => doc.data().is_member === isMemBool);
        }

        const pageSize = parseInt(req.query.pagination?.pageSize) || docs.length;
        const page = parseInt(req.query.pagination?.page) || 1;
        const paginatedDocs = docs.slice((page - 1) * pageSize, page * pageSize);

        const data = paginatedDocs.map(formatStrapiAuthor);

        res.json({
            data,
            meta: {
                pagination: { page, pageSize, total: docs.length, pageCount: Math.ceil(docs.length / pageSize) || 1 }
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

app.get('/authors', handleAuthors);
app.get('/api/authors', handleAuthors);

// Handle /vcd-collection and /api/vcd-collection
const handleVcdCollection = async (req, res) => {
    try {
        const filters = req.query.filters || {};
        const search = getFilterVal(filters, ['search']);

        let snapshot = await db.collection('vcd_collection').orderBy('index').get();
        let docs = snapshot.docs;

        if (search) {
            const sq = search.toLowerCase();
            docs = docs.filter(doc => {
                const d = doc.data();
                return (d.titleChinese && d.titleChinese.toLowerCase().includes(sq)) ||
                    (d.titleEnglish && d.titleEnglish.toLowerCase().includes(sq)) ||
                    (d.dirChinese && d.dirChinese.toLowerCase().includes(sq)) ||
                    (d.dirEnglish && d.dirEnglish.toLowerCase().includes(sq));
            });
        }

        const data = docs.map(doc => ({
            id: doc.id,
            attributes: doc.data()
        }));

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

app.get('/vcd-collection', handleVcdCollection);
app.get('/api/vcd-collection', handleVcdCollection);

exports.api = functions
    .region('asia-east2')
    .runWith({
        serviceAccount: 'floating-project-website@appspot.gserviceaccount.com'
    })
    .https.onRequest(app);
