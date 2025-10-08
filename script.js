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

// 合成スクラッチ風ノイズ
function playScratchNoise(speed = 1) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const bufferSize = audioCtx.sampleRate * 0.2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1000 + speed * 500, audioCtx.currentTime);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  source.start();
}

// 回転操作
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;
let lastAngle = null;
let lastTime = null;
const circle = document.getElementById('circle');

circle.addEventListener('mousedown', (e) => {
  isDragging = true;
  startAngle = getAngle(e);
  lastAngle = startAngle;
  lastTime = performance.now();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const angle = getAngle(e);
  const now = performance.now();

  const delta = angle - startAngle;
  currentRotation += delta;
  circle.style.transform = `rotate(${currentRotation}deg)`;
  startAngle = angle;

  // スクラッチ速度計算
  if (lastAngle !== null && lastTime !== null) {
    const deltaAngle = angle - lastAngle;
    const deltaTime = now - lastTime;
    const speed = Math.abs(deltaAngle / deltaTime); // 絶対値で方向無視

    if (speed > 0.01) {
      playScratchNoise(speed);
    }
  }

  lastAngle = angle;
  lastTime = now;
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
