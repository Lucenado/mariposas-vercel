var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')
const jwt = require("jsonwebtoken");

const DBSOURCE = "fischer.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {

        // Se não consigo abrir o BD...
        console.error(err.message)
        
        throw err

    }else{
        
        console.log('Connected to the SQLite database.')

        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            token text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Tabela já existia...
            }else{

                // Começando script com um usuário admin para teste...
                var sql_insert = 'INSERT INTO user (name, email, password, token) VALUES (?, ?, ?, ?)'
                
                const token = jwt.sign(
                    { user_email: "admin@example.com" },
                    "secret",
                    {
                        expiresIn: "2h",
                    }
                );

                db.run(sql_insert, ["admin","admin@example.com", md5("admin123456"), token])
                
                console.log("O BD foi carregado com sucesso!")
            
            }
        });  
    }
});


module.exports = db
