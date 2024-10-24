import express from `express`;
import { Router } from "express";
const router = express.Router();

router.get("/", function (req,res){
    res.send("Hola Mundo desde Node, a traves de navegador");
})
router.get("/QuienSoy", function(req,res){
    res.json({"estudiante": "Antonio Dolores",
        "Carrera": "TI-DSM",
        "Grado": "4°",
        "Grupo":"B",
        "asignatura":"AWOS"
    })
})
export default Router; //Esta palabra reservada de js me permite exportar los elementos definicdos  y utilizarlos en otros archivos del mismo sitio.