const {Pool} = require('pg');

require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    max: 5,
})

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})
   
const client = await pool.connect()
   
client.release()