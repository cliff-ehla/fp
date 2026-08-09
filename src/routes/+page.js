import http from "../lib/http.js";
export const load = async ({fetch, params}) => {
	const posts = await http.get(fetch, `/posts`, {
		sort: 'createdAt:desc',
		populate: '*',
		'pagination[page]': 1,
		'pagination[pageSize]': 5
	})
	const events = await http.get(fetch, `/events`, {
		sort: 'createdAt:desc',
		populate: '*',
		'pagination[page]': 1,
		'pagination[pageSize]': 5
	})
	return {
		...posts,
		events: events.data
	}
}