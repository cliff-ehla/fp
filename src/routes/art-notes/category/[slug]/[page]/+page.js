import http from "../../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	const category = await http.get(fetch, `/categories`, {
		'filters[slug][$eq]': params.slug
	})
	const post = await http.get(fetch, '/posts', {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[page]': params.page,
		'pagination[pageSize]': 10,
		'filters[categories][slug][$eq]': params.slug
	})
	console.log('category list: ' + params.slug)
	return {
		category: category.data[0],
		posts: post.data,
		pagination: post.meta.pagination
	}
}