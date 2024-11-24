import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generatetid } from '../helpers/tokens.js';
import { emailAfterRegister, passwordRecoveryEmail } from '../helpers/emails.js';
import { where } from "sequelize";

const formularioLogin = (request, response) => {
    response.render('auth/login', {
        autenticado: false,
        page: "Ingresa a la plataforma",
    });
};


const formularioRegister = (request, response) => {
    response.render('auth/register', {
        page: "Crea una cuenta...",
        csrfToken: request.csrfToken(), // Asegúrate de que se esté generando el token CSRF
        user: { // Inicializa el objeto `user` con valores vacíos
            name: '',
            email: ''
        },
        errors: [] // Asegúrate de inicializar un arreglo de errores vacío
    });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        page: "Recupera tu contraseña",
        csrfToken: request.csrfToken()
    });
};

const resetPassword = async (req, res) => {
    await check('correo_usuario')
        .notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('El correo electrónico no tiene el formato correcto')
        .run(req);

    let result = validationResult(req);

    if (!result.isEmpty()) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu acceso a Bienes Raíces',
            csrfToken: req.csrfToken(),
            errors: result.array()
        });
    }

    const { correo_usuario } = req.body;

    const user = await User.findOne({ where: { email: correo_usuario } });

    if (!user) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu acceso a Bienes Raíces',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Ups, el correo no pertenece a ningún usuario' }]
        });
    }

    user.token = generatetid();
    await user.save();

    passwordRecoveryEmail({
        email: user.email,
        name: user.name,
        token: user.token
    });

    res.render('templates/message', {
        page: 'Restablece tu contraseña',
        msg: 'Hemos enviado un email con las instrucciones para restablecer tu contraseña'
    });
};

const createNewUser = async (req, res) => {
    await check('name').notEmpty().withMessage('El nombre no puede estar vacío').run(req);
    await check('email').isEmail().withMessage('Esto no parece un email').run(req);
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req);
    await check('confirmPassword').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req);
    await check('birth').notEmpty().withMessage("La fecha no puede estar vacía").run(req);

    // Resultados de la validación
    const result = validationResult(req);

    // Validación de que el resultado esté vacío
    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Error al intentar crear la cuenta',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.nombre_usuario, // Asegúrate de usar el nombre correcto aquí
                email: req.body.correo_usuario // Igual para el correo
            }
        });
    }

    const { nombre_usuario: name, correo_usuario: email, pass_usuario: password, fecha_usuario: date } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        return res.render('auth/register', {
            page: 'Error al intentar crear la cuenta de Usuario',
            csrfToken: req.csrfToken(),
            errors: [{ msg: `El usuario ${email} ya se encuentra registrado.` }],
            user: {
                name: req.body.nombre_usuario,
                email: req.body.correo_usuario
            }
        });
    }

    const newUser = await User.create({
        name: req.body.nombre_usuario,
        date: req.body.fecha_usuario,
        email: req.body.correo_usuario,
        password: req.body.pass_usuario,
        token: generatetid()
    });

    emailAfterRegister({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token
    });

    res.render('templates/message', {
        page: 'Cuenta Creada Correctamente',
        message: `Hemos Enviado un Email de Confirmación al correo: ${email} para verificar tu cuenta`
    });
};

const confirm = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ where: { token } });
    if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta...',
            message: 'Hubo un error al confirmar tu cuenta, intenta de nuevo...',
            error: true
        });
    }

    user.token = null; // Limpiar el token
    user.confirmed = true; // Marcar como confirmado
    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Cuenta confirmada',
        message: 'La cuenta se ha confirmado correctamente',
        error: false
    });
};

export { formularioLogin, formularioRegister, createNewUser, confirm, resetPassword, formularioPasswordRecovery };
