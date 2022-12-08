import http from "../../../lib/http.js";
export const load = async ({fetch, params}) => {
	return http.get(fetch, `/posts/${params.id}`)
}