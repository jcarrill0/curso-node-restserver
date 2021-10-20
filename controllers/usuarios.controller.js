const { response } = require('express')


const usuariosGet = (req, res = response) => {

    const { q, nombre, apikey } = req.query

    res.json({
        msg: 'get API',
        q,
        nombre,
        apikey
    })
}
const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body

    res.json({
        msg: 'post API',
        nombre,
        edad
    })
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params

    res.json({
        msg: 'put API',
        id
    })
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch API'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}