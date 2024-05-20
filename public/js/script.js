//HTML elements
//toggleDisableMando();
let clientId = null;
let gameId = null;
let playerColor = null;
const characters = [
    {
        id: 0, name: "Carolina", src: "0.png"
    }, {
        id: 1, name: "Cristina", src: "1.png"
    }, {
        id: 2, name: "Gabriela", src: "2.png"
    }, {
        id: 3, name: "Oscar", src: "3.png"
    },
    {
        id: 4, name: "Maria", src: "4.png"
    }, {
        id: 5, name: "Borja", src: "5.png"
    }, {
        id: 6, name: "Loreto", src: "6.png"
    }, {
        id: 7, name: "Nacho", src: "7.png"
    }, {
        id: 8, name: "Beatriz", src: "8.png"
    },
    {
        id: 9, name: "Pedro", src: "9.png"
    }, {
        id: 10, name: "Raquel", src: "10.png"
    }, {
        id: 11, name: "Sara", src: "11.png"
    }, {
        id: 12, name: "Inés", src: "12.png"
    }, {
        id: 13, name: "Daniel", src: "13.png"
    }, {
        id: 14, name: "Susana", src: "14.png"
    }, {
        id: 15, name: "Ramon", src: "15.png"
    }, {
        id: 16, name: "Catalina", src: "16.png"
    }, {
        id: 17, name: "Camino", src: "17.png"
    }, {
        id: 18, name: "Carlos", src: "18.png"
    }, {
        id: 19, name: "Jesus", src: "19.png"
    }, {
        id: 20, name: "Lola", src: "20.png"
    }, {
        id: 21, name: "Jorge", src: "21.png"
    }, {
        id: 22, name: "Carlota", src: "22.png"
    }, {
        id: 23, name: "angel", src: "23.png"
    }, {
        id: 24, name: "Teresa", src: "24.png"
    }, {
        id: 25, name: "Arturo", src: "25.png"
    }, {
        id: 26, name: "Liliana", src: "26.png"
    }, {
        id: 27, name: "Fátima", src: "27.png"
    }, {
        id: 28, name: "Marina", src: "28.png"
    }, {
        id: 29, name: "Alejandro", src: "29.png"
    }, {
        id: 30, name: "Paz", src: "30.png"
    }, {
        id: 31, name: "Alberto", src: "31.png"
    }, {
        id: 32, name: "Veronica", src: "32.png"
    }, {
        id: 33, name: "Paula", src: "33.png"
    }, {
        id: 34, name: "Mario", src: "34.png"
    }, {
        id: 35, name: "Blanca", src: "35.png"
    }, {
        id: 36, name: "Antonio Banderas", src: "banderas.png"
    }, {
        id: 37, name: "Marc Anthony", src: "anthony.png"
    }, {
        id: 38, name: "David Bisbal", src: "bisbal.png"
    }, {
        id: 39, name: "Jennifer Lopez", src: "jlo.png"
    }, {
        id: 39, name: "Jhonny Deep", src: "depp.jpg"
    }, {
        id: 40, name: "Pedro Sanchez", src: "pedrosanchez.png"
    }, {
        id: 41, name: "Rosalia", src: "rosalia.png"
    }, {
        id: 42, name: "Sharon Stone", src: "stone.png"
    }, {
        id: 43, name: "Will Smith", src: "will.png"
    }, {
        id: 44, name: "Jackie Chan", src: "chan.png"

    }];
    
//CON .baseURI de cualquier elemento de la web recoges el nombre del host y puerto que envia el html!!!!!!!!!!!!!!!!!!
var url=(document.getElementById("hostdata").baseURI.split("//")[1].split(":")[0]);
var puerto=document.getElementById("hostdata").attributes.puerto.nodeValue;
const URLWS="ws://"+url+":" + puerto;


