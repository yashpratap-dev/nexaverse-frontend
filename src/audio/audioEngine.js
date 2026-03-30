const AC = new (window.AudioContext || window.webkitAudioContext)();

export function resumeAudio() {
  if (AC.state === 'suspended') AC.resume();
}

function tone(f, t, d, v, dl = 0) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.connect(g); g.connect(AC.destination);
  o.type = t; o.frequency.value = f;
  g.gain.setValueAtTime(0, AC.currentTime + dl);
  g.gain.linearRampToValueAtTime(v, AC.currentTime + dl + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dl + d);
  o.start(AC.currentTime + dl); o.stop(AC.currentTime + dl + d + 0.05);
}

function nz(d, v, hp = 800) {
  const buf = AC.createBuffer(1, AC.sampleRate * d, AC.sampleRate);
  const da = buf.getChannelData(0);
  for (let i = 0; i < da.length; i++) da[i] = Math.random() * 2 - 1;
  const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = hp;
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(AC.destination);
  g.gain.setValueAtTime(v, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d);
  s.start(); s.stop(AC.currentTime + d + 0.05);
}

export function playIntro() {
  resumeAudio();
  tone(40, 'sine', 4, 0.22); tone(55, 'sine', 3, 0.14, 0.3);
  const o = AC.createOscillator(), g = AC.createGain();
  o.connect(g); g.connect(AC.destination); o.type = 'sine';
  o.frequency.setValueAtTime(55, AC.currentTime + 0.7);
  o.frequency.exponentialRampToValueAtTime(1400, AC.currentTime + 2.9);
  g.gain.setValueAtTime(0, AC.currentTime + 0.7);
  g.gain.linearRampToValueAtTime(0.1, AC.currentTime + 1.3);
  g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 3.1);
  o.start(AC.currentTime + 0.7); o.stop(AC.currentTime + 3.3);
  [220,330,440,550,660].forEach((f,i) => tone(f,'triangle',0.5,0.045,1.9+i*0.1));
  [440,550,660,880,1100].forEach((f,i) => tone(f,'sine',0.9,0.065,2.75+i*0.052));
  nz(0.07, 0.18, 3500);
  setTimeout(() => nz(0.05, 0.1, 5000), 2800);
}

export function playTypeTone(i) {
  resumeAudio();
  tone(260 + i * 88, 'square', 0.055, 0.027);
}

export function playClick() {
  resumeAudio();
  tone(660,'sine',0.09,0.06); tone(880,'sine',0.05,0.035,0.05); nz(0.035,0.028,5000);
}

export function playHover() {
  resumeAudio();
  tone(440,'sine',0.035,0.016);
}

export function playKey(k) {
  resumeAudio();
  const f = 180 + (k.charCodeAt(0) % 14) * 40;
  tone(f,'square',0.06,0.03); tone(f*2,'sine',0.04,0.016); nz(0.025,0.02,4000);
}

export function playTxt() {
  resumeAudio();
  tone(280 + Math.random() * 160, 'sine', 0.055, 0.012);
}

export function playThunder() {
  resumeAudio();
  nz(0.09, 0.55, 250);
  const o1 = AC.createOscillator(), o2 = AC.createOscillator(), g1 = AC.createGain();
  o1.connect(g1); o2.connect(g1); g1.connect(AC.destination);
  o1.type = 'sawtooth'; o1.frequency.setValueAtTime(55, AC.currentTime);
  o1.frequency.linearRampToValueAtTime(25, AC.currentTime + 3.5);
  o2.type = 'sine'; o2.frequency.setValueAtTime(38, AC.currentTime + 0.1);
  o2.frequency.linearRampToValueAtTime(18, AC.currentTime + 3.5);
  g1.gain.setValueAtTime(0, AC.currentTime);
  g1.gain.linearRampToValueAtTime(0.38, AC.currentTime + 0.06);
  g1.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 3.5);
  o1.start(); o1.stop(AC.currentTime + 3.6);
  o2.start(AC.currentTime + 0.1); o2.stop(AC.currentTime + 3.6);
  setTimeout(() => nz(0.07, 0.25, 450), 90);
  setTimeout(() => {
    const o3 = AC.createOscillator(), g2 = AC.createGain();
    o3.connect(g2); g2.connect(AC.destination);
    o3.type = 'sine'; o3.frequency.setValueAtTime(30, AC.currentTime);
    o3.frequency.linearRampToValueAtTime(15, AC.currentTime + 2);
    g2.gain.setValueAtTime(0.14, AC.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 2);
    o3.start(); o3.stop(AC.currentTime + 2.1);
  }, 650);
}