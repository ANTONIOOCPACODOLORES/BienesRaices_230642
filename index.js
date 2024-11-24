import express from 'express';
import generalRoutes from './Routes/GeneralRoutes.js';
import userRoutes from './Routes/userRouters.js';
import csrf from 'csurf';
import db from './db/config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Cargar las variables de entorno
dotenv.config({ path: '.env' });

// Instanciar nuestra aplicación web
const app = express();

// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Middleware para habilitar cookie-parser
app.use(cookieParser());

// Habilitar CSRF con cookies
app.use(csrf({ cookie: true }));

// Middleware para asignar el token CSRF a las vistas
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Genera y asigna el token CSRF
    next();
});

// Configurar Template Engine - PUG
app.set('view engine', 'pug');
app.set('views', './views');

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

// Routing - Enrutamiento para peticiones
app.use('/', generalRoutes); // Rutas generales
app.use('/auth', userRoutes); // Rutas de autenticación

// Configuración del puerto del servidor
const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});
