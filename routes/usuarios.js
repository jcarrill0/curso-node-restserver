const { Router } = require('express')
const { check } = require('express-validator')

const { correoExiste, esRoleValidado, existeUsuarioPorId } = require('../helpers/db-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch
} = require('../controllers/usuarios.controller')




const router = Router()

router.get('/', usuariosGet)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').trim().normalizeEmail().isEmail().bail(),
    check('correo').custom(correoExiste),
    check('role').custom(esRoleValidado),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuariosPost)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom(esRoleValidado),
    validarCampos
], usuariosPut)

router.put('/', usuariosPatch)

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)

module.exports = router