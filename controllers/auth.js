const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { dbConnection } = require('../db/config')



const loginUser = async(req , res = response) => {

    const { email, password } = req.body;

    try {
        const dbUser = await User.findOne({email})

        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo no registrado.'
            });
        }

        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        const token = await generarJWT( dbUser._id, dbUser.email, dbUser.builder );

        return res.status(200).json({
            ok: true,
            uid: dbUser._id,
            email: email,
            builder: dbUser.builder,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const registerUser = async(req, res = response ) => {

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const dbUser = new User({
        email,
        password : hashedPassword,
        builder   : false,
    })
    const userRegistered = await dbUser.save()
    return res.status(200).json({
        ok: true,
    });

}

const revalidarToken = async(req, res = response ) => {
    const { uid, email, builder } = req;
    const token = await generarJWT( uid, email,builder );
    return res.json({
        ok: true,
        uid, 
        email,
        builder,
        token
    });
}



module.exports = {
    loginUser,
    revalidarToken,
    registerUser
}