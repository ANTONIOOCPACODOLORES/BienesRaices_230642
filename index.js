// Ejemplo de activación de HOT RELOAD
/*console.log("Hola desde NodeJS, esto esta en hot reload")*/

/*const express = require('express'); */
import express from 'express';
import generalRoutes from './Routes/GeneralRoutes.js'
import userRoutes from './Routes/userRouters.js'
import db from './db/config.js'

const app = express()

// Configurar Templeate Engine - Habilitamos PUG
app.set('view engine', 'pug')
app.set('views','./views')

// Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));

// Conexión a la base de datos
try {
    await db.authenticate();
    console.log('Conexión correcta a la base de datos')
} catch (error) {
    console.log(error)
}

// Configuramos nuestro servidor web
const port = 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
})

// Routing - Enrutamiento para peticiones
app.use('/', generalRoutes);
app.use('/auth', userRoutes);
