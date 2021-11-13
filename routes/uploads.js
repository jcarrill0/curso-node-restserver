const { Router } = require('express')
const { check } = require('express-validator')

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller')
const { coleccionesPermitidas } = require('../helpers')
const { validarArchivoSubir, validarCampos } = require('../middlewares')


const router = Router()

router.post('/', validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El ID debe de ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)
// ], actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El ID debe de ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)
// ], mostrarImagen)


module.exports = router