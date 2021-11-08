
const authController = require('./auth.controller')
const categoriasController = require('./categorias.controller')
const productosController = require('./productos.controller')
const usuariosController = require('./usuarios.controller')

module.exports = {
    ...authController,
    ...categoriasController,
    ...productosController,
    ...usuariosController
};
