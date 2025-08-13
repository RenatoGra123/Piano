// O Web Audio API permite um controle mais avançado sobre o áudio.
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Objeto para armazenar os buffers de áudio pré-carregados para melhor performance.
const audioBuffers = {};

// Função assíncrona para carregar um arquivo de som.
async function loadSound(url, noteName) {
    try {
        const response = await fetch(url); // Busca o arquivo de áudio
        const arrayBuffer = await response.arrayBuffer(); // Converte para ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer); // Decodifica o áudio
        audioBuffers[noteName] = audioBuffer; // Armazena no objeto audioBuffers
        console.log(`Sound loaded: ${noteName}`); // Mensagem de confirmação para depuração
    } catch (error) {
        console.warn(`Warning: Sound for ${noteName} (${url}) not found or could not be loaded. This key will not play sound.`, error); // Aviso para sons não carregados
    }
}

// Função para reproduzir um som específico e aplicar o efeito visual.
function playSound(noteName) {
    const audioBuffer = audioBuffers[noteName];
    if (!audioBuffer) {
        console.warn(`Sound for ${noteName} is not available.`); // Aviso se o som não foi carregado
        return; // Não faz nada se o som não estiver carregado
    }

    const source = audioContext.createBufferSource(); // Cria uma fonte de áudio
    source.buffer = audioBuffer; // Define o buffer de áudio
    source.connect(audioContext.destination); // Conecta a fonte ao destino de áudio (seus alto-falantes)
    source.start(0); // Inicia a reprodução imediatamente

    // Adiciona o efeito visual
    const keyElement = document.querySelector(`.key[data-note="${noteName}"]`);
    if (keyElement) {
        keyElement.classList.add('active'); // Adiciona uma classe 'active'
        setTimeout(() => {
            keyElement.classList.remove('active'); // Remove a classe 'active' após um curto período
        }, 200); // Duração do efeito em milissegundos
    }
}

// --- INÍCIO DO CARREGAMENTO DOS SONS ---
const notesToLoad = [
    // Oitava 2
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    // Oitava 3
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    // Oitava 4
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'
];

notesToLoad.forEach(note => {
    // AQUI ESTÁ A MUDANÇA: alterado de .mp3 para .wav
    loadSound(`sounds/${note}.wav`, note);
});

// --- RESTO DO SEU CÓDIGO JAVASCRIPT (SEM MUDANÇAS) ---
const pianoKeys = document.querySelectorAll('.key');

pianoKeys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.dataset.note;
        if (note) {
            playSound(note);
        }
    });
});

const keyboardMapping = {
    // Oitava 2
    'Z': 'C2',
    'S': 'C#2',
    'X': 'D2',
    'D': 'D#2',
    'C': 'E2',
    'V': 'F2',
    'G': 'F#2',
    'B': 'G2',
    'H': 'G#2',
    'N': 'A2',
    'J': 'A#2',
    'M': 'B2',

    // Oitava 3
    'Q': 'C3',
    'W': 'D3',
    'E': 'E3',
    'R': 'F3',
    'T': 'G3',
    'Y': 'A3',
    'U': 'B3',

    // Oitava 4 (Exemplo, você pode ajustar as teclas do seu teclado)
    '1': 'C4',
    '2': 'D4',
    '3': 'E4',
    '4': 'F4',
    '5': 'G4',
    '6': 'A4',
    '7': 'B4'
};

document.addEventListener('keydown', (event) => {
    if (event.repeat) return;

    let pressedKey = event.key.toUpperCase();
    if (event.code.startsWith('Digit') || event.code.startsWith('Numpad')) {
        pressedKey = event.key;
    } else if (event.code === 'Slash') {
        pressedKey = '/';
    }

    const noteToPlay = keyboardMapping[pressedKey];

    if (noteToPlay) {
        playSound(noteToPlay);
    }
});