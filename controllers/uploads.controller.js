const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { subirArchivo } = require("../helpers")

const { Usuario, Producto} = require('../models')
const { patch } = require('../routes/auth')
 

const cargarArchivo = async (req, res) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'img')

        res.json({ nombre })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagen = async (req, res) => {

    try {
        const { id , coleccion } = req.params
        let modelo;

        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if(!modelo || !modelo.estado) {
                    return res.status(400).json({
                        msg: `No existe el usuario con el ID ${id}`
                    })
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id)
                if(!modelo || !modelo.estado) {
                    return res.status(400).json({
                        msg: `No existe el producto con el ID ${id}`
                    })
                }
                break;
            default:
                return res.status(500).json({
                    msg: 'Se me olvidó validar esto'
                })
        }

        // Limpiar imágenes previas
        // verificamos si existe una imagen
        if(modelo.img) {
            const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if(fs.existsSync( pathImg )) {
                fs.unlinkSync(pathImg)
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombre

        await modelo.save()

        res.json({ modelo })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagenCloudinary = async (req, res) => {

    try {
        const { id , coleccion } = req.params
        let modelo;

        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if(!modelo || !modelo.estado) {
                    return res.status(400).json({
                        msg: `No existe el usuario con el ID ${id}`
                    })
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id)
                if(!modelo || !modelo.estado) {
                    return res.status(400).json({
                        msg: `No existe el producto con el ID ${id}`
                    })
                }
                break;
            default:
                return res.status(500).json({
                    msg: 'Se me olvidó validar esto'
                })
        }

        // Limpiar imágenes previas
        // verificamos si existe una imagen
        if(modelo.img) {
            const nombreArr = modelo.img.split('/')
            const nombre = nombreArr[nombreArr.length - 1]
            const [ public_id ] = nombre.split('.')
            cloudinary.uploader.destroy( public_id )
        }

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
        modelo.img = secure_url

        await modelo.save()

        res.json(modelo)
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const mostrarImagen = async (req, res) => {
    
    try {
        const { id , coleccion } = req.params
        let modelo;

        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if(!modelo || !modelo.estado) {
                    return res.status(400).json({
                        msg: `No existe el usuario con el ID ${id}`
                    })
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id)
                if(!modelo || !modelo.estado) {
                    return res.status(400).json({
                        msg: `No existe el producto con el ID ${id}`
                    })
                }
                break;
            default:
                return res.status(500).json({
                    msg: 'Se me olvidó validar esto'
                })
        }

        // Limpiar imágenes previas
        let pathImg;

        // verificamos si existe una imagen
        if(modelo.img) {
            pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if(fs.existsSync( pathImg )) {
                return res.sendFile( pathImg )  
            }
        }
        pathImg = path.join(__dirname, '../assets/no-image.jpg')
        res.sendFile( pathImg )
    } catch (msg) {
        res.status(400).json({ msg })
    }
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary 
}

