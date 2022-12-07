export const prerender = true
export const load = async ({fetch}) => {
	let res = await fetch("http://localhost:1337/api/posts?sort=createdAt:desc&populate=%2A", {
		headers: {
			'Authorization': "bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b"
		}
	})
	let json = await res.json()
	return json
}