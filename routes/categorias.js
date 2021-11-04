const { Router } = require('express')
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria } = require('../controllers/categorias.controller');
const { existeCategoria } = require('../helpers/db-validator');

const { validarJWT, validarCampos } = require('../middlewares');

const router = Router()


// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id - publico
// crear un middleware de validar ID - [check('id').custom(existeCategoria)]
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria)

// Agregar una categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actulizar una categoria - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

// Eliminar una categoria - privado - cualquier persona con un token válido
router.delete('/:id', (req, res) => {
    res.json('delete')
})






module.exports = router
