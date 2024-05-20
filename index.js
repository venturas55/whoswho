const WS_PORT = 9090;
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.listen(6001, () => console.log("Listening on http port http://localhost:6001"))


//creo server websocket
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(WS_PORT, () => console.log("and Listening sockets on 9090.. "));
// función middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
//hashmap clients
let clients = {};
let games = {};
let gameId;

//APP LISTEN 
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'index.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file.');
    }

    // Asegúrate de que la variable data está definida y contiene el contenido del archivo HTML
    const modifiedData = data.replace('<!--HOST_PLACEHOLDER-->', WS_PORT);

    res.send(modifiedData);
  });
});

const characters = [
    {
        id: 0, name: "Carolina", src: "0.png"
    }, {
        id: 1, name: "Cristina", src: "1.png"
    }, {
        id: 2, name: "Gabriela", src: "2.png"
    }, {
        id: 3, name: "Oscar", src: "3.png"
    }, {
        id: 4, name: "Maria", src: "4.png"
    }, {
        id: 5, name: "Borja", src: "5.png"
    }, {
        id: 6, name: "Loreto", src: "6.png"
    }, {
        id: 7, name: "Nacho", src: "7.png"
    }, {
        id: 8, name: "Beatriz", src: "8.png"
    }, {
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
        id: 40, name: "Jhonny Deep", src: "depp.jpg"
    }, {
        id: 41, name: "Pedro Sanchez", src: "pedrosanchez.png"
    }, {
        id: 42, name: "Rosalia", src: "rosalia.png"
    }, {
        id: 43, name: "Sharon Stone", src: "stone.png"
    }, {
        id: 44, name: "Will Smith", src: "will.png"
    }, {
        id: 45, name: "Jackie Chan", src: "chan.png"

    }];

const wsServer = new websocketServer({
    "httpServer": httpServer
})
wsServer.on("request", request => {
    //connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"));
    connection.on("close", () => {
            for (let elemento of Object.keys(games)) {
            console.log(games[elemento]);

            for (let j = 0; j < games[elemento].clients.length; j++) {
                if (games[elemento].clients[j].clientId == clientId) {
                    console.log("existe uno " + games[elemento].clients[j]);
                    games[elemento].clients.splice(j, 1);
                } else {
                    console.log("NO existe uno " + clientId);
                }
            }
        }
    });
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        //I have received a message from the client
        //a user want to create a new game
        if (result.method === "create") {
            const clientId = result.clientId;
            gameId = guid();
            games[gameId] = {
                "id": gameId,
                "clients": [],
                "questions": [],
                "created_by": result.clientId
            }
            games[gameId].clients.push({
                clientId,
                "character": characters[Math.floor(Math.random() * characters.length)]
            })

            const payLoad = {
                "method": "create",
                "game": games[gameId],
                "games": games
            }

            //TODO: si un usuario crea de nuevo partida, eliminar la anterior.


            //loop through all clients and tell them that data
            for (const property in clients) {
                clients[property].connection.send(JSON.stringify(payLoad));
            }
        }
        //a client want to join
        if (result.method === "join") {

            const clientId = result.clientId;
            const gameId = result.gameId;
            games[gameId].clients.push({
                clientId,
                "character": characters[Math.floor(Math.random() * characters.length)]
            })
            const game = games[gameId];
            if (games[gameId].clients.length > 2) {
                console.log("sorry max players reach");
                return;
            }

            //start the game
            if (game.clients.length === 2) console.log("arranca");

            const payLoad = {
                "method": "join",
                "game": game
            }
            //loop through all clients and tell them that people has joined
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
        }
        //a user plays
        if (result.method === "question2server") {
            //console.log(result);
            const payLoad = {
                "method": "question2client",
                "gameId": result.gameId,
                "question": result.question
            }

            //loop through all the rest of clients who havent send the message and tell them that message 
            for (let i = 0; i < games[result.gameId].clients.length; i++) {
                if (games[result.gameId].clients[i].clientId != clientId) {
                    clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(payLoad));
                }
            }

        }
        if (result.method === "question2serverTorF") {
            //console.log(result);
            const payLoad = {
                "method": "response2clientTorF",
                "gameId": result.gameId,
                "pregunta": result.pregunta,
                "respuesta": result.respuesta
            }
            //almmaceno la pregunta
            games[result.gameId].questions.push({ "clientId": result.clientId, "pregunta": result.pregunta, "respuesta": result.respuesta })
            //loop through all the rest of clients who havent send the message and tell them that message 
            for (let i = 0; i < games[result.gameId].clients.length; i++) {
                if (games[result.gameId].clients[i].clientId != clientId) {
                    clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(payLoad));
                }
            }



        }
        if (result.method === "guess2server") {
            //console.log(result);
            let payLoad = {
                "method": "guess2client",
                "gameId": result.gameId,
                "guess": result.guess
            }
            //obtener la id del rival. 
            let rivalId = "";
            games[result.gameId].clients[0].clientId == result.clientId ? rivalId = games[result.gameId].clients[1].clientId : rivalId = games[result.gameId].clients[0].clientId;
            //fin e obtener el rival
            // console.log(games[result.gameId].clients);
            // console.log(result.gameId + " rival " + rivalId);
            //console.log("----------------------------------------------------------------");
            // console.log(games[result.gameId].clients.filter(el => el.clientId == rivalId)[0]);
            //console.log(games[result.gameId]);
            if (result.guess == games[result.gameId].clients.filter(el => el.clientId == rivalId)[0].character.id) {
                //loop through all the rest of clients who havent send the message and tell them that message 
                for (let i = 0; i < games[result.gameId].clients.length; i++) {
                    payLoad.guessResult = true;
                    clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(payLoad));
                    //clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(result.clientId + ' no lo ha adivinado ' + result.guess + " " + characters[result.guess].name));
                }
            } else {
                //loop through all the rest of clients who havent send the message and tell them that message 
                for (let i = 0; i < games[result.gameId].clients.length; i++) {
                    payLoad.guessResult = false;
                    clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(payLoad));
                }

            }
        }
        // console.log(games[gameId]);
    })

    //generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    };

    const payLoad = {
        "method": "connect",
        "clientId": clientId,
        "games": games
    };
    //send back the client connect
    connection.send(JSON.stringify(payLoad));

})

function updateGameState() {
    //{"gameid", fasdfsf}
    for (const g of Object.keys(games)) {
        const game = games[g]
        const payLoad = {
            "method": "update",
            "game": game
        }

        game.clients.forEach(c => {
            clients[c.clientId].connection.send(JSON.stringify(payLoad))
        });
    }

    //games[gameId].timeoutID = setTimeout(updateGameState, 500);
}

function S5() {
    //e ha tenido que añadir la condicion de que empiece por una letra para guardar objetos que llevan el id.
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return characters.charAt(Math.floor(Math.random() * characters.length)) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
// then to call it, plus stitch in '4' in the third group
const guid = () => (S5()).toUpperCase();


