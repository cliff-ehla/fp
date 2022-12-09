import http from "../../lib/http.js";
export const load = async ({fetch, params}) => {
	const category = await http.get(fetch, `/categories`, {
		'filters[type][$eq]': 'Post'
	})
	return {
		category_list: category.data
	}
}