var selectList = document.getElementById("selectCharacter");
for (var i = 0; i < characters.length; i++) {
    var option = document.createElement("option");
    option.value = "es" + characters[i].id;
    option.text = characters[i].name;
    selectList.appendChild(option);
}
let ws = new WebSocket(URLWS);
//let ws = new WebSocket("ws://adriandeharo.es:"+PORT);
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const btnGuessCharacter = document.getElementById("btnGuessCharacter");
const btnSendQ = document.getElementById("btnSendQ");
const txtGameId = document.getElementById("txtGameId");
const divPlayers = document.getElementById("divPlayers");
const divCharacter = document.getElementById("divCharacter");
const divBoard = document.getElementById("divBoard");


//Crea tablero y le da dinamismo
function startBoard() {
    for (var i = 0; i < characters.length; i++) {
        const divElement = document.createElement('div');
        divElement.className = "carta";
        divElement.id = "id" + i;
        const imgElement = document.createElement('img');
        imgElement.src = "./img/" + characters[i].src;
        divElement.appendChild(imgElement);
        divBoard.appendChild(divElement);
    }
    const cartas = divBoard.childNodes;
    for (var i = 0; i < cartas.length; i++) {
        cartas[i].addEventListener('click', toggleReverse, false);
    }
}

function toggleDisableMando(texto) {
    console.log("toggleDisableMando: " + texto);
    $("#mando").attr("disabled", "disabled").off('click');
    var x1 = $("#mando").hasClass("disabledDiv");
    (x1 == true) ? $("#mando").removeClass("disabledDiv") : $("#mando").addClass("disabledDiv");
    toggleDisableMandoaux(document.getElementById("mando"));
}

function toggleDisableMandoaux(el) {
    try {
        el.disabled = el.disabled ? false : true;
    } catch (E) { }
    if (el.childNodes && el.childNodes.length > 0) {
        for (var x = 0; x < el.childNodes.length; x++) {
            toggleDisableMandoaux(el.childNodes[x]);
        }
    }
}

function toggleReverse(ev) {
    console.log(ev.target.parentNode.id.substring(2));

    if (ev.originalTarget.attributes.src.value == "./img/back.png")
        ev.originalTarget.attributes.src.value = "./img/" + characters[ev.target.parentNode.id.substring(2)].src;
    else {
        ev.originalTarget.attributes.src.value = "./img/back.png";
    }
}

function Confirm(title, msg, $true, $false) {
    /*change*/
    var $content =
        "<div class='dialog-ovelay'>" +
        "<div class='dialog'><header>" +
        " <h3> " +
        title +
        " </h3> " +
        "<i class='fa fa-close'></i>" +
        "</header>" +
        "<div class='dialog-msg'>" +
        " <p> " +
        msg +
        " </p> " +
        "</div>" +
        "<footer>" +
        "<div class='controls'>" +
        " <button class='button button-danger doAction'>" +
        $true +
        "</button> " +
        " <button class='button button-default cancelAction'>" +
        $false +
        "</button> " +
        "</div>" +
        "</footer>" +
        "</div>" +
        "</div>";
    $("body").prepend($content);
    $(".doAction").click(function () {

        const payLoad = {
            "method": "question2serverTorF",
            gameId,
            clientId,
            "pregunta": msg,
            "respuesta": true
        }
        ws.send(JSON.stringify(payLoad));



        $(this)
            .parents(".dialog-ovelay")
            .fadeOut(500, function () {
                $(this).remove();
            });
    });
    $(".cancelAction, .fa-close").click(function () {
        const payLoad = {
            "method": "question2serverTorF",
            gameId,
            clientId,
            "pregunta": msg,
            "respuesta": false
        }
        ws.send(JSON.stringify(payLoad));


        $(this)
            .parents(".dialog-ovelay")
            .fadeOut(500, function () {
                $(this).remove();
            });
    });
}

//wiring events
btnJoin.addEventListener("click", e => {
    if (gameId === null)
        gameId = txtGameId.value;
    const payLoad = {
        "method": "join",
        clientId,
        gameId
    }
    ws.send(JSON.stringify(payLoad));
});

