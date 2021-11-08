const { Router } = require('express')
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router()


// Obtener todos los Productos - publico
router.get('/', obtenerProductos)

// Obtener una Producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)


router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('categoria', 'El ID brindado para la categoría no es válido').isMongoId(), 
    check('categoria').custom(existeCategoriaPorId),
    check('precio', 'El precio debe ser un número').not().isString(),
    check('precio', 'El precio no puede ser un valor negativo').isFloat({ min: 0}),
    validarCampos
], crearProducto)

// Actulizar una Productos - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    // check('categoria', 'El ID brindado para la categoría no es válido').isMongoId(),
    // check('categoria').custom(existeCategoriaPorId),
    check('precio', 'El precio debe ser un número').not().isString(),
    validarCampos,
    check('precio', 'El precio no puede ser un valor negativo').isFloat({ min: 0}),
    validarCampos,
], actualizarProducto)

// Eliminar una Productos - privado - cualquier persona con un token válido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

module.exports = router
