import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	throw redirect(302, '/blog/page/1');
}