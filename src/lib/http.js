const env = import.meta.env.VITE_ENV
const VITE_API_BASE = env === 'dev' ? import.meta.env.VITE_DEV_API_BASE : import.meta.env.VITE_API_BASE
const VITE_STRAPI_TOKEN = env === 'dev' ? import.meta.env.VITE_DEV_STRAPI_TOKEN : import.meta.env.VITE_STRAPI_TOKEN
import qs from "qs"

const onRes = async (res) => {
	return await res.json()
}

const getQueryUrl = (resource, query) => {
	let url = `${resource}?${qs.stringify(query, {
		encodeValuesOnly: true, // prettify URL
	})}`
	console.log('AAA', url)
	if (query) {
		for (const property in query) {
			let char = resource.includes('?') ? '&' : '?'
			resource += `${char}${property}=${query[property]}`
		}
	}
	console.log('BBB', resource)
	return url
}

const http = (() => {
	async function get (fetch, resource, query) {
		resource = getQueryUrl(resource, query)
		const res = await fetch(`${VITE_API_BASE}/api` + resource, {
			headers: {
				'Authorization': `bearer ${VITE_STRAPI_TOKEN}`
			}
		})
		return onRes(res)
	}

	// an empty object is necessary, otherwise result fatal error when not passing body params
	async function post (fetch, resource, body = {}, config = {}) {
		const res = await fetch(`${VITE_API_BASE}/api` + resource, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `bearer ${VITE_STRAPI_TOKEN}`
			},
			body: body && JSON.stringify(body)
		})
		return onRes(res)
	}

	return {
		get,
		post
	}
})()

export default http