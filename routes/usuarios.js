const { Router } = require('express')
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch
} = require('../controllers/usuarios.controller')

const router = Router()

router.get('/', usuariosGet)

router.post('/', usuariosPost)

router.put('/:id', usuariosPut)

router.put('/', usuariosPatch)

router.delete('/', usuariosDelete)

module.exports = router