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
		const res = await fetch('http://localhost:1337/api' + resource, {
			headers: {
				'Authorization': "bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b"
			}
		})
		return onRes(res)
	}

	// an empty object is necessary, otherwise result fatal error when not passing body params
	async function post (fetch, resource, body = {}, config = {}) {
		const res = await fetch('http://localhost:1337/api' + resource, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': "bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b"
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