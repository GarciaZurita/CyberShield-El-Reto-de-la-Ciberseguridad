const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Qué hacer antes de instalar una app?", respuesta: "Revisar permisos" },
    { pregunta: "¿Qué sistema es más seguro: actualizado o desactualizado?", respuesta: "Actualizado" },
    { pregunta: "¿Qué hacer con redes WiFi públicas?", respuesta: "Evitar compartir datos" },
    { pregunta: "¿Qué es el 2FA?", respuesta: "Autenticación en dos pasos" },
    { pregunta: "¿Qué se debe usar para almacenar contraseñas?", respuesta: "Gestor de contraseñas" },
    { pregunta: "¿Qué hacer con un USB desconocido?", respuesta: "No conectarlo" },
    { pregunta: "¿Qué acción previene malware?", respuesta: "No descargar archivos sospechosos" }
];

let cartas = [];
let cartasSeleccionadas = [];
let bloqueado = false;  // Variable para evitar que se seleccionen más cartas mientras se verifica una pareja
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
        cardBack.textContent = "📱"; // Emoji para dispositivos

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        carta.appendChild(cardInner);

        carta.addEventListener("click", () => {
            if (!bloqueado && !cartasSeleccionadas.includes(carta) && cartasSeleccionadas.length < 2) {
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

    setTimeout(() => {
        cartasSeleccionadas = [];
        bloqueado = false;
    }, 800);

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
