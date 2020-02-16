//Resaltamos las celdas al pasar por encima
var celdas = $("td")
celdas.hover( seleccionar, deseleccionar)

var turn = "x"
//Añadimos un subtítulo con el turno
var tituloTurno = $("<h2></h2>")
tituloTurno.html("Es el turno de: " + turn.toUpperCase()).insertAfter($("h1"));
//Asignamos la función al evento del primer click
celdas.one( "click", firstClick);

//Creamos un botón  para reiniciar la partida
var botonReset = $("<button type=\"button\"></h2>")
botonReset.text("Reiniciar")
botonReset.click( reiniciarPartida )
botonReset.insertAfter($("h1"))

//Creamos el mensaje ganador
var mensajeGanador = $("<h3></h3>")
//Con un id para darle algo de estilo
mensajeGanador.attr("id", "mensaje-ganador");
//Lo ocultamos, para mostrarlo al ganar
mensajeGanador.hide()
$("body").append(mensajeGanador)


//Asociamos el evento 'keyDown' para poder desplazarnos con el teclado
$("body").one("keydown", primeraTecla );

//funcion para asignar el movimiento al teclado
function primeraTecla() {
    //Primero, seleccionamos la primera celda
    var selected = $("td#primera")
    selected.addClass("selected")
    //Y ahora comenzamos a jugar con el teclado
    $("body").on("keydown", moverCelda )
}

//Función para seleccionar una celda
function seleccionar() {
    if (!$(this).hasClass("selected")) {
        //Añadimos la clase 'selected' para darle estilo a la celda
        $(this).addClass("selected");
    }
}

//Función para quitarle la selección a una celda
function deseleccionar(){
    //Eliminamos la celda seleccionada
    $(".selected").removeClass("selected")
    //reseteamos el movimiento del teclado
    $("body").unbind("keydown").one("keydown", primeraTecla )
}

//Función que asigna la 'x' o la 'o' a una celda por primera vez
function firstClick(){
    //Ponemos el texto igual al turno, pero oculto
    $(this).text(turn.toUpperCase()).addClass(turn).hide()
    //Hacemos que aparezca animado
    $(this).show(500)
    //Y comprobamos si es una jugada ganadora
    comprobarTablero(turn, this);
    //Cambiammos de turno
    if(turn == "x") {
        turn = "o"
        tituloTurno.html("Es el turno de: " + turn.toUpperCase())
    } else {
        turn = "x"
        tituloTurno.html("Es el turno de: " + turn.toUpperCase())
    };
    //Asignamos a esta celda la función para el segundo click
    $(this).on("click", restClick )
}
//funcion que reasigna las celdas despues del primer click
function restClick() {
    //Preguntamos si se desea cambiar el valor
    var opcion = confirm("¿Deseas cambiar el valor de la celda?")
    //SOLO si se presiona aceptar
    if (opcion) {
        //Se comprueba el valor actual de la celda
        var newTurn = $(this).attr("class")
        //Se elimina el valor actual
        if(newTurn.includes("x")) {
            $(this).removeClass("x")
            newTurn = "o"
        } else {
            $(this).removeClass("o")
            newTurn = "x"
        };
        //Y se cambia por el contrario
        $(this).text(newTurn.toUpperCase()).addClass(newTurn)
        //Se vuelve a comprobar si hay una jugada ganadora
        comprobarTablero(newTurn, this);
    }
}

