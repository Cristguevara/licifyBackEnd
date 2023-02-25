const mysql      = require('mysql');

var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'prueba1'
  });

module.exports = {
    dbConnection
}