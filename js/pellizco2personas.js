const container = document.getElementById('container');
const jugador1 = document.getElementById('jugador1');
const jugador2 = document.getElementById('jugador2');
const premio = document.getElementById('ganador');
const ganador = document.getElementById('imgGanador');
const canvas = document.querySelector('canvas');
const h1Ganador = document.getElementById('h1Ganador');
const ctx = canvas.getContext('2d');
const colors = ['#ff4d4d', '#4dbaff', '#f54dff', '#90ff4d', '#ff7f4d', '#ffd34d','#4dffc6', '#4d6fff', '#4dff4d', '#1d1d1d'];
const width = window.innerWidth * 0.7; // Ancho en vw
const height = window.innerHeight * 0.80; // Alto en vh
let pathInicioX;
let pathInicioY;
let pathFinalX;
let pathFinalY;
let coordenadas = [];
let mouseX;
let mouseY;
let p = document.getElementById('paragraph');
let p2 = document.getElementById('paragraph2');
let puntosJugador1 = 0;
let puntosJugador2 = 0;
let turno1 = true;
let turno2 = false;
let checkTemporal = 1;

canvas.width = width * window.devicePixelRatio;
canvas.height = height * window.devicePixelRatio;

const circles1 = [];
const circles2 = [];

// Crear los círculos
for (let i = 0; i < 10; i++) {
    ctx.fillStyle = colors[i];
    const x = Math.round(Math.random() * (canvas.width - 150) + 70);
    const y = Math.round(Math.random() * (canvas.height - 50) + 30);
    const radius = 12;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.font = '10px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i + 1, x, y);

    circles1.push({ x, y, radius });
}
for (let i = 0; i < 10; i++) {
    ctx.fillStyle = colors[i];
    const x = Math.round(Math.random() * (canvas.width - 150) + 70);
    const y = Math.round(Math.random() * (canvas.height - 50) + 30);
    const radius = 12;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.font = '10px poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i + 1, x, y);

    circles2.push({ x, y, radius });
}

// Cambiar el cursor al pasar sobre los círculos
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.offsetX * window.devicePixelRatio;
    mouseY = e.offsetY * window.devicePixelRatio;
    let hovering = false;

    for (const circle of circles1) {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        if (Math.sqrt(dx * dx + dy * dy) <= circle.radius) {
            hovering = true;
            break;
        }
    }

    if (hovering) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
    for (const circle of circles2) {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        if (Math.sqrt(dx * dx + dy * dy) <= circle.radius) {
            hovering = true;
            break;
        }
    }

    if (hovering) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});

// Para dibujar puntos
let initialX = 0;
let initialY = 0;

// Esta función detecta si una línea desde (x1, y1) a (x2, y2) cruza la línea desde (x3, y3) a (x4, y4)
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    let ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom === 0) return false; // Las líneas son paralelas
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3)) / denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3)) / denom;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return true; // Las líneas se intersectan
    }
    return false; // Las líneas no se intersectan
}

let canSendConsoleLog = true; // Variable para rastrear si se puede enviar el punto

