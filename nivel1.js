const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Qué no debes compartir en redes sociales?", respuesta: "Información personal" },
    { pregunta: "¿Qué método ayuda a proteger tus cuentas?", respuesta: "Autenticación en dos pasos" },
    { pregunta: "¿Qué hacer si recibes un mensaje sospechoso?", respuesta: "No hacer clic en enlaces" }
];

let cartas = [];
let cartasSeleccionadas = [];
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

        // Contenedor interior para animación
        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        // Parte frontal (con pregunta o respuesta)
        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        cardFront.textContent = cartaData.texto;

        // Parte trasera (con emoji)
        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        cardBack.textContent = "🔒"; // Emoji en la parte trasera

        // Estructura final de la carta
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        carta.appendChild(cardInner);

        carta.addEventListener("click", () => {
            if (!cartasSeleccionadas.includes(carta) && cartasSeleccionadas.length < 2) {
                carta.classList.add("volteada");
                cartasSeleccionadas.push(carta);
                beep.play();

                if (cartasSeleccionadas.length === 2) {
                    setTimeout(verificarPareja, 800);
                }
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
});

// Volver al menú
menuButton.addEventListener("click", () => {
    beep.play();
    window.location.href = "niveles.html";
});

// Iniciar juego
iniciarReloj();
crearCartas();
