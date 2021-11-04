const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/Usuario')


const usuariosGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({ 
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, role } = req.body
    const usuario = new Usuario({ nombre, correo, password, role })

    // Encriptar el pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar DB
    await usuario.save( )

    res.json(usuario)
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body

    if(password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario)
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json(usuario)
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch API'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}