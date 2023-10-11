var express = require("express")

// rotas, API
var app = express()

const cors = require("cors")
app.use(cors({
    origin: "*",
    //methods: ["GET", "POST"],
}))

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API endpoints

// Testes
// ---------------------------------

const testesRoute = require('./routespg/Tests.js')
app.use("/testes", testesRoute)

// Lidando com usuários!
// ---------------------------------

const usuariosRoute = require('./routespg/Usuarios.js')
app.use("/users", usuariosRoute)

// Lidando com Mariposas!
// ---------------------------------

// main
const mainMothsRoute = require('./routespg/MainMoths.js')
app.use("/MainMoths", mainMothsRoute)

// imagens
const imageMothsRoute = require('./routespg/MothImgs.js')
app.use("/MothImgs", imageMothsRoute)

// Lidando com coletas de Mariposas!
// ---------------------------------

const collectionMothsRoute = require('./routespg/MothCollection.js')
app.use("/MothCollection", collectionMothsRoute)

// Referencias
const refMothsRoute = require('./routespg/MothRefs.js')
app.use("/MothRefs", refMothsRoute)



module.exports = app