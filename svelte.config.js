import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// paths: {
		// 	assets: "https://floatingprojectscollective.net"
		// },
		// prerender: {
		// 	handleHttpError: 'ignore',
		// 	handleMissingId: 'ignore',
		// 	concurrency: 5
		// }
	},
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
};

export default config;
