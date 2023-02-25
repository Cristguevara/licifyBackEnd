const express = require('express');
const cors = require('cors');
const { dbConnection, conn } = require('./db/config');
require('dotenv').config();

// Crear el servidor/aplicación de express
const app = express();

// Base de datos
dbConnection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('DB conected');
});;


// Directorio Público
app.use( express.static('public') );

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );


// Rutas
app.use( '/api/auth', require('./routes/auth') );


app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});

