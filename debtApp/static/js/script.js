document.addEventListener('DOMContentLoaded', function() {
    console.log("El script se ha cargado y el DOM está listo.");
    // Selecciona los enlaces y los divs
    const infoLink = document.getElementById('info-link');
    const testLink = document.getElementById('test-link');
    const infoDiv = document.getElementById('info-div');
    // Asumo que el div para "Probar online" se llama "test-div", cámbialo si es necesario
    const testDiv = document.getElementById('test-div');

    // Función para ocultar todos los divs
    function hideAllDivs() {
        infoDiv.style.display = 'none';
        testDiv.style.display = 'none';
    }

    // Función para mostrar el div correspondiente
    function showDiv(divToShow) {
        hideAllDivs();
        divToShow.style.display = 'block';
    }

    // Configura los event listeners
    infoLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        showDiv(infoDiv);
    });

    testLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        showDiv(testDiv);
    });

    // Muestra el div de información por defecto al cargar la página (opcional)
    showDiv(infoDiv);
});