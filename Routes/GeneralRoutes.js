import express from 'express';
const router = express.Router();

//
router.get("/log", function(req, res){
    res.render('auth/login')
})

//quienEres o quienSoy
router.get("/QuienSoy/", function(req, res){
    res.json({
        
        "estudiante": "Antonio Ocpaco Dolores", 
        "carrera": "TI DSM",
        "grado": "4°",
        "grupo": "B",
        "asignatura": "Aplicaciones Web Orientada a Servicios (AWOS)"
    })
})


export default router