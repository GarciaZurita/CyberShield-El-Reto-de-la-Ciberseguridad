document.addEventListener("DOMContentLoaded", () => {
    const beepSound = document.getElementById("beep-sound");
    const botonesNiveles = document.querySelectorAll(".menu-button");

    botonesNiveles.forEach(button => {
        button.addEventListener("click", () => {
            beepSound.currentTime = 0;
            beepSound.play();

            // Verificar si el botón tiene un id con "nivelX"
            if (button.id.startsWith("nivel")) {
                const nivel = button.id.replace("nivel", ""); 
                if (!isNaN(nivel)) {
                    window.location.href = `nivel${nivel}.html`;
                }
            }
        });
    });

    // Botón de volver al menú
    const botonAtras = document.getElementById("atras");
    if (botonAtras) {
        botonAtras.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});
