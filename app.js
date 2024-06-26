const connectButton = document.getElementById('connect-button');
const disconnectButton = document.getElementById('disconnect-button');
const fileInput = document.getElementById('file-input');
const dataInput = document.getElementById('data-input');
const dataSelect = document.getElementById('data-select');
const dataLimitCheck = document.getElementById('data-limit');
const dataLimitInput = document.getElementById('data-limit-input');
const sendButton = document.getElementById('send-button');
const output = document.getElementById('output');

let port;
let writer;

connectButton.addEventListener('click', async () => {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        writer = port.writable.getWriter();
    } catch (error) {
        output.textContent = `Error: ${error}`;
    }
    
    output.textContent = 'Connected to serial port.';
    connectButton.disabled = true;
    dataSelect.disabled = false;
    dataInput.disabled = false;
    disconnectButton.disabled = false;
    fileInput.disabled = false;
    sendButton.disabled = false;
});

dataLimitCheck.addEventListener('change', () => {
    if (dataLimitCheck.checked) {
        dataLimitInput.disabled = false;
    }else{
        dataLimitInput.disabled = true;
        dataLimitInput.value = 0;
    }
});


disconnectButton.addEventListener('click', async () => {
    try {
        await writer.releaseLock();
        await port.close();
        output.textContent = 'Disconnected from serial port.';
    } catch (error) {
        output.textContent = `Error: ${error}`;
    }
        connectButton.disabled = false;
        disconnectButton.disabled = true;
        fileInput.disabled = true;
        dataSelect.disabled = true;
        dataInput.disabled = true;
        sendButton.disabled = true;
});

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        populateSelect(rows);
    };
    reader.readAsText(file);
});

function populateSelect(rows) {
    dataSelect.innerHTML = '';
    rows.forEach((row, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = row.join(', ');
        dataSelect.appendChild(option);
    });

    dataSelect.disabled = false;
}

sendButton.addEventListener('click', async () => {
    const selectedText = dataInput.value;

    try {
        await writer.write(new TextEncoder().encode(selectedText));
        output.textContent = `Sent: "${selectedText}"`;
    } catch (error) {
        output.textContent = `Error: ${error}`;
    }
});

dataSelect.addEventListener('change', (event) => {
    const index = event.target.value;

    const dataLimit = parseInt(dataLimitInput.value);

    if(dataLimitCheck.checked && dataLimit > 0){
        const dataArray = event.target.options[index].text.split(',');
        const firstItem = dataArray[0].slice(0, dataLimit)
        dataInput.value = [firstItem, ...dataArray.slice(1)].join(',');
    }else{
        dataInput.value = event.target.options[index].text;
    }

});
