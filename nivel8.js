const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Qué es el phishing?", respuesta: "Un intento de robo de datos" },
    { pregunta: "¿Cómo protegerse del phishing?", respuesta: "No hacer clic en enlaces sospechosos" },
    { pregunta: "¿Qué es el pretexting?", respuesta: "Engañar con una historia falsa" },
    { pregunta: "¿Qué hacer si alguien pide información personal?", respuesta: "Verificar antes de responder" },
    { pregunta: "¿Cómo evitar el baiting?", respuesta: "No conectar USB desconocidos" },
    { pregunta: "¿Qué es el tailgating?", respuesta: "Entrar sin autorización" },
    { pregunta: "¿Cómo protegerse del vishing?", respuesta: "No confiar en llamadas sospechosas" },
    { pregunta: "¿Qué significa smishing?", respuesta: "Ataque de phishing por SMS" },
    { pregunta: "¿Cuál es una señal de ataque de ingeniería social?", respuesta: "Urgencia y presión" },
    { pregunta: "¿Qué hacer ante una solicitud de datos sospechosa?", respuesta: "Verificar con la fuente oficial" }
];

let cartas = [];
let cartasSeleccionadas = [];
let tiempo = 0;
let intervalo;

// Iniciar el reloj
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

// Barajar cartas
function barajarCartas() {
    cartas.sort(() => Math.random() - 0.5);
}

// Crear las cartas
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
        cardBack.textContent = "🎭"; // Emoji en la parte trasera

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

// Verificar parejas
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

    if (document.querySelectorAll(".card:not(.acertada)").length === 0) {
        clearInterval(intervalo);
        setTimeout(() => alert("¡Nivel completado!"), 500);
    }
}

// Eventos de reinicio y menú
restartButton.addEventListener("click", () => {
    beep.play();
    iniciarReloj();
    crearCartas();
});

menuButton.addEventListener("click", () => {
    beep.play();
    window.location.href = "niveles.html";
});

iniciarReloj();
crearCartas();
