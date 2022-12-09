import adapter from '@sveltejs/adapter-vercel';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: {
			assets: "https://floatingprojectscollective.net"
		}
	},
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
};

export default config;
