import http from "../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	return http.get(fetch, '/events', {
		sort: 'createdAt:desc',
		populate: '*',
		'pagination[page]': params.page,
		'pagination[pageSize]': 10
	})
}