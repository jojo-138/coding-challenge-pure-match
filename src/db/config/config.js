require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DEV_DB_USERNAME,
		password: process.env.DEV_DB_PASSWORD || '',
		database: process.env.DEV_DB_NAME,
		host: process.env.DEV_DB_HOST,
		port: process.env.DEV_DB_PORT,
		dialect: 'postgres',
		logging: console.log,
	},
	test: {
		username: process.env.TEST_DB_USERNAME,
		password: process.env.TEST_DB_PASSWORD || '',
		database: process.env.TEST_DB_NAME,
		host: process.env.TEST_DB_HOST,
		port: process.env.TEST_DB_PORT,
		dialect: 'postgres',
		logging: console.log,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
	},
};
