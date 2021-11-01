const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')


const login = async (req, res) => {

    const { correo, password } = req.body

    try {
        const usuario = await Usuario.findOne({ correo })

        // Si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            })
        }

        //Generar el JWT 
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignin = async (req, res) => {

    const  { id_token } = req.body

    try {
        const { nombre, correo, img } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if(!usuario) {
            /// Tengo que crearlo
            const data = {  
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        // Si el usuario en DB no existe
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT 
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token de google no es válido'
        })
    }
}

module.exports = {
    login,
    googleSignin
}