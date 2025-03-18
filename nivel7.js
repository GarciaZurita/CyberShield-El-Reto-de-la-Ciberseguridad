const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Cómo debe ser una contraseña segura?", respuesta: "Larga y compleja" },
    { pregunta: "¿Qué se debe evitar en contraseñas?", respuesta: "Datos personales" },
    { pregunta: "¿Por qué usar un gestor de contraseñas?", respuesta: "Para almacenar claves seguras" },
    { pregunta: "¿Es seguro usar la misma contraseña?", respuesta: "No, es riesgoso" },
    { pregunta: "¿Cada cuánto cambiar contraseñas?", respuesta: "Regularmente" },
    { pregunta: "¿Qué es la autenticación en dos pasos?", respuesta: "Doble verificación" },
    { pregunta: "¿Por qué no compartir contraseñas?", respuesta: "Riesgo de robo de cuentas" },
    { pregunta: "¿Dónde se recomienda almacenar contraseñas?", respuesta: "Gestor de contraseñas" },
    { pregunta: "¿Qué hace una clave fuerte?", respuesta: "Combinación de caracteres" }
];

let cartas = [];
let cartasSeleccionadas = [];
let bloqueado = false;
let tiempo = 0;
let intervalo;

function iniciarReloj() {
    tiempo = 0;
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        tiempo++;
        let minutos = Math.floor(tiempo / 60).toString().padStart(2, "0");
        let segundos = (tiempo % 60).toString().padStart(2, "0");
        reloj.textContent = `Tiempo: ${minutos}:${segundos}`;
    }, 1000);
}

function barajarCartas() {
    cartas.sort(() => Math.random() - 0.5);
}

function verificarPareja() {
    if (cartasSeleccionadas.length === 2) {
        let [carta1, carta2] = cartasSeleccionadas;
        
        if (carta1.dataset.valor === carta2.dataset.valor) {
            carta1.classList.add("acertada");
            carta2.classList.add("acertada");
        } else {
            setTimeout(() => {
                carta1.classList.remove("volteada");
                carta2.classList.remove("volteada");
            }, 800);
        }

        cartasSeleccionadas = [];
        bloqueado = false;
    }
}

function crearCartas() {
    cardsContainer.innerHTML = "";
    cartas = [];

    preguntasRespuestas.forEach(pair => {
        cartas.push({ texto: pair.pregunta, tipo: "pregunta", valor: pair.pregunta });
        cartas.push({ texto: pair.respuesta, tipo: "respuesta", valor: pair.pregunta });
    });

    barajarCartas();

    cartas.forEach((cartaData) => {
        const carta = document.createElement("div");
        carta.classList.add("card");
        carta.dataset.valor = cartaData.valor;

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        cardFront.textContent = cartaData.texto;

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        cardBack.textContent = "🔓"; 

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        carta.appendChild(cardInner);

        carta.addEventListener("click", () => {
            if (!cartasSeleccionadas.includes(carta) && cartasSeleccionadas.length < 2 && !bloqueado) {
                carta.classList.add("volteada");
                cartasSeleccionadas.push(carta);
                beep.play();

                if (cartasSeleccionadas.length === 2) {
                    bloqueado = true;
                    setTimeout(verificarPareja, 800);
                }
            }
        });

        cardsContainer.appendChild(carta);
    });
}

restartButton.addEventListener("click", () => {
    iniciarReloj();
    crearCartas();
});

menuButton.addEventListener("click", () => {
    window.location.href = "niveles.html";
});

iniciarReloj();
crearCartas();
