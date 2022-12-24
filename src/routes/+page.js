import http from "../lib/http.js";
export const load = async ({fetch, params}) => {
	return http.get(fetch, `/posts`, {
		sort: 'createdAt:desc',
		populate: '*',
		'pagination[page]': 1,
		'pagination[pageSize]': 5
	})
}