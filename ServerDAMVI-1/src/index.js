const express = require("express");
const bodyParser = require("body-parser");
const app = express()


app.use(bodyParser.urlencoded({extended: false})); //LO QUE HACE ES ENCODAR LA URL, PARA PODER UTILIZAR SIMBOLOS EN ELLA COMO ?¿$·%$
app.use(bodyParser.json());

let jugadors = [{
        posicio: "1",
        alies: "jperez",
        nom: "Jose",
        congnom: "Perez",
        score: "1000"
    },
    {
        posicio: "2",
        alies: "jsanz",
        nom: "Juan",
        congnom: "Sanz",
        score: "950"
    },
    {
        posicio: "3",
        alies: "mgutierrez",
        nom: "Maria",
        congnom: "Gutierrez",
        score: "850"
    }];


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
app.get('/Hola', function(req, res){
    res.send('[GET]Saludos desde express');
})
////////////////////////////////////////////////////
app.get('/ranking', function(req, res){
    SortPlayers();
    res.send(jugadors);
})

app.route('/jugador/:user')
    .get(function(req, res){ 
        respuesta.error = false;
        for(var x = 0; x < jugadors.length ; x++)
        {
            if(jugadors[x].alies == req.params.user) 
            {
                res.send(jugadors[x]);
            }
        }
        if(!respuesta.error)
        {
            respuesta = {
                error: true,
                codigo: 504,
                mensaje: "El jugador no existe"
            }
            res.send(respuesta);
        }
    })
    .post(function(req, res){
        var nameOfPlayer = req.body.nom || '';
        var surnameOfPlayer = req.body.congnom || '';
        var scoreOfPlayer = req.body.score || '';
        var nicknameOfPlayer = req.body.alies || '';
        var rankOfPlayer = req.body.posicio || ''; 
        respuesta.error = false;
    
        if(nameOfPlayer == ''|| surnameOfPlayer == '' || parseInt(scoreOfPlayer) <= 0 || nicknameOfPlayer == ''|| rankOfPlayer == '') {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo nombre, apellido y score son requeridos (el valor del score no puede ser negativo)'
            };
        } 
        else if(nicknameOfPlayer != req.params.user) {
            respuesta = {
                error: true,
                codigo: 506,
                mensaje: 'El alias de la URL no es correcto'
            };
        } 
        else 
        {
            for(var x = 0; x < jugadors.length ; x++)
            {
                if(jugadors[x].nom == nameOfPlayer && jugadors[x].congnom == surnameOfPlayer && jugadors[x].alies == nicknameOfPlayer) 
                {
                    respuesta = {
                        Codi: 503,
                        error: true,
                        mensaje: "El jugador ya fue creado previamente"
                    };
                }
            }
            if(!respuesta.error)
            {
                jugadors.push(
                    {
                        posicio: rankOfPlayer,
                        alies: nicknameOfPlayer,
                        nom: nameOfPlayer,
                        congnom: surnameOfPlayer,
                        score: scoreOfPlayer
                    }
                ) 
    
                respuesta = {
                    codigo: 200,                 
                    error: false,                
                    mensaje: 'Jugador Creado',   
                    respuesta: jugadors[jugadors.length - 1]          
                };
            }
        }
        SortPlayers();
        res.send(respuesta); /////LA POSICION SE ENVIARA YA ACTUALIZADA.
    })
    .put(function (req, res) {
        var nameOfPlayer = req.body.nom || '';
        var surnameOfPlayer = req.body.congnom || '';
        var scoreOfPlayer = req.body.score || '';
        var nicknameOfPlayer = req.body.alies || '';
        var rankOfPlayer = req.body.posicio || '';
        var playerFound = false;


        if(nameOfPlayer == '' || surnameOfPlayer == '' || parseInt(scoreOfPlayer) <= 0|| nicknameOfPlayer == ''|| rankOfPlayer == '') {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo nom, cognom, score, alies, posicio son requeridos (el valor del score no puede ser negativo)'
            };
        } 
        else if(nicknameOfPlayer != req.params.user) {
            respuesta = {
                error: true,
                codigo: 504,
                mensaje: 'El jugador no existe'
            };
        } 
        else {
            for(var x = 0; x < jugadors.length ; x++)
            {
                if(jugadors[x].nom == nameOfPlayer && jugadors[x].congnom == surnameOfPlayer && jugadors[x].alies == nicknameOfPlayer) 
                {
                    jugadors[x] = {
                        posicio: rankOfPlayer,
                        alies: nicknameOfPlayer,
                        nom: nameOfPlayer,
                        congnom: surnameOfPlayer,
                        score: scoreOfPlayer
                    };
    
                    respuesta = {
                        error: false,
                        codigo: 505,
                        mensaje: 'jugador actualizado',
                        respuesta: jugadors[x]
                    };
                    playerFound = true;
                }
            }
            if(!playerFound)
            {
                respuesta = {
                    error: true,
                    codigo: 504,
                    mensaje: 'El jugador existe'
                };
            }
        }
        SortPlayers();
        res.send(respuesta);
       })

////////////////////////////////////////////////////
app.listen(3000, ()=>{
console.log("El servidor está inicializado en el puerto 3000");
})

function SortPlayers()
{
    jugadors.sort(function(a, b) { return parseFloat(b.score) - parseFloat(a.score); });
    for(x = 0; x < jugadors.length;x++)
    {
        jugadors[x].posicio = x+1;
    }
}

  