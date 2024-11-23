// Ejemplo de activación de HOT RELOAD
/*console.log("Hola desde NodeJS, esto esta en hot reload")*/

/*const express = require('express'); */
import express from 'express';
import generalRoutes from './Routes/GeneralRoutes.js'
import userRoutes from './Routes/userRouters.js'
import db from './db/config.js'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

//const express= require(`express`); //declaración de objeto que permite entrar al protocolo http y leer páginas
//importar la libreria para crear un servidos web

//Instanciar nuestra aplicación web
const app = express()

// Habilitar la lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configurar Templeate Engine - Habilitamos PUG
app.set('view engine', 'pug')
app.set('views', './views')

// Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));

// Conexión a la base de datos
try {
    await db.authenticate(); // Verifica las credenciales del usuario
    await db.sync(); // Sincroniza las tablas con los modelos
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    console.error('Detalles:', error);
}

// Configuramos nuestro servidor web
const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
})

// Routing - Enrutamiento para peticiones
app.use('/', generalRoutes);
app.use('/auth', userRoutes);
