var sqlite3 = require('sqlite3').verbose();
var validator = require('validator');

const express = require('express')
const refMoths_router = express.Router();

const cache = require('../routeCache');

// Banco de dados
var db_mariposa = require('../database.js');

// Autenticador
const auth = require("../middleware/auth.js");

// Lidando com Referencias!
// ---------------------------------

// pega as referencias com base no id
refMoths_router.get("/refMoths_get/:id", auth,  (req, res) => {

    var sql = "SELECT * FROM 'references' WHERE id_main = ?"
    var params = [req.params.id]

    db_mariposa.all(sql, params, (err, rows) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            
            res.json({
                "data":rows
            })

        }

    });
});

module.exports = refMoths_router;