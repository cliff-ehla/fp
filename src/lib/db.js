import mysql from "mysql2/promise"
export let db = undefined

export const initDBConnection = async () => {
	if (db !== undefined) return
	db = await mysql.createConnection({
		host: 'localhost',
		port: 8889,
		user: 'root',
		password: 'root',
		database: 'strapi'
	})
}