//funcion que comprueba si ha habido algún ganador
function comprobarTablero(turn, nuevo) {
    //Seleccionamos el tablero
     var tablero = $("tr");
     //Vamos a contar las coincidencias en las direcciones
     var coincidencias = 0;
     //Registramos si ha habido alguna victoria
     var victoria = false;
     //Conseguimos el tamaño de la fila
     var tamannoFila = tablero.length;
     //Conseguimos la posición en la fila
     var indexFila = $(nuevo).index("td") % tamannoFila;
     //Conseguimos el padre
     var padre = $(nuevo).parent()

    //Comprobar fila
    for(i = 0; i < tamannoFila - 1; i++) {
        //Comprobamos si los hermanos en la misma fila son iguales que él
        if($(nuevo).siblings().eq(i).hasClass(turn)) {
            coincidencias++;
        }
        coincidencias == 2 ? victoria = true : null;
    }
    coincidencias = 0
    //Comprobar columna
    for(i = 0; i < tablero.length - 1; i++) {
        //Comprobamos si los elementos en la misma columna pero distintas filas coinciden
        if(padre.siblings().eq(i).children().eq(indexFila).hasClass(turn)) {
            coincidencias++;
        }
        coincidencias == 2 ? victoria = true : null;
    }
    coincidencias = 0
    //Comprobar diagonal \ (izuierda-arriba hacia derecha-abajo)
    for(i = 0; i < tablero.length; i++) {
        //Comprobamos si los elementos desde una esquina a la otra coinciden
        if(padre.parent().children().eq(i).children().eq(i).hasClass(turn)) {
            coincidencias++;
        }
        coincidencias == 3 ? victoria = true : null;
    }
    coincidencias = 0
    //Comprobar diagonal / (derecha-arriba hacia izquierda-abajo)
    for(i = 0; i < tablero.length; i++) {
        //Comprobamos si los elementos desde una esquina a la otra coinciden
        if(padre.parent().children().eq(i).children().eq(tablero.length-1 - i).hasClass(turn)) {
            coincidencias++;
        }
        coincidencias == 3 ? victoria = true : null;
    }
    coincidencias = 0

    //En caso de victoria, Hacemos que aparezca el mensaje de la victoria
    if (victoria) {
        mensajeGanador.text("HA GANADO: " + turn.toUpperCase()).show(1000)
    }
}

//Función para reiniciar la partida
function reiniciarPartida() {
    var tablero = $("td");
    //Eliminamos las x y o de las casillas
    tablero.removeClass("x")
    tablero.removeClass("o")
    tablero.text("")
    //reseteamos el turno
    turn = "x"
    //Reiniciamos el evento de 'click'
    tablero.unbind("click").one("click", firstClick )
    //ocultamos el mensaje ganador
    $(mensajeGanador).hide(200)
}






//Función que administra el movimiento con el teclado
function moverCelda(e) {
    var selected = $(".selected")
    switch (e.which) {
        //Izquierda
        case 37:
            //Conseguimos el tamaño de la fila
            var tamannoFila = $("tr").length;
            //Conseguimos la posición del elemento
            var index = selected.index("td") % tamannoFila;
            //Comprobamos si se sale de los límites
            if (index != 0) {
                //Seleccionamos el elemento sigiente
                selected.prev().addClass("selected");
            } else {
                //Seleccionamos el último elemento
                selected.parent().children().eq(tamannoFila-1).addClass("selected");
            }
            //Eliminamos la selección actual
            selected.removeClass("selected");
            break;
        //Arriba
        case 38:
            //Conseguimos el tamaño de la fila
            var tamannoFila = $("tr").length;
            //Conseguimos la posición en la fila
            var index = selected.index("td") % tamannoFila;
            //Conseguimos el padre
            var padre = selected.parent()
            //Conseguimos el tamaño de la columna
            var tamannoColumna = padre.parent().children().length
            //Conseguimos la posición respecto a las columnas
            var indexColumna = padre.index("tr") % tamannoColumna
            //Comprobamos si al movernos nos salimos de los límites
            if (indexColumna != 0) {
                //Si no nos salimos, seleccionamos el elemento de la fila anterior en la misma posición que estábamos
                padre.prev().children().eq(index).addClass("selected");
            } else {
                //Si nos salimos, seleccionamos el elemento de la última fila, en la misma columna que estábamos
                padre.parent().children().eq(tamannoColumna-1).children().eq(index).addClass("selected");
            }
            selected.removeClass("selected");
            break;

            //Estos dos siguientes movimientos son análogos a los dos anteriores
        //Derecha
        case 39:
            //Conseguimos la posición del elemento
            var tamannoFila = $("tr").length;
            var index = selected.index("td") % tamannoFila;
            if (index != tamannoFila-1) {
                selected.next().addClass("selected");
            } else {
                selected.parent().children().eq(0).addClass("selected");
            }
            selected.removeClass("selected");
            break;
        //Abajo
        case 40:
            //Conseguimos la posición del elemento
            var tamannoFila = $("tr").length;
            var index = selected.index("td") % tamannoFila;
            var padre = selected.parent()
            var tamannoColumna = padre.parent().children().length
            var indexColumna = padre.index("tr") % tamannoColumna
            if (indexColumna != tamannoColumna-1) {
                padre.next().children().eq(index).addClass("selected");
            } else {
                padre.parent().children().eq(0).children().eq(index).addClass("selected");
            }
            selected.removeClass("selected");
            break;
        case 32:
            selected.click()
            break;
        default:
            null;
            break;
    };
}

