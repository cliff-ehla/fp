import http from "../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	return http.get(fetch, '/posts', {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[page]': params.page,
		'pagination[pageSize]': 10,
		'filters[author][slug][$eq]': params.slug
	})
}