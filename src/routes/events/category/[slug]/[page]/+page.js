import http from "../../../../../lib/http.js";
export const load = async ({fetch, params}) => {
	// const category = await http.get(fetch, `/event-categories`, {
	// 	'filters[slug][$eq]': params.slug
	// })
	const events = await http.get(fetch, '/events', {
		sort: 'createdAt:desc',
		populate: '%2A',
		'pagination[page]': params.page,
		'pagination[pageSize]': 10,
		'filters[event_categories][slug][$eq]': params.slug
	})
	return {
		events: events.data,
		pagination: events.meta.pagination
	}
}