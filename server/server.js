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

// Health check for hosting providers
app.get('/health', (req, res) => res.send('ok'));

// Fallback to index.html for single-page app routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../website/index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`HTTP + WebSocket running on port ${PORT}`);
    console.log('PORT env:', process.env.PORT);
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
