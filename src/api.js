const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let code100 = { code: 100, error: false, message: '2-DAMVI Server Up' };
let code200 = { code: 200, error: false, message: 'Player Exists' };
let code201 = { code: 201, error: false, message: 'Player Correctly Created' };
let code202 = { code: 201, error: false, message: 'Player Correctly Updated' };
let codeError502 = { code: 503, error: true, message: 'The field: name, surname, score are mandatories (the score value has to be >0)' };
let codeError503 = { code: 503, error: true, message: 'Error: Player Exists' };
let codeError504 = { code: 504, error: true, message: 'Error: Player not found' };

var players = [
    { position: "1", alias: "jperez", name: "Jose", surname: "Perez", score: 1000, created: "2020-11-03T15:20:21.377Z"},
    { position: "2", alias: "jsanz", name: "Juan", surname: "Sanz", score: 950, created: "2020-11-03T15:20:21.377Z" },
    { position: "3", alias: "mgutierrez", name: "Maria", surname: "Gutierrez", score: 850, created: "2020-11-03T15:20:21.377Z" }
];

function UpdateRanking() {
    //Order the ranking
    players.sort((a, b) => (a.score <= b.score) ? 1 : -1);

    //Position Update
    for (x = 0; x < players.length; x++) {
        players[x].position = x + 1;
    }
};

app.get('/', function (req, res) {
    //code funciona ok
    res.send(code100);
});

app.get('/ranking', function (req, res) {
    let ranking = { namebreplayers: players.length, players: players };
    res.send(ranking);
});

app.get('/players/:alias', function (req, res) {
    //Player Search
    var index = players.findIndex(j => j.alias === req.params.alias);

    if (index >= 0) {
        //Player exists
        response = code200;
        response.jugador = players[index];
    } else {
        //Player doesn't exists
        response = codeError504;
    }
    res.send(response);
});

app.post('/players/:alias', function (req, res) {
    var paramAlias = req.params.alias || '';
    var paramName = req.body.name || '';
    var paramSurname = req.body.surname || '';
    var paramScore = req.body.score || '';

    if (paramAlias === '' || paramName === '' || paramSurname === '' || parseInt(paramScore) <= 0 || paramScore === '') {
        response = codeError502;
    } else {
        //Player Search
        var index = players.findIndex(j => j.alias === paramAlias)

        if (index != -1) {
            //Player allready exists
            response = codeError503;
        } else {
            //Add Player
            players.push({
                position: '',
                alias: paramAlias,
                name: paramName,
                surname: paramSurname,
                score: paramScore ,
                created: new Date()
            });
            //Sort the ranking
            UpdateRanking();
            //Search Player Again
            index = players.findIndex(j => j.alias === paramAlias);
            //Response return
            response = code201;
            response.player = players[index];
        }
    }
    res.send(response);
});

app.put('/players/:alias', function (req, res) {
    var paramalias = req.params.alias || '';
    var paramname = req.body.name || '';
    var paramsurname = req.body.surname || '';
    var paramScore = req.body.score || '';

    if (paramalias === '' || paramname === '' || paramsurname === '' || parseInt(paramScore) <= 0 || paramScore === '') {
        response = codeError502; //Paràmetres incomplerts
    } else {
        //Player Search
        var index = players.findIndex(j => j.alias === paramalias)

        if (index != -1) {
            //Update Player
            players[index] = {
                position: '',
                alias: paramalias,
                name: paramname,
                surname: paramsurname,
                score: paramScore,
                created:  players[index].created,
                updated: new Date()
            };
            //Sort the ranking
            UpdateRanking();
            //Search Player Again
            index = players.findIndex(j => j.alias === paramalias);
            //Response return
            response = code202;
            response.jugador = players[index];
        } else {
            response = codeError504;
        }
    }
    res.send(response);
});

module.exports = app;