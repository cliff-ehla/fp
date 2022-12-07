import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	throw redirect(302, '/art-notes/page/1');
}