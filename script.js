const notes = document.querySelectorAll('.note');
notes.forEach((note, i) => {
  note.style.setProperty('--i', i);
  note.addEventListener('click', () => {
    const freq = noteFrequencies[note.dataset.note];
    playNote(freq);
  });
});

const noteFrequencies = {
  'C': 261.63,
  'G': 392.00,
  'D': 293.66,
  'A': 440.00,
  'E': 329.63,
  'B': 493.88,
  'F#': 370.00,
  'C#': 277.18,
  'G#': 415.30,
  'D#': 311.13,
  'A#': 466.16,
  'F': 349.23
};

function playNote(frequency) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}

// 回転操作
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;
const circle = document.getElementById('circle');

circle.addEventListener('mousedown', (e) => {
  isDragging = true;
  startAngle = getAngle(e);
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const angle = getAngle(e);
  const delta = angle - startAngle;
  currentRotation += delta;
  circle.style.transform = `rotate(${currentRotation}deg)`;
  startAngle = angle;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

function getAngle(e) {
  const rect = circle.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}
