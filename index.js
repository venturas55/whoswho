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
const clients = {};
const games = {};


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
        console.log("closed!");

    });
    connection.on("message", message => {
        var gameId;
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
            }
            games[gameId].clients.push({
                "clientId": clientId,
                "character": characters[Math.floor(Math.random() * characters.length)]
            })

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
            //console.log(payLoad);
        }

        //a client want to join
        if (result.method === "join") {

            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length >= 2) {
                //sorry max players reach
                return;
            }
            game.clients.push({
                "clientId": clientId,
                "character": characters[Math.floor(Math.random() * characters.length)]
            })
            //start the game
            //if (game.clients.length === 2) updateGameState();

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
            console.log(result);
            const payLoad = {
                "method": "question2Client",
                "gameId": result.gameId,
                "question": result.question
            }

            //loop through all the rest of clients who havent send the message and tell them that message 
            for (var i = 0; i < games[result.gameId].clients.length; i++) {
                if (games[result.gameId].clients[i].clientId != clientId) {
                    clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(payLoad));
                }
            }

        }
        if (result.method === "question2serverTorF") {
            console.log(result);
            const payLoad = {
                "method": "response2ClientTorF",
                "gameId": result.gameId,
                "respuestaTorF": result.respuestaTorF
            }

            //loop through all the rest of clients who havent send the message and tell them that message 
            for (var i = 0; i < games[result.gameId].clients.length; i++) {
                if (games[result.gameId].clients[i].clientId != clientId) {
                    clients[games[result.gameId].clients[i].clientId].connection.send(JSON.stringify(payLoad));
                }
            }



        }



        console.log(games[gameId]);

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
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4()).toLowerCase();


