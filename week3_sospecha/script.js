let titulo;
let boton1;
let boton2;
let texto1;
let texto2;
let texto3;
let rojo= "#D9C7B1";
let verde= "#C5D5D4";
let gris= "#C7C9C9";
let ahora=0;

let poemas = 
[
    {
        titulo: ["sospecha", "día", "pantuflas", "cama", "estrellas", "dioses", "recuerdo", "olvidado", "barro", "opaco", "verdad", "silencio", "sombras", "carne", "resplandor", "vuelta", "solo", "dedos", "caída", "promesa", "cotidiano"],
        texto1: ["De", "Una luz extraña sobre lo ", "Una mañana me levantaré a ver el ", " ", "Temblorosa cercanía de los ", "Un", " ", "Cuando la transparente posibilidad se vuelve ", " ", "No Hay ", "Bajo la ", "Oscuridad, una leve ", "Cuando lo ", "Vibrando aún entre el sueño y las ", "Leve mentira. Una ", "De la ", "De forma que ya no sientas su ", "Muchos pequeños ", "Un ", "Falsa", "La "],
        boton1: ["dioses", "cotidiano", "día", "promesa", "dedos", "silencio", "solo", "opaco", "resplandor", "vuelta", "cama", "caída", "opaco", "pantuflas", "sospecha", "cama", "carne", "dioses", "silencio", "caída", "cama"],
        bot1_p: [5, 20, 1, 19, 17, 11, 16, 9, 14, 15, 3, 18, 9, 2, 0, 3, 13, 5, 11, 18, 3],
        texto2: ["parece estar hecho el ", "para que se parexca al ", "sin temor a encontrar ", "de poder volver el ", "a una ", "negro entre las ", "lo que no se ha ", " ", "sin forma eres como una ", "que darle ", "siempre hay ", "hacia la ", "de tus ojos se impone al ", "se levanta lo ", "de poder alcanzar lo más profundo donde solamente hay ", "al ", "vibrar bajo tus ", "vagando entre lo ", ", luego una ", ", equivocado camino de ", ", la "],
        boton2: ["día", "recuerdo", "estrellas", "barro", "verdad", "estrellas", "olvidado", "recuerdo", "promesa", "solo", "sombras", "sospecha", "resplandor", "olvidado", "sombras", "barro", "dedos", "cotidiano", "verdad", "vuelta", "pantuflas"],
        bot2_p: [1, 6, 4, 8, 10, 4, 7, 6, 19, 16, 12, 0, 14, 7, 12, 8, 17, 20, 10, 15, 2],
        texto3: [".", ".", ".", "que aún somos.", ".", ", sosteniéndolas, equilibrándolas.", "todavía.", ".", ".", "mirarlo y esperar.", ".", ".", "de los objetos que te rodean.", ".", ".", ".", ".", ".", ".", ".", ", la mantequilla, las llaves, la ducha más fría cada vez "],
        color: [verde, rojo, verde, rojo, gris, gris, rojo, gris, rojo, gris, verde, verde, gris, rojo, rojo, verde, verde, rojo, gris, verde, gris]
    },
    
];

//1. identify and select the button
Fboton1 = document.getElementById('boton1');
Fboton2 = document.getElementById('boton2');

//2. listen to event click on the button
//3. change poem
Fboton1.addEventListener("click", function() {
    console.log(poemas[0].color[ahora]);
    document.getElementById('titulo').innerHTML = poemas[0].titulo[ahora];
    document.getElementById('texto1').innerHTML = poemas[0].texto1[ahora];
    document.getElementById('boton1').innerHTML = poemas[0].boton1[ahora];
    document.getElementById('texto2').innerHTML = poemas[0].texto2[ahora];
    document.getElementById('boton2').innerHTML = poemas[0].boton2[ahora];
    document.getElementById('texto3').innerHTML = poemas[0].texto3[ahora];
    document.body.style.background = poemas[0].color[ahora];
    ahora = poemas[0].bot1_p[ahora];
});
Fboton2.addEventListener("click", function() {
    document.getElementById('texto1').innerHTML = poemas[0].texto1[ahora];
    document.getElementById('titulo').innerHTML = poemas[0].titulo[ahora];
    document.getElementById('texto1').innerHTML = poemas[0].texto1[ahora];
    document.getElementById('boton1').innerHTML = poemas[0].boton1[ahora];
    document.getElementById('texto2').innerHTML = poemas[0].texto2[ahora];
    document.getElementById('boton2').innerHTML = poemas[0].boton2[ahora];
    document.getElementById('texto3').innerHTML = poemas[0].texto3[ahora];    
    document.body.style.background = poemas[0].color[ahora];
    ahora = poemas[0].bot2_p[ahora];
});


