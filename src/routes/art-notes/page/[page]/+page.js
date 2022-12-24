import http from "../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	return http.get(fetch, '/posts', {
		sort: 'createdAt:desc',
		populate: {
			authors: {
				populate: {
					image: true
				}
			},
			categories: true,
			tags: true,
			image: true
		},
		'pagination[page]': params.page,
		'pagination[pageSize]': 10
	})
}