const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Qué es el phishing?", respuesta: "Suplantación de identidad" },
    { pregunta: "¿Qué hacer si recibes un mensaje sospechoso?", respuesta: "No hacer clic en enlaces" },
    { pregunta: "¿Cómo evitar fraudes en línea?", respuesta: "Verificar sitios web seguros" },
    { pregunta: "¿Qué es un fraude de soporte técnico?", respuesta: "Estafa que finge ser ayuda técnica" },
    { pregunta: "¿Cómo protegerse de fraudes en compras?", respuesta: "Usar métodos de pago seguros" },
    { pregunta: "¿Qué hacer si crees que fuiste estafado?", respuesta: "Reportar y bloquear contacto" },
    { pregunta: "¿Qué es el smishing?", respuesta: "Phishing por SMS" },
    { pregunta: "¿Cómo saber si una oferta es falsa?", respuesta: "Demasiado buena para ser verdad" }
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
        cardBack.textContent = "🏦"; // Emoji de fraudes financieros

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
    bloqueado = false;

    // Verificar si todas las cartas han sido acertadas
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
