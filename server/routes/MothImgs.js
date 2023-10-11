var sqlite3 = require('sqlite3').verbose();
var validator = require('validator');

const express = require('express');
const imageMoths_router = express.Router();

const cache = require('../routeCache');

// Banco de dados
var db_mariposa = require('../database.js')

// Autenticador
const auth = require("../middleware/auth.js");
const jwt = require("jsonwebtoken");

// Upload de imagens
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'fonte_dados_coleta_imagens/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });

// IMAGENS
// ---------------------------------

// pega todas as imagens
imageMoths_router.get("/imageMoths_getAll", cache(2628288), auth, (req, res) => {

    var sql = "SELECT * FROM images"
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

// pega uma imagem baseada em id
imageMoths_router.get("/imageMoths_getSomeFamilia/:id", cache(2628288), auth, (req, res) => {

    var sql = "SELECT * FROM imagens WHERE identificador = ?"
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

// pega imagens baseadas em referencia da main
imageMoths_router.get("/imageMoths_getSomeId/:id", cache(2628288), auth, (req, res) => {

    var sql = "SELECT * FROM images WHERE id_main = ? AND type = 0"
    var params = [req.params.id]

    db_mariposa.all(sql, params, (err, rows) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            //res.send("working fine");
            res.json({
                "data":rows
            })

        }

    });
});

// pega imagens baseadas em id e tipo
imageMoths_router.get("/imageMoths_getSomeId/:id/:type", cache(2628288), auth, (req, res) => {

    var sql = "SELECT * FROM images WHERE id_main = ? AND type = ?"
    var params = [req.params.id, req.params.type]

    db_mariposa.all(sql, params, (err, rows) => {

        if (err) {
            
            res.status(400).json({"error":err.message});
            return;

        }
        else{
            //res.send("working fine");
            res.json({
                "data":rows
            })

        }

    });
});

// pega todas as imagens de um bicho de nome "x"
imageMoths_router.get("/imageMoths_getSomeFamilia/:nome", auth, (req, res) => {

    var sql = "SELECT * FROM imagens WHERE nome LIKE '%" + req.params.nome + "%'"
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

// todas as imagens de uma familia
imageMoths_router.get("/imageMoths_getSomeFamilia/:familia", auth, (req, res) => {

    var sql = "SELECT * FROM imagens WHERE familia_nome = ?"
    var params = [req.params.familia]

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

// todas as imagens de uma familia + subfamilia
imageMoths_router.get("/imageMoths_getSomeSubfamilia/:familia/:sub_familia", auth, (req, res) => {

    var sql = "SELECT * FROM imagens WHERE familia_nome = ? AND sub_familia_nome = ?"
    var params = [req.params.familia, req.params.sub_familia]

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

// Upload nova imagem
imageMoths_router.post("/imageMoths_newImage/", upload.single('foto'), 
    (req, res, next) => {
        
        console.log("Image Uploaded!")

        const token = req.headers["my_token"];

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        } else{
            if(token === "000000"){
                return res.status(403).send("Log in first!");
            }
        }

        try {

            const decoded = jwt.verify(token, 'secret');
            req.user_email = decoded;
            console.log("Valid token!")

        } catch (err) {
            return res.status(401).send("Invalid Token");
        }

        return next();

}, (req, res, next) => {

    // adicionar identificador -> função gera
    // nome -> !usuário passa
    // string arquivo -> (script) nome do arquivo
    // caminho relativo -> (script) path
    // familia_nome -> !usuário passa
    // sub_familia_nome -> !usuário passa

    // identificador_referencia -> buscar equivalencia!
    // tem que passar o nome na tabela main ou o identificador na tabela main

    // identificador_main -> !usuário passa
    // nome_main -> !usuário passa (apenas um é necessário)
    
    var data = {
        nome: req.body.nome,
        string_arquivo : req.file.originalname, 
        caminho_relativo : req.file.path, 
        familia_nome: req.body.familia_nome,
        sub_familia_nome: req.body.sub_familia_nome,
        main_identificador: req.body.main_identificador
    }

    // main_nome ou main_identificador existe?
    // se sim, INSERT
    // se não, erro
    var sql_retrieve = " "
    var params = []
    
    sql_retrieve = "SELECT * from main WHERE identificador = ?"
    var params = [data.main_identificador]

    db_mariposa.get(sql_retrieve, params, (err, rows) => {

        // se passou daqui a entrada na main existe
        if (err) {
            return res.status(400).json({"error":err.message});
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


            var sql_insert = 'INSERT INTO imagens (identificador, nome, string_arquivo, caminho_relativo, familia_nome, sub_familia_nome, identificador_referencia) VALUES (?, ?, ?, ?, ?, ?, ?)'
                
            db_mariposa.run(sql_insert, [identificador, data.nome, data.string_arquivo, data.caminho_relativo, data.familia_nome, data.sub_familia_nome, data.main_identificador])
            
            return res.status(200).send("Upload Ok");

        }
    
    });

});

// Deleta uma certa imagem da main baseado em id
imageMoths_router.delete("delete_img_id/:id", auth, (req, res) => {

    db_mariposa.run(
        'DELETE FROM imagens WHERE identificador = ?',

        req.params.id,
        
        function (err, result) {

            if (err){
                res.status(400).json({"error": res.message})
                return;
            }

            res.json({"message":"Image deleted!", changes: this.changes})
    
    });
})

// Deleta uma certa imagem da main baseado no nome do arquivo
imageMoths_router.delete("delete_img_arquivo/:arquivo", auth, (req, res) => {

    db_mariposa.run(
        'DELETE FROM imagens WHERE string_arquivo = ?',

        req.params.arquivo,
        
        function (err, result) {

            if (err){
                res.status(400).json({"error": res.message})
                return;
            }

            res.json({"message":"Image deleted!", changes: this.changes})
    
    });
})

module.exports = imageMoths_router;