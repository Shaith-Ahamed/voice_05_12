let ws;

document.getElementById("startBtn").onclick = async () => {
    ws = new WebSocket("wss://YOUR_RENDER_URL.onrender.com"); // CHANGE THIS

    ws.onopen = () => {
        console.log("Connected to cloud WebSocket");
    };

    await startAudio();
};

async function startAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();

    await ctx.audioWorklet.addModule("PCMProcessor.js");
    const source = ctx.createMediaStreamSource(stream);
    const processor = new AudioWorkletNode(ctx, "pcm-processor");

    processor.port.onmessage = (event) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(event.data);
    };

    source.connect(processor);
}
