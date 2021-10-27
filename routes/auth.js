const { Router } = require('express')
const { check } = require('express-validator')

const { login } = require('../controllers/auth.controller')
const { usuarioExiste } = require('../helpers/db-validator')
const { validarCampos } = require('../middlewares/validar-campos')


const router = Router()

router.post('/login', [
    check('correo', 'El correo es obligatorio').trim().normalizeEmail().isEmail(),
    check('correo').custom(usuarioExiste),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login)

module.exports = router