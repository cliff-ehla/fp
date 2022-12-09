import http from "../../../lib/http.js";

export const load = async ({fetch, params}) => {
	return http.get(fetch, `/posts`, {
		populate: '%2A',
		'filters[slug][$eq]': params.slug
	})
}