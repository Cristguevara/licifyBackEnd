const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { dbConnection } = require('../db/config')


const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar el email
        dbConnection.query('SELECT * FROM login WHERE email = ? ', [email],  async function (error, results, fields) {
            if (error) {return res.status(500).json({
                ok: false,
                msg: 'Error al validar email en la base de datos'
                });
            };

            const usuario = await results[0]

            if ( usuario ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya existe con ese email'
                });
            }

            const dbUser = req.body

            // Hashear la contraseña
            const salt = bcrypt.genSaltSync();
            dbUser.password = bcrypt.hashSync( password, salt );
            //console.log('dbUser',dbUser)

            dbConnection.query('INSERT INTO login SET ?', dbUser, async function (error, results, fields) {
                if (error) {return res.status(500).json({
                    ok: false,
                    msg: 'Error al validar email en la base de datos'
                    });
                };
                const id = await results.insertId

                // Generar el JWT
                const token = await generarJWT( id, dbUser.email );

                // Generar respuesta exitosa
                return res.status(201).json({
                    ok: true,
                    uid: id,
                    email: dbUser.email,
                    token
                });
            });

        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const loginUsuario = async(req , res = response) => {

    const { email, password } = req.body;

    try {

        dbConnection.query('SELECT * FROM login WHERE email = ? ', [email],  async function (error, results, fields) {
            if (error) {return res.status(500).json({
                ok: false,
                msg: 'Error al validar email en la base de datos'
                });
            };

            const dbUser = await results[0]

            if(  !dbUser ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo no existe'
                });
            }


            // Confirmar si el password hace match
            const validPassword = bcrypt.compareSync( password, dbUser.password );

            if ( !validPassword ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El password no es válido'
                });
            }

            // Generar el JWT
            const token = await generarJWT( dbUser.id, dbUser.email );

            // Respuesta del servicio
            return res.json({
                ok: true,
                uid: dbUser.id,
                email: email,
                token
            });

        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const revalidarToken = async(req, res = response ) => {

    const { uid, email } = req;

    // Generar el JWT
    const token = await generarJWT( uid, email );

    return res.json({
        ok: true,
        uid, 
        email,
        token
    });

}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}