import qs from "qs"

const VITE_API_BASE = import.meta.env.VITE_API_BASE || 'https://asia-east2-empower-b4b4a.cloudfunctions.net'
const VITE_STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN

const onRes = async (res) => {
	if (!res.ok) {
		const text = await res.text()
		throw new Error(`HTTP ${res.status}: ${text}`)
	}
	return await res.json()
}

const getQueryUrl = (resource, query) => {
	if (!query || Object.keys(query).length === 0) return resource
	return `${resource}?${qs.stringify(query, {
		encodeValuesOnly: true
	})}`
}

const http = (() => {
	async function get (fetchFn, resource, query) {
		const urlPath = getQueryUrl(resource, query)
		const fullUrl = `${VITE_API_BASE}/api${urlPath}`
		const res = await (fetchFn || fetch)(fullUrl, {
			headers: {
				'Authorization': `bearer ${VITE_STRAPI_TOKEN}`
			}
		})
		return onRes(res)
	}

	async function post (fetchFn, resource, body = {}) {
		const fullUrl = `${VITE_API_BASE}/api${resource}`
		const res = await (fetchFn || fetch)(fullUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `bearer ${VITE_STRAPI_TOKEN}`
			},
			body: JSON.stringify(body)
		})
		return onRes(res)
	}

	return {
		get,
		post
	}
})()

export default http