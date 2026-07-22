'use strict'
//BOTONES DE TEMPORIZADOR
let btn1 = document.getElementById('btn1');
let btn2 = document.getElementById('btn2');
let btn3 = document.getElementById('btn3');
let btn4 = document.getElementById('btn4');
let btn5 = document.getElementById('btn5');
let btn6 = document.getElementById('btn6');

//Cronometro
let cronometro = document.getElementById('cronometro');
let descanso = document.getElementById('descanso');

//BOTONES DE REPRODUCTOR
let playMusic = document.getElementById('playMusic');
let atrasMusic = document.getElementById('atrasMusic');
let delanteMusic = document.getElementById('delanteMusic');

//ICONO MUSICA
let volumenMusic = document.getElementById('volumenMusic');

//VARIABLES GLOBALES PARA TEMPORIZADOR
let tiempoTotalSeg = 60*25;
let reloj = null;
let tiempoDesSeg = 60*5;

//AUDIO TERMINAR
let audioTerminar = document.getElementById('audioTerminar');

//LISTA DE CANCIONES
let arrayCanciones = [];
let cancionActual = 0;

//canvas
let canvas = document.getElementById('campo');
let ctx = canvas.getContext('2d');
let audioContext;
let analyser;
let source;

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// FUNCIONAMIENTO DEL PROGRAMA
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
cambiarTempo();
reproducirMusica();
configuracion();
empezarContador();
musica();
visualizador();

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// FUNCIONES CON LA LOGICA
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//CAMBIAR TEXTO
function cambiarTempo(){
    btn1.addEventListener('click', function(){
        cronometro.textContent = '25:00';
        descanso.textContent = '05:00';
        tiempoTotalSeg = 60*25;
        tiempoDesSeg = 60*5;
    });
    btn2.addEventListener('click', function(){
        cronometro.textContent = '30:00';
        descanso.textContent = '05:00';
        tiempoTotalSeg = 60*30;
        tiempoDesSeg = 60*5;
    });
    btn3.addEventListener('click', function(){
        cronometro.textContent = '30:00';
        descanso.textContent = '10:00';
        tiempoTotalSeg = 60*30;
        tiempoDesSeg = 60*10;
    });
    btn4.addEventListener('click', function(){
        cronometro.textContent = '50:00';
        descanso.textContent = '10:00';
        tiempoTotalSeg = 60*50;
        tiempoDesSeg = 60*10;
    });
    btn5.addEventListener('click', function(){
        cronometro.textContent = '60:00';
        descanso.textContent = '10:00';
        tiempoTotalSeg = 60*60;
        tiempoDesSeg = 60*10;
    });
    btn6.addEventListener('click', function(){
        cronometro.textContent = '60:00';
        descanso.textContent = '15:00';
        tiempoTotalSeg = 60*60;
        tiempoDesSeg = 60*15;
    });
}

//PANTALLA AJUSTES
function configuracion(){
    let btnConfig = document.getElementById('configuracion');
    let pantalla = document.getElementById('pantalla-config');
    pantalla.classList.add('oculto');
    btnConfig.addEventListener('click', function(){
        console.log('pulsado el boton');
        pantalla.classList.remove('oculto');
    });

    let btnCerrar = document.getElementById('btnCerrarConfig');
    btnCerrar.addEventListener('click', function(){
        pantalla.classList.add('oculto');
    });
}

//BOTON START
function empezarContador(){
    let btnEmpezar = document.getElementById('btnEmpezar');
    let btnStop = document.getElementById('btnStop');
    btnStop.classList.add('oculto');
    
    btnEmpezar.addEventListener('click', function(){
        btnEmpezar.classList.add('oculto');
        btnStop.classList.remove('oculto');
        ocultarBotones();
        cronometro.classList.add('cronometro-funcionando');
        descanso.classList.add('descanso-funcionando');
        clearInterval(reloj);

        reloj = setInterval(function(){
            let minutos = Math.floor(tiempoTotalSeg/60);
            let segundos = (tiempoTotalSeg%60);

            if(minutos < 10){
                minutos = "0" + minutos;
            }
            if(segundos < 10){
                segundos = "0" + segundos;
            }

            cronometro.textContent = minutos + ":" + segundos;
            tiempoTotalSeg--;

            if(tiempoTotalSeg < 0){
                clearInterval(reloj);
                cronometro.textContent = "00:00";
                console.log('terminado');
                audioTerminar.play();
                empezarDescanso();
            }
        }, 1000);
    });

    btnStop.addEventListener('click', function(){
        clearInterval(reloj);
        cronometro.classList.remove('cronometro-funcionando');
        descanso.classList.remove('descanso-funcionando');
        btnStop.classList.add('oculto');
        btnEmpezar.classList.remove('oculto');
        mostrarBotones();
    });
}

function resetear(){
    let btnReset = document.getElementById('btnReset');
    btnReset.addEventListener('click', function(){
        clearInterval(reloj);
        
    });
}

