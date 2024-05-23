const connectButton = document.getElementById('connect-button');
const disconnectButton = document.getElementById('disconnect-button');
const sendButton = document.getElementById('send-button');
const inputBox = document.getElementById('input-box');
const output = document.getElementById('output');
let port;
let writer;

connectButton.addEventListener('click', async () => {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        writer = port.writable.getWriter();

        output.textContent = 'Connected to serial port.';
        connectButton.disabled = true;
        disconnectButton.disabled = false;
        inputBox.disabled = false;
        sendButton.disabled = false;
    } catch (error) {
        output.textContent = `Error: ${error}`;
    }
});

disconnectButton.addEventListener('click', async () => {
    try {
        await writer.releaseLock();
        await port.close();
        output.textContent = 'Disconnected from serial port.';
        connectButton.disabled = false;
        disconnectButton.disabled = true;
        inputBox.disabled = true;
        sendButton.disabled = true;
    } catch (error) {
        output.textContent = `Error: ${error}`;
    }
});

sendButton.addEventListener('click', async () => {
    const text = inputBox.value;
    try {
        await writer.write(new TextEncoder().encode(text));
        output.textContent = `Sent: ${text}`;
    } catch (error) {
        output.textContent = `Error: ${error}`;
    }
});