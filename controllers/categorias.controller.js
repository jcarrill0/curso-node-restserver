const { response } = require('express')
const { Categoria } = require('../models')


// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({ 
                path: 'usuario', 
                select: 'nombre -_id' 
            }) 
    ])

    res.json({
        total,
        categorias

    })
}

// obtenerCategoria - populate - return {}
const obtenerCategoria = async (req, res) => {
    const { id } = req.params

    const categoria = await Categoria
                                .findById(id)
                                .populate('usuario','nombre -_id')

    res.json(categoria)
}

// crearCategoria - private
const crearCategoria = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({ nombre })

    if(categoriaDB) { // si es diferente de null
        return res.status(400).json({
            msg: `La categoría ${nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    // Guardar en DB
    await categoria.save()

    res.status(201).json(categoria)
}

// actualizarCategoria - param(nombre)
const actualizarCategoria = async (req, res) => {
    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id
 
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

    res.json(categoria)
}

// borrarCategoria - estado: false
const borrarCategoria = async (req, res) => {
    const { id } = req.params 

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json(categoriaBorrada)
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
    crearCategoria
};
