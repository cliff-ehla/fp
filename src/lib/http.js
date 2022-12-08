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
				'Authorization': "bearer 8ad8e50b2b82202dcde9375fa93adef20b517576b410ebc5ab63b0ad7bb81465a78804a03fbb12425bdd736bd4fac5ac9cb2245077f477072cb6b56a8449c88a7ed67a4be4da41be82d21e39e4a3e88473326e5fcc9dbd029f396a388411e755005173a5a9c1312ae7900ca8adabe79b1b5860626246f53695319aa1080c6ae9"
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
				'Authorization': "bearer 8ad8e50b2b82202dcde9375fa93adef20b517576b410ebc5ab63b0ad7bb81465a78804a03fbb12425bdd736bd4fac5ac9cb2245077f477072cb6b56a8449c88a7ed67a4be4da41be82d21e39e4a3e88473326e5fcc9dbd029f396a388411e755005173a5a9c1312ae7900ca8adabe79b1b5860626246f53695319aa1080c6ae9"
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