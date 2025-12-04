// ---------------------- MODULES ----------------------
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import dgram from "dgram";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------- PATH HELPERS ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------- EXPRESS WEBSITE HOST ----------------------
const app = express();
const PORT = process.env.PORT || 10000;

// Serve your website folder statically
app.use(express.static(path.join(__dirname, "../website")));

const server = app.listen(PORT, () => {
    console.log(`HTTP + WebSocket running on port ${PORT}`);
});

// ---------------------- WEBSOCKET SERVER ----------------------
const wss = new WebSocketServer({ server });

// ---------------------- UDP SETUP ----------------------
const udp = dgram.createSocket("udp4");
const ESP32_IP = "192.168.1.25";  // Change
const UDP_PORT = 5005;

// ---------------------- WS HANDLERS ----------------------
wss.on("connection", (ws) => {
    console.log("Website connected");

    ws.on("message", (data) => {
        udp.send(data, UDP_PORT, ESP32_IP);
    });
});
