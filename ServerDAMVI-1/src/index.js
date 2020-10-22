const express = require("express");
const bodyParser = require("body-parser");
const app = express()

app.use(bodyParser.urlencoded({extended: false})); //LO QUE HACE ES ENCODAR LA URL, PARA PODER UTILIZAR SIMBOLOS EN ELLA COMO ?¿$·%$
app.use(bodyParser.json());
let jugador={
    nombre:'',
    apellido:'',
    score:''
};
let respuesta={
    error: false,
    codigo:200,
    mensaje:''
};
////////////////////////////////////////////////////
app.get('/', function(req, res){
    respuesta = {
        error: true,
        codigo:200,
        mensaje:'Punto de inicio'
    }
    res.send(respuesta);
})
////////////////////////////////////////////////////
app.post('/gamer', function (req, res) {
    var nom = req.body.nombre || null;
    var cognom = req.body.apellido || null;
    var puntuacio = req.body.score || null;

    if(nom == null|| cognom == null || puntuacio == null) {
        respuesta = {
        error: true,
        codigo: 502,
        mensaje: 'El campo nombre, apellido y score son requeridos'
        };
    } 
    else 
    {
        if(jugador.nombre == nom && jugador.apellido == cognom) 
        {
            respuesta = {
                Codi: 503,
                error: true,
                mensaje: "El jugador ya fue creado previamente"
            };
        } 
        else {
            jugador = {
                nombre: nom,
                apellido: cognom,
                score: puntuacio
            };

            respuesta = {
                codigo: 200,                 
                error: false,                
                mensaje: 'Jugador Creado',   
                respuesta: jugador           
            };
        }
    }
    res.send(respuesta);
});
////////////////////////////////////////////////////
app.get('/Hola', function(req, res){
    res.send('[GET]Saludos desde express');
})
////////////////////////////////////////////////////
app.listen(3000, ()=>{
console.log("El servidor está inicializado en el puerto 3000");
})