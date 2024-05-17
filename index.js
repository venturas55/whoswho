const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
app.listen(6001, () => console.log("Listening on http port http://localhost:6001"))


//creo server websocket
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on http://localhost:9090"));
// función middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
//hashmap clients
let clients = {};
let games = {};
let gameId;

//APP LISTEN 
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"))

const characters = [
    {
        id: 0, name: "Carolina"
    }, {
        id: 1, name: "Cristina"
    }, {
        id: 2, name: "Gabriela"
    }, {
        id: 3, name: "Oscar"
    },
    {
        id: 4, name: "Maria",
    }, {
        id: 5, name: "Borja",
    }, {
        id: 6, name: "Loreto"
    }, {
        id: 7, name: "Nacho"
    }, {
        id: 8, name: "Beatriz"
    },
    {
        id: 9, name: "Pedro"
    }, {
        id: 10, name: "Raquel"
    }, {
        id: 11, name: "Sara"
    }, {
        id: 12, name: "Inés"
    }, {
        id: 13, name: "Daniel"
    }, {
        id: 14, name: "Susana"
    }, {
        id: 15, name: "Ramon"
    }, {
        id: 16, name: "Catalina"
    }, {
        id: 17, name: "Camino"
    }, {
        id: 18, name: "Carlos"
    }, {
        id: 19, name: "Jesus"
    }, {
        id: 20, name: "Lola"
    }, {
        id: 21, name: "Jorge"
    }, {
        id: 22, name: "Carlota"
    }, {
        id: 23, name: "angel"
    }, {
        id: 24, name: "Teresa"
    }, {
        id: 25, name: "Arturo"
    }, {
        id: 26, name: "Liliana"
    }, {
        id: 27, name: "Fátima"
    }, {
        id: 28, name: "Marina"
    }, {
        id: 29, name: "Alejandro"
    }, {
        id: 30, name: "Paz"
    }, {
        id: 31, name: "Alberto"
    }, {
        id: 32, name: "Veronica"
    }, {
        id: 33, name: "Paula"
    }, {
        id: 34, name: "Mario"
    }, {
        id: 35, name: "Blanca"
    }];

const wsServer = new websocketServer({
    "httpServer": httpServer
})
wsServer.on("request", request => {
    //connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"));
    connection.on("close", () => {
        console.log("<" + clientId);
        console.log("closed!");
        console.log(games);
        for (let i = 0; i < games.length; i++) {
            for (let j = 0; j < games[i].clients.length; j++) {
                if (games[i].clients[j].clientId == clientId) {
                    console.log("existe uno " + clientId);
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
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
            console.log(games);
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
            })
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
        "clientId": clientId
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

function S4() {
    //e ha tenido que añadir la condicion de que empiece por una letra para guardar objetos que llevan el id.
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return characters.charAt(Math.floor(Math.random() * characters.length)) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4()).toUpperCase();


