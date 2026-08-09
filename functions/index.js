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

        let snapshot = await db.collection('posts').get();
        let docs = snapshot.docs;

        // Apply filters in memory for max flexibility across composite objects
        if (slug) {
            docs = docs.filter(doc => doc.data().slug === slug);
        }
        if (categorySlug) {
            docs = docs.filter(doc => doc.data().category?.slug === categorySlug);
        }
        if (authorSlug) {
            docs = docs.filter(doc => {
                const authors = doc.data().authors || [];
                return authors.some(a => a.slug === authorSlug);
            });
        }
        if (tagSlug) {
            docs = docs.filter(doc => {
                const tags = doc.data().tags || [];
                return tags.some(t => t.slug === tagSlug);
            });
        }
        if (searchQuery) {
            const sq = searchQuery.toLowerCase();
            docs = docs.filter(doc => {
                const data = doc.data();
                return (data.title && data.title.toLowerCase().includes(sq)) || 
                       (data.content && data.content.toLowerCase().includes(sq));
            });
        }

        // Handle sort
        const sort = req.query.sort;
        if (sort) {
            const [field, direction] = sort.split(':');
            const isDesc = direction === 'desc';
            docs.sort((a, b) => {
                let valA = a.data()[field] || a.data()[field === 'createdAt' ? 'created_at' : field] || '';
                let valB = b.data()[field] || b.data()[field === 'createdAt' ? 'created_at' : field] || '';
                if (valA < valB) return isDesc ? 1 : -1;
                if (valA > valB) return isDesc ? -1 : 1;
                return 0;
            });
        } else {
            docs.sort((a, b) => {
                let valA = a.data().createdAt || a.data().created_at || '';
                let valB = b.data().createdAt || b.data().created_at || '';
                return valA < valB ? 1 : (valA > valB ? -1 : 0);
            });
        }

        // Pagination
        const total = docs.length;
        const pageSize = parseInt(req.query.pagination?.pageSize) || 10;
        const page = parseInt(req.query.pagination?.page) || 1;
        const pageCount = Math.ceil(total / pageSize) || 1;
        const paginatedDocs = docs.slice((page - 1) * pageSize, page * pageSize);

        const formattedData = paginatedDocs.map(formatStrapiPost);

        res.json({
            data: formattedData,
            meta: {
                pagination: { page, pageSize, total, pageCount }
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

        let snapshot = await db.collection('events').get();
        let docs = snapshot.docs;

        if (slug) {
            docs = docs.filter(doc => doc.data().slug === slug);
        }
        if (categorySlug) {
            docs = docs.filter(doc => doc.data().category?.slug === categorySlug);
        }
        if (artistSlug) {
            docs = docs.filter(doc => {
                const artists = doc.data().artists || [];
                return artists.some(a => a.slug === artistSlug);
            });
        }
        if (searchQuery) {
            const sq = searchQuery.toLowerCase();
            docs = docs.filter(doc => {
                const data = doc.data();
                return (data.title && data.title.toLowerCase().includes(sq)) || 
                       (data.content && data.content.toLowerCase().includes(sq));
            });
        }

        // Sort
        const sort = req.query.sort;
        if (sort) {
            let [field, direction] = sort.split(':');
            if (field === 'start_date') field = 'startDate';
            const isDesc = direction === 'desc';
            docs.sort((a, b) => {
                let valA = a.data()[field] || a.data()[field === 'startDate' ? 'start_date' : field] || '';
                let valB = b.data()[field] || b.data()[field === 'startDate' ? 'start_date' : field] || '';
                if (valA < valB) return isDesc ? 1 : -1;
                if (valA > valB) return isDesc ? -1 : 1;
                return 0;
            });
        } else {
            docs.sort((a, b) => {
                let valA = a.data().startDate || a.data().start_date || '';
                let valB = b.data().startDate || b.data().start_date || '';
                return valA < valB ? 1 : (valA > valB ? -1 : 0);
            });
        }

        const total = docs.length;
        const pageSize = parseInt(req.query.pagination?.pageSize) || 10;
        const page = parseInt(req.query.pagination?.page) || 1;
        const pageCount = Math.ceil(total / pageSize) || 1;
        const paginatedDocs = docs.slice((page - 1) * pageSize, page * pageSize);

        const formattedData = paginatedDocs.map(formatStrapiEvent);

        res.json({
            data: formattedData,
            meta: {
                pagination: { page, pageSize, total, pageCount }
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

exports.api = functions
    .region('asia-east2')
    .runWith({
        serviceAccount: 'empower-b4b4a@appspot.gserviceaccount.com'
    })
    .https.onRequest(app);
