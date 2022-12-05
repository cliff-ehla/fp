import {initDBConnection} from '$lib/db'

export async function handle({ event, resolve }) {
	await initDBConnection()
	return resolve(event);
}