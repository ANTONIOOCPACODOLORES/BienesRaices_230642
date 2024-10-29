import express from 'express';

const router = express.Router();

// GET - Para obtener datos del servidor al cliente
router.get("/busquedaPorID/:id", function (request, response) {
    response.send(`Se está solicitando buscar al usuario con ID: ${request.params.id}`);
});

// POST - Para enviar datos del cliente al servidor
router.post("/newUser/:name/:email/:password", function(req, res) {
    res.send(`Se ha solicitado la creación de un nuevo usuario de nombre: ${req.params.name}, asociado al correo electrónico: ${req.params.email} con la contraseña: ${req.params.password}`);
});

// PUT - Para actualización completa de la información del cliente al servidor
router.put("/replaceUserByEmail/:name/:email/:password", function(a, b) {
    b.send(`Se ha solicitado el reemplazo de toda la información del usuario ${a.params.name}, con correo: ${a.params.email} y contraseña: ${a.params.password}`);
});

// PATCH - Para actualización parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(request, response) {
    const { email, newPassword, newPasswordConfirm } = request.params;

    if (newPassword === newPasswordConfirm) {
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}. Los cambios se aceptan, ya que la contraseña y confirmación coinciden.`);
        console.log(newPassword);
        console.log(newPasswordConfirm);
    } else {
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email} con la nueva contraseña ${newPassword}, pero se rechaza el cambio ya que la nueva contraseña y su confirmación no coinciden.`);
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
});

// DELETE - Para eliminar datos del cliente al servidor
router.delete("/deleteUser/:email", function(request, response) {
    response.send(`Se ha solicitado la eliminación del usuario asociado al correo: ${request.params.email}`);
});
export default router;