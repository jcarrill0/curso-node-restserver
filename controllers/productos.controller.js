const { response } = require('express')
const { Producto } = require('../models')


const obtenerProductos = async (req, res) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({ 
                path: 'usuario', 
                select: 'nombre -_id' 
            }) 
            .populate({ 
                path: 'categoria', 
                select: 'nombre -_id' 
            }) 
            
    ])

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async (req, res) => {
    const { id } = req.params

    const producto = await Producto
                                .findById(id)
                                .populate('usuario','nombre -_id')
                                .populate('categoria','nombre -_id')

    res.json(producto)
}

const crearProducto = async (req, res) => {
    const { estado, usuario, ...body } = req.body

    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if(productoDB) { // si es diferente de null
        return res.status(400).json({
            msg: `El producto ${body.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data)

    // Guardar en DB
    await producto.save()

    res.status(201).json(producto)
}

const actualizarProducto = async (req, res) => {
    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }
    data.usuario = req.usuario._id
 
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

    res.json(producto)
}

const borrarProducto = async (req, res) => {
    const { id } = req.params 

    const ProductoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json(ProductoBorrado)
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    crearProducto
};
