import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const emailAfterRegister = async(newUserData) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        auth:{
            user: process.env.USER,
            pass: process.env.PASS
        }
    })

    //console.log(data)
    const {email, name, token}= newUserData
    

    //Enviar al email
    await transport.sendMail({
        from:'bienesraices_230642.com',
        to: email,
        subject: 'Bienvenido/a a BienesRaices_230369',
        text: 'Ya casi puedes usar nuestra plataforma, sola falta...',
        html: `<p> Hola, <span style="color:red"> ${name}</span>, <br>
        Bienvenido a la plataforma de BienesRaices, el sitio seguro donde podrás buscar, comprar y ofertar propiedades a través de Internet. <br>
        <p> Ya solo necesitamos confirmes la cuenta que creaste. dando click a la siguiente liga: <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}"> Confirmar cuenta</a><p> <br>

        <p> Si tu no has creado la cuenta, ignora este mensaje. </p>`

    })
}
export {emailAfterRegister}