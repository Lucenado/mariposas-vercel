var sqlite3 = require('sqlite3').verbose();
var validator = require('validator');

const express = require('express')
const mainMoths_router = express.Router();

const cache = require('../routeCache');

// Banco de dados
//var db_mariposa = require('../database.js');
var db_mariposa = require('../databasepg.js');

// Autenticador
const auth = require("../middleware/auth.js");

// Lidando com Mariposas!
// ---------------------------------

// MAIN
// ---------------------------------

// pega todas os bichos da Main (menos os sinonimos)
mainMoths_router.get("/mainMoths_getAll", cache(2628288), auth,  (req, res) => {

    var sql = "SELECT * FROM main WHERE syn_of IS NULL ORDER BY genus, id"
    var params = []

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            
            res.json({
                "data":result.rows
            })

        }

    });
});

// pega o id dos bichos sinonimos da main
mainMoths_router.get("/mainMoths_getAllSyns", cache(2628288), auth,  (req, res) => {

    var sql = "SELECT syn_of FROM main WHERE syn_of IS NOT NULL"
    var params = []
    var data = []

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            result.rows.forEach((row) => {
                data.push(row.syn_of)
            })
            res.json({
                "data": data
            })

        }

    });
});

// pega todos os dados dos bichos sinonimos da main baseado em id
mainMoths_router.get("/mainMoths_getSyns/:syn_of", cache(2628288), auth,  (req, res) => {

    var sql = "SELECT * FROM main WHERE syn_of = $1"
    var params = [req.params.syn_of]
    var data = []

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{

            res.json({
                "data": result.rows
            })

        }

    });
});

// ve bicho da main baseado no genero
mainMoths_router.get("/mainMoths_getGenus/:genus", cache(2628288), auth,  (req, res) => {

    var sql = "SELECT * FROM main WHERE genus = ?"
    var params = [req.params.genus]

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            
            res.json({
                "data":result.rows
            })

        }

    });
});

// ve bicho da main baseado na especie
mainMoths_router.get("/mainMoths_getSpecies/:species", cache(2628288), auth,  (req, res) => {

    var sql = "SELECT * FROM main WHERE species = ?"
    var params = [req.params.species]

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            
            res.json({
                "data":result.rows
            })

        }

    });
});

// ve bicho da main baseado no id
mainMoths_router.get("/mainMoths_get/:id", cache(2628288), auth,  (req, res) => {

    var sql = "SELECT * FROM main WHERE id = ?"
    var params = [req.params.id]

    db_mariposa.query(sql, params, (err, result) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        } else if(typeof result.rows === 'undefined'){
            res.json({
                "data":"Not Found"
            })
        }
        else{
            
            res.json({
                "data":result.rows
            })

        }

    });
});

// register moth
mainMoths_router.post("/registerMainMoth", (req, res, next) => {

    var data = {
        nome: req.body.nome,
    }

    if (req.body.nome == null){
        
        res.status(400).send("Name is null");
        return; 

    }
    else{

        var sql_retrieve = "SELECT * from main WHERE nome = ?"
        var params = [data.nome]

        db_mariposa.get(sql_retrieve, params, (err, rows) => {

            // se passou daqui o usuário existe
            if (rows != undefined || rows != null || err) {
                res.status(400).send("Moth already exists!");
                console.log(rows)
                return;
            }
            else{
                
                // create 6 digit id based on name
                const length = 6
                const Opcoes = "123456789"
                const OpcoesLength = 9

                let identificador = ' ';

                for ( let i = 0; i < length; i++ ) {
                    identificador += Opcoes.charAt(Math.floor(Math.random() * OpcoesLength));
                }
            
                var sql_insert = 'INSERT INTO main (nome, identificador) VALUES (?, ?)'
                
                db_mariposa.run(sql_insert, [data.nome, identificador])

                res.status(200).json({"nome":data.nome, "identificador": identificador});
                return;
            }

        });

    }    

});

// delete moth by name
mainMoths_router.delete("delete/:nome", auth,  (req, res) => {

    db_mariposa.run(
        'DELETE FROM main WHERE nome = ?',

        req.params.nome,
        
        function (err, result) {

            if (err){
                res.status(400).json({"error": res.message})
                return;
            }

            res.json({"message":"Moth deleted!", changes: this.changes})
    
    });
})

// filter moths
mainMoths_router.post("/mainMoths_filter", auth,  (req, res) => {

    var data = {
        nome: req.body.nome,
    }

    if (req.body.nome == null){
        
        res.status(400).send("Name is null");
        return; 

    }
    else{
            
        var sql = "SELECT * FROM main WHERE nome LIKE '%" + data.nome + "%'"
        var params = []

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
    
    }

});

// update moth by id
mainMoths_router.patch("/mainMoths_PatchId/:id", auth,  (req, res) => {
    
    var data = {
        nome: req.body.nome,
        identificador: req.body.identificador
    }

    db_mariposa.run(
        `UPDATE main set 
            nome = COALESCE(?,nome),
            identificador = COALESCE(?,identificador), 
            WHERE identificador = ?`,
        [data.nome, data.identificador, req.params.id],
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

// update moth by name
mainMoths_router.patch("/mainMoths_PatchNome/:nome", auth, (req, res) => {
    
    var data = {
        nome: req.body.nome,
        identificador: req.body.identificador
    }

    db_mariposa.run(
        `UPDATE main set 
            nome = COALESCE(?,nome),
            identificador = COALESCE(?,identificador), 
            WHERE nome = ?`,
        [data.nome, data.identificador, req.params.nome],
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


module.exports = mainMoths_router;