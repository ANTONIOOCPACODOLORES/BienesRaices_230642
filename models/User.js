import {DataTypes} from 'sequelize'
import db from '../db/config.js'
import { Hooks } from 'sequelize/lib/hooks';


const User = db.define('tbb_users',{
    name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    token: DataTypes.STRING, 
    confirmed: DataTypes.BOOLEAN
},{
    Hooks:{
        beforeCreate: async function (user) {
            //Generamos la clave para el hasheo, se recomiendan 1o rondas de aleatorizacion para no consumir demasiados recursos de de hardware y hacer lento el proceso.
            const salt = await bcrypt.hash(user.password, salt);
        }
    }
})


export default User;