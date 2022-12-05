import {json} from "@sveltejs/kit";
import {db} from "../../../lib/db.js";

export const POST = async () => {
	let res = await db.query(`
	select * from blogs
	`)
	return json({
		foo:res[0]
	})
}