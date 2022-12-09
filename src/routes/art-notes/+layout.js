import http from "../../lib/http.js";
export const load = async ({fetch, params}) => {
	const category = await http.get(fetch, `/categories`)
	return {
		category_list: category.data
	}
}