btnCreate.addEventListener("click", e => {
    const payLoad = {
        "method": "create",
        gameId,
        clientId
    }
    ws.send(JSON.stringify(payLoad));
});

btnSendQ.addEventListener("click", e => {
    const payLoad = {
        "method": "question2server",
        clientId,
        gameId,
        "question": document.getElementById("pregunta").value
    }
    ws.send(JSON.stringify(payLoad));
});

btnGuessCharacter.addEventListener("click", e => {
    //console.log(document.getElementById("selectCharacter").value.substring(2));
    const payLoad = {
        "method": "guess2server",
        clientId,
        gameId,
        "guess": document.getElementById("selectCharacter").value.substring(2)
    }
    ws.send(JSON.stringify(payLoad));
});

function displayGames(games) {
    //console.log(games);
    //const listado = document.getElementById("listadoPartidas");
    /*     while (listadoPartidas.firstChild)
            listadoPartidas.removeChild(listadoPartidas.firstChild) */
    divPlayers.innerHTML = "<h4> Partidas disponibles</h4>";
    for (const item in games) {
        const d = document.createElement("div");
        const l = document.createElement("label");
        l.textContent = item;
        console.log(item);
        d.appendChild(l);
        const button = document.createElement("button");
        button.className = "button";
        button.onclick = function(){
            const payLoad = {
                "method": "join",
                clientId,
                "gameId":item
            }
            ws.send(JSON.stringify(payLoad));
          };
          button.innerHTML = "join";
          d.appendChild(button);
          divPlayers.appendChild(d);

    }
}

ws.onmessage = message => {
    //message.data
    const response = JSON.parse(message.data);
    //connect
    if (response.method === "connect") {
        clientId = response.clientId;
        console.log("Client id Set successfully " + clientId);
    }

    //create
    if (response.method === "create") {
        gameId = response.game.id;
        console.log("game successfully created with id " + response.game.id);
        console.log(response.game.created_by + " x " + clientId);
        if (response.game.created_by == clientId) {
            divPlayers.innerHTML = "Esperando un rival... pasale el codigo: " + response.game.id;
        } else
            displayGames(response.games);
    }
    if (response.method === "question2client") {
        toggleDisableMando("question2client");
        Confirm("Pregunta", response.question, "Si", "No",);
    }
    if (response.method === "response2clientTorF") {
        //TODO: TOGGLE TURNO:  preguntas y guesses
        toggleDisableMando("response2clientTorF");
        if (response.respuesta)
            alert("El adversario contestó SI a tu pregunta: " + response.pregunta);
        else
            alert("El adversario contestó NO a tu pregunta: " + response.pregunta);
    }
    if (response.method === "guess2client") {
        toggleDisableMando("guess2client");
        console.log(response);
        if (response.guessResult)
            alert("El adversario acertó " + characters[response.guess].name);
        else
            alert("El adversario NO acertó " + characters[response.guess].name);
    }

    //join
    if (response.method === "join") {
        const game = response.game;

        while (divPlayers.firstChild)
            divPlayers.removeChild(divPlayers.firstChild)

        game.clients.forEach(c => {
            const d = document.createElement("div");
            d.textContent = c.clientId;
            divPlayers.appendChild(d);
            //crear character
            if (clientId == c.clientId) {
                const divChar = document.createElement('div');
                divChar.className = "carta";
                divChar.id = "char" + c.character.id;
                const imgElement = document.createElement('img');
                imgElement.src = "./img/" + c.character.id + ".png";
                divChar.appendChild(imgElement);
                divCharacter.appendChild(divChar);
            }
        });

        while (divBoard.firstChild)
            divBoard.removeChild(divBoard.firstChild)
        startBoard();

        if (clientId != game.created_by) {
            toggleDisableMando("join");
            console.log("Se deshabilita por no ser creador");
        }
        //solo desactivar uno aleatorio

    }
}


/* for Bulma buttons with modals to work */
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });
});
/* end of bulma working */