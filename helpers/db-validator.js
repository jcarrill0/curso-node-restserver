
const { Usuario, Role, Categoria, Producto } = require('../models')


const getUser = correo => Usuario.findOne({ correo })

const correoExiste = async (correo = '') => {
    const emailExist = await getUser(correo)
    if(emailExist) {
        throw new Error(`El correo: ${correo}, ya esta registrado.`)
    }
}

const existeUsuarioPorId = async id => {
    const existeUsuario = await Usuario.findById(id)
    if(!existeUsuario || !usuario.estado) {
        throw new Error(`El ID: ${id}, NO existe.`)
    }
}

const esRoleValidado = async (rol = '') => {
    const existeRole = await Role.findOne({ rol })
    if(!existeRole) {
        throw new Error(`El rol: ${rol}, NO es un rol válido`)
    }
}

const usuarioExiste = async (correo = '') => {
    const usuario = await getUser(correo)
    if(!usuario) {
        throw new Error('Usuario / Password no son correctos - correo')
    }
}

const existeCategoriaPorId = async id => {
    const categoria = await Categoria.findById(id)

    if(!categoria || !categoria.estado) {
        throw new Error('La categoría NO existe.')
    }
}

const existeProductoPorId = async id => {
    const producto = await Producto.findById(id)

    if(!producto || !producto.estado) {
        throw new Error('El producto NO existe.')
    }
}

module.exports = {
    esRoleValidado,
    correoExiste,
    existeUsuarioPorId,
    usuarioExiste,
    existeCategoriaPorId,
    existeProductoPorId,
}