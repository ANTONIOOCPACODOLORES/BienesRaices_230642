import Sequelize from 'sequelize'
import dontenv from 'dotenv'
dontenv.config({path:'.env'})
//import { noBoolOperatorAliases } from 'sequelize/lib/utils/deprecations';

const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER,process.env.BD_PASS,{
    host:process.env.BD_DOMAIN,
    port:process.env.BD_PORT,
    dialect:'mysql',
    define:{
        timestamps:true
    },
    pool:{
        max:5,
        min:0,
        acquire:3000,
        idlle:1000

    },
    operatorAliases:false
});

export default db;