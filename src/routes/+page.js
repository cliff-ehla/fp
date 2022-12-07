import http from "../lib/http.js";
export const prerender = true
export const load = async ({fetch, params}) => {
	return http.get(fetch, `/posts`, {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[page]': 1,
		'pagination[pageSize]': 5
	})
}