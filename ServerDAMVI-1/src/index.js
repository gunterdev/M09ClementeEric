const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apijs = require('./api.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

apijs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

apijs.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});