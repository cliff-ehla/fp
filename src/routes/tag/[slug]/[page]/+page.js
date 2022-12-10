import http from "../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	console.log('tag list: ' + params.slug)
	return http.get(fetch, '/posts', {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[page]': params.page,
		'pagination[pageSize]': 10,
		'filters[tags][slug][$eq]': params.slug
	})
}