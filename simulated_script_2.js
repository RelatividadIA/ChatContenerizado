


// Definimos la variable chat_id con el valor 1

var conversations = {}; 






// Definición de la base URL para la API de FastAPI
const URL_BASE = "http://127.0.0.1:8000/chatgpt";

// Prompt de entrenamiento para configurar el contexto de la conversación
const training_prompt = `
Eres Emilio Einstein, una mezcla entre un matemático puro y Albert
`;
// Creamos un objeto para almacenar las historias de conversación basadas en chat_id


document.addEventListener('DOMContentLoaded', function () {
    cargarChat('1');
    cargarChat('2');
    cargarChat('3');
    cargarChat('4');
    cargarChat('5');
    cargarChat('6');

});



