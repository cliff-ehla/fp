import http from "../../lib/http.js";
export const load = async ({fetch, url}) => {
    const q = url.searchParams.get('q')
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
            }
        })
    ])
    return {
        posts,
        events,
        search_key: q
    }
}