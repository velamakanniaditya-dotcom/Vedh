// sounds.js - Vedh's Audio Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  // Browsers require audio to be "resumed" after a user clicks something
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'correct') {
    // 🌟 Happy "Ding!"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);

  } else if (type === 'wrong') {
    // ⚠️ Gentle "Boop"
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);

  } else if (type === 'win') {
    // 🏆 Level Up Fanfare (Arpeggio)
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.setValueAtTime(523.25, now + 0.1); // C
    osc.frequency.setValueAtTime(659.25, now + 0.2); // E
    osc.frequency.setValueAtTime(783.99, now + 0.3); // G
    osc.frequency.setValueAtTime(1046.50, now + 0.4); // High C
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
    osc.start(now);
    osc.stop(now + 1.0);

  } else if (type === 'click') {
    // 🖱️ Short button pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

// 🐾 Animal sound synthesizer
function playAnimalSound(name) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;

  function osc(type, freq, gainVal, start, duration, freqEnd) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, now + start);
    if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, now + start + duration);
    g.gain.setValueAtTime(gainVal, now + start);
    g.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
    o.start(now + start); o.stop(now + start + duration);
  }

  function noise(gainVal, start, duration) {
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src = audioCtx.createBufferSource();
    const g = audioCtx.createGain();
    src.buffer = buf; src.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(gainVal, now + start);
    g.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
    src.start(now + start); src.stop(now + start + duration);
  }

  switch (name) {
    case 'Dog':      // Woof: short bark - drop in pitch
      osc('sawtooth', 320, 0.5, 0, 0.12, 120);
      osc('sawtooth', 280, 0.3, 0.12, 0.18, 100);
      break;
    case 'Cat':      // Meow: rise then fall
      osc('sine', 400, 0.3, 0, 0.15, 700);
      osc('sine', 700, 0.25, 0.15, 0.3, 300);
      break;
    case 'Cow':      // Moo: long, low
      osc('sawtooth', 140, 0.4, 0, 0.1, 200);
      osc('sawtooth', 200, 0.4, 0.1, 0.5, 150);
      osc('sawtooth', 150, 0.3, 0.6, 0.4, 130);
      break;
    case 'Pig':      // Oink: nasal burst
      osc('square', 250, 0.3, 0, 0.08, 350);
      osc('square', 350, 0.3, 0.08, 0.15, 200);
      break;
    case 'Sheep':    // Baa: wavering
      osc('sine', 350, 0.35, 0, 0.2, 380);
      osc('sine', 370, 0.3, 0.2, 0.3, 320);
      osc('sine', 320, 0.25, 0.5, 0.3, 300);
      break;
    case 'Lion':     // Roar: low rumble sweep
      osc('sawtooth', 80, 0.5, 0, 0.3, 60);
      osc('sawtooth', 60, 0.5, 0.3, 0.5, 40);
      noise(0.25, 0, 0.8);
      break;
    case 'Frog':     // Ribbit: two pulses
      osc('square', 300, 0.3, 0, 0.1, 200);
      osc('square', 200, 0.3, 0.15, 0.12, 250);
      osc('square', 300, 0.25, 0.35, 0.1, 200);
      break;
    case 'Bird':     // Tweet: fast chirp
      osc('sine', 1800, 0.3, 0, 0.06, 2400);
      osc('sine', 2400, 0.3, 0.1, 0.06, 1800);
      osc('sine', 1800, 0.25, 0.2, 0.06, 2400);
      break;
    case 'Elephant': // Trumpet: sweep up
      osc('sawtooth', 200, 0.4, 0, 0.1, 300);
      osc('sawtooth', 300, 0.4, 0.1, 0.2, 500);
      osc('sawtooth', 500, 0.35, 0.3, 0.3, 400);
      break;
    case 'Snake':    // Hiss: white noise
      noise(0.15, 0, 0.7);
      break;
    case 'Horse':    // Neigh: rise then flutter down
      osc('sawtooth', 400, 0.35, 0, 0.15, 900);
      osc('sawtooth', 900, 0.3, 0.15, 0.4, 300);
      break;
    case 'Duck':     // Quack: nasal short
      osc('square', 450, 0.35, 0, 0.05, 350);
      osc('square', 350, 0.3, 0.05, 0.1, 400);
      osc('square', 400, 0.25, 0.15, 0.08, 300);
      break;
    case 'Wolf':     // Howl: long rising
      osc('sine', 200, 0.3, 0, 0.2, 350);
      osc('sine', 350, 0.35, 0.2, 0.5, 600);
      osc('sine', 600, 0.3, 0.7, 0.5, 550);
      break;
    case 'Bee':      // Buzz: fast modulation
      osc('square', 180, 0.2, 0, 0.6);
      osc('square', 185, 0.15, 0, 0.6);
      break;
  }
}
