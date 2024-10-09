let contador = 0;
let puntuacionMaximaJugador = 0;
let probabilidadReinicio = 0;
let top3Puntuaciones = [];

const pantallaComienzo = document.getElementById('pantallaComienzo');
const pantallaJuego = document.getElementById('pantallaJuego');
const botonComienzo = document.getElementById('botonComienzo');
const botonContador = document.getElementById('botonContador');
const contadorMostrado = document.getElementById('contador');
const puntuacionMaximaJugadorMostrada = document.getElementById('puntuacionMaximaJugador');
const probabilidadReinicioMostrada = document.getElementById('probabilidadReinicio');
const animacionReinicio = document.getElementById('animacionReinicio');
const confetiContainer = document.getElementById('confeti');
const formularioNombre = document.getElementById('formularioNombre');
const inputNombre = document.getElementById('inputNombre');
const botonGuardar = document.getElementById('botonGuardar');
const listaTop3 = document.getElementById('listaTop3');

botonComienzo.addEventListener('click', comenzarJuego);
botonContador.addEventListener('click', manejarClic);
botonGuardar.addEventListener('click', guardarNombre);

// Cargar puntuaciones máximas del localStorage
cargarPuntuacionesMaximas();

function comenzarJuego() {
    pantallaComienzo.classList.add('desaparecer');
    setTimeout(() => {
        pantallaComienzo.classList.add('oculto');
        pantallaJuego.classList.remove('oculto');
        pantallaJuego.classList.add('aparecer');
    }, 500);
}

function manejarClic() {
    probabilidadReinicio += 1;
    
    if (Math.random() * 100 < probabilidadReinicio) {
        mostrarAnimacionReinicio();
        setTimeout(() => {
            contador = 0;
            probabilidadReinicio = 0;
            actualizarPantalla();
        }, 500);
    } else {
        contador++;
        if (contador > puntuacionMaximaJugador) {
            puntuacionMaximaJugador = contador;
            if (contador % 10 === 0 && contador > 0) {
                lanzarConfeti();
            }
            if (esNuevoPuntuajeTop3(contador)) {
                mostrarFormularioNombre();
            }
        }
        actualizarPantalla();
    }
}

function actualizarPantalla() {
    contadorMostrado.textContent = contador;
    puntuacionMaximaJugadorMostrada.textContent = `Tu Máximo: ${puntuacionMaximaJugador}`;
    probabilidadReinicioMostrada.textContent = `Probabilidad de reinicio: ${probabilidadReinicio.toFixed(1)}%`;
    actualizarListaTop3();
}

function mostrarAnimacionReinicio() {
    animacionReinicio.style.transform = 'translateY(0)';
    setTimeout(() => {
        animacionReinicio.style.transform = 'translateY(-100%)';
    }, 500);
}

function lanzarConfeti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

function mostrarFormularioNombre() {
    formularioNombre.classList.remove('oculto');
}

function guardarNombre() {
    const nombre = inputNombre.value.trim();
    if (nombre) {
        agregarPuntuacionTop3(nombre, puntuacionMaximaJugador);
        formularioNombre.classList.add('oculto');
        actualizarPantalla();
        guardarPuntuacionesMaximas();
    }
}

function esNuevoPuntuajeTop3(puntuacion) {
    return top3Puntuaciones.length < 3 || puntuacion > top3Puntuaciones[top3Puntuaciones.length - 1].puntuacion;
}

function agregarPuntuacionTop3(nombre, puntuacion) {
    top3Puntuaciones.push({ nombre, puntuacion });
    top3Puntuaciones.sort((a, b) => b.puntuacion - a.puntuacion);
    if (top3Puntuaciones.length > 3) {
        top3Puntuaciones.pop();
    }
}

function actualizarListaTop3() {
    listaTop3.innerHTML = '';
    top3Puntuaciones.forEach((puntuacion, index) => {
        const li = document.createElement('li');
        li.textContent = `${puntuacion.nombre}: ${puntuacion.puntuacion}`;
        listaTop3.appendChild(li);
    });
}

function cargarPuntuacionesMaximas() {
    const puntuacionesGuardadas = localStorage.getItem('top3Puntuaciones');
    if (puntuacionesGuardadas) {
        top3Puntuaciones = JSON.parse(puntuacionesGuardadas);
        actualizarListaTop3();
        //localStorage.clear();
        //PARA RESETAR LOS DATOS
    }
}

function guardarPuntuacionesMaximas() {
    localStorage.setItem('top3Puntuaciones', JSON.stringify(top3Puntuaciones));
}