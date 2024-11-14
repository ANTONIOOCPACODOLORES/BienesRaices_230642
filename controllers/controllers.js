import { request, response } from "express";
import { Where } from "sequelize/lib/utils";

const formularioLogin = (request, response) =>   {
    response.render("auth/login", {
        page : "Ingresa a la plataforma"
    })
}

const formularioRegister = (request, response) =>  {
    response.render('auth/register', {
        page : "Crea una nueva cuenta..."
        
    })};

const formularioPasswordRecovery = (request, response) =>  {
response.render('auth/passwordRecovery', {
        page : "Recuperación de Contraseña"
 })};

 const createNewUser=async(request,response)=>
 {
    //Validacionde los camposque se reciben del formulario
    await check ('nombre_usuario').notEmpty().withMessage("El nombre del usuario es un campo obligatorio.").createNewUser
    (request)
    await check('email_usuario').notEmpty().withMessage("El correo electronico es un campo obligatorio").isEmail
    ().withMessage("").run(request)
    await check('pass_usuario').notEmpty().withMessage("La contraseña debe ser un campo obligatorio.").isLength
    ({min:8}).withMessage("La contraseña debe ser de al menos 8 caracteres.").run(request)
    await check("Pass2_usuario").equals(request.body.pass_usuario).withMessage("La contraseña y su confirmacion deben de coincidir").run(request) 

    let result  = validationResult(request)

    //verificamos si hay errores de validación
    if(!result.isEmpty())
    {
        return response.render("auth/register",{
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: result.array(),
            user: {
                name: request.body.nombre_usuario, 
                email: request.body.email
            }
        })
    }

    //Desestructurar los parametros del request
    const {nombre_usuario:name, correo_usuario:email, pass_usuario:password}=request.body

    //Verificar que el usuario no existe previamente en la bd
    const existinUser = await User.findOne({Where: {email}})

    console.log(existinUser);

    if (existinUser)
    {
        return response.render("auth/register",{
            page: 'Error al intentar  crear la cuenta de usuario',
            errors: [{msg: `El usuario ${email} ya se encuentra registrado.`}],
            user: {
                name:name
            }
                
        })
    }

    console.log("Registrando a un nuevo usuario.");
    console.log(request.body);


     //Registramos los datos en la base de datos.
     const newUser = await User.create({
        name: request.body.nombre_usuario, 
        email: request.body.correo_usuario,
        password: request.body.pass_usuario,
        }); 
        response.json(newUser); 

    return;

}

export {formularioLogin, formularioRegister, formularioPasswordRecovery}