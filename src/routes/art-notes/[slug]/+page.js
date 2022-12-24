import http from "../../../lib/http.js";
import {redirect} from "@sveltejs/kit";

export const load = async ({fetch, params}) => {
	const posts = await http.get(fetch, `/posts`, {
		populate: {
			authors: {
				populate: {
					image: true
				}
			},
			categories: true,
			tags: true,
			events: {
				populate: {
					image: true
				}
			},
			related_posts: {
				populate: {
					image: true
				}
			},
			image: true
		},
		'filters[slug][$eq]': params.slug
	})
	if (!posts.data.length) throw redirect(307, '/');
	console.log('post detail')
	return posts.data[0]
}