import { request, response } from 'express'
import {check, validationResult } from 'express-validator';
import User from '../models/User.js'
import {generatetid} from '../helpers/tokens.js'
import {emailAfterRegister} from '../helpers/emails.js'

const formularioLogin= (request, response) =>{
    response.render('auth/login',{
        autenticado: false,
        page: "Ingresa a la plataforma"
    })
}

const formularioRegister= (request, response) =>{
    response.render('auth/register',{
        page: "Crea una cuenta..."
    })
}

const createNewUser = async (req, res) =>{
    


    await check('nombre_usuario').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
    await check('correo_usuario').notEmpty().withMessage('El correo electrónico es un campo obligatorio').isEmail().withMessage('No es un email correcto').run(req)
    await check('pass_usuario').notEmpty().withMessage('La contraseña es un campo obligatorio').isLength({min:8}).withMessage('La contraseña debería tener al menos 8 carácteres').run(req)
    await check('pass2_usuario').equals(req.body.pass_usuario).withMessage('La contraseña no coinciden').run(req)


    let result= validationResult(req)

    //return res.json
    //validación que el resultado este vacío
    if(!result.isEmpty()){
        return res.render('auth/register',{
            page: 'Error al intentar crear la cuenta',
            errors: result.array(),
            user:{
                name: req.body.nombre_usuario,
                email: req.correo_usuario
            }
            
        })
    }


    //Desestructurar los parametros del request
    const {nombre_usuario: name, correo_usuario:email, pass_usuario:password}= req.body

    //Verificar que el usuario no existe previamente en la bd
    const existingUser= await User.findOne({where: {email}})

    console.log(existingUser);

    //este error no lo encuentra el express.validator, sino nosotros mismos con la base de datos
    if(existingUser){
        return res.render("auth/register", {
            page: 'Error al intentar crear la cuenta de Usuario',
            errors: [{msg: `El usuario ${email} ya se encuentra registrando.`}],
            user:{
                name:name
            }
        })
    }


    /*console.log("Registrando a nuevo usuario");
    console.log(req.body);*/
    const newUser= await User.create({
        name: req.body.nombre_usuario,
        email: req.body.correo_usuario,
        password: req.body.pass_usuario,
        token: generatetid()
    });
    //response.json(newUser);


    //Enviar el correo de confirmación

    emailAfterRegister({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token
    })
    
    
    res.render('templates/message',{
        page: 'Cuenta Creada Correctamente',
        message: `Hemos Enviado un Email de Confirmación al correo: ${email} para verificar tu cuenta`
    })

    //res.json(newUser);
    //return;
}

//función de comprobación de cuenta
const confirm=(req, res)=>{
    
    //validarToken = Si existe
    //Confirmar cuenta 
    //Enviar mensaje
    const {token} = req.params
    console.log("Error")
    console.log(`Intentando confirmar la cuenta con el token: ${token}` )
}




const formularioPasswordRecovery= (request, response) =>{
    response.render('auth/passwordRecovery',{
        page: "Recupera tu contraseña"
    })
}

export {formularioLogin, formularioRegister, createNewUser, confirm, formularioPasswordRecovery}