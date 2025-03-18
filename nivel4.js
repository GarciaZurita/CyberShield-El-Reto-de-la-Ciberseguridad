const cardsContainer = document.querySelector(".grid");
const restartButton = document.getElementById("reiniciar");
const menuButton = document.getElementById("volverMenu");
const reloj = document.getElementById("reloj");
const beep = document.getElementById("beep");

const preguntasRespuestas = [
    { pregunta: "¿Qué es phishing?", respuesta: "Engaño para robar datos" },
    { pregunta: "¿Qué debes hacer con correos sospechosos?", respuesta: "No hacer clic en enlaces" },
    { pregunta: "¿Cómo reconocer phishing?", respuesta: "Errores en el correo" },
    { pregunta: "¿Qué hacer si recibes un correo falso?", respuesta: "Reportarlo como spam" },
    { pregunta: "¿Es seguro abrir archivos adjuntos de desconocidos?", respuesta: "No, pueden ser virus" },
    { pregunta: "¿Cómo protegerte del phishing?", respuesta: "Verifica remitente y enlaces" }
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

// Barajar cartas
function barajarCartas() {
    cartas.sort(() => Math.random() - 0.5);
}

// Crear cartas
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
        cardBack.textContent = "📧"; // Emoji en la parte trasera

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        carta.appendChild(cardInner);

        carta.addEventListener("click", () => {
            if (!cartasSeleccionadas.includes(carta) && cartasSeleccionadas.length < 2) {
                carta.classList.add("volteada");
                cartasSeleccionadas.push(carta);
                beep.play();
                if (cartasSeleccionadas.length === 2) setTimeout(verificarPareja, 800);
            }
        });

        cardsContainer.appendChild(carta);
    });
}

// Verificar parejas
function verificarPareja() {
    const [carta1, carta2] = cartasSeleccionadas;
    if (carta1.dataset.valor === carta2.dataset.valor) carta1.classList.add("acertada"), carta2.classList.add("acertada");
    else setTimeout(() => carta1.classList.remove("volteada"), carta2.classList.remove("volteada"), 800);
    cartasSeleccionadas = [];
}

// Inicializar
restartButton.addEventListener("click", iniciarReloj, crearCartas);
menuButton.addEventListener("click", () => window.location.href = "niveles.html");
iniciarReloj();
crearCartas();
