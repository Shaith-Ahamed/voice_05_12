// // // ---------------------- MODULES ----------------------
// // import express from "express";
// // import WebSocket, { WebSocketServer } from "ws";
// // import dgram from "dgram";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // // ---------------------- PATH HELPERS ----------------------
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // ---------------------- EXPRESS WEBSITE HOST ----------------------
// // const app = express();
// // const PORT = process.env.PORT || 10000;

// // // Serve your website folder statically
// // app.use(express.static(path.join(__dirname, "../website"))); 

// // // Health check for hosting providers
// // app.get('/health', (req, res) => res.send('ok'));

// // // Fallback to index.html for single-page app routes
// // app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../website/index.html'));
// // });

// // const server = app.listen(PORT, () => {
// //     console.log(`HTTP + WebSocket running on port ${PORT}`);
// //     console.log('PORT env:', process.env.PORT);
// // });

// // // ---------------------- WEBSOCKET SERVER ----------------------
// // const wss = new WebSocketServer({ server });

// // // ---------------------- UDP SETUP ----------------------
// // const udp = dgram.createSocket("udp4");
// // const ESP32_IP = "10.221.158.136";  // Change
// // const UDP_PORT = 5005;

// // // ---------------------- WS HANDLERS ----------------------
// // wss.on("connection", (ws) => {
// //     console.log("Website connected");

// //     ws.on("message", (data) => {
// //         udp.send(data, UDP_PORT, ESP32_IP);
// //     });
// // });


// // ---------------------- MODULES ----------------------
// import express from "express";
// import WebSocket, { WebSocketServer } from "ws";
// import dgram from "dgram";
// import path from "path";
// import { fileURLToPath } from "url";
// import { createServer } from "http";

// // ---------------------- PATH HELPERS ----------------------
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ---------------------- EXPRESS APP ----------------------
// const app = express();
// const PORT = process.env.PORT || 10000;

// // Serve your website folder statically
// app.use(express.static(path.join(__dirname, "../website"))); 

// // Health check for hosting providers
// app.get('/health', (req, res) => res.send('ok'));

// // Fallback to index.html for single-page app routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../website/index.html'));
// });

// // ---------------------- CREATE HTTP SERVER ----------------------
// // Create a single HTTP server that handles both Express and WebSocket
// const server = createServer(app);

// // ---------------------- WEBSOCKET SERVER ----------------------
// // Attach WebSocket server to the SAME HTTP server
// const wss = new WebSocketServer({ server });

// // ---------------------- UDP SETUP ----------------------
// const udp = dgram.createSocket("udp4");
// const ESP32_IP = "192.168.1.100";  // Change this to your ESP32's IP
// const UDP_PORT = 5005;

// // ---------------------- WS HANDLERS ----------------------
// wss.on("connection", (ws) => {
//     console.log("Website connected to WebSocket");

//     ws.on("message", (data) => {
//         console.log(`Received WebSocket message (${data.length} bytes)`);
//         // Forward to ESP32 via UDP
//         udp.send(data, UDP_PORT, ESP32_IP, (err) => {
//             if (err) console.error("UDP send error:", err);
//         });
//     });

//     ws.on("close", () => {
//         console.log("Website disconnected");
//     });

//     ws.on("error", (err) => {
//         console.error("WebSocket error:", err);
//     });
// });

// // ---------------------- START SERVER ----------------------
// // Start the single server on the Railway-provided PORT
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`HTTP: http://localhost:${PORT}`);
//     console.log(`WebSocket: ws://localhost:${PORT}`);
//     console.log(`Forwarding to ESP32 at ${ESP32_IP}:${UDP_PORT}`);
// });

// // ---------------------- UDP ERROR HANDLING ----------------------
// udp.on("error", (err) => {
//     console.error("UDP error:", err);
// });

// // Handle server shutdown
// process.on('SIGINT', () => {
//     console.log('Shutting down...');
//     udp.close();
//     server.close();
//     process.exit(0);
// });


// ---------------------- MODULES ----------------------
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

// ---------------------- PATH HELPERS ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------- EXPRESS APP ----------------------
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

// ---------------------- CREATE HTTP SERVER ----------------------
const server = createServer(app);

// ---------------------- WEBSOCKET SERVER ----------------------
// Attach WebSocket server to the same HTTP server
const wss = new WebSocketServer({ server });

// ---------------------- WS HANDLERS ----------------------
wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", (data) => {
        console.log(`Received WebSocket message (${data.length} bytes)`);

        // Broadcast to all connected clients (optional)
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on("close", () => {
        console.log("WebSocket client disconnected");
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});

// ---------------------- START SERVER ----------------------
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`HTTP: http://localhost:${PORT}`);
    console.log(`WebSocket ready for clients`);
});

// ---------------------- HANDLE SHUTDOWN ----------------------
process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.close();
    process.exit(0);
});


