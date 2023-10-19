const {Pool} = require('pg');

require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    max: 5,
    min: 2,
    idleTimeoutMillis: 1000 //close idle clients after 1 second
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

/*(async () => {
    const {rows} = await pool.query('SELECT $1 AS food', ['pizza'])
    console.log(rows);
})();*/

/*const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "fischercopy",
    password: "postgres",
    port: 5432,
});*/

/*pool.connect((err) => {
    if (err) {throw err}
    console.log("Connected to PostgreSQL successfully!")
})*/


module.exports = pool;