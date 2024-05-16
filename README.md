# WebSocket Game Server

Este repositorio contiene un servidor de juego simple implementado con Node.js, Express y WebSocket. Permite a los usuarios conectarse, crear y unirse a juegos, y comunicarse mediante mensajes en tiempo real.

## Descripción

Este proyecto es un servidor de juego que utiliza WebSocket para la comunicación en tiempo real entre clientes. Los usuarios pueden crear nuevos juegos, unirse a juegos existentes y enviar preguntas y respuestas entre ellos. Los personajes del juego son asignados aleatoriamente a cada jugador.

## Características

- Servidor HTTP con Express para servir archivos estáticos y manejar rutas.
- Servidor WebSocket para manejar conexiones y mensajes en tiempo real.
- Gestión de juegos y jugadores.
- Comunicación en tiempo real entre jugadores con preguntas y respuestas.

## Requisitos

- Node.js (versión 12 o superior)

## Instalación

1. Clona este repositorio en tu máquina local.
    ```bash
    git clone https://github.com/tu-usuario/websocket-game-server.git
    cd websocket-game-server
    ```

2. Instala las dependencias necesarias.
    ```bash
    npm install
    ```

3. Inicia el servidor.
    ```bash
    node index.js
    ```

## Uso

1. Abre tu navegador y navega a `http://localhost:6001` para cargar la interfaz del juego.
2. El servidor WebSocket escucha en `ws://localhost:9090`.

### Endpoints

- **GET /**: Sirve el archivo `index.html` que debería estar en el directorio raíz.
- **Archivos estáticos**: Los archivos en el directorio `public` son servidos como estáticos.

## Estructura del Proyecto

- `index.js`: Archivo principal que contiene la lógica del servidor HTTP y WebSocket.
- `public/`: Directorio para archivos estáticos.
- `index.html`: Archivo HTML principal.

## Ejemplo de Mensajes WebSocket

### Crear un Juego

**Solicitud:**
```json
{
    "method": "create",
    "clientId": "unique_client_id"
}
