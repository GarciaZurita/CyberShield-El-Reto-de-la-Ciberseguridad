const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Qué hace un gestor de contraseñas?", respuesta: "Guarda contraseñas de forma segura" },
    { pregunta: "¿Qué longitud mínima debe tener una contraseña segura?", respuesta: "12 caracteres" },
    { pregunta: "¿Qué tipo de caracteres debe incluir una contraseña?", respuesta: "Letras, números y símbolos" },
    { pregunta: "¿Es recomendable usar la misma contraseña en varios sitios?", respuesta: "No, aumenta el riesgo de hackeo" },
    { pregunta: "¿Cómo puedes proteger una cuenta además de la contraseña?", respuesta: "Autenticación en dos pasos" }
];

let cartas = [];
let cartasSeleccionadas = [];
let bloqueado = false; // Evita que se seleccionen más de dos cartas a la vez
let tiempo = 0;
let intervalo;

// Función para iniciar el reloj
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

// Función para barajar cartas
function barajarCartas() {
    cartas.sort(() => Math.random() - 0.5);
}

// Función para crear las cartas
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
        cardBack.textContent = "🔑";

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        carta.appendChild(cardInner);

        carta.addEventListener("click", () => {
            if (bloqueado || cartasSeleccionadas.includes(carta) || carta.classList.contains("acertada")) {
                return; // Si el juego está bloqueado, la carta ya está volteada o acertada, no hace nada
            }

            carta.classList.add("volteada");
            cartasSeleccionadas.push(carta);
            beep.play();

            if (cartasSeleccionadas.length === 2) {
                bloqueado = true;
                setTimeout(verificarPareja, 800);
            }
        });

        cardsContainer.appendChild(carta);
    });
}

// Verificar si las cartas son pareja
function verificarPareja() {
    const [carta1, carta2] = cartasSeleccionadas;

    if (carta1.dataset.valor === carta2.dataset.valor) {
        carta1.classList.add("acertada");
        carta2.classList.add("acertada");
        carta1.style.pointerEvents = "none";
        carta2.style.pointerEvents = "none";
    } else {
        setTimeout(() => {
            carta1.classList.remove("volteada");
            carta2.classList.remove("volteada");
        }, 800);
    }

    cartasSeleccionadas = [];
    bloqueado = false; // Desbloqueamos el juego

    // Verificar si el jugador ganó
    if (document.querySelectorAll(".card:not(.acertada)").length === 0) {
        clearInterval(intervalo);
        setTimeout(() => alert("¡Nivel completado!"), 500);
    }
}

// Reiniciar el nivel
restartButton.addEventListener("click", () => {
    beep.play();
    iniciarReloj();
    crearCartas();
    bloqueado = false;
});

// Volver al menú
menuButton.addEventListener("click", () => {
    beep.play();
    window.location.href = "niveles.html";
});

// Iniciar juego
iniciarReloj();
crearCartas();
