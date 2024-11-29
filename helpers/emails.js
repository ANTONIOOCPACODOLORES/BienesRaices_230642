import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const emailAfterRegister = async (newUserData) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    const { email, name, token } = newUserData;

    await transport.sendMail({

        from: 'bienesraices_230642.com',
        to: email,
        subject: 'Solicitud de actualización de contraseña en BienesRaices.com',
        text: 'Por favor actualiza tu contraseña para ingresar a la plataforma',
        html: `<p>Hola, <span style="color:red">${name}</span>, <br>
        Haz reportado el olvido o perdida de tu contraseña para acceder a tu cuenta de BienesRaices. <br>
        <p>Solo necesitamos confirmes la cuenta que creaste dando click en la siguiente liga: <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}">Confirmar cuenta</a></p><br>
        <p>Actualizar contraseña</p>`,
    });
};








const passwordRecoveryEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    const { email, name, token } = data;

    await transport.sendMail({
        from: 'bienesraices_230642.com',
        to: email,
        subject: 'Recuperación de contraseña - BienesRaices_230369',
        text: 'Sigue las instrucciones para recuperar tu contraseña.',
        html: `<p>Hola, ${name},</p>
        <p>Parece que has solicitado recuperar tu contraseña.</p>
        <p>Sigue este enlace para establecer una nueva contraseña: <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/resetPassword/${token}">Recuperar contraseña</a></p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>`,
    });
};

export { emailAfterRegister, passwordRecoveryEmail };
