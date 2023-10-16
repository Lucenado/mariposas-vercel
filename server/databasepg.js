const {Pool} = require('pg');

require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    max: 5,
})

pool.connect((err) => {
    if (err) {throw err}
    console.log("Connected to PostgreSQL successfully!")
})


module.exports = pool;