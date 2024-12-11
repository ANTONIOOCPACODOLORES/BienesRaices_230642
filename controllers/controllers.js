import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generatetId } from '../helpers/tokens.js';
import { emailAfterRegister, emailChangePassword } from '../helpers/emails.js';

const formularioLogin = (request, response) => {
    response.render("auth/login", {
        page: "Ingresa a la plataforma",
    });
};

const formularioRegister = (request, response) => {
    response.render('auth/register', {
        page: "Crea una nueva cuenta...",
        csrfToken: request.csrfToken(),
    });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        page: "Recuperación de Contraseña",
        csrfToken: request.csrfToken(),
    });
};

const createNewUser = async (request, response) => {
    // Validación de los campos del formulario
    await check('nombre_usuario').notEmpty().withMessage("El nombre del usuario es obligatorio.").run(request);
    await check('correo_usuario')
        .notEmpty().withMessage("El correo electrónico es obligatorio.")
        .isEmail().withMessage("Formato incorrecto: usuario@dominio.extension").run(request);
    await check('pass_usuario')
        .notEmpty().withMessage("La contraseña es obligatoria.")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres.").run(request);
    await check('pass2_usuario')
        .equals(request.body.pass_usuario).withMessage("Las contraseñas no coinciden.").run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/register", {
            page: 'Error al crear la cuenta',
            errors: result.array(),
            csrfToken: request.csrfToken(),
            user: {
                name: request.body.nombre_usuario,
                email: request.body.correo_usuario,
            },
        });
    }

    const { nombre_usuario: name, correo_usuario: email, pass_usuario: password } = request.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        return response.render("auth/register", {
            page: 'Error al crear la cuenta',
            csrfToken: request.csrfToken(),
            errors: [{ msg: `El usuario ${email} ya está registrado.` }],
            user: { name, email },
        });
    }

    // Crear un nuevo usuario
    const newUser = await User.create({
        name,
        email,
        password,
        token: generatetId(),
    });

    // Enviar correo de confirmación
    try {
        await emailAfterRegister({ name: newUser.name, email: newUser.email, token: newUser.token });

        response.render('templates/message', {
            csrfToken: request.csrfToken(),
            page: 'Cuenta creada satisfactoriamente',
            msg: `Se ha enviado un correo a: ${newUser.email} para confirmar tu cuenta.`,
        });
    } catch (error) {
        console.error("Error al enviar el correo: ", error);

        response.render('templates/message', {
            csrfToken: request.csrfToken(),
            page: 'Error al enviar el correo',
            msg: 'Ocurrió un problema al enviar el correo de confirmación. Intenta nuevamente más tarde.',
        });
    }
};

const confirm = async (request, response) => {
    const { token } = request.params;

    const userWithToken = await User.findOne({ where: { token } });

    if (!userWithToken) {
        return response.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta',
            msg: 'El token no es válido o ya fue utilizado.',
            error: true,
        });
    }

    userWithToken.token = null;
    userWithToken.confirmed = true;
    await userWithToken.save();

    response.render('auth/confirmAccount', {
        page: 'Cuenta confirmada',
        msg: 'Tu cuenta ha sido confirmada exitosamente.',
        error: false,
    });
};

const passwordReset = async (request, response) => {
    await check('correo_usuario')
        .notEmpty().withMessage("El correo electrónico es obligatorio.")
        .isEmail().withMessage("Formato incorrecto: usuario@dominio.extension").run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/passwordRecovery", {
            page: 'Error al solicitar el cambio de contraseña',
            errors: result.array(),
            csrfToken: request.csrfToken(),
        });
    }

    const { correo_usuario: email } = request.body;
    const existingUser = await User.findOne({ where: { email, confirmed: true } });

    if (!existingUser) {
        return response.render("auth/passwordRecovery", {
            page: 'Error',
            csrfToken: request.csrfToken(),
            errors: [{ msg: 'No existe una cuenta confirmada con este correo.' }],
        });
    }

    existingUser.token = generatetId();
    existingUser.password=" ";
    await existingUser.save();

    await emailChangePassword({ name: existingUser.name, email: existingUser.email, token: existingUser.token });

    response.render('templates/message', {
        csrfToken: request.csrfToken(),
        page: 'Solicitud aceptada',
        msg: `Se ha enviado un correo a: ${email} para restablecer tu contraseña.`,
    });
};

const verifyTokenPasswordChange = async (request, response) => {
    const { token } = request.params;
    const userTokenOwner = await User.findOne({ where: { token } });

    if (!userTokenOwner) {
        return response.render('templates/message', {
            csrfToken: request.csrfToken(),
            page: 'Error',
            msg: 'El token no es válido o ha expirado.',
        });
    }

    response.render('auth/reset-password', {
        csrfToken: request.csrfToken(),
        page: 'Restablece tu contraseña',
    });
};

const updatePassword = async (request, response) => {
    const { token } = request.params;

    const userTokenOwner = await User.findOne({ where: { token } });

    if (!userTokenOwner) {
        return response.render("auth/reset-password", {
            page: 'Error',
            errors: [{ msg: 'Token inválido o expirado' }],
            csrfToken: request.csrfToken(),
        });
    }

    await check('new_password')
        .notEmpty().withMessage("La contraseña es obligatoria.")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres.").run(request);
    await check('confirm_new_password')
        .equals(request.body.new_password).withMessage("Las contraseñas no coinciden.").run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/reset-password", {
            page: 'Error al restablecer la contraseña',
            errors: result.array(),
            csrfToken: request.csrfToken(),
        });
    }

    userTokenOwner.password = request.body.new_password;
    userTokenOwner.token = null;
    await userTokenOwner.save();

    response.render('auth/accountConfirmed', {
        page: 'Contraseña actualizada',
        msg: 'Tu contraseña ha sido actualizada exitosamente.',
        error: false,
    });
};

export {
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery,
    createNewUser,
    confirm,
    passwordReset,
    verifyTokenPasswordChange,
    updatePassword,
};
