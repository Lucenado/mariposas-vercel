var md5 = require('md5')
var sqlite3 = require('sqlite3').verbose()
var validator = require('validator');
const jwt = require("jsonwebtoken");

const express = require('express')
const users_router = express.Router()

// Banco de dados
//var db_mariposa = require('../database.js')
var db_mariposa = require('../databasepg.js');

// Autenticador
const auth = require("../middleware/auth.js");

// Lidando com usuários!
// ---------------------------------

// registrar usuário
users_router.post("/register", (req, res, next) => {

    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    console.log("Nome:")
    console.log(req.body.email)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

    var correctEmail = validator.isEmail(req.body.email);
    var correctPassword = true //validator.register('strict', value => passwordRegex.test(value),'Password must contain at least one uppercase letter, one lowercase letter and one number');

    if (!correctEmail || !correctPassword){
        
        res.status(400).send("User does not fit the criteria!");
        console.log(correctEmail)
        console.log(correctPassword)
        return; 

    }
    else{

        var sql_retrieve = "SELECT * from user WHERE email = ? AND password = ?"
        var params = [data.email, data.password]

        db_mariposa.get(sql_retrieve, params, (err, rows) => {

            // se passou daqui o usuário existe
            if (rows != undefined || rows != null || err) {
                res.status(400).send("User already exists!");
                console.log(rows)
                return;
            }
            else{
                // cria token
                const token = jwt.sign(
                    { user_email: data.email },
                    "secret",
                    /*{
                        expiresIn: "2h",
                    }*/
                );

                var sql_insert = 'INSERT INTO user (name, email, password, token) VALUES (?, ?, ?, ?)'
                
                db_mariposa.run(sql_insert, [data.name, data.email, md5(data.password), token])

                res.status(200).json({"my_token":token, "name": data.name, "email": data.email});
                return;
            }

        });

    }    

});

// login usuário
users_router.post("/login", (req, res, next) => {

    var data = {
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }

    var sql_retrieve = "SELECT * from user WHERE email = ? AND password = ?"
    var params = [data.email, data.password]

    console.log("senha")
    console.log(data.password)

    db_mariposa.query(sql_retrieve, params, (err, result) => {

        // se passou daqui o usuário existe
        if (err) {
            return res.status(400).json({"error":err.message});
        }

        // cria token
        const token = jwt.sign(
            { user_email: data.email },
            "secret",
            /*{
                expiresIn: "2h",
            }*/
        );

        var sql_update = "UPDATE user SET token = ? WHERE email = ? AND password = ?"

        db_mariposa.run(sql_update, [token, data.email , md5(data.password)])
        
        return res.status(200).json({"my_token":token, "name": data.name, "email": data.email});

    });

});

// get user por id
users_router.get("/:id", auth, (req, res) => {

    var sql = "SELECT * FROM user WHERE id = ?"
    var params = [req.params.id]

    db_mariposa.get(sql, params, (err, row) => {

        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }

        res.json({
            "message":"success",
            "data":row
        })

    });
});

// get user por email (que é um id único anyway)
users_router.post("/email", auth, (req, res) => {

    var sql = "SELECT * FROM user WHERE email = ?"
    var params = [req.body.email]

    db_mariposa.get(sql, params, (err, row) => {

        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }

        res.json({
            "message":"success",
            "data":row
        })

    });
});

// atualizar um usuário
users_router.patch("/update/:email", auth, (req, res) => {
    
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }

    db_mariposa.run(
        `UPDATE user set 
            name = COALESCE(?,name), 
            email = COALESCE(?,email), 
            password = COALESCE(?,password) 
            WHERE email = ?`,
        [data.name, data.email, data.password, req.params.email],
        function (err, result) {

            if (err){
                res.status(400).json({"error": res.message})
                return;
            }

            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })

    });
})

// deletar um usuário
users_router.delete("/delete/:email", auth, (req, res) => {

    db_mariposa.run(
        'DELETE FROM user WHERE email = ?',

        req.params.email,
        
        function (err, result) {

            if (err){
                res.status(400).json({"error": res.message})
                return;
            }

            res.json({"message":"User deleted!", changes: this.changes})
    
    });
})

// ver todos os usuários
users_router.post("/users_get", auth, (req, res) => {

    // só funciona se vc é o admin!

    var sql = "SELECT * FROM user"
    var params = []

    db_mariposa.all(sql, params, (err, rows) => {

        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if(req.body.email == "admin@example.com"){
            
            res.json({
                "message":"success",
                "data":rows
            })

        }
        else{
            
            res.json({
                "message":"Pending permission!",
                "data":rows
            })

        }

    });
});

// user logout (deleta a token dele do banco de dados, ele tem que gerar uma nova ao entrar!)
users_router.post("/logout", auth, (req, res) => {

    var data = {
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }

    var sql_retrieve = "SELECT * from user WHERE email = ?, password = ?"
    var params = [data.email, data.password]

    console.log("senha")
    console.log(data.password)

    db_mariposa.get(sql_retrieve, params, (err, rows) => {

        // se passou daqui o usuário existe
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        // cria token
        const token = "000000"

        var sql_update = "UPDATE user SET token = ? WHERE email = ?, password = ?"

        db_mariposa.run(sql_update, [token, data.email , md5(data.password)])
        
        return res.status(200).json({"my_token":token, "message": "Bye!"});
    });
});

module.exports = users_router;
