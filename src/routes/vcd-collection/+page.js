import http from "../../lib/http.js";

export const load = async ({ fetch }) => {
	return http.get(fetch, '/vcd-collection', {})
}
