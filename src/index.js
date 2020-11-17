const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apijs = require('./api.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port= process.env.PORT || 3000;
apijs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

apijs.listen(port, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});