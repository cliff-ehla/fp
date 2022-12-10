import http from "../../../lib/http.js";
import {redirect} from "@sveltejs/kit";

export const load = async ({fetch, params}) => {
	const posts = await http.get(fetch, `/events`, {
		populate: '%2A',
		'filters[slug][$eq]': params.slug
	})
	if (!posts.data.length) throw redirect(307, '/');
	console.log('event detail')
	return posts.data[0]
}