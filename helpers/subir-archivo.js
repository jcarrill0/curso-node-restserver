const path = require('path')
const { v4: uuidv4 } = require('uuid');


const extValidas = ['png', 'jpg', 'jpeg', 'gif']

const subirArchivo = (files, extensionesValidas = extValidas, carpeta = '') => {

    return new Promise((resolve, reject ) => {
        const { archivo } = files

        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]

        if(!extensionesValidas.includes(extension)) {
            return reject(`La extension .${extension} no es permitida - Extensiones válidas: ${extensionesValidas}`)
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)

        archivo.mv(uploadPath, err => {
            if (err) {
                return reject(err)
            }

            resolve(nombreTemp)
        })
    })
}

module.exports = {
    subirArchivo
};

 

