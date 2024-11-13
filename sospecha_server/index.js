
// let a=20;
// let b=10;
// console.log(a+b);

// const { request } = require("express");


let express = require('express');
let app = express();

// app.get('/', (request, response)=>{
// response.send("hello");
// })

app.use('/', express.static('public'));

app.get('/acerca', (request, response)=>{
    response.send("musarañas");
    })

app.get('/data', (req, res)=>{
    res.json(poemas);
    })

app.get('/poemas/:poema', (req, res)=>{
    console.log(req.params.poema);
    let user_poema = req.params.poema;
    let user_obj;
    for(let i=0; i<poemas.data.length;i++){
        if(user_poema == poemas.data[i].titulo){
         user_obj=poemas.data[i];   
        }
    }
    console.log(user_obj);

    if(user_obj){
        res.json(user_obj);
    }else{
    res.json({status: "no info"});
    }
    })

app.listen(3000, ()=>{
    console.log ("app ahora funciona");
})

let poemas = {
    "data" : [

        {
            titulo: "Sospecha",
            texto1: "De",
            boton1: "Dioses",
            bot1_p: 5,
            texto2: "parece estar hecho el ",
            boton2: "Día",
            bot2_p: 1,
            texto3: ".",
            
        },
        {
            titulo: ["Día"],
            texto1: ["Una luz extraña sobre lo "],
            boton1: ["Cotidiano"],
            bot1_p: [20],
            texto2: ["para que se parezca al "],
            boton2: ["Recuerdo"],
            bot2_p: [6],
            texto3: ["."],

        },
        {
            titulo: ["Pantuflas"],
            texto1: ["Una mañana me levantaré a ver el "],
            boton1: ["Día"],
            bot1_p: [1],
            texto2: ["sin temor a encontrar ", "de poder volver el "],
            boton2: ["Estrellas"],
            bot2_p: [4],
            texto3: ["."],

        },
        {
            titulo: ["Cama"],
            texto1: [" "],
            boton1: ["Promesa"],
            bot1_p: [19],
            texto2: ["de poder volver al "],
            boton2: ["Barro"],
            bot2_p: [8],
            texto3: ["que aún somos."],
        },
        {
            titulo: ["Estrellas"],
            texto1: ["Temblorosa cercanía de los "],
            boton1: ["Dedos"],
            bot1_p: [17],
            texto2: ["a una "],
            boton2: ["Verdad"],
            bot2_p: [10],
            texto3: ["."],
            
        },
        {
            titulo: ["Dioses"],
            texto1: ["Un"],
            boton1: ["Silencio"],
            bot1_p: [11, 16, 9, 14, 15, 3, 18, 9, 2, 0, 3, 13, 5, 11, 18, 3],
            texto2: ["negro entre las "],
            boton2: ["Estrellas"],
            bot2_p: [4],
            texto3: ["sosteniéndolas, equilibrándolas."],

        },
        {
            titulo: ["Recuerdo"],
            texto1: [" "],
            boton1: ["Solo"],
            bot1_p: [16],
            texto2: ["lo que no se ha "],
            boton2: ["Olvidado"],
            bot2_p: [7],
            texto3: ["todavía."],

        },
        {
            titulo: ["Olvidado"],
            texto1: ["Cuando la transparente posibilidad se vuelve "],
            boton1: ["Opaco"],
            bot1_p: [9],
            texto2: [" "],
            boton2: ["Recuerdo"],
            bot2_p: [6],
            texto3: ["."],

        },
        {
            titulo: ["Barro"],
            texto1: [" "],
            boton1: ["Resplandor"],
            bot1_p: [14],
            texto2: ["sin forma eres como una "],
            boton2: ["Promesa"],
            bot2_p: [19],
            texto3: ["."],

        },
        {
            titulo: ["Opaco"],
            texto1: ["No Hay "],
            boton1: ["Vuelta"],
            bot1_p: [15],
            texto2: ["que darle "],
            boton2: ["Solo"],
            bot2_p: [16],
            texto3: ["mirarlo y esperar."],

        },
    ]
} 