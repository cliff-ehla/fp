<script>
	import {onMount} from "svelte";
	let posts
	onMount(async () => {
		let res = await fetch("http://localhost:1337/api/posts", {
			headers: {
				'Authorization': "bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b"
			}
		})
		let json = await res.json()
		posts = json.data
		console.log('cliff: ', posts)
	})
</script>

{#if posts}
	{#each posts as p}
		<p><b>{p.attributes.title}</b></p>
		<p>{p.attributes.wp_large_url}</p>
		<img src="http://localhost:8888/wp-content/uploads/{p.attributes.wp_large_url}" alt="">
	{/each}
{/if}
