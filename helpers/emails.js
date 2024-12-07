import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const emailAfterRegister = async (newUserData) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, name, token } = newUserData;

    try {
        // Email de bienvenida
        await transport.sendMail({
            from: 'bienesraices_230642.com',
            to: email,
            subject: 'Bienvenido/a al BienesRaices_230642',
            text: 'Ya casi puedes usar nuestra plataforma, solo falta...',
            html: `
                <p> Hola, <span style="color: red">${name}</span>,<br>
                Bienvenido a la plataforma de BienesRaíces, el sitio seguro donde podrás buscar, comprar y ofertar propiedades a través de internet.<br>
                <p>Ya solo necesitamos confirmes la cuenta que creaste, dando click a la siguiente liga: 
                <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}">Confirmar cuenta</a></p><br>
                <p>Si tú no has creado la cuenta, ignora este mensaje.</p>
            `,
        });

        // Email de actualización de contraseña
        await transport.sendMail({
            from: 'bienesraices_230642.com',
            to: email,
            subject: 'Solicitud de actualización de contraseña en BienesRaices.com',
            text: 'Por favor actualiza tu contraseña para ingresar a la plataforma',
            html: `
                <p>Hola, <span style="color: red">${name}</span>,<br>
                Has reportado el olvido o pérdida de tu contraseña para acceder a tu cuenta de BienesRaices.<br>
                <p>Solo necesitamos que confirmes tu cuenta dando click en la siguiente liga: 
                <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}">Confirmar cuenta</a></p><br>
                <p>Actualizar contraseña</p>
            `,
        });
    } catch (error) {
        console.error('Error al enviar los correos:', error);
    }
};

const emailChangePassword = async (userData) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, name, token } = userData;

    try {
        // Email de recuperación de contraseña
        await transport.sendMail({
            from: 'bienesraices_230642.com',
            to: email,
            subject: 'Solicitud de actualización en contraseña - BienesRaices_230369',
            text: 'Sigue las instrucciones para actualizar tu contraseña.',
            html: `
                <p>Hola, <span style="color: red">${name}</span>,</p>
                <p>Parece que has solicitado recuperar tu contraseña.</p>
                <p>Sigue este enlace para establecer una nueva contraseña: 
                <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery/${token}">Recuperar contraseña</a></p>
                <p>Si no solicitaste este cambio, ignora este correo.</p>
            `,
        });
    } catch (error) {
        console.error('Error al enviar el correo de recuperación de contraseña:', error);
    }
};

export { emailAfterRegister, emailChangePassword };
