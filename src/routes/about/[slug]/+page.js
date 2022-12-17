import http from "../../../lib/http.js";
export const load = async ({fetch, params}) => {
	console.log(params.slug)
	return http.get(fetch, '/abouts', {
		'filters[slug][$eq]': params.slug
	})
}