const dibujar = (cursorX, cursorY) => {
    ctx.beginPath();
    ctx.moveTo(initialX, initialY);
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(cursorX, cursorY);
    ctx.stroke();

    let intersected = false; // Variable para rastrear si la línea se cruzó con alguna línea anterior

    // Verificar si la línea intersecta con alguna línea anterior
    for (let i = 0; i < coordenadas.length - 9; i += 2) {
        if (intersect(initialX, initialY, cursorX, cursorY, coordenadas[i].x, coordenadas[i].y, coordenadas[i + 1].x, coordenadas[i + 1].y)) {
            intersected = true;
            break; // No es necesario seguir verificando
        }
    }
    if(turno1){
        if (intersected && canSendConsoleLog) {
            puntosJugador1++;
            const ultimas8Coordenadas = coordenadas.slice(-16); // Obtener las últimas 8 coordenadas (16 valores en total)
            const estaRepetida = ultimas8Coordenadas.some(coord => coord.x === cursorX && coord.y === cursorY);
            if (!estaRepetida) {
                p.textContent = puntosJugador1;
                canSendConsoleLog = false; // Desactivar la capacidad de enviar otro console.log
                setTimeout(() => {
                    canSendConsoleLog = true; // Permitir enviar otro punto después de 300 milisegundos
                }, 300);
            }
        }
    }
    if(turno2){
        if (intersected && canSendConsoleLog) {
            puntosJugador2++;
            const ultimas8Coordenadas = coordenadas.slice(-16); // Obtener las últimas 8 coordenadas (16 valores en total)
            const estaRepetida = ultimas8Coordenadas.some(coord => coord.x === cursorX && coord.y === cursorY);
            if (!estaRepetida) {
                p2.textContent = puntosJugador2;
                canSendConsoleLog = false; // Desactivar la capacidad de enviar otro console.log
                setTimeout(() => {
                    canSendConsoleLog = true; // Permitir enviar otro punto después de 300 milisegundos
                }, 300);
            }
        }
    }
    

    // Guardar coordenadas
    coordenadas.push({ x: initialX, y: initialY });
    coordenadas.push({ x: cursorX, y: cursorY });

    initialX = cursorX;
    initialY = cursorY;
    
};


const mouseClick = (e) => {
    initialX = e.offsetX * window.devicePixelRatio;
    initialY = e.offsetY * window.devicePixelRatio;
    dibujar(initialX, initialY);
    pathInicioX = initialX;
    pathInicioY = initialY;
    console.log(pathInicioX, pathInicioY);
    canvas.addEventListener('mousemove', mouseMoving);
    document.addEventListener('mouseup', mouseUp);
    
    
};

