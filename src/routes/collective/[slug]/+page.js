import http from "../../../lib/http.js";
import {redirect} from "@sveltejs/kit";

export const load = async ({fetch, params}) => {
	const posts = await http.get(fetch, `/authors`, {
		populate: '%2A',
		'filters[slug][$eq]': params.slug
	})
	if (!posts.data.length) throw redirect(307, '/');
	console.log('people detail')
	return posts.data[0]
}