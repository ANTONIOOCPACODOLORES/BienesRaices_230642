import express from 'express';
import { formularioLogin, formularioRegister, formularioPasswordRecovery } from '../controllers/controllers.js';

const router = express.Router();

// GET - Lectura de datos e información del servidor al cliente
// EndPoints: Rutas para acceder a las secciones o funciones de la aplicación web
router.get("/findByID/:id", (req, res) => {
    res.send(`Se está solicitando buscar al usuario con ID: ${req.params.id}`);
});

// POST - Envío de datos e información del cliente al servidor
router.post("/newUser/:name/:email/:password", (req, res) => {
    res.send(`Se ha solicitado la creación de un nuevo usuario de nombre: ${req.params.name}, asociado al correo electrónico: ${req.params.email}, con la contraseña: ${req.params.password}`);
});

// PUT - Actualización total de información del cliente al servidor
router.put("/replaceUserByEmail/:name/:email/:password", (req, res) => {
    res.send(`Se ha solicitado el reemplazo de toda la información del usuario: ${req.params.name}, con correo: ${req.params.email}, y contraseña: ${req.params.password}`);
});

// PATCH - Actualización parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", (req, res) => {
    const { email, newPassword, newPasswordConfirm } = req.params; // Desestructuración de parámetros

    if (newPassword === newPasswordConfirm) {
        res.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}. Se aceptan los cambios ya que la contraseña y confirmación son la misma.`);
    } else {
        res.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`);
    }
});

// DELETE - Eliminación de recursos
router.delete("/deleteUser/:email", (req, res) => {
    res.send(`Se ha solicitado la eliminación del usuario asociado al correo: ${req.params.email}`);
});

// Rutas de autenticación
router.get("/login", formularioLogin);
router.get("/createAccount", formularioRegister);
router.get("/passwordRecovery", formularioPasswordRecovery);

export default router;
