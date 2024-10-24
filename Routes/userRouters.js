import { Router } from "express";
const Router=express.Router();
//GET- Se Utiliza para la lectura de datos e información del servidor al cliente
//EndPoints- son las rutas para acceder a las secciones o funciones de nuestra aplicación web
//2 Componentes de una petición ruta (a donde voy), función callback (que hago)
//":" en una ruta definen de manera posicional los parametros de entrada
Router.get("/finByID/:id",function(request,response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`);
})
//POST- se utiliza para el envío de datos e información del cliente al servidor
Router.post("/newUser/: name/: email/: password",function(req,res){
    res.send(`Se ha solisitado la creación de un nuevo usuario de nombre: ${req.params.name},
        asociado al correo electronico: ${req.params.email} con la contraseña: ${req.params.password}`)
})
//PUT- se utiliza para la actualización total de información del cliente al servidor
Router.put("/replaceUserByEmail/:name/:email/:password",function(a,b){
    b.send(`Se ha solicitado el remplazo de toda la información del usuario: ${a.params.name},
        con correo: ${a.params.email} y contraseña: ${a.params.password}`)
})


//PATCH- se utiliza para la actualización parcial
Router.patch("/updatePassword/: email/: newPassword/:newPasswordConfirm",function(request,
    response){
const {email,newPassword,newPasswordConfirm}=request.params//Destruturación de un objeto
if(newPassword===newPasswordConfirm){
    response.send(`Se ha solicitado el actualización de contraseña del usuario con correo: ${email}, se aceptan los cambios ya que la contraseña y confirmación son la misma.`)
    console.log(newPassword);
    console.log(newPasswordConfirm);
}else{
response.send(`Se ha solicitado el actualización de la contraseña del usuario con correo: ${email}, con la nueva contraseña: ${newPassword}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`)
console.log(newPassword);
console.log(newPasswordConfirm);
}
})
//Delete Eliminar
Router.delete("/deleteUser/:email",function(request,response){
    response.send(`Se ha solicitado la eliminación `)
})