//GET MUSICA
function musica(){
    let recurso = './musica/musica.json';
    //GET 
    fetch(recurso).then(function(respuesta){
        if(respuesta.ok){
            respuesta.json().then(function(data){
                arrayCanciones = data;
                console.log(arrayCanciones);
            });
        }
        else{
            console.log('Error en cargar las canciones');
        }
    });
}

function reproducirMusica(){
    let reproductorAudio = document.getElementById('reproductorAudio');
    playMusic.addEventListener('click', function(){
        if(!reproductorAudio.getAttribute('src')){
            let cancion = Math.floor(Math.random()*arrayCanciones.length);
            reproductorAudio.src = arrayCanciones[cancion].ruta;
        }

        if (playMusic.textContent ==='play_circle'){
            playMusic.textContent = 'pause_circle';
            reproductorAudio.play();
        }
        else{
            playMusic.textContent = 'play_circle';
            reproductorAudio.pause();
        }

        

    });

    let barraVolumen = document.getElementById('volumen');
    reproductorAudio.volume = barraVolumen.value;
    barraVolumen.addEventListener('input', function(){
        reproductorAudio.volume = barraVolumen.value;
        
        if(barraVolumen.value <= 0){
            volumenMusic.textContent = 'volume_off';
        }
        else{
            volumenMusic.textContent = 'volume_up';
        }
    });

    volumenMusic.addEventListener('click', function(){
            if( volumenMusic.textContent ==='volume_up'){
                volumenMusic.textContent = 'volume_off';
                reproductorAudio.volume = 0;
            }
            else{
                volumenMusic.textContent ='volume_up'
                reproductorAudio.volume = barraVolumen.value;
            }
        });

    reproductorAudio.addEventListener('ended', function(){
        cancionActual++;
        if(cancionActual >= arrayCanciones.length){
            cancionActual = 0;
        }
        reproductorAudio.src = arrayCanciones[cancionActual].ruta;
        reproductorAudio.play();
    });

    delanteMusic.addEventListener('click', function(){
        cancionActual++;
        if(cancionActual >= arrayCanciones.length){
            cancionActual = 0;
        }
        reproductorAudio.src = arrayCanciones[cancionActual].ruta;
        reproductorAudio.play();
        playMusic.textContent = 'pause_circle';
    });

    atrasMusic.addEventListener('click', function(){
        cancionActual--;
        if(cancionActual < 0){
            cancionActual = arrayCanciones.length - 1;
        }
        reproductorAudio.src = arrayCanciones[cancionActual].ruta;
        reproductorAudio.play();
        playMusic.textContent = 'pause_circle';
    });


}

function visualizador(){
    let audio = document.getElementById('reproductorAudio');
    audio.addEventListener('play', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 64; 
            
            dibujarVisualizador();
        }
    });
}

function dibujarVisualizador(){
    requestAnimationFrame(dibujarVisualizador);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    if (!analyser) return;
    //datos del audio
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 10; 
    const espacio = 4;
    
    // Calculamos el centro exacto del canvas
    const centroX = canvas.width / 2;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Mantenemos tu paleta neón
        if (i < bufferLength / 3) {
            ctx.fillStyle = 'rgb(255, 255, 255)';
        } else {
            ctx.fillStyle = 'rgb(255, 255, 255)';
        }
        
        ctx.shadowBlur = 10; 
        let xDerecha = centroX + (i * (barWidth + espacio));
        ctx.fillRect(xDerecha, canvas.height - barHeight, barWidth, barHeight);
        if (i > 0) {
            let xIzquierda = centroX - (i * (barWidth + espacio));
            ctx.fillRect(xIzquierda, canvas.height - barHeight, barWidth, barHeight);
        }
    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// FUNCIONES AUXILIARES
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

function empezarDescanso(){
    let descanso = document.getElementById('descanso');
    reloj = setInterval(function(){
            let minutos = Math.floor(tiempoDesSeg/60);
            let segundos = (tiempoDesSeg%60);

            if(minutos < 10){
                minutos = "0" + minutos;
            }
            if(segundos < 10){
                segundos = "0" + segundos;
            }

            descanso.textContent = minutos + ":" + segundos;
            tiempoDesSeg--;

            if(tiempoDesSeg < 0){
                clearInterval(reloj);
                descanso.textContent = "00:00";
                audioTerminar.play();
                console.log('termiando');

            }
        }, 1000);
}

function ocultarBotones(){
    btn1.classList.add('oculto');
    btn2.classList.add('oculto');
    btn3.classList.add('oculto');
    btn4.classList.add('oculto');
    btn5.classList.add('oculto');
    btn6.classList.add('oculto');
}

function mostrarBotones(){
    btn1.classList.remove('oculto');
    btn2.classList.remove('oculto');
    btn3.classList.remove('oculto');
    btn4.classList.remove('oculto');
    btn5.classList.remove('oculto');
    btn6.classList.remove('oculto');
}


