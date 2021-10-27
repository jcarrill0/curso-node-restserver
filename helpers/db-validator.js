const Role = require('../models/Role')
const Usuario = require('../models/Usuario')


const getUser = correo => Usuario.findOne({ correo })

const correoExiste = async (correo = '') => {
    const emailExist = await getUser(correo)
    if(emailExist) {
        throw new Error(`El correo: ${correo}, ya esta registrado.`)
    }
}

const existeUsuarioPorId = async id => {
    const existeUsuario = await Usuario.findById(id)
    if(!existeUsuario) {
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

module.exports = {
    esRoleValidado,
    correoExiste,
    existeUsuarioPorId,
    usuarioExiste
}