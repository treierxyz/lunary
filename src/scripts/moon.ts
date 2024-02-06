import { getMoonIllumination } from "suncalc";

let currentPhase: number;
let prettyPhase: string;
const updateRate = 100;

const bigEmoji = document.getElementById("emoji");
const phase = document.getElementById("phase");

function inRange(i: number, min: number, max: number) {
	return min <= i && i <= max;
}

function phaseName(phase: number) {
	const floorPhase = Math.round(phase * 1000);
	switch (floorPhase) {
		case 0:
		case 1000:
			return ["New Moon", "🌑"];
		case 250:
			return ["First Quarter", "🌓"];
		case 500:
			return ["Full Moon", "🌕"];
		case 750:
			return ["Third Quarter", "🌗"];
		default:
			if (inRange(floorPhase, 1, 249)) {
				return ["Waxing Crescent", "🌒"];
			}
			if (inRange(floorPhase, 251, 499)) {
				return ["Waxing Gibbous", "🌔"];
			}
			if (inRange(floorPhase, 501, 749)) {
				return ["Waning Gibbous", "🌖"];
			}
			if (inRange(floorPhase, 751, 999)) {
				return ["Waning Crescent", "🌘"];
			}

			return ["Unknown", "❓"];
	}
}

function update() {
	currentPhase = getMoonIllumination(new Date()).phase; // from 0.0 to 1.0
	// currentPhase = (parseFloat(Date.now().toString().slice(0, -2)) / 100) % 1; // testing only
	prettyPhase = `${(currentPhase * 100).toFixed(4)}%`; // from 0.0000% to 100.0000%

	if (bigEmoji !== null) {
		bigEmoji.innerHTML = `${phaseName(currentPhase)[1]}`;
	}
	if (phase !== null) {
		phase.innerHTML = `${phaseName(currentPhase)[0]}`;
	}
	for (const iterator of document.getElementsByClassName("percentage")) {
		iterator.innerHTML = `${prettyPhase}`;
	}

	document.body.style.setProperty("--progress-width", `${prettyPhase}`);
	document.title = phaseName(currentPhase)[1];
	return null;
}

if (bigEmoji !== null) {
	bigEmoji.onclick = () => {
		navigator.clipboard.writeText(phaseName(currentPhase)[1]);
		const toast = document.getElementById("toast");
		if (toast !== null) {
			toast.classList.remove("toastAnimation");
			toast.offsetWidth;
			toast.classList.add("toastAnimation");
		}
	};
}

window.setInterval(update, updateRate);
window.onload = update();
