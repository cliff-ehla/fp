import http from "../../lib/http.js";
export const load = async ({fetch, params}) => {
	return http.get(fetch, '/authors', {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[pageSize]': 100,
		'filters[is_member]': true
	})
}