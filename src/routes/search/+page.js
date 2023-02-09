import http from "../../lib/http.js";
export const load = async ({fetch, url}) => {
    const q = url.searchParams.get('q')
    if (!q) return {
        posts: [],
        events: []
    }
    const [
        { data: posts },
        { data: events }
    ] = await Promise.all([
        http.get(fetch, '/posts', {
            filters: {
                $or: [
                    {
                        title: {
                            $containsi: q
                        }
                    },
                    {
                        content: {
                            $containsi: q
                        }
                    }
                ]
            },
            populate: {
                image: true,
                authors: true
            }
        }),
        http.get(fetch, '/events', {
            filters: {
                $or: [
                    {
                        title: {
                            $containsi: q
                        }
                    },
                    {
                        content: {
                            $containsi: q
                        }
                    }
                ]
            },
            populate: {
                image: true
            }
        })
    ])
    return {
        posts,
        events,
        search_key: q
    }
}