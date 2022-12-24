import http from "../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	console.log('author list: ' + params.slug)
	return http.get(fetch, '/posts', {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[page]': params.page,
		'pagination[pageSize]': 10,
		'filters[authors][slug][$eq]': params.slug
	})
}