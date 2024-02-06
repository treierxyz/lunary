import { getMoonIllumination } from 'suncalc';

let currentPhase;
let prettyPhase;
const updateRate = 100;

function inRange(i, min, max) {
  return min <= i && i <= max
}

function phaseName(phase) {
  const floorPhase = Math.round(phase * 1000)
  switch (floorPhase) {
    case 0:
    case 1000:
      return ['New Moon', '🌑']
    case 250:
      return ['First Quarter', '🌓']
    case 500:
      return ['Full Moon', '🌕']
    case 750:
      return ['Third Quarter', '🌗']
    default:
      if (inRange(floorPhase, 1, 249)) {
        return ['Waxing Crescent', '🌒']
      }
      if (inRange(floorPhase, 251, 499)) {
        return ['Waxing Gibbous', '🌔']
      }
      if (inRange(floorPhase, 501, 749)) {
        return ['Waning Gibbous', '🌖']
      }
      if (inRange(floorPhase, 751, 999)) {
        return ['Waning Crescent', '🌘']
      }

      return ['Unknown', '❓']
  }
}

function update() {
  currentPhase = getMoonIllumination(new Date()).phase; // from 0.0 to 1.0
  // currentPhase = (parseFloat((Date.now()).toString().slice(0, -2)) / 100) % 1 // testing only
  prettyPhase = `${(currentPhase * 100).toFixed(4)}%` // from 0.0000% to 100.0000%

  document.getElementById('emoji').innerHTML = `${phaseName(currentPhase)[1]}`;
  for (const iterator of document.getElementsByClassName('percentage')) {
    iterator.innerHTML = `${prettyPhase}`;
  }
  document.getElementById('phase').innerHTML = `${phaseName(currentPhase)[0]}`;
  // document.getElementById('bar').style.width = `${prettyPhase}`;
  document.body.style.setProperty('--progress-width', `${prettyPhase}`)
  document.title = phaseName(currentPhase)[1];
}

document.getElementById('emoji').onclick = () => {
  navigator.clipboard.writeText(phaseName(currentPhase)[1])
  document.getElementById('toast').classList.remove('toastAnimation');
  document.getElementById('toast').offsetWidth
  document.getElementById('toast').classList.add('toastAnimation');
}
window.setInterval(update, updateRate)
window.onload = update()