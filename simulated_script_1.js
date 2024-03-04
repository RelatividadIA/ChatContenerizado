// Definición de la base URL para la API de FastAPI
const URL_BASE = "http://127.0.0.1:8000/chatgpt";

// Prompt de entrenamiento para configurar el contexto de la conversación
const training_prompt = `

Eres Emilio Einstein, una mezcla entre un matemático puro y Albert

`;

let conversationHistory = [
    { role: "system", content: training_prompt}
];

// Función para renderizar el historial de la conversación en la interfaz
function renderConversationHistory() {
    let conversationElement = document.getElementById("apiResponse");
    conversationElement.innerHTML = ''; // Limpiar la conversación actual

    // Filtrar los mensajes para excluir aquellos con role "system"
    conversationHistory.filter(message => message.role !== "system").forEach(message => {
        let messageElement = document.createElement("div");
        messageElement.classList.add('message-bubble');
        messageElement.classList.add(message.role === "user" ? "user" : "assistant");

        // Aplicar la clase writing si el mensaje es "escribiendo" o alguna variación de este
        if (message.content.startsWith("escribiendo")) {
            messageElement.classList.add("writing");
        }

        messageElement.innerText = message.content;
        conversationElement.appendChild(messageElement);
    });
    let lastMessageElement = conversationElement.lastChild;
    if (lastMessageElement) {
        lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
}



// Función para resetear la conversación
function resetConversation() {
    document.getElementById('prompt').value = '';
    document.getElementById('apiResponse').innerHTML = ''; // Limpiar la visualización de la conversación
    conversationHistory = [{ role: "system", content: training_prompt }]; // Reiniciar con el prompt de entrenamiento
    renderConversationHistory();
}

// Función para enviar mensajes
// Función para enviar mensajes
function sendMessage() {
    let userPrompt = document.getElementById("prompt").value.trim();
    if (userPrompt === '') return; // No enviar mensajes vacíos

    // Mostrar el mensaje del usuario inmediatamente
    conversationHistory.push({ role: "user", content: userPrompt });
    renderConversationHistory();

    // Inicializar "escribiendo" con puntos dinámicos
    let dots = "";
    let writingIndex = conversationHistory.length; // Índice para la burbuja "escribiendo..."
    conversationHistory.push({ role: "assistant", content: `escribiendo${dots}` });
    renderConversationHistory();

    // Intervalo para actualizar el mensaje "escribiendo..."
    let writingInterval = setInterval(() => {
        dots = dots.length < 3 ? dots + "." : "";
        conversationHistory[writingIndex] = { role: "assistant", content: `escribiendo${dots}` };
        renderConversationHistory();
    }, 500); // Actualiza cada 500 ms

    // Limpia el área de texto después de enviar el mensaje
    document.getElementById('prompt').value = '';

    // Preparar datos para la API
    let dataToSend = {
        messages: conversationHistory.slice(0, -1) // Excluir "escribiendo..."
    };

    // Llamada a la API para procesar la respuesta
    fetch(URL_BASE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Psico-API-Key': '94705224-bhvg-4745-mac7-f15c455858f4'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(writingInterval); // Detener el intervalo de "escribiendo..."
        // Remover la burbuja "escribiendo..." antes de añadir la respuesta real
        conversationHistory.splice(writingIndex, 1); // Eliminar el elemento en el índice de "escribiendo..."
        if (!conversationHistory.find(m => m.content === data.response)) {
            conversationHistory.push({ role: "assistant", content: data.response });
        }
        renderConversationHistory();
    })
    .catch((error) => {
        clearInterval(writingInterval); // Detener el intervalo de "escribiendo..." en caso de error
        console.error('Error:', error);
        // Remover la burbuja "escribiendo..." y mostrar error
        conversationHistory.splice(writingIndex, 1); // Eliminar "escribiendo..."
        conversationHistory.push({ role: "assistant", content: `Error: ${error}` });
        renderConversationHistory();
    });
}

// Resto del código aquí (sin cambios necesarios)


// Agregar evento al formulario para manejar el envío de mensajes
document.getElementById("promptForm").addEventListener("submit", function(event){
    event.preventDefault();
    sendMessage();
});

// Evento para detectar la tecla Enter y enviar el mensaje
document.getElementById('prompt').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento por defecto del Enter
        sendMessage();
    }
});

// Evento para el botón de resetear la conversación
document.querySelector('.btn-secondary').addEventListener('click', resetConversation);

// Inicializar la conversación al cargar la página
renderConversationHistory();

// Evento para el botón de resetear la conversación
document.querySelector('.btn-clear').addEventListener('click', resetConversation);
