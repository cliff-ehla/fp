const VITE_API_BASE = import.meta.env.VITE_API_BASE_PROD
const VITE_STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN_PROD

const onRes = async (res) => {
	return await res.json()
}

const getQueryUrl = (resource, query) => {
	if (query) {
		for (const property in query) {
			let char = resource.includes('?') ? '&' : '?'
			resource += `${char}${property}=${query[property]}`
		}
	}
	return resource
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