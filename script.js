document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".menu-button");
    const beepSound = document.getElementById("beep-sound");
    const detallesJuegoBtn = document.getElementById("detalles-juego");
    const iniciarJuegoBtn = document.getElementById("iniciar-juego"); // Botón de iniciar juego
    
    // Crear el cuadro de instrucciones
    const instruccionesBox = document.createElement("div");
    instruccionesBox.id = "instrucciones-box";
    instruccionesBox.style.display = "none";
    instruccionesBox.innerHTML = `
        <div class="instrucciones-content">
            <h2>Instrucciones del Juego</h2>
            <p>Encuentra las parejas de cartas relacionadas con ciberseguridad en el menor tiempo posible.</p>
            <p>Conforme avances, los niveles serán más difíciles y tendrás más cartas.</p>
            <button id="cerrar-instrucciones">Cerrar</button>
        </div>
    `;
    document.body.appendChild(instruccionesBox);
    
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            beepSound.currentTime = 0;
            beepSound.play();
        });
    });

    detallesJuegoBtn.addEventListener("click", () => {
        instruccionesBox.style.display = "flex";
    });

    document.body.addEventListener("click", (event) => {
        if (event.target.id === "cerrar-instrucciones") {
            instruccionesBox.style.display = "none";
        }
    });

    // Redirigir al menú de niveles
    iniciarJuegoBtn.addEventListener("click", () => {
        setTimeout(() => {
            window.location.href = "niveles.html"; 
        }, 200); // Pequeña pausa para que se escuche el sonido antes de la redirección
    });
});
