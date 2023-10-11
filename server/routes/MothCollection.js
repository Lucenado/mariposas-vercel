var sqlite3 = require('sqlite3').verbose()
var validator = require('validator');

const express = require('express');
const collectionMoths_router = express.Router();

const cache = require('../routeCache');

// Banco de dados
var db_mariposa = require('../database.js');

// Autenticador
const auth = require("../middleware/auth.js");

// Lidando com coletas de Mariposas!
// ---------------------------------

// pega todas as coletas
collectionMoths_router.get("/collectionMoths_getAll", cache(2628288), auth, (req, res) => {

    var sql = "SELECT * FROM coleta"
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
});

// pega tudo baseado em "genus"
collectionMoths_router.post("/collectionMoths_filter_genus/:genus", cache(2628288), auth, (req, res) => {

    var data = {
        genus: req.params.genus,
    }

    if (req.body.nome == null){
        
        res.status(400).send("Genus is null");
        return; 

    }
    else{
            
        var sql = "SELECT * FROM coleta WHERE genus LIKE '%" + data.genus + "%'"
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


// pega tudo baseado em "species"
collectionMoths_router.get("/collectionMoths_filter_species/:species", cache(2628288), auth, (req, res) => {

    var data = {
        genus: req.params.species,
    }

    if (req.body.nome == null){
        
        res.status(400).send("Species is null");
        return; 

    }
    else{
            
        var sql = "SELECT * FROM coleta WHERE species LIKE '%" + data.species + "%'"
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


// pega tudo baseado em "locality"
collectionMoths_router.get("/collectionMoths_filter_locality/:locality", auth, (req, res) => {

    var data = {
        locality: req.params.locality,
    }

    if (req.body.nome == null){
        
        res.status(400).send("Locality is null");
        return; 

    }
    else{
            
        var sql = "SELECT * FROM coleta WHERE locality LIKE '%" + data.locality + "%'"
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

// pega uma coleta especifica baseada em seu "id_coleta"
collectionMoths_router.get("/collectionMoths_get/:id", auth, (req, res) => {

    var sql = "SELECT * FROM coleta WHERE id_coleta = ?"
    var params = [req.params.id]

    db_mariposa.get(sql, params, (err, rows) => {

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


// pega tudo baseado em "id_main"
collectionMoths_router.get("/collectionMoths_filter_main/:id_main", auth, (req, res) => {

    var sql = "SELECT * FROM collection WHERE id_main = ?"
    var params = [ req.params.id_main ]

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

// pega nome de colunas da tabela coletas
collectionMoths_router.get("/collectionMoths_getColumns", cache(2628288), auth, (req, res) => {

    var sql = "SELECT * FROM collection WHERE id_main = ?"
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
});


// atualiza coleta baseado em seu "id_coleta"
collectionMoths_router.patch("/collectionMoths_update/:id_coleta", auth, (req, res) => {
    
    var data = {
        inst_bar_code: req.body.inst_bar_code,
        genus: req.body.genus, 
        species: req.body.species, 
        author: req.body.author,
        sex: req.body.sex, 
        number_of_spec: req.body.number_of_spec,
        museum_coll: req.body.museum_coll,
        country: req.body.country, 
        province: req.body.province,
        locality: req.body.locality, 
        date: req.body.date,
        collector: req.body.collector, 
        type: req.body.type,
        accession: req.body.accession,
        lat: req.body.lat, 
        lat1: req.body.lat1, 
        lat2: req.body.lat2, 
        lat_hem: req.body.lat_hem, 
        long: req.body.long, 
        long1: req.body.long1, 
        long2: req.body.long2, 
        long_hem: req.body.long_hem,
    }

    // Genus não pode começar em lower case
    const uppercase_start = /[A-Z][a-z]*/
    const lowercase_only = /[a-z]/

    // species não pode começar em upper case
    // genus tem que começar com upper case
    let spec_ok = Boolean(data.species.match(lowercase_only))
    let genus_ok = Boolean(data.genus.match(uppercase_start))

    var sex_ok = 1
    
    // sex tem que ser M ou F
    if(data.sex == "f" || data.sex == "F" || data.sex == "m" || data.sex == "M"){
        sex_ok = 0
    }

    // de resto, não há regras
    if(!spec_ok || !genus_ok || !sex_ok){
        res.status(400).json({"error": res.message})
        return;
    }
    else{    

        db_mariposa.run(
            `UPDATE user set 
                inst_bar_code = COALESCE(?,inst_bar_code), 
                genus = COALESCE(?,genus), 
                species = COALESCE(?,species), 
                author = COALESCE(?,author), 
                sex = COALESCE(?,sex), 
                number_of_spec = COALESCE(?,number_of_spec), 
                museum_coll = COALESCE(?,museum_coll), 
                country = COALESCE(?,country), 
                province = COALESCE(?,province), 
                locality = COALESCE(?,locality), 
                date = COALESCE(?,date), 
                collector = COALESCE(?,collector), 
                type = COALESCE(?,type), 
                accession = COALESCE(?,accession), 
                lat = COALESCE(?,lat), 
                lat1 = COALESCE(?,lat1), 
                lat2 = COALESCE(?,lat2), 
                lat_hem = COALESCE(?,lat_hem), 
                long = COALESCE(?,long), 
                long1 = COALESCE(?,long1), 
                long2 = COALESCE(?,long2), 
                long_hem = COALESCE(?,long_hem), 
                WHERE id_coleta = ?`,
            [data.inst_bar_code, data.genus, data.species, data.author, data.sex, 
                data.number_of_spec, data.museum_coll, data.country, data.province, data.locality,
                data.date, data.collector, data.type, data.accession, data.lat, data.lat1, 
                data.lat2, data.lat_hem, data.long, data.long1, data.long2, data.long_hem, req.params.id_coleta],
            
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

    }
})


// deleta coleta dada sua "id_coleta"
collectionMoths_router.delete("/collectionMoths_/:id", auth, (req, res) => {

    db_mariposa.run(
        'DELETE FROM coleta WHERE id_coleta = ?',

        req.params.id,
        
        function (err, result) {

            if (err){
                res.status(400).json({"error": res.message})
                return;
            }

            res.json({"message":"User deleted!", changes: this.changes})
    
    });

})


// adiciona uma nova coleta
collectionMoths_router.post("/collectionMoths_add/:referencia_main", auth, (req, res) => {

    var data = {
        inst_bar_code: req.body.inst_bar_code,
        genus: req.body.genus, 
        species: req.body.species, 
        author: req.body.author,
        sex: req.body.sex, 
        number_of_spec: req.body.number_of_spec,
        museum_coll: req.body.museum_coll,
        country: req.body.country, 
        province: req.body.province,
        locality: req.body.locality, 
        date: req.body.date,
        collector: req.body.collector, 
        type: req.body.type,
        accession: req.body.accession,
        lat: req.body.lat, 
        lat1: req.body.lat1, 
        lat2: req.body.lat2, 
        lat_hem: req.body.lat_hem, 
        long: req.body.long, 
        long1: req.body.long1, 
        long2: req.body.long2, 
        long_hem: req.body.long_hem,
    }

    if(!data.inst_bar_code){

        res.status(400).send("Inst bar code missing!")
        return; 

    }
    else{

        // create 6 digit id based on name
        const length = 6
        const Opcoes = "123456789"
        const OpcoesLength = 9

        let id_coleta = ' ';

        for ( let i = 0; i < length; i++ ) {
            id_coleta += Opcoes.charAt(Math.floor(Math.random() * OpcoesLength));
        }

        var sql_insert = 'INSERT INTO coleta (inst_bar_code, genus, species, author, sex, number_of_spec, museum_coll, country, province, locality, date, collector, type, accession, lat, lat1, lat2, lat_hem, long, long1, long2, long_hem, id_coleta, referencia_main) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        db_mariposa.run(sql_insert, [data.inst_bar_code, data.genus, data.species, data.author, data.sex, data.number_of_spec, data.museum_coll, data.country, data.province, data.locality, data.date, data.collector, data.type, data.accession, data.lat, data.lat1, data.lat2, data.lat_hem, data.long, data.long1, data.long2, data.long_hem, id_coleta, req.params.referencia_main])

        res.status(200).json({"id_coleta":id_coleta});
        return;

    }

})


module.exports = collectionMoths_router;