const mouseMoving = (e) => {
    dibujar(e.offsetX * window.devicePixelRatio, e.offsetY * window.devicePixelRatio);
    
};
const mouseUp = () => {
    canvas.removeEventListener('mousemove', mouseMoving);
    document.removeEventListener('mouseup', mouseUp);
    pathFinalX = initialX;
    pathFinalY = initialY;
    console.log(pathFinalX, pathFinalY);
    canvas.removeEventListener('mousemove', mouseMoving);
    document.removeEventListener('mouseup', mouseUp);
    
    if(turno2){
        jugador1.classList.add('cuadro2');
        jugador1.classList.remove('cuadro');
        jugador2.classList.add('cuadro');
        jugador2.classList.remove('cuadro2');
        
    }
    if(turno1){
        jugador2.classList.add('cuadro2');
        jugador2.classList.remove('cuadro');
        jugador1.classList.add('cuadro');
        jugador1.classList.remove('cuadro2');
        
    }
    // Cambio de turnos
    if (checkTemporal == 1) {
        if (((pathInicioX >= (circles1[0].x - 60) || pathInicioX <= (circles1[0].x + 60)) && 
             (pathInicioY >= (circles1[0].y - 60) || pathInicioY <= (circles1[0].y + 60))) || 
            ((pathInicioX >= (circles2[0].x - 60) || pathInicioX <= (circles2[0].x + 60)) && 
             (pathInicioY >= (circles2[0].y - 60) || pathInicioY <= (circles2[0].y + 60)))) {
            
            if (turno1 && ((pathFinalX >= (circles1[1].x - 60) || pathFinalX <= (circles1[1].x + 60)) && 
                           (pathFinalY >= (circles1[1].y - 60) || pathFinalY <= (circles1[1].y + 60))) || 
                          ((pathFinalX >= (circles2[1].x - 60) || pathFinalX <= (circles2[1].x + 60)) && 
                           (pathFinalY >= (circles2[1].y - 60) || pathFinalY <= (circles2[1].y + 60)))) {
                turno1 = !turno1;
                turno2 = !turno2;
                console.log('Cambio de turno');
            } else if (turno2 && ((pathFinalX >= (circles1[1].x - 60) || pathFinalX <= (circles1[1].x + 60)) && 
                                  (pathFinalY >= (circles1[1].y - 60) || pathFinalY <= (circles1[1].y + 60))) || 
                                 ((pathFinalX >= (circles2[1].x - 60) || pathFinalX <= (circles2[1].x + 60)) && 
                                  (pathFinalY >= (circles2[1].y - 60) || pathFinalY <= (circles2[1].y + 60)))) {
                console.log('Vamos al 3');
                turno1 = !turno1;
                turno2 = !turno2;
            }
            checkTemporal++;
        }
    }
    if (checkTemporal == 2) {
        if (((pathInicioX >= (circles1[1].x - 60) || pathInicioX <= (circles1[1].x + 60)) && 
             (pathInicioY >= (circles1[1].y - 60) || pathInicioY <= (circles1[1].y + 60))) || 
            ((pathInicioX >= (circles2[1].x - 60) || pathInicioX <= (circles2[1].x + 60)) && 
             (pathInicioY >= (circles2[1].y - 60) || pathInicioY <= (circles2[1].y + 60)))) {
            console.log('Pasamos al check2');
            if (turno1 && ((pathFinalX >= (circles1[2].x - 60) || pathFinalX <= (circles1[2].x + 60)) && 
                           (pathFinalY >= (circles1[2].y - 60) || pathFinalY <= (circles1[2].y + 60))) || 
                          ((pathFinalX >= (circles2[2].x - 60) || pathFinalX <= (circles2[2].x + 60)) && 
                           (pathFinalY >= (circles2[2].y - 60) || pathFinalY <= (circles2[2].y + 60)))) {
                console.log('Cambio de turno');
                turno1 = !turno1;
                turno2 = !turno2;
            } else if (turno2 && ((pathFinalX >= (circles1[2].x - 60) || pathFinalX <= (circles1[2].x + 60)) && 
                                  (pathFinalY >= (circles1[2].y - 60) || pathFinalY <= (circles1[2].y + 60))) || 
                                 ((pathFinalX >= (circles2[2].x - 60) || pathFinalX <= (circles2[2].x + 60)) && 
                                  (pathFinalY >= (circles2[2].y - 60) || pathFinalY <= (circles2[2].y + 60)))) {
                console.log('Vamos al 4');
                turno1 = !turno1;
                turno2 = !turno2;
            }
            checkTemporal++;
        }
    }
        if (checkTemporal == 3) {
    if (((pathInicioX >= (circles1[2].x - 60) || pathInicioX <= (circles1[2].x + 60)) && 
             (pathInicioY >= (circles1[2].y - 60) || pathInicioY <= (circles1[2].y + 60))) || 
            ((pathInicioX >= (circles2[2].x - 60) || pathInicioX <= (circles2[2].x + 60)) && 
             (pathInicioY >= (circles2[2].y - 60) || pathInicioY <= (circles2[2].y + 60)))) {
            
            if (turno1 && ((pathFinalX >= (circles1[3].x - 60) || pathFinalX <= (circles1[3].x + 60)) && 
                           (pathFinalY >= (circles1[3].y - 60) || pathFinalY <= (circles1[3].y + 60))) || 
                          ((pathFinalX >= (circles2[3].x - 60) || pathFinalX <= (circles2[3].x + 60)) && 
                           (pathFinalY >= (circles2[3].y - 60) || pathFinalY <= (circles2[3].y + 60)))) {
                console.log('Cambio de turno');
                turno1 = !turno1;
                turno2 = !turno2;
            } else if (turno2 && ((pathFinalX >= (circles1[3].x - 60) || pathFinalX <= (circles1[3].x + 60)) && 
                                  (pathFinalY >= (circles1[3].y - 60) || pathFinalY <= (circles1[3].y + 60))) || 
                                 ((pathFinalX >= (circles2[3].x - 60) || pathFinalX <= (circles2[3].x + 60)) && 
                                  (pathFinalY >= (circles2[3].y - 60) || pathFinalY <= (circles2[3].y + 60)))) {
                console.log('Vamos al 5');
                turno1 = !turno1;
                turno2 = !turno2;
            }
            checkTemporal++;
        }
    }
        if (checkTemporal == 4) {
    if (((pathInicioX >= (circles1[3].x - 60) || pathInicioX <= (circles1[3].x + 60)) && 
             (pathInicioY >= (circles1[3].y - 60) || pathInicioY <= (circles1[3].y + 60))) || 
            ((pathInicioX >= (circles2[3].x - 60) || pathInicioX <= (circles2[3].x + 60)) && 
             (pathInicioY >= (circles2[3].y - 60) || pathInicioY <= (circles2[3].y + 60)))) {
            
            if (turno1 && ((pathFinalX >= (circles1[4].x - 60) || pathFinalX <= (circles1[4].x + 60)) && 
                           (pathFinalY >= (circles1[4].y - 60) || pathFinalY <= (circles1[4].y + 60))) || 
                          ((pathFinalX >= (circles2[4].x - 60) || pathFinalX <= (circles2[4].x + 60)) && 
                           (pathFinalY >= (circles2[4].y - 60) || pathFinalY <= (circles2[4].y + 60)))) {
                console.log('Cambio de turno');
                turno1 = !turno1;
                turno2 = !turno2;
            } else if (turno2 && ((pathFinalX >= (circles1[4].x - 60) || pathFinalX <= (circles1[4].x + 60)) && 
                                  (pathFinalY >= (circles1[4].y - 60) || pathFinalY <= (circles1[4].y + 60))) || 
                                 ((pathFinalX >= (circles2[4].x - 60) || pathFinalX <= (circles2[4].x + 60)) && 
                                  (pathFinalY >= (circles2[4].y - 60) || pathFinalY <= (circles2[4].y + 60)))) {
                console.log('Vamos al 6');
                turno1 = !turno1;
                turno2 = !turno2;
            }
            checkTemporal++;
        }
    }
        if (checkTemporal == 5) {
    if (((pathInicioX >= (circles1[4].x - 60) || pathInicioX <= (circles1[4].x + 60)) && 
             (pathInicioY >= (circles1[4].y - 60) || pathInicioY <= (circles1[4].y + 60))) || 
            ((pathInicioX >= (circles2[4].x - 60) || pathInicioX <= (circles2[4].x + 60)) && 
             (pathInicioY >= (circles2[4].y - 60) || pathInicioY <= (circles2[4].y + 60)))) {
            
            if (turno1 && ((pathFinalX >= (circles1[5].x - 60) || pathFinalX <= (circles1[5].x + 60)) && 
                           (pathFinalY >= (circles1[5].y - 60) || pathFinalY <= (circles1[5].y + 60))) || 
                          ((pathFinalX >= (circles2[5].x - 60) || pathFinalX <= (circles2[5].x + 60)) && 
                           (pathFinalY >= (circles2[5].y - 60) || pathFinalY <= (circles2[5].y + 60)))) {
                console.log('Cambio de turno');
                turno1 = !turno1;
                turno2 = !turno2;
            } else if (turno2 && ((pathFinalX >= (circles1[5].x - 60) || pathFinalX <= (circles1[5].x + 60)) && 
                                  (pathFinalY >= (circles1[5].y - 60) || pathFinalY <= (circles1[5].y + 60))) || 
                                 ((pathFinalX >= (circles2[5].x - 60) || pathFinalX <= (circles2[5].x + 60)) && 
                                  (pathFinalY >= (circles2[5].y - 60) || pathFinalY <= (circles2[5].y + 60)))) {
                console.log('Vamos al 7');
                turno1 = !turno1;
                turno2 = !turno2;
            }
            checkTemporal++;
        }
    }
    if (checkTemporal == 6) {
    if (((pathInicioX >= (circles1[5].x - 60) || pathInicioX <= (circles1[5].x + 60)) && 
             (pathInicioY >= (circles1[5].y - 60) || pathInicioY <= (circles1[5].y + 60))) || 
            ((pathInicioX >= (circles2[5].x - 60) || pathInicioX <= (circles2[5].x + 60)) && 
             (pathInicioY >= (circles2[5].y - 60) || pathInicioY <= (circles2[5].y + 60)))) {
            
            if (turno1 && ((pathFinalX >= (circles1[6].x - 60) || pathFinalX <= (circles1[6].x + 60)) && 
                           (pathFinalY >= (circles1[6].y - 60) || pathFinalY <= (circles1[6].y + 60))) || 
                          ((pathFinalX >= (circles2[6].x - 60) || pathFinalX <= (circles2[6].x + 60)) && 
                           (pathFinalY >= (circles2[6].y - 60) || pathFinalY <= (circles2[6].y + 60)))) {
                console.log('Cambio de turno');
                turno1 = !turno1;
                turno2 = !turno2;
            } else if (turno2 && ((pathFinalX >= (circles1[6].x - 60) || pathFinalX <= (circles1[6].x + 60)) && 
                                  (pathFinalY >= (circles1[6].y - 60) || pathFinalY <= (circles1[6].y + 60))) || 
                                 ((pathFinalX >= (circles2[6].x - 60) || pathFinalX <= (circles2[6].x + 60)) && 
                                  (pathFinalY >= (circles2[6].y - 60) || pathFinalY <= (circles2[6].y + 60)))) {
                console.log('Vamos al 8');
                turno1 = !turno1;
                turno2 = !turno2;
            }
            checkTemporal++;
        }
    }

    if (checkTemporal == 7) {
        if (((pathInicioX >= (circles1[6].x - 60) || pathInicioX <= (circles1[6].x + 60)) && 
                 (pathInicioY >= (circles1[6].y - 60) || pathInicioY <= (circles1[6].y + 60))) || 
                ((pathInicioX >= (circles2[6].x - 60) || pathInicioX <= (circles2[6].x + 60)) && 
                 (pathInicioY >= (circles2[6].y - 60) || pathInicioY <= (circles2[6].y + 60)))) {
                
                if (turno1 && ((pathFinalX >= (circles1[7].x - 60) || pathFinalX <= (circles1[7].x + 60)) && 
                               (pathFinalY >= (circles1[7].y - 60) || pathFinalY <= (circles1[7].y + 60))) || 
                              ((pathFinalX >= (circles2[7].x - 60) || pathFinalX <= (circles2[7].x + 60)) && 
                               (pathFinalY >= (circles2[7].y - 60) || pathFinalY <= (circles2[7].y + 60)))) {
                    console.log('Cambio de turno');
                    turno1 = !turno1;
                    turno2 = !turno2;
                } else if (turno2 && ((pathFinalX >= (circles1[7].x - 60) || pathFinalX <= (circles1[7].x + 60)) && 
                                      (pathFinalY >= (circles1[7].y - 60) || pathFinalY <= (circles1[7].y + 60))) || 
                                     ((pathFinalX >= (circles2[7].x - 60) || pathFinalX <= (circles2[7].x + 60)) && 
                                      (pathFinalY >= (circles2[7].y - 60) || pathFinalY <= (circles2[7].y + 60)))) {
                    console.log('Vamos al 9');
                    turno1 = !turno1;
                    turno2 = !turno2;
                }
                checkTemporal++;
        }
    }
    if (checkTemporal == 8) {
        if (((pathInicioX >= (circles1[7].x - 60) || pathInicioX <= (circles1[7].x + 60)) && 
                 (pathInicioY >= (circles1[7].y - 60) || pathInicioY <= (circles1[7].y + 60))) || 
                ((pathInicioX >= (circles2[7].x - 60) || pathInicioX <= (circles2[7].x + 60)) && 
                 (pathInicioY >= (circles2[7].y - 60) || pathInicioY <= (circles2[7].y + 60)))) {
                
                if (turno1 && ((pathFinalX >= (circles1[8].x - 60) || pathFinalX <= (circles1[8].x + 60)) && 
                               (pathFinalY >= (circles1[8].y - 60) || pathFinalY <= (circles1[8].y + 60))) || 
                              ((pathFinalX >= (circles2[8].x - 60) || pathFinalX <= (circles2[8].x + 60)) && 
                               (pathFinalY >= (circles2[8].y - 60) || pathFinalY <= (circles2[8].y + 60)))) {
                    console.log('Cambio de turno');
                    turno1 = !turno1;
                    turno2 = !turno2;
                } else if (turno2 && ((pathFinalX >= (circles1[8].x - 60) || pathFinalX <= (circles1[8].x + 60)) && 
                                      (pathFinalY >= (circles1[8].y - 60) || pathFinalY <= (circles1[8].y + 60))) || 
                                     ((pathFinalX >= (circles2[8].x - 60) || pathFinalX <= (circles2[8].x + 60)) && 
                                      (pathFinalY >= (circles2[8].y - 60) || pathFinalY <= (circles2[8].y + 60)))) {
                    console.log('Vamos al 10');
                    turno1 = !turno1;
                    turno2 = !turno2;
                }
                checkTemporal++;
        }
    }
    if (checkTemporal >= 9) {
        if (((pathInicioX >= (circles1[8].x - 60) || pathInicioX <= (circles1[8].x + 60)) && 
                 (pathInicioY >= (circles1[8].y - 60) || pathInicioY <= (circles1[8].y + 60))) || 
                ((pathInicioX >= (circles2[8].x - 60) || pathInicioX <= (circles2[8].x + 60)) && 
                 (pathInicioY >= (circles2[8].y - 60) || pathInicioY <= (circles2[8].y + 60)))) {
                
                if (turno1 && ((pathFinalX >= (circles1[9].x - 60) || pathFinalX <= (circles1[9].x + 60)) && 
                               (pathFinalY >= (circles1[9].y - 60) || pathFinalY <= (circles1[9].y + 60))) || 
                              ((pathFinalX >= (circles2[9].x - 60) || pathFinalX <= (circles2[9].x + 60)) && 
                               (pathFinalY >= (circles2[9].y - 60) || pathFinalY <= (circles2[9].y + 60)))) {
                    console.log('Cambio de turno');
                    turno1 = !turno1;
                    turno2 = !turno2;
                } else if (turno2 && ((pathFinalX >= (circles1[9].x - 60) || pathFinalX <= (circles1[9].x + 60)) && 
                                      (pathFinalY >= (circles1[9].y - 60) || pathFinalY <= (circles1[9].y + 60))) || 
                                     ((pathFinalX >= (circles2[9].x - 60) || pathFinalX <= (circles2[9].x + 60)) && 
                                      (pathFinalY >= (circles2[9].y - 60) || pathFinalY <= (circles2[9].y + 60)))) {
                    turno1 = !turno1;
                    turno2 = !turno2;
                }
                checkTemporal++;
        }
    }
    // Final del juego
    if(checkTemporal == 28){
        if(puntosJugador1 > puntosJugador2){
            console.log('!')
            premio.classList.remove('hidding')
            premio.classList.add('show')
            
            ganador.src = './img/ganador2.png';
            h1Ganador.textContent = '¡El jugador 2 es el ganador!';
        }
        else if(puntosJugador2 > puntosJugador1){
            console.log('!')
            premio.classList.remove('hidding')
            premio.classList.add('show')
            ganador.src = './img/ganador1.png'
            h1Ganador.textContent = '¡El jugador 1 es el ganador!';
        }
        else{
            console.log('!')
            premio.classList.remove('hidding')
            premio.classList.add('show')
            ganador.src = './img/popup2.png'
            h1Ganador.textContent = `¡Ha sido un empate!`;
        }   
    }
};

canvas.addEventListener('mousedown', mouseClick);