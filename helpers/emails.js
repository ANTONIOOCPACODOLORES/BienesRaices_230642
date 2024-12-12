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
    await transport.sendMail({
      from: 'bienesraices_230642.com',
      to: email,
      subject: 'Bienvenido/a al BienesRaices_230642',
      text: 'Ya casi puedes usar nuestra plataforma, solo falta...',
      html: `
        <p>Hola, <span style="color: red">${name}</span>,<br>
        Bienvenido a la plataforma de BienesRaíces, el sitio seguro donde podrás buscar, comprar y ofertar propiedades a través de internet.<br>
        <p>Ya solo necesitamos confirmes la cuenta que creaste, dando click a la siguiente liga:
        <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}">Confirmar cuenta</a></p><br>
        <p>Si tú no has creado la cuenta, ignora este mensaje.</p>
      `,
    });
    console.log('Correo de bienvenida enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
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
    await transport.sendMail({
      from: 'bienesraices_230642.com',
      to: email,
      subject: 'Restablece tu contraseña en BienesRaices_230642',
      text: 'Solicitud de restablecimiento de contraseña',
      html: `
        <p>Hola, <span style="color: red">${name}</span>,<br>
        Has solicitado restablecer tu contraseña. Para continuar, haz clic en el siguiente enlace:<br>
        <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery/${token}">Restablecer contraseña</a></p><br>
        <p>Si tú no has solicitado este cambio, ignora este mensaje.</p>
      `,
    });
    console.log('Correo de restablecimiento de contraseña enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export { emailAfterRegister, emailChangePassword };
