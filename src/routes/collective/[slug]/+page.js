import http from "../../../lib/http.js";
import {redirect} from "@sveltejs/kit";

export const load = async ({fetch, params}) => {
	const members = await http.get(fetch, `/authors`, {
		populate: '*',
		'filters[slug][$eq]': params.slug
	})
	const posts = await http.get(fetch, '/posts', {
		sort: 'createdAt:desc',
		'pagination[page]': 1,
		'pagination[pageSize]': 3,
		'filters[authors][slug][$eq]': params.slug
	})
	const events = await http.get(fetch, '/events', {
		sort: 'createdAt:desc',
		'pagination[page]': 1,
		'pagination[pageSize]': 3,
		'filters[artists][slug][$eq]': params.slug
	})
	if (!members.data.length) throw redirect(307, '/');
	console.log('people detail')
	return {
		member: members.data[0],
		posts: posts,
		events
	}
}