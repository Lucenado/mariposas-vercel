// Create express app
var express = require("express")
var app = require("./app.js")

// Server port
var HTTP_PORT = 8000 

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

//Default response (Erros!)
app.use(function(req, res){
    res.status(404);
});

app.get('/express_backend', (req, res) => {
    res.send({express: "O BACKEND ESTA CONECTADO AO REACT"})
});