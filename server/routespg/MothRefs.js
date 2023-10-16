var sqlite3 = require('sqlite3').verbose();
var validator = require('validator');

const express = require('express')
const refMoths_router = express.Router();

const cache = require('../routeCache');

// Banco de dados
//var db_mariposa = require('../database.js');
var db_mariposa = require('../databasepg.js');

// Autenticador
const auth = require("../middleware/auth.js");

// Lidando com Referencias!
// ---------------------------------

// pega as referencias com base no id
refMoths_router.get("/refMoths_get/:id", auth,  (req, res) => {

    var sql = "SELECT * FROM \"references\" WHERE id_main = $1"
    var params = [req.params.id]

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            console.log(result.rows)
            res.json({
                //"data":result.rows
            })

        }

    });
});

module.exports = refMoths_router;