import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const emailAfterRegister = async (newUserData) => {
  // Configura el transporte con las credenciales de Mailtrap
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // sandbox.smtp.mailtrap.io
    port: process.env.EMAIL_PORT, // 2525
    auth: {
      user: process.env.EMAIL_USER, // tu usuario de Mailtrap
      pass: process.env.EMAIL_PASS, // tu contraseña de Mailtrap
    },
  });

  const { email, name, token } = newUserData;

  try {
    // Email de bienvenida
    await transport.sendMail({
      from: 'bienesraices_230642.com', // Remitente
      to: email, // Destinatario
      subject: 'Bienvenido/a al BienesRaices_230642', // Asunto
      text: 'Ya casi puedes usar nuestra plataforma, solo falta...', // Cuerpo en texto plano
      html: `
        <p>Hola, <span style="color: red">${name}</span>,<br>
        Bienvenido a la plataforma de BienesRaíces, el sitio seguro donde podrás buscar, comprar y ofertar propiedades a través de internet.<br>
        <p>Ya solo necesitamos confirmes la cuenta que creaste, dando click a la siguiente liga:
        <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}">Confirmar cuenta</a></p><br>
        <p>Si tú no has creado la cuenta, ignora este mensaje.</p>
      `, // Cuerpo en HTML
    });
    console.log('Correo de bienvenida enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export { emailAfterRegister };
