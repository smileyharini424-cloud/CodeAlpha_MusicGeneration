const mood = document.getElementById("mood");
const tempo = document.getElementById("tempo");
const generateBtn = document.getElementById("generateBtn");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

let audioContext;
let melody = [];
let currentNote = 0;
let isPlaying = false;
let timer;

// Musical notes
const notes = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25
};

// Generate melody according to mood
function generateMelody(selectedMood) {

    const melodies = {
        happy: ["C4", "E4", "G4", "C5", "G4", "E4", "D4", "G4"],
        calm: ["C4", "D4", "E4", "G4", "E4", "D4", "C4", "G4"],
        energetic: ["C5", "E5", "G4", "C5", "D5", "G4", "E5", "C5"],
        sad: ["A4", "G4", "E4", "D4", "C4", "D4", "E4", "G4"]
    };

    return melodies[selectedMood];
}

// Generate button
generateBtn.addEventListener("click", function () {

    melody = generateMelody(mood.value);

    currentNote = 0;

    playBtn.disabled = false;

    status.textContent =
        "🎼 Melody generated successfully! Click Play Melody.";

});

// Play a note
function playNote(note) {

    if (!audioContext) {
        audioContext =
            new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = notes[note];

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.5
    );
}

// Play melody
function playMelody() {

    if (melody.length === 0) {
        return;
    }

    isPlaying = true;

    playBtn.disabled = true;
    stopBtn.disabled = false;

    status.textContent = "🎵 Playing your generated melody...";

    currentNote = 0;

    const tempoValues = {
        slow: 700,
        medium: 450,
        fast: 250
    };

    const speed = tempoValues[tempo.value];

    function nextNote() {

        if (!isPlaying) {
            return;
        }

        if (currentNote >= melody.length) {

            isPlaying = false;

            playBtn.disabled = false;
            stopBtn.disabled = true;

            status.textContent =
                "🎵 Melody finished!";

            return;
        }

        playNote(melody[currentNote]);

        currentNote++;

        timer = setTimeout(nextNote, speed);
    }

    nextNote();
}

// Play button
playBtn.addEventListener("click", function () {

    if (!audioContext) {
        audioContext =
            new (window.AudioContext || window.webkitAudioContext)();
    }

    playMelody();
});

// Stop button
stopBtn.addEventListener("click", function () {

    isPlaying = false;

    clearTimeout(timer);

    playBtn.disabled = false;
    stopBtn.disabled = true;

    status.textContent =
        "⏹️ Melody stopped.";
});