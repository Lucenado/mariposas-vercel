// Testes
// http://localhost:8000/testes/

const express = require('express')
const testes_router = express.Router()

// Autenticador
const auth = require("../middleware/auth.js");

// Testes
// ---------------------------------

// Autenticação funcionando! Nesse endereço, se vc está autenticado, recebe um ok!
testes_router.post("/welcome_test", auth, (req, res) => {

    res.status(200).send("Autenticação básica funcionando!");

});

// Funcionando! Na root, retorna um ok!
testes_router.get("/", (req, res, next) => {
    
    res.status(200).send("Ok, a API está rodando olha!")

});

module.exports = testes_router; 
